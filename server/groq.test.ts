import { afterEach, describe, expect, it, vi } from "vitest";
import { getGroqApiUrl, groqChatStream } from "./groq";

const DEFAULT_URL = "https://api.groq.com/openai/v1/chat/completions";
const original = process.env.GROQ_API_URL;

afterEach(() => {
  if (original === undefined) delete process.env.GROQ_API_URL;
  else process.env.GROQ_API_URL = original;
});

describe("getGroqApiUrl", () => {
  it("defaults to the direct Groq endpoint when GROQ_API_URL is unset", () => {
    delete process.env.GROQ_API_URL;
    expect(getGroqApiUrl()).toBe(DEFAULT_URL);
  });

  it("falls back to the default when GROQ_API_URL is blank", () => {
    process.env.GROQ_API_URL = "   ";
    expect(getGroqApiUrl()).toBe(DEFAULT_URL);
  });

  it("uses the relay URL when GROQ_API_URL is set (and trims it)", () => {
    const relay =
      "https://groq-relay.example.workers.dev/openai/v1/chat/completions";
    process.env.GROQ_API_URL = `  ${relay}  `;
    expect(getGroqApiUrl()).toBe(relay);
  });
});

describe("groqChatStream", () => {
  const originalKey = process.env.GROQ_API_KEY;

  afterEach(() => {
    if (originalKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = originalKey;
    vi.unstubAllGlobals();
  });

  it("reassembles tokens when SSE lines are split mid-line and mid-character", async () => {
    process.env.GROQ_API_KEY = "test-key";

    // Cyrillic content (2 bytes/char) spread across several SSE events.
    const parts = ["Монтаж ", "вентиляции ", "под ключ"];
    const expected = parts.join("");
    const sse =
      parts
        .map(
          p =>
            `data: ${JSON.stringify({ choices: [{ delta: { content: p } }] })}\n\n`
        )
        .join("") + "data: [DONE]\n\n";

    // Encode and slice into tiny fixed-size byte chunks so boundaries land
    // both mid-line and mid-multibyte-character — reproducing the bug.
    const bytes = new TextEncoder().encode(sse);
    const chunkSize = 7;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        for (let i = 0; i < bytes.length; i += chunkSize) {
          controller.enqueue(bytes.subarray(i, i + chunkSize));
        }
        controller.close();
      },
    });

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(stream, { status: 200 }))
    );

    let out = "";
    for await (const chunk of groqChatStream([
      { role: "user", content: "цена?" },
    ])) {
      out += chunk;
    }

    expect(out).toBe(expected);
  });
});
