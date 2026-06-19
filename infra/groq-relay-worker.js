// groq-relay — Cloudflare Worker that forwards Groq OpenAI-compatible API calls.
// Purpose: the freonn.ru origin server is in RU, where Groq's edge returns 403.
// This Worker runs on Cloudflare's network (allowed region) and relays requests
// to api.groq.com, preserving the Authorization header and streaming responses.
// It is a thin forwarder: it never stores the API key (the caller sends it).
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only relay the Groq OpenAI-compatible API surface; reject everything else
    // so the Worker can't be abused as a generic open proxy.
    if (!url.pathname.startsWith("/openai/")) {
      return new Response("Not found", { status: 404 });
    }

    const target = "https://api.groq.com" + url.pathname + url.search;

    const headers = new Headers();
    for (const h of ["authorization", "content-type", "accept"]) {
      const v = request.headers.get(h);
      if (v) headers.set(h, v);
    }

    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body,
    });

    // Pass the upstream response straight through (keeps SSE streaming intact).
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: upstream.headers,
    });
  },
};
