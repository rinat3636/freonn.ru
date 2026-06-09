/**
 * @deprecated Production uses server/_core/index.ts (see railway.toml).
 * Kept for reference; do not use as entry point.
 */
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { groqChat, groqChatStream, isGroqAvailable, GROQ_CONTENT_MODEL } from "./groq.js";
import { isValidSpaPath } from "./spaRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_BOT_TOKEN = process.env.MAX_BOT_TOKEN || "";
const MAX_API_URL = "https://platform-api.max.ru/messages";
// Two recipients: owner device 1 and device 2
const MAX_USER_IDS = [161746887, 214386106];

async function sendMaxMessage(text: string): Promise<void> {
  for (const userId of MAX_USER_IDS) {
    try {
      const res = await fetch(`${MAX_API_URL}?user_id=${userId}`, {
        method: "POST",
        headers: {
          Authorization: MAX_BOT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error(`[MAX] Failed to send to user ${userId}:`, err);
      } else {
        console.log(`[MAX] Message sent to user ${userId}`);
      }
    } catch (e) {
      console.error(`[MAX] Error sending to user ${userId}:`, e);
    }
  }
}

// ─── Freonn AI system prompt ──────────────────────────────────────────────────
const FREONN_SYSTEM_PROMPT = `Ты — AI-консультант инженерной компании Freonn (freonn.ru).
Компания специализируется на проектировании, монтаже и обслуживании инженерных систем:
вентиляция, кондиционирование, дымоудаление, отопление, холодоснабжение, водоснабжение, электроснабжение, пескоструйная обработка.
Работаем в Москве и Московской области. Опыт 15+ лет, 1280+ объектов, 25 бригад.
Телефон: 8(800)101-2009 (бесплатно). Email: freonn@internet.ru.

Правила:
- Отвечай кратко, профессионально, по-русски.
- Если вопрос не по теме инженерных систем — вежливо перенаправь к нашим услугам.
- Не называй цены точно — предлагай оставить заявку для расчёта.
- Всегда предлагай вызвать инженера или оставить заявку на сайте.
- Максимум 3–4 предложения на ответ.`;

// ─── Static fallback answers (when Groq is unavailable) ──────────────────────
const FALLBACK_ANSWERS = [
  "Здравствуйте! Я консультант Freonn. Для точного ответа на ваш вопрос рекомендую позвонить нашим инженерам: **8(800)101-2009** (бесплатно) или оставить заявку на сайте — мы перезвоним в течение 30 минут.",
  "Спасибо за вопрос! Наши специалисты готовы проконсультировать вас бесплатно. Позвоните по номеру **8(800)101-2009** или напишите на freonn@internet.ru — мы подберём оптимальное решение для вашего объекта.",
  "Отличный вопрос! Для точного расчёта стоимости и сроков нам нужно изучить ваш объект. Оставьте заявку на сайте или позвоните: **8(800)101-2009** — выезд инженера в течение 1 дня, расчёт бесплатно.",
];

function getRandomFallback(): string {
  return FALLBACK_ANSWERS[Math.floor(Math.random() * FALLBACK_ANSWERS.length)];
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "2mb" }));

  // ── Health check for Groq ──────────────────────────────────────────────────
  app.get("/api/groq/status", (_req, res) => {
    res.json({ available: isGroqAvailable() });
  });

  // ── AI Chat (streaming) ────────────────────────────────────────────────────
  // POST /api/ai/chat
  // Body: { messages: [{role, content}][], stream?: boolean }
  // Graceful fallback: returns static answer if Groq is unavailable
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages = [], stream = false } = req.body || {};

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "messages array is required" });
        return;
      }

      // Build conversation with system prompt
      const conversation = [
        { role: "system" as const, content: FREONN_SYSTEM_PROMPT },
        ...messages.slice(-10).map((m: { role: string; content: string }) => ({
          role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
          content: String(m.content ?? ""),
        })),
      ];

      // ── Streaming mode ────────────────────────────────────────────────────
      if (stream) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        if (!isGroqAvailable()) {
          const fallback = getRandomFallback();
          res.write(`data: ${JSON.stringify({ content: fallback })}\n\n`);
          res.write("data: [DONE]\n\n");
          res.end();
          return;
        }

        try {
          for await (const chunk of groqChatStream(conversation)) {
            res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
          }
        } catch {
          // Stream failed mid-way — send fallback continuation
          res.write(`data: ${JSON.stringify({ content: "\n\n" + getRandomFallback() })}\n\n`);
        }

        res.write("data: [DONE]\n\n");
        res.end();
        return;
      }

      // ── Non-streaming mode ────────────────────────────────────────────────
      const result = await groqChat(conversation);
      if (result) {
        res.json({ content: result });
      } else {
        // Groq unavailable — return fallback, NOT an error
        res.json({ content: getRandomFallback(), fallback: true });
      }
    } catch (e) {
      console.error("[ai/chat] Error:", e);
      // Even on unexpected error — return fallback, never 500 to the user
      res.json({ content: getRandomFallback(), fallback: true });
    }
  });

  // ── SEO Meta Generator ─────────────────────────────────────────────────────
  // POST /api/seo/meta
  // Body: { type: "service"|"city"|"blog"|"object", data: {...} }
  // Returns: { title, description, keywords } or fallback values
  app.post("/api/seo/meta", async (req, res) => {
    try {
      const { type, data } = req.body || {};

      if (!type || !data) {
        res.status(400).json({ error: "type and data are required" });
        return;
      }

      // Fallback meta values by type
      const fallbackMeta: Record<string, { title: string; description: string; keywords: string }> = {
        service: {
          title: `${data.name ?? "Услуга"} в Москве — Freonn`,
          description: `Профессиональный монтаж ${data.name ?? "инженерных систем"} в Москве и МО. Выезд инженера за 1 день. Звоните: 8(800)101-2009`,
          keywords: `${data.name ?? "инженерные системы"}, монтаж, Москва, Freonn`,
        },
        city: {
          title: `Монтаж инженерных систем в ${data.cityName ?? "городе"} — Freonn`,
          description: `Freonn — монтаж вентиляции, кондиционирования и отопления в ${data.cityName ?? "вашем городе"}. Опыт 15 лет, 1280+ объектов. Бесплатный расчёт.`,
          keywords: `монтаж вентиляции ${data.cityName ?? ""}, кондиционирование ${data.cityName ?? ""}, Freonn`,
        },
        blog: {
          title: `${data.articleTitle ?? "Статья"} — Блог Freonn`,
          description: data.excerpt ?? "Экспертные статьи об инженерных системах от специалистов Freonn.",
          keywords: `${data.category ?? "инженерные системы"}, статья, Freonn`,
        },
        object: {
          title: `${data.objectName ?? "Объект"} — Портфолио Freonn`,
          description: `Реализованный проект: ${data.objectName ?? "монтаж инженерных систем"}. Freonn — 1280+ выполненных объектов в Москве и МО.`,
          keywords: `портфолио, ${data.objectType ?? "инженерные системы"}, Freonn`,
        },
      };

      if (!isGroqAvailable()) {
        res.json({ ...fallbackMeta[type] ?? fallbackMeta.service, fallback: true });
        return;
      }

      const prompt = buildMetaPrompt(type, data);
      const result = await groqChat(
        [{ role: "user", content: prompt }],
        GROQ_CONTENT_MODEL,
        300
      );

      if (!result) {
        res.json({ ...fallbackMeta[type] ?? fallbackMeta.service, fallback: true });
        return;
      }

      // Parse JSON from LLM response
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          res.json({
            title: String(parsed.title ?? "").slice(0, 65) || fallbackMeta[type]?.title,
            description: String(parsed.description ?? "").slice(0, 165) || fallbackMeta[type]?.description,
            keywords: String(parsed.keywords ?? "") || fallbackMeta[type]?.keywords,
          });
          return;
        }
      } catch {
        // JSON parse failed — use fallback
      }

      res.json({ ...fallbackMeta[type] ?? fallbackMeta.service, fallback: true });
    } catch (e) {
      console.error("[seo/meta] Error:", e);
      res.status(500).json({ error: "Internal error" });
    }
  });

  // ── City SEO Text Generator ────────────────────────────────────────────────
  // POST /api/seo/city-text
  // Body: { city: "istra", cityName: "Истра" }
  // Returns: { lsi, district, objects } or fallback
  app.post("/api/seo/city-text", async (req, res) => {
    try {
      const { city, cityName } = req.body || {};

      if (!city || !cityName) {
        res.status(400).json({ error: "city and cityName are required" });
        return;
      }

      const fallback = {
        lsi: `Freonn выполняет полный комплекс работ по проектированию, монтажу и обслуживанию инженерных систем в ${cityName}е и прилегающем районе. Работаем с промышленными предприятиями, коммерческой недвижимостью и жилыми объектами.`,
        district: `${cityName}ском районе`,
        objects: "Промышленные объекты, коммерческая недвижимость, ЖК",
        fallback: true,
      };

      if (!isGroqAvailable()) {
        res.json(fallback);
        return;
      }

      const prompt = `Напиши уникальный SEO-текст (2–3 предложения, 60–80 слов) для страницы "Монтаж инженерных систем в ${cityName}" компании Freonn.
Включи LSI-ключевые слова: вентиляция, кондиционирование, дымоудаление, отопление, промышленные объекты, монтаж под ключ.
Упомяни специфику ${cityName} (тип предприятий, районные особенности).
Также укажи типичные объекты через запятую (3–5 типов).

Ответь строго в JSON:
{"lsi": "...", "district": "${cityName}ском районе", "objects": "Тип1, Тип2, Тип3"}`;

      const result = await groqChat(
        [{ role: "user", content: prompt }],
        GROQ_CONTENT_MODEL,
        300
      );

      if (!result) {
        res.json(fallback);
        return;
      }

      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          res.json({
            lsi: String(parsed.lsi ?? fallback.lsi),
            district: String(parsed.district ?? fallback.district),
            objects: String(parsed.objects ?? fallback.objects),
          });
          return;
        }
      } catch {
        // fall through
      }

      res.json(fallback);
    } catch (e) {
      console.error("[seo/city-text] Error:", e);
      res.json({
        lsi: `Монтаж инженерных систем в ${req.body?.cityName ?? "городе"} — Freonn.`,
        district: `${req.body?.cityName ?? ""}ском районе`,
        objects: "Промышленные объекты, коммерческая недвижимость",
        fallback: true,
      });
    }
  });

  // ── Blog Article Generator ─────────────────────────────────────────────────
  // POST /api/seo/generate-article
  // Body: { topic: string, category: string, keywords?: string[] }
  // Returns: { title, slug, excerpt, content, meta } or error
  app.post("/api/seo/generate-article", async (req, res) => {
    try {
      const { topic, category, keywords = [] } = req.body || {};

      if (!topic || !category) {
        res.status(400).json({ error: "topic and category are required" });
        return;
      }

      if (!isGroqAvailable()) {
        res.status(503).json({
          error: "Groq API недоступен. Добавьте GROQ_API_KEY в переменные окружения.",
          fallback: true,
        });
        return;
      }

      const kwList = keywords.length > 0 ? keywords.join(", ") : "вентиляция, монтаж, инженерные системы";

      const prompt = `Напиши экспертную SEO-статью для блога инженерной компании Freonn (freonn.ru).

Тема: "${topic}"
Категория: ${category}
Ключевые слова: ${kwList}

Требования:
- Объём: 600–800 слов
- Структура: введение, 3–4 раздела с заголовками H2, заключение с призывом к действию
- Упомяни компанию Freonn в заключении
- Используй ключевые слова органично
- Формат: Markdown

Также предоставь мета-данные в конце в JSON-блоке:
\`\`\`json
{"title": "...", "description": "...", "slug": "...", "excerpt": "..."}
\`\`\``;

      const result = await groqChat(
        [{ role: "user", content: prompt }],
        GROQ_CONTENT_MODEL,
        2048,
        30000
      );

      if (!result) {
        res.status(503).json({ error: "Groq API не ответил. Попробуйте позже.", fallback: true });
        return;
      }

      // Extract JSON meta block
      const jsonMatch = result.match(/```json\s*([\s\S]*?)```/);
      let meta = { title: topic, description: "", slug: "", excerpt: "" };
      if (jsonMatch) {
        try {
          meta = { ...meta, ...JSON.parse(jsonMatch[1]) };
        } catch {
          // ignore parse error
        }
      }

      // Remove JSON block from content
      const content = result.replace(/```json[\s\S]*?```/, "").trim();

      res.json({ content, meta, topic, category });
    } catch (e) {
      console.error("[seo/generate-article] Error:", e);
      res.status(500).json({ error: "Internal error" });
    }
  });

  // ── Semantic Clustering ────────────────────────────────────────────────────
  // POST /api/seo/cluster-keywords
  // Body: { keywords: string[] }
  // Returns: { clusters: { page, intent, keywords[] }[] } or fallback
  app.post("/api/seo/cluster-keywords", async (req, res) => {
    try {
      const { keywords = [] } = req.body || {};

      if (!Array.isArray(keywords) || keywords.length === 0) {
        res.status(400).json({ error: "keywords array is required" });
        return;
      }

      if (!isGroqAvailable()) {
        res.status(503).json({
          error: "Groq API недоступен. Добавьте GROQ_API_KEY в переменные окружения.",
          fallback: true,
        });
        return;
      }

      // Process in batches of 100 to avoid token limits
      const batch = keywords.slice(0, 100);

      const prompt = `Ты — SEO-специалист. Кластеризуй следующие ключевые слова для сайта инженерной компании Freonn.ru.

Страницы сайта: вентиляция, кондиционирование, дымоудаление, отопление, холодоснабжение, водоснабжение, электроснабжение, пескоструй, блог, главная, о компании.

Ключевые слова:
${batch.join("\n")}

Для каждого кластера укажи:
- page: slug страницы (например "ventilyaciya")
- intent: "commercial" или "informational"
- keywords: массив ключевых слов

Ответь строго в JSON:
{"clusters": [{"page": "...", "intent": "...", "keywords": ["..."]}]}`;

      const result = await groqChat(
        [{ role: "user", content: prompt }],
        GROQ_CONTENT_MODEL,
        2048,
        30000
      );

      if (!result) {
        res.status(503).json({ error: "Groq API не ответил. Попробуйте позже.", fallback: true });
        return;
      }

      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          res.json(parsed);
          return;
        }
      } catch {
        // fall through
      }

      res.json({ raw: result, clusters: [] });
    } catch (e) {
      console.error("[seo/cluster-keywords] Error:", e);
      res.status(500).json({ error: "Internal error" });
    }
  });

  // ── Static files ───────────────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // SPA fallback: 200 для известных маршрутов, 404 для несуществующих
  app.get("*", (req, res) => {
    const status = isValidSpaPath(req.path) ? 200 : 404;
    res.status(status).sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`[Groq] API available: ${isGroqAvailable()}`);
  });
}

// ── Helper: build meta prompt ─────────────────────────────────────────────────
function buildMetaPrompt(type: string, data: Record<string, string>): string {
  const prompts: Record<string, string> = {
    service: `Напиши SEO Title (до 60 символов) и Meta Description (до 160 символов) для страницы услуги "${data.name}" компании Freonn (монтаж инженерных систем, Москва). Ответь в JSON: {"title":"...","description":"...","keywords":"..."}`,
    city: `Напиши SEO Title (до 60 символов) и Meta Description (до 160 символов) для страницы "Монтаж инженерных систем в ${data.cityName}" компании Freonn. Ответь в JSON: {"title":"...","description":"...","keywords":"..."}`,
    blog: `Напиши SEO Title (до 60 символов) и Meta Description (до 160 символов) для статьи блога "${data.articleTitle}" (категория: ${data.category}). Ответь в JSON: {"title":"...","description":"...","keywords":"..."}`,
    object: `Напиши SEO Title (до 60 символов) и Meta Description (до 160 символов) для страницы портфолио "${data.objectName}" компании Freonn. Ответь в JSON: {"title":"...","description":"...","keywords":"..."}`,
  };
  return prompts[type] ?? prompts.service;
}

startServer().catch(console.error);
