import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { SERVICE_SEO } from "../../shared/geoRoutes";
import {
  buildPageJsonLd,
  getBlogSeoMeta,
  getCitySeoMeta,
  getServiceGeoSeoMeta,
  getServicePageSeoMeta,
  injectPageJsonLd,
  isNoIndexPath,
  resolveCanonicalPath,
  shouldOmitGeoMeta,
  stripGeoMetaTags,
} from "../seoInjection";
import { isValidSpaPath, normalizePathname } from "../spaRoutes";

// Polyfill for import.meta.dirname (not available in Node.js < 20.11)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_URL = "https://freonn.ru";

interface ServerSeoMeta {
  title: string;
  description: string;
  keywords?: string;
  robots?: string;
}

const serverSeo: Record<string, ServerSeoMeta> = {
  "/": {
    title: "Freonn — монтаж инженерных систем в Москве и МО",
    description: "Проектирование, монтаж и обслуживание вентиляции, кондиционирования, дымоудаления, отопления и электроснабжения в Москве и Московской области.",
    keywords: "монтаж вентиляции Москва, кондиционирование Москва, дымоудаление Москва, инженерные системы МО",
  },
  "/moskva": {
    title: "Монтаж инженерных систем в Москве — Freonn",
    description: "Вентиляция, кондиционирование, дымоудаление, отопление и электроснабжение для объектов Москвы. Выезд инженера, проектирование, монтаж под ключ.",
    keywords: "монтаж вентиляции Москва, кондиционирование Москва, инженерные системы Москва",
  },
  "/moskovskaya-oblast": {
    title: "Монтаж инженерных систем в Московской области — Freonn",
    description: "Инженерные системы под ключ по Московской области: вентиляция, кондиционирование, дымоудаление, отопление, электроснабжение. Бесплатный расчёт.",
    keywords: "монтаж вентиляции Московская область, кондиционирование МО, инженерные системы МО",
  },
  "/dzerzhinskij": {
    title: "Монтаж инженерных систем в Дзержинском — Freonn",
    description: "Вентиляция, кондиционирование, дымоудаление и отопление в Дзержинском. Офис Freonn в Московской области, выезд инженера и монтаж под ключ.",
    keywords: "монтаж вентиляции Дзержинский, кондиционирование Дзержинский, инженерные системы Дзержинский",
  },
  "/uslugi": {
    title: "Услуги по монтажу инженерных систем в Москве — Freonn",
    description: "Вентиляция, кондиционирование, дымоудаление, отопление, холодоснабжение, водоснабжение и электроснабжение для коммерческих объектов.",
  },
  "/contacts": {
    title: "Контакты Freonn — инженерные системы в Москве и МО",
    description: "Связаться с Freonn: телефон 8(800)101-2009, email freonn@internet.ru. Офис: Московская обл., г. Дзержинский, ул. Ленина 2Б. Выезд инженера по Москве и МО.",
  },
};

