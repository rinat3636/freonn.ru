/**
 * Переключение SEO_RELEASE_PHASE и перегенерация sitemap.
 *
 * Фазы (shared/seoMatrix.ts):
 *   1 — city hubs + service×city (tier-0/1/2)
 *   2 — 3D matrix tier-1 + кейсы + алиасы×город
 *   3 — price×city tier-1
 *   4 — словарь + калькулятор
 *
 * Usage: pnpm run seo:phase 2
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MATRIX_PATH = path.join(__dirname, "../shared/seoMatrix.ts");

const phaseArg = process.argv[2];
const phase = Number(phaseArg);

if (!Number.isInteger(phase) || phase < 1 || phase > 4) {
  console.error("Usage: pnpm run seo:phase <1|2|3|4>");
  process.exit(1);
}

const src = fs.readFileSync(MATRIX_PATH, "utf8");
const currentMatch = src.match(/export const SEO_RELEASE_PHASE = (\d+);/);
const currentPhase = currentMatch ? Number(currentMatch[1]) : NaN;

if (!Number.isInteger(currentPhase)) {
  console.error("Could not read SEO_RELEASE_PHASE in shared/seoMatrix.ts");
  process.exit(1);
}

if (currentPhase === phase) {
  console.log(`✓ SEO_RELEASE_PHASE already ${phase} — regenerating sitemap`);
} else {
  const next = src.replace(/export const SEO_RELEASE_PHASE = \d+;/, `export const SEO_RELEASE_PHASE = ${phase};`);
  fs.writeFileSync(MATRIX_PATH, next, "utf8");
  console.log(`✓ SEO_RELEASE_PHASE set to ${phase}`);
}

execSync("pnpm run seo:sitemap", { stdio: "inherit", cwd: path.join(__dirname, "..") });

console.log(`\nNext: pnpm check && pnpm test && pnpm run deploy`);
console.log(`Yandex Webmaster: submit sitemap-index.xml (+ sitemap-moscow-core.xml for phase 1)`);
