/**
 * groq.ts — Groq API client for Freonn SEO automation
 *
 * SAFETY FIRST: All functions are wrapped in try/catch.
 * If GROQ_API_KEY is missing or the API is unavailable,
 * every function returns null/false — the site never crashes.
 */

const GROQ_DEFAULT_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// The Groq endpoint is configurable so the request can be routed through a relay
// (e.g. a Cloudflare Worker) when the origin server's region is blocked by Groq.
// Set GROQ_API_URL to the relay's /openai/v1/chat/completions URL; otherwise the
// call goes straight to api.groq.com.
export function getGroqApiUrl(): string {
  const override = (process.env.GROQ_API_URL ?? "").trim();
  return override || GROQ_DEFAULT_API_URL;
}

// Fast model for chat; powerful model for content generation
export const GROQ_CHAT_MODEL = "llama-3.1-8b-instant";
export const GROQ_CONTENT_MODEL = "llama-3.3-70b-versatile";

function getApiKey(): string | null {
  const key = process.env.GROQ_API_KEY ?? "";
  return key.trim().length > 0 ? key : null;
}

export function isGroqAvailable(): boolean {
  return getApiKey() !== null;
}

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: { content: string };
    finish_reason: string;
  }>;
}

/**
 * Core Groq API call — returns text or null on any error.
 * Never throws. Safe to call without try/catch.
 */
export async function groqChat(
  messages: GroqMessage[],
  model: string = GROQ_CHAT_MODEL,
  maxTokens: number = 1024,
  timeoutMs: number = 15000
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("[Groq] GROQ_API_KEY is not set — skipping API call");
    return null;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(getGroqApiUrl(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text().catch(() => "unknown error");
      console.error(`[Groq] API error ${response.status}: ${errText}`);
      return null;
    }

    const data = (await response.json()) as GroqResponse;
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      console.error("[Groq] Request timed out");
    } else {
      console.error("[Groq] Unexpected error:", err);
    }
    return null;
  }
}

/**
 * Streaming version — yields chunks via async generator.
 * Falls back gracefully if streaming is unavailable.
 */
export async function* groqChatStream(
  messages: GroqMessage[],
  model: string = GROQ_CHAT_MODEL,
  maxTokens: number = 1024
): AsyncGenerator<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("[Groq] GROQ_API_KEY is not set — skipping stream");
    return;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(getGroqApiUrl(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
        stream: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok || !response.body) {
      console.error(`[Groq] Stream error ${response.status}`);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    // Network chunks don't align with SSE lines: a `data: {…}` line can be split
    // across reads. Buffer the trailing partial line and only parse complete
    // (newline-terminated) lines, otherwise tokens get dropped mid-word.
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // skip malformed SSE lines
        }
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      console.error("[Groq] Stream timed out");
    } else {
      console.error("[Groq] Stream error:", err);
    }
  }
}