const objectSeo: Record<string, { name: string; phrase: string }> = {
  "sklad": { name: "склад", phrase: "для складов" },
  "ofis": { name: "офис", phrase: "для офисов" },
  "tc": { name: "торговый центр", phrase: "для торговых центров" },
  "zavod": { name: "завод", phrase: "для производств и заводов" },
  "restoran": { name: "ресторан", phrase: "для ресторанов и кафе" },
  "gostinica": { name: "гостиница", phrase: "для гостиниц и отелей" },
  "shkola": { name: "школа", phrase: "для школ и учебных заведений" },
  "bolnica": { name: "медицинское учреждение", phrase: "для больниц и клиник" },
  "parking": { name: "паркинг", phrase: "для паркингов" },
  "dc": { name: "дата-центр", phrase: "для дата-центров и серверных" },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const NOINDEX_PAGE_SEO: Record<string, ServerSeoMeta> = {
  "/spasibo": {
    title: "Спасибо за заявку — Freonn",
    description: "Ваша заявка принята. Мы свяжемся с вами в ближайшее время.",
    robots: "noindex, nofollow",
  },
  "/auth/login": {
    title: "Вход — Freonn",
    description: "Авторизация в личном кабинете Freonn.",
    robots: "noindex, nofollow",
  },
  "/auth/app-callback": {
    title: "Авторизация — Freonn",
    description: "Обработка авторизации Freonn.",
    robots: "noindex, nofollow",
  },
  "/oplata-i-dostavka": {
    title: "Оплата и доставка — Freonn",
    description: "Раздел в разработке.",
    robots: "noindex, nofollow",
  },
  "/sotrudniki": {
    title: "Сотрудники — Freonn",
    description: "Раздел в разработке.",
    robots: "noindex, nofollow",
  },
  "/video-kejsy": {
    title: "Видео кейсы — Freonn",
    description: "Раздел в разработке.",
    robots: "noindex, nofollow",
  },
  "/poleznye-materialy": {
    title: "Полезные материалы — Freonn",
    description: "Раздел в разработке.",
    robots: "noindex, nofollow",
  },
};

function getServerSeo(pathname: string, status: number): ServerSeoMeta | null {
  if (status === 404) {
    return {
      title: "Страница не найдена — Freonn",
      description: "Страница не найдена. Перейдите к услугам Freonn: вентиляция, кондиционирование, дымоудаление и инженерные системы в Москве и МО.",
      robots: "noindex, nofollow",
    };
  }

  const clean = normalizePathname(pathname);
  if (NOINDEX_PAGE_SEO[clean]) return NOINDEX_PAGE_SEO[clean];
  if (serverSeo[clean]) return serverSeo[clean];

  const serviceGeoMeta = getServiceGeoSeoMeta(pathname);
  if (serviceGeoMeta) return serviceGeoMeta;

  const blogMeta = getBlogSeoMeta(pathname);
  if (blogMeta) return blogMeta;

  const servicePageMeta = getServicePageSeoMeta(pathname);
  if (servicePageMeta) return servicePageMeta;

  const cityMeta = getCitySeoMeta(clean.slice(1));
  if (cityMeta) return cityMeta;

  const service = SERVICE_SEO[clean.slice(1) as keyof typeof SERVICE_SEO];
  if (service) {
    return {
      title: `Монтаж ${service.genitive} в Москве и МО — Freonn`,
      description: `Проектирование и монтаж ${service.genitive} для коммерческих и промышленных объектов в Москве и Московской области. Выезд инженера, смета, гарантия.`,
      keywords: `монтаж ${service.genitive} Москва, ${service.name.toLowerCase()} Московская область, Freonn`,
    };
  }

  for (const [serviceSlug, serviceData] of Object.entries(SERVICE_SEO)) {
    for (const [objectSlug, objectData] of Object.entries(objectSeo)) {
      if (clean === `/${serviceSlug}-${objectSlug}`) {
        return {
          title: `${serviceData.name} ${objectData.phrase} в Москве и МО — Freonn`,
          description: `Проектирование и монтаж ${serviceData.genitive} ${objectData.phrase}. Работаем с объектами от 500 м² в Москве и Московской области.`,
          keywords: `${serviceData.name.toLowerCase()} ${objectData.name}, монтаж ${serviceData.genitive} Москва, ${serviceData.name.toLowerCase()} МО`,
        };
      }
    }
  }

  return null;
}

function injectServerSeo(html: string, pathname: string, status: number) {
  let next = html;
  if (shouldOmitGeoMeta(pathname)) {
    next = stripGeoMetaTags(next);
  }

  const jsonLd = status === 200 ? buildPageJsonLd(pathname) : null;
  if (jsonLd) {
    next = injectPageJsonLd(next, jsonLd);
  }

  const seo = getServerSeo(pathname, status);
  if (!seo) return next;

  const clean = pathname.replace(/\/$/, "") || "/";
  const resolvedClean = resolveCanonicalPath(clean);
  const canonicalPath =
    status === 404 ? "/404" : isNoIndexPath(pathname) ? resolvedClean : resolvedClean === "/" ? "/" : resolvedClean;
  const canonical = `${SITE_URL}${canonicalPath === "/" ? "/" : canonicalPath}`;
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const keywords = escapeHtml(seo.keywords || "");
  const robots = escapeHtml(
    seo.robots || (isNoIndexPath(pathname) ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1")
  );
  const yandexRobots = status === 404 || isNoIndexPath(pathname) || seo.robots?.includes("noindex")
    ? "noindex, nofollow"
    : "index, follow";

  next = next
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${robots}" />`)
    .replace(/<meta name="googlebot" content="[^"]*" \/>/, `<meta name="googlebot" content="${robots}" />`)
    .replace(/<meta name="yandexbot" content="[^"]*" \/>/, `<meta name="yandexbot" content="${yandexRobots}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*" data-seo-id="canonical" \/>/, `<link rel="canonical" href="${canonical}" data-seo-id="canonical" />`)
    .replace(/<link rel="alternate" hreflang="ru" href="[^"]*" \/>/, `<link rel="alternate" hreflang="ru" href="${canonical}" />`)
    .replace(/<link rel="alternate" hreflang="x-default" href="[^"]*" \/>/, `<link rel="alternate" hreflang="x-default" href="${canonical}" />`);

  if (keywords) {
    next = next.replace(/<meta name="keywords" content="[^"]*" \/>/, `<meta name="keywords" content="${keywords}" />`);
  }

  return next;
}

function normalizeSpaPathname(originalUrl: string) {
  return normalizePathname(new URL(originalUrl, "http://localhost").pathname);
}

function spaResponseHeaders(status: number): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "text/html; charset=utf-8",
  };
  if (status === 404) {
    headers["Cache-Control"] = "no-store, no-cache, must-revalidate";
  }
  return headers;
}

export async function setupVite(app: Express, server: Server) {
  // Dynamically import vite config only in development to avoid bundling issues
  const viteConfig = await import("../../vite.config").then(
    (m: { default?: unknown }) => m.default || m
  );
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...(viteConfig as object),
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    const pathname = normalizeSpaPathname(url);
    if (pathname.length > 1 && new URL(url, "http://localhost").pathname.endsWith("/")) {
      const parsedUrl = new URL(url, "http://localhost");
      parsedUrl.pathname = pathname;
      res.redirect(301, `${parsedUrl.pathname}${parsedUrl.search}`);
      return;
    }

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      const status = isValidSpaPath(pathname) ? 200 : 404;
      res
        .status(status)
        .set(spaResponseHeaders(status))
        .end(injectServerSeo(page, pathname, status));
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, "../..", "dist", "public")
      : path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // SPA fallback: 200 для известных маршрутов, 404 для несуществующих
  app.use("*", async (req, res, next) => {
    const parsedUrl = new URL(req.originalUrl, "http://localhost");
    const pathname = normalizeSpaPathname(req.originalUrl);
    if (parsedUrl.pathname.length > 1 && parsedUrl.pathname.endsWith("/")) {
      parsedUrl.pathname = pathname;
      res.redirect(301, `${parsedUrl.pathname}${parsedUrl.search}`);
      return;
    }
    const status = isValidSpaPath(pathname) ? 200 : 404;
    try {
      const html = await fs.promises.readFile(path.resolve(distPath, "index.html"), "utf-8");
      res
        .status(status)
        .set(spaResponseHeaders(status))
        .send(injectServerSeo(html, pathname, status));
    } catch (e) {
      next(e);
    }
  });
}
