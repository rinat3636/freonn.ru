# SEO: аудит → упаковка → максимальное улучшение (freonn.ru)

Трёхэтапный план SEO-архитектуры freonn.ru. Источник: Cursor plan `seo_audit_and_upgrade`.

**Статус:** все этапы реализованы в коде (коммиты `fcf6ab9`, `5198340`, `12274eb`).

---

## Этап 1 — Аудит (зафиксирован в коде)

| Задача | Файлы | Статус |
|--------|-------|--------|
| URL inventory, tier rules, фазы | `shared/seoConfig.ts` | ✅ |
| Единый `OBJECT_SLUGS` | `shared/objectSlugs.ts` | ✅ |
| Комментарии маршрутов | `App.tsx`, `seoMatrix.ts` | ✅ |

**Инвентарь:** ~2205 URL в sitemap-index при `SEO_RELEASE_PHASE = 4`.

---

## Этап 2 — Упаковка

| Задача | Статус |
|--------|--------|
| 301: `/garantiya`→`/garantii`, `/licenzii-i-sertifikaty`→`/sertifikaty`, `/partneram`→`/partnery` | ✅ `App.tsx` + `CANONICAL_REDIRECTS` |
| Удалён dead code `useAICityContent` | ✅ |
| JSON-LD dedup (city + service×geo — только SSR) | ✅ `seoInjection.ts` |
| Sitemap hygiene, `includeInSitemap()`, phase 4 | ✅ `scripts/generate-sitemap.ts` |
| Footer без noindex coming-soon | ✅ |
| `pnpm run seo:phase 4` | ✅ |

---

## Этап 3 — Контент и перелинковка

| Задача | Статус |
|--------|--------|
| Tier-2: 44 города district + LSI | ✅ `shared/tier2CityContent.ts` |
| ServiceGeoPage: `getCityContent()` для non-MO | ✅ |
| Matrix enrichment (3D, alias, price) | ✅ `ServiceObjectCityPage`, `ServiceAliasCityPage`, `PricingCityPage` |
| Tier-2 nearby tier-1 links | ✅ `CityPage`, `ServiceGeoPage` |
| SSR parity: blog, services, alias canonical | ✅ `blogSeo.ts`, `serviceFaq.ts`, `vite.ts` |
| Coming-soon: noindex + robots + контент | ✅ |

---

## Этап 4 — Деплой и мониторинг (ручные шаги)

1. **Деплой** — Railway из `main` (автоматически при push).
2. **Яндекс.Вебмастер** — переотправить `sitemap-index.xml` + `sitemap-moscow-core.xml`.
3. **KPI 4–8 недель:** impressions `/moskva`, `/ventilyaciya-moskva`, top tier-1; indexed/submitted ratio; tier-2 <30% geo-индекса.

```bash
pnpm check && pnpm test
pnpm run seo:sitemap    # или pnpm run seo:phase 4
```

---

## Что сознательно не делаем

- Groq для geo-контента
- 3D для tier-2 городов
- Hreflang (монолингвальный RU)
- Полный rewrite 552 service×city страниц
