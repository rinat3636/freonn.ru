import { afterEach, describe, expect, it } from "vitest";
import { getGroqApiUrl } from "./groq";

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
