/**
 * Cloudflare Worker — non-RU reverse proxy for the Groq API.
 *
 * Why: Groq blocks Russian IPs (HTTP 403), and the freonn.ru server runs on a
 * Moscow VPS. This Worker runs on Cloudflare's global edge, so requests reach
 * Groq from a non-RU IP. The app points GROQ_BASE_URL at this Worker.
 *
 * Deploy (free tier):
 *   1. npm i -g wrangler && wrangler login   (or use a Cloudflare API token)
 *   2. wrangler deploy deploy/groq-proxy-worker.js --name freonn-groq-proxy
 *   3. (recommended) set a shared secret so it is not an open relay:
 *        wrangler secret put PROXY_SECRET
 *      and set the same value as GROQ_PROXY_SECRET in the server .env.
 *
 * Server config (.env):
 *   GROQ_BASE_URL=https://freonn-groq-proxy.<account>.workers.dev/openai/v1
 *   GROQ_PROXY_SECRET=<same value as the Worker PROXY_SECRET>   # optional
 *
 * The app sends `Authorization: Bearer <GROQ_API_KEY>`; this Worker forwards it
 * unchanged to Groq, so the key never lives in the Worker.
 */

const UPSTREAM = "https://api.groq.com";

export default {
  async fetch(request, env) {
    // Lock the proxy down with a shared secret when configured.
    if (env.PROXY_SECRET) {
      if (request.headers.get("x-proxy-secret") !== env.PROXY_SECRET) {
        return new Response("forbidden", { status: 403 });
      }
    }

    const url = new URL(request.url);
    const target = UPSTREAM + url.pathname + url.search;

    const headers = new Headers(request.headers);
    headers.delete("x-proxy-secret");
    headers.set("Host", "api.groq.com");

    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
      // required by Cloudflare when streaming a request body
      ...(["GET", "HEAD"].includes(request.method) ? {} : { duplex: "half" }),
    });

    // Pass the upstream response through verbatim (preserves SSE streaming).
    const respHeaders = new Headers(upstream.headers);
    respHeaders.delete("content-encoding");
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: respHeaders,
    });
  },
};
