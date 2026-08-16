#!/usr/bin/env python3
"""
generate-1000-blog.py
─────────────────────────────────────────────────────────────────────────────
Generates 1 000 SEO blog articles for /blog/:slug on freonn.ru.

Outputs:
  - shared/blogSeo.ts            (metadata for SSR + useSEO)
  - client/public/blog/articles-index.json
  - client/public/blog/articles/<slug>.json
  - client/public/blog/covers/<slug>.svg
  - client/public/sitemap-blog.xml
"""

import json
import os
import random
import re
import subprocess
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def read_text(rel_path: str) -> str:
    return (ROOT / rel_path).read_text(encoding="utf-8")

def read_git_original(rel_path: str) -> str | None:
    try:
        return subprocess.check_output(
            ["git", "show", f"HEAD:{rel_path}"],
            cwd=ROOT,
            stderr=subprocess.DEVNULL,
            text=True,
        )
    except Exception:
        return None

def write_text(rel_path: str, text: str) -> None:
    p = ROOT / rel_path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")

def write_json(rel_path: str, data) -> None:
    p = ROOT / rel_path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

# ═════════════════════════════════════════════════════════════════════════════
# Parsers
# ═════════════════════════════════════════════════════════════════════════════

def parse_blog_seo() -> dict:
    # Read the committed (legacy) version so re-runs are idempotent and don't
    # treat previously generated entries as legacy collisions.
    text = read_git_original("shared/blogSeo.ts") or read_text("shared/blogSeo.ts")
    m = re.search(r"BLOG_ARTICLE_SEO:.*?=\s*\{(.*?)\};\s*$", text, re.S | re.M)
    if not m:
        raise RuntimeError("Could not find BLOG_ARTICLE_SEO object")
    body = m.group(1)
    pattern = re.compile(
        r'"([^"]+)":\s*\{\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*published:\s*"([^"]+)",\s*description:\s*"([^"]+)"\s*,?\s*\}',
        re.S,
    )
    out = {}
    for slug, title, category, published, description in pattern.findall(body):
        out[slug] = {
            "title": title,
            "category": category,
            "published": published,
            "description": description,
        }
    return out

def _extract_from_articles_array(text: str, cdn_url: str) -> list | None:
    m = re.search(r"const articles = \[(.*?)\];", text, re.S)
    if not m:
        return None
    body = m.group(1)
    pattern = re.compile(
        r'\{\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*readTime:\s*"([^"]+)",\s*img:\s*`([^`]+)`,\s*href:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)"\s*,?\s*\}',
        re.S,
    )
    cards = []
    for title, category, read_time, img_tpl, href, excerpt in pattern.findall(body):
        slug = href.split("/blog/")[-1]
        img = img_tpl.replace("${CDN}", cdn_url)
        cards.append({
            "slug": slug,
            "title": title,
            "category": category,
            "readTime": read_time,
            "img": img,
            "href": href,
            "excerpt": excerpt,
        })
    return cards


def _extract_from_legacy_articles(text: str, cdn_url: str) -> list | None:
    m = re.search(r'const legacyArticles: Record<string, \{[^}]*\}> = \{(.*?)\};\s*\nexport default', text, re.S)
    if not m:
        return None
    body = m.group(1)
    pattern = re.compile(
        r'"([^"]+)":\s*\{\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*readTime:\s*"([^"]+)",\s*img:\s*`([^`]+)`,\s*content:\s*`([^`]*)`\s*,?\s*\},?',
        re.S,
    )
    cards = []
    for slug, title, category, read_time, img_tpl, content in pattern.findall(body):
        # Build an excerpt from the first paragraph of content
        plain = re.sub(r"\s+", " ", content.replace("##", "").replace("`", "").strip())
        excerpt = (plain[:160] + "…") if len(plain) > 160 else plain
        img = img_tpl.replace("${CDN}", cdn_url)
        cards.append({
            "slug": slug,
            "title": title,
            "category": category,
            "readTime": read_time,
            "img": img,
            "href": f"/blog/{slug}",
            "excerpt": excerpt,
        })
    return cards


def parse_blog_index_cards(cdn_url: str) -> list:
    # Try the old articles array first; after the Blog.tsx refactor use legacyArticles.
    text = ""
    try:
        text = read_text("client/src/pages/Blog.tsx")
    except FileNotFoundError:
        pass

    cards = _extract_from_articles_array(text, cdn_url)
    if cards:
        return cards

    try:
        blog_article_text = read_text("client/src/pages/BlogArticle.tsx")
    except FileNotFoundError:
        blog_article_text = ""

    cards = _extract_from_legacy_articles(blog_article_text, cdn_url)
    if cards:
        return cards

    raise RuntimeError("Could not find Blog.tsx articles array or BlogArticle.tsx legacyArticles")

