import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import multer from "multer";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { notifyOwner } from "./notification";
import { uploadFileToSupabase } from "../supabaseStorage";
import { groqChat, groqChatStream, isGroqAvailable, GROQ_CONTENT_MODEL } from "../groq";
import { getCityEntry } from "../../shared/geoRoutes";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
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

const FALLBACK_ANSWERS = [
  "Здравствуйте! Я консультант Freonn. Для точного ответа на ваш вопрос рекомендую позвонить нашим инженерам: **8(800)101-2009** (бесплатно) или оставить заявку на сайте — мы перезвоним в течение 30 минут.",
  "Спасибо за вопрос! Наши специалисты готовы проконсультировать вас бесплатно. Позвоните по номеру **8(800)101-2009** или напишите на freonn@internet.ru — мы подберём оптимальное решение для вашего объекта.",
  "Отличный вопрос! Для точного расчёта стоимости и сроков нам нужно изучить ваш объект. Оставьте заявку на сайте или позвоните: **8(800)101-2009** — выезд инженера в течение 1 дня, расчёт бесплатно.",
];

const getRandomFallback = () => FALLBACK_ANSWERS[Math.floor(Math.random() * FALLBACK_ANSWERS.length)];

function getCitySeoFallback(city: string, cityName: string) {
  const entry = getCityEntry(city);
  const cityIn = entry?.phrase ?? `в ${cityName}`;
  const district =
    city === "moskovskaya-oblast" ? "Московской области"
    : city === "moskva" ? "Москве"
    : `${cityName}ском районе`;
  return {
    lsi: `Freonn выполняет полный комплекс работ по монтажу инженерных систем ${cityIn}. Работаем с промышленными предприятиями и коммерческой недвижимостью.`,
    district,
    objects: "Промышленные объекты, коммерческая недвижимость, ЖК",
  };
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // ── 301-редиректы старых WordPress URL → правильные страницы ──────────────────────────
  const legacyRedirects: Record<string, string> = {
    "/shop":         "/uslugi",
    "/wp-login.php": "/",
    "/wp-admin":     "/",
    "/cart":         "/uslugi",
    "/checkout":     "/uslugi",
    "/product":      "/uslugi",
    "/products":     "/uslugi",
    "/store":        "/uslugi",
    "/feed":         "/",
    "/xmlrpc.php":   "/",
    "/sitemap_index.xml": "/sitemap.xml",
    "/about":        "/o-kompanii",
  };
  app.use((req, res, next) => {
    const pathname = req.path.replace(/\/$/, "") || "/";
    // Точные совпадения
    if (legacyRedirects[pathname]) {
      return res.redirect(301, legacyRedirects[pathname]);
    }
    // Паттерны WordPress и устаревших URL
    if (/^\/(wp-content|wp-includes|wp-json|wp-admin|wp-login|shop\/|product\/)/i.test(req.path)) {
      return res.redirect(301, "/uslugi");
    }
    // WordPress рубрики, метки, авторы, пагинация, фид
    if (/^\/(category|tag|author|page|feed)\//i.test(req.path)) {
      const dest = /^\/(tag|author)\//i.test(req.path) ? "/blog" : "/uslugi";
      return res.redirect(301, dest);
    }
    // WordPress date-based archives: /2020/01/15/...
    if (/^\/\d{4}\/\d{2}\//i.test(req.path)) {
      return res.redirect(301, "/blog");
    }
    next();
  });

  // ── www → non-www redirect (SEO: устраняем дубли домена) ───────────────────────────
  app.use((req, res, next) => {
    const host = req.headers.host || "";
    if (host.startsWith("www.")) {
      const newHost = host.slice(4);
      const redirectUrl = `https://${newHost}${req.originalUrl}`;
      return res.redirect(301, redirectUrl);
    }
    next();
  });

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // MAX bot notification
  const MAX_BOT_TOKEN = process.env.MAX_BOT_TOKEN || "";
  const MAX_API_URL = "https://platform-api.max.ru/messages";
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

  // File upload endpoint — stores file to S3 and returns URL
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
  app.post("/api/upload-file", upload.single("file"), async (req: express.Request, res: express.Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: "Файл не получен" });
        return;
      }
      const url = await uploadFileToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype);
      res.json({ success: true, url, filename: req.file.originalname });
    } catch (e) {
      console.error("[upload-file] Error:", e);
      res.status(500).json({ success: false, error: "Ошибка загрузки файла" });
    }
  });

  // Form submission → MAX bot
  app.post("/api/submit-form", async (req, res) => {
    try {
      const { name, phone, email, service, message, fileUrl, fileName, pageUrl, referrer } = req.body || {};
      if (!name || !phone) {
        res.status(400).json({ success: false, error: "Имя и телефон обязательны" });
        return;
      }
      const text = [
        "📋 Новая заявка с сайта freonn.ru",
        "",
        `👤 Имя: ${name}`,
        `📞 Телефон: ${phone}`,
        email ? `📧 Email: ${email}` : null,
        service ? `🔧 Услуга: ${service}` : null,
        pageUrl ? `🌐 Страница: ${pageUrl}` : null,
        referrer ? `↩️ Источник: ${referrer}` : null,
        message ? `💬 Сообщение: ${message}` : null,
        fileUrl ? `📎 Документ: ${fileName || "файл"} — ${fileUrl}` : null,
      ]
        .filter(Boolean)
        .join("\n");
      await sendMaxMessage(text);
      // Also send via Manus notifyOwner as backup
      try {
        await notifyOwner({
          title: `Новая заявка с freonn.ru — ${name}`,
          content: text,
        });
      } catch {
        // notifyOwner failure is non-critical
      }
      res.json({ success: true });
    } catch (e) {
      console.error("[submit-form] Error:", e);
      res.status(500).json({ success: false, error: "Ошибка сервера" });
    }
  });

  // ── Groq AI эндпоинты ──────────────────────────────────────────────────────
  // SAFETY: все функции обёрнуты в try/catch с fallback.
  // Если GROQ_API_KEY не задан или API недоступен — сайт работает штатно.

  // GET /api/groq/status — проверка доступности токена
  app.get("/api/groq/status", (_req, res) => {
    res.json({ available: isGroqAvailable() });
  });

  // POST /api/ai/chat — AI-консультант (streaming + non-streaming)
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages = [], stream = false } = req.body || {};
      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "messages array is required" });
        return;
      }
      const conversation = [
        { role: "system" as const, content: FREONN_SYSTEM_PROMPT },
        ...messages.slice(-10).map((m: { role: string; content: string }) => ({
          role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
          content: String(m.content ?? ""),
        })),
      ];

      if (stream) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();
        if (!isGroqAvailable()) {
          res.write(`data: ${JSON.stringify({ content: getRandomFallback() })}\n\n`);
          res.write("data: [DONE]\n\n");
          res.end();
          return;
        }
        try {
          for await (const chunk of groqChatStream(conversation)) {
            res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
          }
        } catch {
          res.write(`data: ${JSON.stringify({ content: "\n\n" + getRandomFallback() })}\n\n`);
        }
        res.write("data: [DONE]\n\n");
        res.end();
        return;
      }

      const result = await groqChat(conversation);
      if (result) {
        res.json({ content: result });
      } else {
        res.json({ content: getRandomFallback(), fallback: true });
      }
    } catch (e) {
      console.error("[ai/chat] Error:", e);
      res.json({ content: getRandomFallback(), fallback: true });
    }
  });

  // POST /api/seo/meta — генерация мета-тегов
  app.post("/api/seo/meta", async (req, res) => {
    try {
      const { type, data } = req.body || {};
      if (!type || !data) { res.status(400).json({ error: "type and data are required" }); return; }
      const fallbackMeta: Record<string, { title: string; description: string; keywords: string }> = {
        service: { title: `${data.name ?? "Услуга"} в Москве — Freonn`, description: `Профессиональный монтаж ${data.name ?? "инженерных систем"} в Москве и МО. Звоните: 8(800)101-2009`, keywords: `${data.name ?? "инженерные системы"}, монтаж, Москва` },
        city: { title: `Монтаж инженерных систем в ${data.cityName ?? "городе"} — Freonn`, description: `Freonn — монтаж вентиляции, кондиционирования и отопления в ${data.cityName ?? "вашем городе"}. Бесплатный расчёт.`, keywords: `монтаж вентиляции ${data.cityName ?? ""}, Freonn` },
        blog: { title: `${data.articleTitle ?? "Статья"} — Блог Freonn`, description: data.excerpt ?? "Экспертные статьи об инженерных системах.", keywords: `${data.category ?? "инженерные системы"}, Freonn` },
      };
      if (!isGroqAvailable()) { res.json({ ...fallbackMeta[type] ?? fallbackMeta.service, fallback: true }); return; }
      const prompts: Record<string, string> = {
        service: `Напиши SEO Title (до 60 символов) и Meta Description (до 160 символов) для страницы услуги "${data.name}" компании Freonn. Ответь в JSON: {"title":"...","description":"...","keywords":"..."}`,
        city: `Напиши SEO Title (до 60 символов) и Meta Description (до 160 символов) для страницы "Монтаж инженерных систем в ${data.cityName}" компании Freonn. Ответь в JSON: {"title":"...","description":"...","keywords":"..."}`,
        blog: `Напиши SEO Title (до 60 символов) и Meta Description (до 160 символов) для статьи "${data.articleTitle}". Ответь в JSON: {"title":"...","description":"...","keywords":"..."}`,
      };
      const result = await groqChat([{ role: "user", content: prompts[type] ?? prompts.service }], GROQ_CONTENT_MODEL, 300);
      if (!result) { res.json({ ...fallbackMeta[type] ?? fallbackMeta.service, fallback: true }); return; }
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) { const p = JSON.parse(jsonMatch[0]); res.json({ title: String(p.title ?? "").slice(0, 65), description: String(p.description ?? "").slice(0, 165), keywords: String(p.keywords ?? "") }); return; }
      } catch { /* fall through */ }
      res.json({ ...fallbackMeta[type] ?? fallbackMeta.service, fallback: true });
    } catch (e) { console.error("[seo/meta] Error:", e); res.status(500).json({ error: "Internal error" }); }
  });

  // POST /api/seo/city-text — SEO-текст для городской страницы
  app.post("/api/seo/city-text", async (req, res) => {
    try {
      const { city, cityName } = req.body || {};
      if (!city || !cityName) { res.status(400).json({ error: "city and cityName are required" }); return; }
      const cityFallback = getCitySeoFallback(city, cityName);
      const fallback = { ...cityFallback, fallback: true };
      if (!isGroqAvailable()) { res.json(fallback); return; }
      const prompt = `Напиши уникальный SEO-текст (2–3 предложения, 60–80 слов) для страницы "Монтаж инженерных систем в ${cityName}" компании Freonn. Включи LSI: вентиляция, кондиционирование, дымоудаление, отопление. Упомяни специфику ${cityName}. Ответь в JSON: {"lsi": "...", "district": "...", "objects": "..."}`;
      const result = await groqChat([{ role: "user", content: prompt }], GROQ_CONTENT_MODEL, 300);
      if (!result) { res.json(fallback); return; }
      try { const m = result.match(/\{[\s\S]*\}/); if (m) { const p = JSON.parse(m[0]); res.json({ lsi: String(p.lsi ?? fallback.lsi), district: String(p.district ?? fallback.district), objects: String(p.objects ?? fallback.objects) }); return; } } catch { /* fall through */ }
      res.json(fallback);
    } catch (e) { console.error("[seo/city-text] Error:", e); res.json({ lsi: `Монтаж инженерных систем — Freonn.`, district: `районе`, objects: "Промышленные объекты", fallback: true }); }
  });

  // POST /api/seo/generate-article — генерация статьи блога
  app.post("/api/seo/generate-article", async (req, res) => {
    try {
      const { topic, category, keywords = [] } = req.body || {};
      if (!topic || !category) { res.status(400).json({ error: "topic and category are required" }); return; }
      if (!isGroqAvailable()) { res.status(503).json({ error: "Groq API недоступен. Добавьте GROQ_API_KEY.", fallback: true }); return; }
      const kwList = (keywords as string[]).length > 0 ? (keywords as string[]).join(", ") : "вентиляция, монтаж, инженерные системы";
      const prompt = `Напиши экспертную SEO-статью для блога Freonn.\nТема: "${topic}"\nКатегория: ${category}\nКлючевые слова: ${kwList}\nОбъём: 600–800 слов. Структура: введение, 3–4 раздела H2, заключение с призывом. Формат: Markdown.\nВ конце JSON-блок:\n\`\`\`json\n{"title":"...","description":"...","slug":"...","excerpt":"..."}\n\`\`\``;
      const result = await groqChat([{ role: "user", content: prompt }], GROQ_CONTENT_MODEL, 2048, 30000);
      if (!result) { res.status(503).json({ error: "Groq API не ответил.", fallback: true }); return; }
      const jsonMatch = result.match(/```json\s*([\s\S]*?)```/);
      let meta = { title: topic, description: "", slug: "", excerpt: "" };
      if (jsonMatch) { try { meta = { ...meta, ...JSON.parse(jsonMatch[1]) }; } catch { /* ignore */ } }
      const content = result.replace(/```json[\s\S]*?```/, "").trim();
      res.json({ content, meta, topic, category });
    } catch (e) { console.error("[seo/generate-article] Error:", e); res.status(500).json({ error: "Internal error" }); }
  });

  // POST /api/seo/cluster-keywords — кластеризация семантики
  app.post("/api/seo/cluster-keywords", async (req, res) => {
    try {
      const { keywords = [] } = req.body || {};
      if (!Array.isArray(keywords) || keywords.length === 0) { res.status(400).json({ error: "keywords array is required" }); return; }
      if (!isGroqAvailable()) { res.status(503).json({ error: "Groq API недоступен.", fallback: true }); return; }
      const batch = (keywords as string[]).slice(0, 100);
      const prompt = `Кластеризуй ключевые слова для сайта Freonn.ru по страницам: вентиляция, кондиционирование, дымоудаление, отопление, холодоснабжение, водоснабжение, электроснабжение, пескоструй, блог.\nКлючевые слова:\n${batch.join("\n")}\nОтветь в JSON: {"clusters": [{"page": "...", "intent": "commercial|informational", "keywords": ["..."]}]}`;
      const result = await groqChat([{ role: "user", content: prompt }], GROQ_CONTENT_MODEL, 2048, 30000);
      if (!result) { res.status(503).json({ error: "Groq API не ответил.", fallback: true }); return; }
      try { const m = result.match(/\{[\s\S]*\}/); if (m) { res.json(JSON.parse(m[0])); return; } } catch { /* fall through */ }
      res.json({ raw: result, clusters: [] });
    } catch (e) { console.error("[seo/cluster-keywords] Error:", e); res.status(500).json({ error: "Internal error" }); }
  });

  // POST /api/seo/service-content — FAQ + расширенный контент для страниц услуг
  app.post("/api/seo/service-content", async (req, res) => {
    try {
      const { slug, title, description } = req.body || {};
      if (!slug || !title) { res.status(400).json({ error: "slug and title are required" }); return; }
      const fallback = { faq: [], jsonLdFaq: null, fallback: true };
      if (!isGroqAvailable()) { res.json(fallback); return; }
      const prompt = `Ты SEO-эксперт. Для страницы услуги "${title}" компании Freonn (монтаж инженерных систем в Москве и МО) создай 5 вопросов и ответов FAQ.
Ответь строго в JSON: {"faq": [{"q": "...", "a": "..."}]}`;
      const result = await groqChat([{ role: "user", content: prompt }], GROQ_CONTENT_MODEL, 800, 20000);
      if (!result) { res.json(fallback); return; }
      try {
        const m = result.match(/\{[\s\S]*\}/);
        if (m) {
          const p = JSON.parse(m[0]);
          const faq = Array.isArray(p.faq) ? p.faq.slice(0, 5) : [];
          const jsonLdFaq = faq.length > 0 ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item: { q: string; a: string }) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          } : null;
          res.json({ faq, jsonLdFaq });
          return;
        }
      } catch { /* fall through */ }
      res.json(fallback);
    } catch (e) { console.error("[seo/service-content] Error:", e); res.json({ faq: [], jsonLdFaq: null, fallback: true }); }
  });

  // POST /api/seo/city-content — расширенный контент для городских страниц (FAQ + LSI)
  app.post("/api/seo/city-content", async (req, res) => {
    try {
      const { city, cityName } = req.body || {};
      if (!city || !cityName) { res.status(400).json({ error: "city and cityName are required" }); return; }
      const cityFallback = getCitySeoFallback(city, cityName);
      const fallback = { ...cityFallback, faq: [], fallback: true };
      if (!isGroqAvailable()) { res.json(fallback); return; }
      const prompt = `Ты SEO-эксперт. Для страницы "Монтаж инженерных систем в ${cityName}" компании Freonn создай:
1. LSI-текст (2–3 предложения, 60–80 слов) с упоминанием специфики ${cityName}
2. 3 вопроса-ответа FAQ для жителей ${cityName}
Ответь строго в JSON: {"lsi": "...", "district": "...", "objects": "...", "faq": [{"q": "...", "a": "..."}]}`;
      const result = await groqChat([{ role: "user", content: prompt }], GROQ_CONTENT_MODEL, 600, 20000);
      if (!result) { res.json(fallback); return; }
      try {
        const m = result.match(/\{[\s\S]*\}/);
        if (m) {
          const p = JSON.parse(m[0]);
          res.json({
            lsi: String(p.lsi ?? fallback.lsi),
            district: String(p.district ?? fallback.district),
            objects: String(p.objects ?? fallback.objects),
            faq: Array.isArray(p.faq) ? p.faq.slice(0, 3) : [],
          });
          return;
        }
      } catch { /* fall through */ }
      res.json(fallback);
    } catch (e) { console.error("[seo/city-content] Error:", e); res.json({ lsi: `Монтаж инженерных систем — Freonn.`, district: `районе`, objects: "Промышленные объекты", faq: [], fallback: true }); }
  });

  // GET /api/sitemap-dynamic.xml — динамический sitemap с AI-приоритетами
  app.get("/api/sitemap-dynamic.xml", (_req, res) => {
    const baseUrl = "https://freonn.ru";
    // Только города с реальными страницами в CityPage.tsx (правильные slug без опечаток)
    const cities = ["moskva","moskovskaya-oblast","dzerzhinskij","balashikha","khimki","korolev","mytishchi","odintsovo","podolsk","krasnogorsk","lyubertsy","zhukovsky","elektrostal","sergiev-posad","noginsk","klin","istra","domodedovo","ramenskoe","stupino","chekhov","serpukhov","kolomna","voskresensk","kashira","mozhaisk","ruza","volokolamsk","taldom","dubna","dmitrov","dolgoprudny","fryazevo","pushkino","lobnya","krasnoznamensk","zelenograd","troitsk","shcherbinka","shchelkovo","naro-fominsk","orekhovo-zuevo","protvino","solnechnogorsk"];
    const services = ["ventilyaciya","kondicionirovanie","dymoudalenie","otoplenie","holodosnabzhenie","vodosnabzhenie","peskostrujnaya-obrabotka","elektrosnabzhenie"];
    const geoPages = services.flatMap(s => ["moskva", "moskovskaya-oblast"].map(g => `${s}-${g}`));
    const objects = ["sklad","ofis","tc","zavod","restoran","gostinica","shkola","bolnica","parking","dc"];
    const objectPages = services.flatMap(s => objects.map(o => `${s}-${o}`));
    const today = new Date().toISOString().split("T")[0];
    const urls = [
      { loc: baseUrl, priority: "1.0", changefreq: "weekly" },
      { loc: `${baseUrl}/uslugi`, priority: "0.9", changefreq: "weekly" },
      { loc: `${baseUrl}/blog`, priority: "0.8", changefreq: "daily" },
      { loc: `${baseUrl}/contacts`, priority: "0.7", changefreq: "monthly" },
      { loc: `${baseUrl}/o-kompanii`, priority: "0.7", changefreq: "monthly" },
      ...services.map(s => ({ loc: `${baseUrl}/${s}`, priority: "0.85", changefreq: "weekly" })),
      ...geoPages.map(p => ({ loc: `${baseUrl}/${p}`, priority: "0.8", changefreq: "weekly" })),
      ...objectPages.map(p => ({ loc: `${baseUrl}/${p}`, priority: "0.7", changefreq: "monthly" })),
      ...cities.map(c => ({ loc: `${baseUrl}/${c}`, priority: "0.75", changefreq: "weekly" })),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
    res.set("Content-Type", "application/xml");
    res.send(xml);
  });

  // ── tRPC API ───────────────────────────────────────────────────────────────
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ── Express error handler (must be last middleware) ────────────────────────
  // Catches errors passed via next(err) and prevents unhandled crash.
  app.use((err: Error, _req: import("express").Request, res: import("express").Response, _next: import("express").NextFunction) => {
    // Ignore HTTP parse errors from abruptly-closed connections (bots/scanners)
    if (err.message === "Parse Error") return;
    console.error("[Express error]", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`[Groq] API available: ${isGroqAvailable()}`);
  });
}

// ── Global error handlers ──────────────────────────────────────────────────
// Prevents Node.js from crashing on unhandled errors (e.g. HTTP Parse Error
// caused by bots/scanners closing connections mid-request).
process.on("uncaughtException", (err: NodeJS.ErrnoException) => {
  // Ignore benign network-level parse errors from abruptly-closed connections
  if (err.code === "HPE_INVALID_METHOD" || err.message === "Parse Error") {
    return;
  }
  console.error("[uncaughtException]", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});

startServer().catch(console.error);
