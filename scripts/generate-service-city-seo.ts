/**
 * generate-service-city-seo.ts — уникальные тексты для landing «услуга × город» через Groq.
 * Output: scripts/output/service-city-seo.json
 *
 * Usage:
 *   GROQ_API_KEY=gsk_xxx npx tsx scripts/generate-service-city-seo.ts
 *   GROQ_API_KEY=gsk_xxx LIMIT=20 npx tsx scripts/generate-service-city-seo.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CITIES, SERVICE_SEO, SERVICE_SLUGS } from "../shared/geoRoutes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const API_KEY = process.env.GROQ_API_KEY ?? "";
const DELAY_MS = 1200;
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : undefined;

interface ServiceCitySeo {
  path: string;
  title: string;
  description: string;
  intro: string;
}

async function generateEntry(
  serviceSlug: string,
  citySlug: string,
): Promise<ServiceCitySeo | null> {
  const service = SERVICE_SEO[serviceSlug as keyof typeof SERVICE_SEO];
  const city = CITIES.find((c) => c.slug === citySlug);
  if (!service || !city) return null;

  const prompt = `Ты SEO-копирайтер для freonn.ru (монтаж инженерных систем в Москве и МО).
Напиши уникальный контент для страницы «${service.name} ${city.phrase}».

Ответ строго JSON без markdown:
{"title":"...","description":"...","intro":"..."}

title: до 60 символов, с городом
description: 140–160 символов
intro: 2–3 предложения, коммерческий тон, упомяни типы объектов в ${city.name}`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      console.error(`  ✗ ${serviceSlug}-${citySlug}: HTTP ${response.status}`);
      return null;
    }

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    const content = data.choices?.[0]?.message?.content ?? "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]) as { title?: string; description?: string; intro?: string };
    return {
      path: `/${serviceSlug}-${citySlug}`,
      title: String(parsed.title ?? "").trim(),
      description: String(parsed.description ?? "").trim(),
      intro: String(parsed.intro ?? "").trim(),
    };
  } catch (err) {
    console.error(`  ✗ ${serviceSlug}-${citySlug}:`, err);
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("Freonn SEO — Service×City generator (Groq)\n");

  if (!API_KEY) {
    console.error("✗ GROQ_API_KEY is not set.");
    process.exit(1);
  }

  const pairs = SERVICE_SLUGS.flatMap((serviceSlug) =>
    CITIES.map((city) => ({ serviceSlug, citySlug: city.slug })),
  );
  const work = LIMIT ? pairs.slice(0, LIMIT) : pairs;
  console.log(`  Pages: ${work.length} / ${pairs.length}\n`);

  const results: Record<string, ServiceCitySeo> = {};
  let ok = 0;

  for (const { serviceSlug, citySlug } of work) {
    const key = `${serviceSlug}-${citySlug}`;
    process.stdout.write(`  → ${key}... `);
    const entry = await generateEntry(serviceSlug, citySlug);
    if (entry?.title) {
      results[key] = entry;
      ok++;
      console.log("✓");
    } else {
      console.log("skip");
    }
    await sleep(DELAY_MS);
  }

  const outDir = path.join(__dirname, "output");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "service-city-seo.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`\n✓ Saved ${ok}/${work.length} entries → ${outPath}`);
}

main();