def parse_cdn_url() -> str:
    for src in ("client/src/pages/Blog.tsx", "client/src/pages/BlogArticle.tsx"):
        text = read_text(src)
        m = re.search(r'const CDN = "([^"]+)";', text)
        if m:
            return m.group(1)
    raise RuntimeError("CDN not found")

def parse_services() -> dict:
    text = read_text("shared/serviceObjects.ts")
    m = re.search(r"SERVICES:.*?=\s*\{(.*?)\};", text, re.S)
    if not m:
        raise RuntimeError("SERVICES not found")
    body = m.group(1)
    pattern = re.compile(r'(\w+):\s*\{\s*name:\s*"([^"]+)",\s*nameGen:\s*"([^"]+)",\s*slug:\s*"([^"]+)"\s*,?\s*\}')
    out = {}
    for key, name, name_gen, slug in pattern.findall(body):
        out[key] = {"name": name, "nameGen": name_gen, "slug": slug}
    return out

def parse_object_seo() -> dict:
    text = read_text("shared/seoMatrix.ts")
    m = re.search(r"OBJECT_SEO:.*?=\s*\{(.*?)\};", text, re.S)
    if not m:
        raise RuntimeError("OBJECT_SEO not found")
    body = m.group(1)
    pattern = re.compile(r'(\w+):\s*\{\s*name:\s*"([^"]+)",\s*namePrep:\s*"([^"]+)",\s*nameGen:\s*"([^"]+)"\s*,?\s*\}')
    out = {}
    for key, name, name_prep, name_gen in pattern.findall(body):
        out[key] = {"name": name, "namePrep": name_prep, "nameGen": name_gen}
    return out

def parse_object_types() -> dict:
    text = read_text("shared/serviceObjects.ts")
    m = re.search(r"OBJECT_TYPES:.*?=\s*\{(.*?)\};", text, re.S | re.M)
    if not m:
        raise RuntimeError("OBJECT_TYPES not found")
    body = m.group(1)
    pattern = re.compile(
        r'(\w+):\s*\{\s*name:\s*"([^"]+)",\s*namePrep:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*features:\s*\[([^\]]*)\]\s*,?\s*\}',
        re.S,
    )
    out = {}
    for key, name, name_prep, slug, description, features_raw in pattern.findall(body):
        features = re.findall(r'"([^"]*)"', features_raw)
        out[key] = {
            "name": name,
            "namePrep": name_prep,
            "slug": slug,
            "description": description,
            "features": features,
        }
    return out

def parse_matrix_cities() -> list:
    text = read_text("shared/geoTiers.ts")
    slugs = []
    m0 = re.search(r'TIER0_SLUGS = \[(.*?)\]', text, re.S)
    m1 = re.search(r'TIER1_CITY_SLUGS = \[(.*?)\]', text, re.S)
    if m0:
        slugs += re.findall(r'"([^"]+)"', m0.group(1))
    if m1:
        slugs += re.findall(r'"([^"]+)"', m1.group(1))
    return slugs

def parse_cities() -> dict:
    text = read_text("shared/geoRoutes.ts")
    pattern = re.compile(r'\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*phrase:\s*"([^"]+)"\s*\}')
    out = {}
    for slug, name, phrase in pattern.findall(text):
        out[slug] = {"slug": slug, "name": name, "phrase": phrase}
    return out

# ═════════════════════════════════════════════════════════════════════════════
# Helpers
# ═════════════════════════════════════════════════════════════════════════════

def slugify(text: str) -> str:
    tr = {
        "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo",
        "ж": "zh", "з": "z", "и": "i", "й": "j", "к": "k", "л": "l", "м": "m",
        "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
        "ф": "f", "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch",
        "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
    }
    lowered = text.lower()
    out = []
    for ch in lowered:
        if ch in tr:
            out.append(tr[ch])
        elif re.match(r"[a-z0-9]", ch):
            out.append(ch)
        else:
            out.append("-")
    slug = "".join(out)
    slug = re.sub(r"-+", "-", slug).strip("-")
    slug = slug[:64].strip("-")
    return slug or "article"

