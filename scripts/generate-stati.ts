/**
 * generate-stati.ts — генерация SEO-статей /stati/ через Groq.
 * Usage: GROQ_API_KEY=... npx tsx scripts/generate-stati.ts
 * Output: shared/contentPagesExtra6.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const API_KEY = process.env.GROQ_API_KEY ?? "";
const DELAY_MS = Number(process.env.GROQ_DELAY_MS ?? "45000");

const TOPICS = [
  {
    slug: "montazh-ventilyacii-na-kuhne",
    category: "Вентиляция",
    keywords: "вентиляция на кухне, вытяжка на кухне, монтаж кухонной вытяжки, вентиляция в кафе, жироуловитель",
    prompt: "Напиши SEO-статью для freonn.ru: 'Монтаж вентиляции на кухне: в квартире, кафе и ресторане'. Целевая аудитория — владельцы квартир и общепита. Раскрой: нормы воздухообмена, виды вытяжек, жироуловители, этапы монтажа, типичные ошибки, цены в Москве и МО.",
  },
  {
    slug: "kondicionirovanie-sklada",
    category: "Кондиционирование",
    keywords: "кондиционирование склада, монтаж кондиционирования на складе, сплит система склад, холодоснабжение склада",
    prompt: "Напиши SEO-статью для freonn.ru: 'Кондиционирование склада: расчёт, системы, монтаж и эксплуатация'. Целевая аудитория — владельцы складов и логистических комплексов. Раскрой: теплопритоки, расчёт мощности, сплит vs VRF vs прецизионные, этапы монтажа, обслуживание.",
  },
  {
    slug: "otoplenie-torgovogo-centra",
    category: "Отопление",
    keywords: "отопление торгового центра, монтаж отопления ТЦ, тепловая завеса, радиаторное отопление, воздушное отопление магазин",
    prompt: "Напиши SEO-статью для freonn.ru: 'Отопление торгового центра: проектирование, монтаж и выбор системы'. Целевая аудитория — девелоперы и управляющие ТЦ. Раскрой: виды систем (водяное, воздушное, тёплые полы, завесы), расчёт теплопотерь, этапы монтажа, требования к комфорту и энергоэффективности.",
  },
  {
    slug: "vodosnabzhenie-i-kanalizaciya-ofisa",
    category: "Водоснабжение",
    keywords: "водоснабжение офиса, канализация офиса, проектирование водоснабжения, монтаж водопровода в офисе",
    prompt: "Напиши SEO-статью для freonn.ru: 'Водоснабжение и канализация офиса: проектирование и монтаж'. Целевая аудитория — офисные центры и бизнес-центры. Раскрой: нормы расхода воды, схемы разводки, выбор материалов, этапы монтажа, требования СНиП, типичные ошибки.",
  },
  {
    slug: "elektrosnabzhenie-proizvodstva",
    category: "Электроснабжение",
    keywords: "электроснабжение производства, проектирование электроснабжения цеха, молниезащита, заземление, распределительные щиты",
    prompt: "Напиши SEO-статью для freonn.ru: 'Электроснабжение производства: проектирование, монтаж и безопасность'. Целевая аудитория — промышленные предприятия. Раскрой: расчёт нагрузок, вводно-распределительные устройства, заземление и молниезащита, кабельные линии, этапы монтажа, требования ПУЭ.",
  },
];

interface FaqItem {
  q: string;
  a: string;
}

interface Article {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  h1: string;
  category: string;
  author: string;
  published: string;
  modified: string;
  readTime: string;
  html: string;
  faq: FaqItem[];
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function todayIso() {
  const now = new Date();
  const tzOffset = -now.getTimezoneOffset();
  const sign = tzOffset >= 0 ? "+" : "-";
  const pad = (n: number) => String(n).padStart(2, "0");
  const hh = pad(Math.abs(Math.trunc(tzOffset / 60)));
  const mm = pad(Math.abs(tzOffset % 60));
  return `${now.toISOString().split(".")[0]}${sign}${hh}:${mm}`;
}

async function fetchArticle(topic: (typeof TOPICS)[number]): Promise<Article | null> {
  const today = todayIso();
  const systemPrompt = `Ты — технический SEO-копирайтер для инженерной компании Freonn (freonn.ru). Пишешь экспертные SEO-статьи на русском языке.

Статья должна быть полезной, без воды, с конкретными цифрами, нормами и практическими рекомендациями. HTML-контент должен содержать теги <h2>, <p>, <ul>, <li>, <ol>, <strong>. Можно добавить 1–2 внутренние ссылки вида <a href="/uslugi/...">, <a href="/ceny/...">, <a href="/stati/...">, <a href="/contacts">.

Ответ строго в формате JSON (без markdown): {
  "title": "...",
  "description": "...",
  "h1": "...",
  "html": "...",
  "faq": [{"q":"...","a":"..."}]
}

title: 55–65 символов, привлекательный, с ключевыми словами
description: 145–160 символов, с призывом и цифрами
h1: 1 предложение, с ключевыми словами, без перечислений
html: 700–1200 слов, 4–6 разделов h2, экспертный тон, конкретные цифры
faq: 3–4 вопроса/ответа по теме, кратко и по делу`;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: topic.prompt },
      ],
      max_tokens: 3500,
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
  const raw = data.choices?.[0]?.message?.content ?? "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    console.error(`  ✗ ${topic.slug}: no JSON found`);
    return null;
  }

  const parsed = JSON.parse(match[0]) as { title?: string; description?: string; h1?: string; html?: string; faq?: FaqItem[] };
  if (!parsed.title || !parsed.html) {
    console.error(`  raw (${raw.length} chars):`, raw.slice(0, 600));
    throw new Error("incomplete JSON");
  }

  return {
    slug: topic.slug,
    title: parsed.title.trim(),
    description: (parsed.description ?? parsed.title).trim(),
    keywords: topic.keywords,
    h1: (parsed.h1 ?? parsed.title).trim(),
    category: topic.category,
    author: "Freonn",
    published: today,
    modified: today,
    readTime: "7 минут",
    html: parsed.html.trim(),
    faq: Array.isArray(parsed.faq) ? parsed.faq.slice(0, 4) : [],
  };
}

async function generateArticle(topic: (typeof TOPICS)[number], attempts = 2): Promise<Article | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetchArticle(topic);
    } catch (err: any) {
      console.error(`  ✗ ${topic.slug}: ${err.message} (attempt ${i + 1}/${attempts})`);
      if (i < attempts - 1) {
        const backoff = (i + 1) * 15000;
        console.log(`     waiting ${backoff / 1000}s...`);
        await sleep(backoff);
      }
    }
  }
  return null;
}

function quote(str: string): string {
  return JSON.stringify(str);
}

function renderArticle(article: Article): string {
  const faq = article.faq
    .map((f) => `      { q: ${quote(f.q)}, a: ${quote(f.a)} }`)
    .join(",\n");
  return `  {
    slug: ${quote(article.slug)},
    title: ${quote(article.title)},
    description: ${quote(article.description)},
    keywords: ${quote(article.keywords)},
    h1: ${quote(article.h1)},
    category: ${quote(article.category)},
    author: ${quote(article.author)},
    published: ${quote(article.published)},
    modified: ${quote(article.modified)},
    readTime: ${quote(article.readTime)},
    html: ${quote(article.html)},
    faq: [\n${faq}\n    ],
  }`;
}

async function main() {
  if (!API_KEY) {
    console.error("✗ GROQ_API_KEY is not set.");
    process.exit(1);
  }

  const outPath = path.join(__dirname, "..", "shared", "contentPagesExtra6.ts");

  // Load existing articles if present to avoid regenerating/replacing them.
  let existing: Article[] = [];
  try {
    const mod = (await import("file://" + outPath)) as { EXTRA_CONTENT_PAGES_6: Article[] };
    existing = mod.EXTRA_CONTENT_PAGES_6 ?? [];
    console.log(`Found ${existing.length} existing article(s) in ${outPath}.`);
  } catch {
    // file doesn't exist yet
  }

  const existingSlugs = new Set(existing.map((a) => a.slug));
  const topicsToGenerate = TOPICS.filter((t) => !existingSlugs.has(t.slug));

  if (topicsToGenerate.length === 0) {
    console.log("All topics already exist. Nothing to generate.");
    return;
  }

  console.log(`Generating ${topicsToGenerate.length} /stati articles...\n`);
  const articles: Article[] = [...existing];

  for (const topic of topicsToGenerate) {
    process.stdout.write(`  → ${topic.slug}... `);
    const article = await generateArticle(topic);
    if (article) {
      articles.push(article);
      console.log("✓");
    } else {
      console.log("skip");
    }
    await sleep(DELAY_MS);
  }

  if (articles.length === existing.length) {
    console.error("✗ No new articles generated.");
    process.exit(1);
  }

  const fileContent = `/** SEO-статьи /stati/ (парт 6) — сгенерированы через Groq */\n\nexport const EXTRA_CONTENT_PAGES_6: any[] = [\n${articles.map(renderArticle).join(",\n")}\n];\n`;
  fs.writeFileSync(outPath, fileContent, "utf-8");
  console.log(`\n✓ Wrote ${articles.length} articles to ${outPath}`);
}

main();
