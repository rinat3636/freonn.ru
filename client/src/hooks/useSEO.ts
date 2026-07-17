import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "service";
  canonical?: string;
  /** JSON-LD structured data object(s) — pass array for multiple schemas */
  jsonLd?: object | object[];
  /** noindex pages (404, coming-soon, etc.) */
  noIndex?: boolean;
  /** Article published date ISO string */
  publishedTime?: string;
  /** Article modified date ISO string */
  modifiedTime?: string;
  /** Breadcrumb items for BreadcrumbList schema */
  breadcrumbs?: Array<{ name: string; url: string }>;
  /** Article author name */
  author?: string;
  /** Article section / category */
  section?: string;
  /** Article tags */
  tags?: string[];
  /**
   * Не подставлять geo.* / yandex-region (центр Москвы) — для городских лендингов,
   * чтобы мета не противоречила контенту страницы.
   */
  omitRegionMeta?: boolean;
}

export const SITE_NAME = "Freonn — Инженерная компания";
export const SITE_URL = "https://freonn.ru";
export const DEFAULT_OG_IMAGE = "https://freonn.ru/og-cover.jpg";
export const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663524928365/d5oRPUYjSRzESZKpUgG9pW/freonn-logo_62401a1b.png";

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector(
    `meta[${attr}="${name}"]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(name: string, property = false) {
  const attr = property ? "property" : "name";
  const el = document.querySelector(`meta[${attr}="${name}"]`);
  if (el) el.remove();
}

function removeAllMeta(name: string, property = false) {
  const attr = property ? "property" : "name";
  document.querySelectorAll(`meta[${attr}="${name}"]`).forEach(el => el.remove());
}

function setLink(rel: string, href: string, id?: string, extra?: Record<string, string>) {
  const selector = id ? `link[data-seo-id="${id}"]` : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (id) el.setAttribute("data-seo-id", id);
    if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(schemas: object[], id: string) {
  let el = document.querySelector(
    `script[data-seo-id="${id}"]`
  ) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-seo-id", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(
    schemas.length === 1 ? schemas[0] : schemas
  );
}

function removeJsonLd(id: string) {
  const el = document.querySelector(`script[data-seo-id="${id}"]`);
  if (el) el.remove();
}

export function useSEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  canonical,
  jsonLd,
  noIndex = false,
  publishedTime,
  modifiedTime,
  breadcrumbs,
  author,
  section,
  tags,
  omitRegionMeta = false,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title.toLowerCase().includes(SITE_NAME.toLowerCase()) || title.toLowerCase().includes("freonn")
      ? title
      : `${title} | ${SITE_NAME}`;
    const resolvedCanonical = canonical
      ? `${SITE_URL}${canonical}`
      : window.location.href.split("?")[0].split("#")[0];
    const resolvedImage = ogImage || DEFAULT_OG_IMAGE;
    const resolvedOgTitle = ogTitle || title;
    const resolvedOgDesc = ogDescription || description;
    const resolvedAuthor = author || "Freonn — Инженерная компания";

    // ── Title ──────────────────────────────────────────────────────────────
    document.title = fullTitle;

    // ── Basic meta ─────────────────────────────────────────────────────────
    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta(
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    );
    setMeta("googlebot", noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMeta("yandexbot", noIndex ? "noindex, nofollow" : "index, follow");
    setMeta("author", resolvedAuthor);
    setMeta("copyright", "© 2011–2026 ООО «ЭКС» (Freonn)");

    // ── Geo / Yandex region (только если не городской лендинг) ────────────
    if (omitRegionMeta) {
      ["geo.region", "geo.placename", "geo.position", "ICBM", "yandex-region"].forEach((n) =>
        removeMeta(n)
      );
    } else {
      setMeta("geo.region", "RU-MOW");
      setMeta("geo.placename", "Москва");
      setMeta("geo.position", "55.7558;37.6173");
      setMeta("ICBM", "55.7558, 37.6173");
      setMeta("yandex-region", "213");
    }

    // ── Open Graph ─────────────────────────────────────────────────────────
    setMeta("og:type", ogType === "article" ? "article" : "website", true);
    setMeta("og:locale", "ru_RU", true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:title", resolvedOgTitle, true);
    setMeta("og:description", resolvedOgDesc, true);
    setMeta("og:image", resolvedImage, true);
    setMeta("og:image:secure_url", resolvedImage, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "640", true);
    setMeta("og:image:type", resolvedImage.endsWith(".png") ? "image/png" : "image/jpeg", true);
    setMeta("og:image:alt", resolvedOgTitle, true);
    setMeta("og:url", resolvedCanonical, true);
    setMeta("og:updated_time", modifiedTime || publishedTime || "2026-04-25T00:00:00+03:00", true);

    // ── Article-specific OG tags ───────────────────────────────────────────
    if (ogType === "article") {
      if (publishedTime) {
        setMeta("article:published_time", publishedTime, true);
        setMeta("article:modified_time", modifiedTime || publishedTime, true);
      }
      setMeta("article:author", resolvedAuthor, true);
      setMeta("article:section", section || "Инженерные системы", true);
      setMeta("article:publisher", SITE_URL, true);
      // Remove old tags, re-add fresh
      removeAllMeta("article:tag", true);
      if (tags && tags.length > 0) {
        tags.forEach(tag => {
          const el = document.createElement("meta");
          el.setAttribute("property", "article:tag");
          el.setAttribute("content", tag);
          document.head.appendChild(el);
        });
      }
    } else {
      removeMeta("article:published_time", true);
      removeMeta("article:modified_time", true);
      removeMeta("article:author", true);
      removeMeta("article:section", true);
      removeMeta("article:publisher", true);
      removeAllMeta("article:tag", true);
    }

    // ── Twitter Card ───────────────────────────────────────────────────────
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", "@freonn");
    setMeta("twitter:creator", "@freonn");
    setMeta("twitter:title", resolvedOgTitle);
    setMeta("twitter:description", resolvedOgDesc);
    setMeta("twitter:image", resolvedImage);
    setMeta("twitter:image:alt", resolvedOgTitle);

    // ── Canonical + hreflang ───────────────────────────────────────────────
    setLink("canonical", resolvedCanonical, "canonical");
    setLink("alternate", resolvedCanonical, "hreflang-ru", { hreflang: "ru" });
    setLink("alternate", resolvedCanonical, "hreflang-default", { hreflang: "x-default" });

    // ── JSON-LD (без дубля Organization — см. index.html @graph) ───────────
    const schemas: object[] = [];

    // BreadcrumbList if breadcrumbs provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: SITE_URL,
          },
          ...breadcrumbs.map((b, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: b.name,
            item: b.url.startsWith("http") ? b.url : `${SITE_URL}${b.url}`,
          })),
        ],
      });
    }

    // Custom JSON-LD from caller
    if (jsonLd) {
      const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.push(...arr);
    }

    if (schemas.length > 0) {
      setJsonLd(schemas, "page-schema");
    } else {
      removeJsonLd("page-schema");
    }

    return () => {
      removeJsonLd("page-schema");
    };
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    canonical,
    noIndex,
    publishedTime,
    modifiedTime,
    author,
    section,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(breadcrumbs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(jsonLd),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(tags),
    omitRegionMeta,
  ]);
}