def escape_ts_string(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

def estimate_read_time(content: str) -> str:
    words = len(re.split(r"\s+", content.strip()))
    minutes = max(1, (words + 199) // 200)
    if 11 <= minutes % 100 <= 14:
        return f"{minutes} минут"
    if minutes % 10 == 1:
        return f"{minutes} минута"
    if 2 <= minutes % 10 <= 4:
        return f"{minutes} минуты"
    return f"{minutes} минут"

def wrap_text(text: str, max_chars: int) -> list:
    words = text.split()
    lines = []
    current = ""
    for word in words:
        if len(current) + len(word) + 1 <= max_chars:
            current = (current + " " + word).strip()
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines

def pick(seed: int, items: list):
    return items[seed % len(items)]

# ═════════════════════════════════════════════════════════════════════════════
# Content generation
# ═════════════════════════════════════════════════════════════════════════════

def generate_content(service, obj, city, seed: int) -> str:
    s_name = service["name"]
    s_name_acc = service_accusative(service)
    s_gen = service["nameGen"]
    o_name = obj["name"]
    o_prep = obj["namePrep"]
    o_gen = obj["nameGen"]
    c_name = city["name"]
    c_phrase = city["phrase"]
    o_features = obj.get("features", [])

    intros = [
        f"{s_name} {o_prep} {c_phrase} — важная часть инженерной инфраструктуры объекта. {obj['description']} Правильный подход к проектированию и монтажу позволяет обеспечить комфорт, безопасность и соответствие нормативным требованиям.",
        f"В статье разбираем, как организовать {s_name_acc} {o_prep} {c_phrase}: от расчёта до выбора оборудования и сдачи объекта. {obj['description']}",
        f"{o_name} {c_phrase} нуждается в надёжных инженерных системах. {s_name} {o_prep} решает задачи микроклимата, пожарной безопасности и энергоэффективности.",
        f"{obj['description']} Рассказываем, как проектируется и монтируется {s_name.lower()} {o_prep} {c_phrase} и на что обращать внимание при выборе подрядчика.",
    ]
    intro = pick(seed, intros)

    s1_titles = [
        f"## Зачем {o_name} нуждается в системе {s_gen}",
        f"## Почему в системе {s_gen} {o_prep} {c_phrase} важна надёжность",
        f"## Задачи системы {s_gen} на объекте",
    ]
    s1_title = pick(seed + 1, s1_titles)
    s1_bodies = [
        f"Без качественной системы {s_gen} объект не сможет работать в нормальном режиме. {o_name} требует поддержания стабильных параметров микроклимата, удаления загрязнённого воздуха и, при необходимости, охлаждения или обогрева помещений.",
        f"{s_name} {o_prep} {c_phrase} обеспечивает комфортные условия для людей и сохранность оборудования. Особенно важно учитывать специфику объекта: {', '.join(o_features[:3] if o_features else ['надёжность', 'эффективность', 'безопасность'])}.",
    ]
    s1_body = pick(seed + 2, s1_bodies)

    s2_title = "## Ключевые требования к объекту"
    if o_features:
        feature_bullets = "\n".join(f"- {f}" for f in o_features[:5])
    else:
        feature_bullets = "\n".join([
            "- Соответствие нормативным требованиям и техническим условиям",
            "- Энергоэффективность и управляемость системы",
            "- Надёжность и резервирование критичных элементов",
            "- Низкий уровень шума и вибрации",
            "- Удобство обслуживания и доступ к оборудованию",
        ])

    s3_title = "## Нормативные требования"
    norms = [
        "Соблюдение СП 60.13330.2020, СП 118.13330.2012 и СанПиН 2.2.4.548-96.",
        "Проектирование с учётом пожарной безопасности по СП 7.13130.2013 и требований МЧС.",
        "Соответствие СНиП 41-01-2003 и ГОСТ 12.1.005-88 по параметрам микроклимата.",
        "Учёт специфических отраслевых стандартов и технических условий заказчика.",
        "Оформление исполнительной документации и проведение пусконаладочных работ.",
    ]
    random.seed(seed)
    random.shuffle(norms)
    norm_bullets = "\n".join(f"- {n}" for n in norms[:4])

    s4_title = "## Этапы проектирования и монтажа"
    stages = [
        f"Предпроектное обследование {o_gen} {c_phrase} и сбор исходных данных.",
        f"Разработка технического задания и согласование схемы системы {s_gen}.",
        f"Подбор оборудования с учётом нагрузок, режимов работы и энергоэффективности.",
        f"Монтаж воздуховодов, оборудования, запорной арматуры и автоматики.",
        f"Пусконаладка, испытания и сдача системы {s_gen} в эксплуатацию.",
    ]
    stage_bullets = "\n".join(f"- {s}" for s in stages)

    s5_title = "## Типичные ошибки"
    mistakes = [
        "Недооценка расчётной нагрузки и выбор оборудования «с запасом» без расчёта.",
        "Игнорирование шумовых характеристик и виброизоляции.",
        "Отсутствие резервирования критичных элементов системы.",
        "Неправильная организация воздухораспределения и отсутствие балансировки.",
        "Самовольный монтаж без согласования проектной документации.",
    ]
    random.seed(seed + 7)
    random.shuffle(mistakes)
    mistake_bullets = "\n".join(f"- {m}" for m in mistakes[:4])

    conclusions = [
        f"Freonn проектирует и монтирует {s_name.lower()} {o_prep} {c_phrase} более 15 лет. Мы учитываем нормативы, специфику объекта и бюджет заказчика. Оставьте заявку — инженер подготовит коммерческое предложение и выедет на объект.",
        f"Если вам нужна {s_name.lower()} {o_prep} {c_phrase}, обратитесь в Freonn. Мы выполним расчёт, проектирование, монтаж и сервисное обслуживание под ключ.",
        f"Компания Freonn готова взять на себя {s_gen} {o_prep} {c_phrase}: от идеи до ввода в эксплуатацию. Получите бесплатную консультацию инженера.",
    ]
    conclusion = pick(seed + 3, conclusions)

    parts = [
        intro,
        "",
        s1_title,
        s1_body,
        "",
        s2_title,
        feature_bullets,
        "",
        s3_title,
        norm_bullets,
        "",
        s4_title,
        stage_bullets,
        "",
        s5_title,
        mistake_bullets,
        "",
        "## Почему выбирают Freonn",
        conclusion,
    ]
    return "\n".join(parts)

def service_accusative(service: dict) -> str:
    """Return an acceptable accusative form for inanimate service nouns."""
    if service["slug"] == "ventilyaciya" or service["name"].lower() == "вентиляция":
        return "вентиляцию"
    return service["name"].lower()

def make_title(service, obj, city, seed: int) -> str:
    s_name = service["name"]
    s_gen = service["nameGen"]
    o_prep = obj["namePrep"]
    o_gen = obj["nameGen"]
    c_phrase = city["phrase"]
    templates = [
        f"{s_name} {o_prep} {c_phrase}: цены, нормы и монтаж",
        f"Монтаж {s_gen} {o_prep} {c_phrase} — под ключ",
        f"{s_name} для {o_gen} {c_phrase}: проектирование и обслуживание",
        f"Проектирование {s_gen} {o_prep} {c_phrase}: требования и стоимость",
        f"{s_name} {o_prep} {c_phrase}: расчёт, выбор оборудования, монтаж",
        f"Обслуживание {s_gen} {o_prep} {c_phrase}: регламент и стоимость",
    ]
    return pick(seed, templates)

def make_excerpt(service, obj, city, title: str, seed: int) -> str:
    s_gen = service["nameGen"]
    s_name_acc = service_accusative(service)
    o_name = obj["name"]
    o_gen = obj["nameGen"]
    c_phrase = city["phrase"]
    bodies = [
        f"Руководство по выбору {s_gen} для {o_gen} {c_phrase} от инженеров Freonn.",
        f"Как спроектировать {s_name_acc} для {o_gen} {c_phrase}: нормативы, этапы и стоимость.",
        f"{o_name} {c_phrase}: особенности {s_gen}, оборудование и типичные ошибки.",
    ]
    return pick(seed % len(bodies), bodies)

# ═════════════════════════════════════════════════════════════════════════════
# SVG covers
# ═════════════════════════════════════════════════════════════════════════════

def category_colors(category: str) -> tuple:
    palette = {
        "Вентиляция": ("#2D3092", "#0F1340"),
        "Кондиционирование": ("#00A8E8", "#006D9C"),
        "Дымоудаление": ("#B91C1C", "#7F1313"),
        "Отопление": ("#FF6B35", "#C84C1E"),
        "Холодоснабжение": ("#00B894", "#008B6B"),
        "Водоснабжение": ("#0984E3", "#065A9E"),
        "Электроснабжение": ("#F39C12", "#D35400"),
        "Пескоструй": ("#636E72", "#2D3436"),
        "Автоматизация": ("#6C5CE7", "#4834D4"),
        "Обслуживание": ("#00CEC9", "#008B8B"),
    }
    return palette.get(category, ("#2D3092", "#0F1340"))

def svg_cover(slug: str, title: str, category: str) -> str:
    c1, c2 = category_colors(category)
    lines = wrap_text(title, 28)
    if len(lines) > 3:
        lines = lines[:3]
        lines[-1] = lines[-1][:32] + "…"
    tspans = "\n".join(
        f'<tspan x="80" dy="{76 if i == 0 else 76}">{line}</tspan>' for i, line in enumerate(lines)
    )
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 700" width="1600" height="700">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{c1}"/>
      <stop offset="100%" stop-color="{c2}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="700" fill="url(#g)"/>
  <circle cx="1350" cy="120" r="220" fill="rgba(255,255,255,0.08)"/>
  <circle cx="200" cy="650" r="180" fill="rgba(255,255,255,0.05)"/>
  <text x="80" y="80" font-family="Arial, sans-serif" font-size="22" fill="rgba(255,255,255,0.75)" font-weight="bold" letter-spacing="2">FREONN · {category.upper()}</text>
  <text x="80" y="220" font-family="Arial, sans-serif" font-size="64" fill="white" font-weight="bold" line-height="1.2">
    {tspans}
  </text>
  <rect x="80" y="540" width="120" height="6" fill="white" opacity="0.8"/>
  <text x="80" y="590" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.85)">freonn.ru/blog/{slug}</text>
</svg>'''

# ═════════════════════════════════════════════════════════════════════════════
# Main
# ═════════════════════════════════════════════════════════════════════════════

def main():
    print("Parsing existing files...")
    cdn_url = parse_cdn_url()
    legacy_seo = parse_blog_seo()
    legacy_cards = parse_blog_index_cards(cdn_url)
    services = parse_services()
    object_seo = parse_object_seo()
    object_types = parse_object_types()
    matrix_slugs = parse_matrix_cities()
    cities = parse_cities()

    # Clean previously generated article assets so stale files don't accumulate
    # if the script is run multiple times.
    generated_dir = ROOT / "client" / "public" / "assets" / "blog"
    if generated_dir.exists():
        import shutil
        for sub in ("articles", "covers"):
            p = generated_dir / sub
            if p.exists():
                shutil.rmtree(p)
        (generated_dir / "articles-index.json").unlink(missing_ok=True)

    # Combine object data
    objects = {}
    for slug, data in object_types.items():
        seo = object_seo.get(slug, {})
        objects[slug] = {
            **data,
            "namePrep": seo.get("namePrep", data.get("namePrep", slug)),
            "nameGen": seo.get("nameGen", data.get("name", slug)),
        }

    matrix_cities = [cities[s] for s in matrix_slugs if s in cities]

    print(f"Legacy SEO entries: {len(legacy_seo)}")
    print(f"Legacy cards: {len(legacy_cards)}")
    print(f"Services: {len(services)}, Objects: {len(objects)}, Matrix cities: {len(matrix_cities)}")

    if not services or not objects or not matrix_cities:
        raise RuntimeError("Failed to parse source data")

    # Build all service×object×city combos and take first 1000 deterministically
    combos = []
    for s_key, s in services.items():
        for o_key, o in objects.items():
            for city in matrix_cities:
                combos.append((s, o, city))
    combos.sort(key=lambda x: (x[0]["slug"], x[1]["slug"], x[2]["slug"]))
    combos = combos[:1000]

    print(f"Generated combos: {len(combos)}")

    # Schedule new articles between 2024-08-11 and 2026-08-16
    start = datetime(2024, 8, 11, 10, 0, 0, tzinfo=timezone(timedelta(hours=3)))
    end = datetime(2026, 8, 16, 10, 0, 0, tzinfo=timezone(timedelta(hours=3)))
    total_seconds = (end - start).total_seconds()

    new_seo = {}
    new_index = []

    for i, (service, obj, city) in enumerate(combos):
        seed = i
        category = service["name"]
        title = make_title(service, obj, city, seed)
        base_slug = slugify(title)
        slug = base_slug
        counter = 1
        while slug in legacy_seo or slug in new_seo:
            slug = f"{base_slug}-{counter}"
            counter += 1

        frac = i / max(1, len(combos) - 1)
        pub_dt = start + timedelta(seconds=int(total_seconds * frac))
        pub_dt = pub_dt.replace(hour=10 + (i % 3) * 2)
        published = pub_dt.strftime("%Y-%m-%dT%H:%M:%S%z")
        published = published[:-2] + ":" + published[-2:]

        excerpt = make_excerpt(service, obj, city, title, seed)
        content = generate_content(service, obj, city, seed)
        read_time = estimate_read_time(content)
        description = f"{title} — материалы блога Freonn ({category}). Монтаж инженерных систем {city['phrase']}."[:165]
        img = f"/assets/blog/covers/{slug}.svg"

        article_data = {
            "slug": slug,
            "title": title,
            "category": category,
            "readTime": read_time,
            "img": img,
            "content": content,
            "published": published,
            "modified": published,
        }
        write_json(f"client/public/assets/blog/articles/{slug}.json", article_data)
        write_text(f"client/public/assets/blog/covers/{slug}.svg", svg_cover(slug, title, category))

        new_seo[slug] = {
            "title": title,
            "category": category,
            "published": published,
            "description": description,
        }

        new_index.append({
            "slug": slug,
            "title": title,
            "category": category,
            "readTime": read_time,
            "img": img,
            "href": f"/blog/{slug}",
            "excerpt": excerpt,
            "published": published,
        })

    # Legacy index entries
    legacy_index = []
    for card in legacy_cards:
        slug = card["slug"]
        seo = legacy_seo.get(slug)
        if not seo:
            continue
        legacy_index.append({
            "slug": slug,
            "title": card["title"],
            "category": card["category"],
            "readTime": card["readTime"],
            "img": card["img"],
            "href": card["href"],
            "excerpt": card["excerpt"],
            "published": seo.get("published", "2024-02-15T10:00:00+03:00"),
        })

    all_index = legacy_index + new_index
    all_index.sort(key=lambda x: x["published"], reverse=True)

    write_json("client/public/assets/blog/articles-index.json", all_index)

    # Write shared/blogSeo.ts
    merged_seo = {**legacy_seo, **new_seo}
    lines = [
        '/** Blog SEO metadata — shared between SSR and client */',
        'export interface BlogArticleSeo {',
        '  title: string;',
        '  category: string;',
        '  published: string;',
        '  description: string;',
        '}',
        '',
        'export const BLOG_ARTICLE_SEO: Record<string, BlogArticleSeo> = {',
    ]
    for slug in sorted(merged_seo.keys()):
        entry = merged_seo[slug]
        lines.append(f'  "{slug}": {{')
        lines.append(f'    title: "{escape_ts_string(entry["title"])}",')
        lines.append(f'    category: "{escape_ts_string(entry["category"])}",')
        lines.append(f'    published: "{entry["published"]}",')
        lines.append(f'    description: "{escape_ts_string(entry["description"])}",')
        lines.append('  },')
    lines.extend([
        '};',
        '',
        'export function getBlogArticleSeo(slug: string): BlogArticleSeo | null {',
        '  return BLOG_ARTICLE_SEO[slug] ?? null;',
        '}',
        '',
        'export function getBlogArticleSeoMeta(slug: string) {',
        '  const article = getBlogArticleSeo(slug);',
        '  if (!article) return null;',
        '  return {',
        '    title: `${article.title} — Freonn`,',
        '    description: article.description,',
        '    keywords: `${article.category.toLowerCase()}, инженерные системы, Freonn, монтаж вентиляции`,',
        '    ogType: "article" as const,',
        '    article: {',
        '      publishedTime: article.published,',
        '      modifiedTime: article.published,',
        '      section: article.category,',
        '      author: "Freonn",',
        '    },',
        '  };',
        '}',
        '',
        'export function getBlogSeoMeta(pathname: string) {',
        '  const slug = pathname.replace(/^\\/blog\\/?/, "");',
        '  if (!slug) return null;',
        '  return getBlogArticleSeoMeta(slug);',
        '}',
        '',
    ])
    write_text("shared/blogSeo.ts", "\n".join(lines))

    # Sitemap
    url_lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    url_lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for entry in sorted(all_index, key=lambda x: x["slug"]):
        lastmod = entry["published"][:10]
        url_lines.append('  <url>')
        url_lines.append(f'    <loc>https://freonn.ru{entry["href"]}</loc>')
        url_lines.append(f'    <lastmod>{lastmod}</lastmod>')
        url_lines.append('    <changefreq>monthly</changefreq>')
        url_lines.append('    <priority>0.65</priority>')
        url_lines.append('  </url>')
    url_lines.append('</urlset>')
    write_text("client/public/sitemap-blog.xml", "\n".join(url_lines) + "\n")

    print(f"Done: {len(new_index)} new articles generated.")
    print(f"Total blog entries: {len(all_index)}")

if __name__ == "__main__":
    main()
