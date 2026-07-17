import { CASE_STUDY_BY_SLUG } from "../shared/caseStudies";
import { CONTENT_PAGE_BY_SLUG } from "../shared/contentPages";
import { GLOSSARY_BY_SLUG } from "../shared/glossaryTerms";

export interface PageSeoMeta {
  title: string;
  description: string;
  keywords?: string;
  robots?: string;
  ogType?: "website" | "article" | "service";
  article?: {
    publishedTime: string;
    modifiedTime: string;
    section: string;
    author: string;
  };
}

const STATIC_PAGE_SEO: Record<string, PageSeoMeta> = {
  "/o-kompanii": {
    title: "О компании Freonn — инженерная компания Москва",
    description:
      "Freonn — инженерная компания с 15-летним опытом. Монтаж вентиляции, кондиционирования, дымоудаления и отопления в Москве и МО. Более 1280 выполненных объектов.",
    keywords:
      "инженерная компания Москва, монтаж вентиляции, о компании Freonn, история компании",
  },
  "/blog": {
    title: "Блог — статьи об инженерных системах",
    description:
      "Полезные статьи о вентиляции, кондиционировании, дымоудалении и отоплении. Советы по выбору оборудования, нормы проектирования, разбор реальных объектов.",
    keywords:
      "блог вентиляция, статьи кондиционирование, инженерные системы статьи, нормы вентиляции, проектирование вентиляции",
  },
  "/faq": {
    title: "Вопросы и ответы — монтаж инженерных систем",
    description:
      "Ответы на частые вопросы о монтаже вентиляции, кондиционирования и дымоудаления. Сроки, гарантии, стоимость работ, необходимые документы.",
    keywords:
      "вопросы вентиляция, FAQ кондиционирование, стоимость монтажа вентиляции, гарантия на вентиляцию",
  },
  "/obekty": {
    title: "Объекты — портфолио выполненных работ",
    description:
      "Более 1280 выполненных объектов: промышленные предприятия, торговые центры, офисы, премиум недвижимость. Монтаж инженерных систем в Москве и МО.",
    keywords:
      "портфолио инженерные системы, выполненные объекты вентиляция, монтаж вентиляции примеры работ",
  },
  "/ceny": {
    title: "Цены на монтаж инженерных систем — прайс-лист",
    description:
      "Актуальные цены на монтаж вентиляции, кондиционирования, дымоудаления и отопления в Москве. Прозрачное ценообразование, смета бесплатно.",
    keywords:
      "цены монтаж вентиляции, стоимость кондиционирования, прайс дымоудаление, расценки инженерные системы",
  },
  "/uslugi": {
    title: "Услуги — монтаж инженерных систем в Москве",
    description:
      "Полный спектр инженерных услуг: вентиляция, кондиционирование, дымоудаление, отопление, холодоснабжение, водоснабжение, электроснабжение. Проектирование и монтаж под ключ.",
    keywords:
      "услуги монтаж вентиляции, кондиционирование офиса, дымоудаление монтаж, инженерные системы под ключ",
  },
  "/akcii": {
    title: "Акции и скидки — монтаж инженерных систем",
    description:
      "Актуальные акции и специальные предложения от Freonn: скидки на монтаж вентиляции, бесплатный выезд инженера, рассрочка на оборудование.",
    keywords:
      "акции монтаж вентиляции, скидки кондиционирование, спецпредложения инженерные системы",
  },
  "/novosti": {
    title: "Новости компании Freonn",
    description:
      "Последние новости инженерной компании Freonn: новые объекты, сертификаты, акции, обновления оборудования и технологий монтажа.",
    keywords: "новости Freonn, инженерная компания новости, вентиляция новости",
  },
  "/vakansii": {
    title: "Вакансии — работа в инженерной компании Freonn",
    description:
      "Открытые вакансии в Freonn: монтажники вентиляции, инженеры-проектировщики, менеджеры. Официальное трудоустройство, достойная зарплата, обучение.",
    keywords:
      "вакансии монтажник вентиляции, работа инженер Москва, вакансии инженерная компания",
  },
  "/sertifikaty": {
    title: "Документы и лицензии — Freonn",
    description:
      "Лицензии МЧС, допуск СРО, сертификаты ISO и производителей оборудования. Freonn работает в полном соответствии с законодательством РФ.",
    keywords:
      "лицензия МЧС монтаж, допуск СРО вентиляция, сертификаты инженерная компания",
  },
  "/dokumenty": {
    title: "Документы и лицензии — Freonn",
    description:
      "Лицензии МЧС, допуск СРО, сертификаты ISO и производителей оборудования. Freonn работает в полном соответствии с законодательством РФ.",
    keywords:
      "лицензия МЧС монтаж, допуск СРО вентиляция, сертификаты инженерная компания",
  },
  "/partnery": {
    title: "Партнёры — Freonn инженерная компания",
    description:
      "Официальные партнёры Freonn: производители оборудования, поставщики материалов, проектные организации. Сотрудничество и дилерские программы.",
    keywords:
      "партнёры инженерная компания, дилер вентиляция, поставщик кондиционеры Москва",
  },
  "/rekvizity": {
    title: "Реквизиты компании Freonn",
    description:
      "Официальные реквизиты ООО Freonn: ИНН, КПП, ОГРН, банковские реквизиты для заключения договора на монтаж инженерных систем.",
    keywords:
      "реквизиты Freonn, ИНН инженерная компания, договор монтаж вентиляции",
  },
  "/garantii": {
    title: "Гарантии на монтаж инженерных систем — Freonn",
    description:
      "Freonn предоставляет гарантию 1 год на монтажные работы и до 5 лет на оборудование производителя. Официальный договор, гарантийное обслуживание, техническая поддержка.",
    keywords:
      "гарантия монтаж вентиляции, гарантийное обслуживание кондиционирование, гарантия инженерные системы",
  },
  "/karta-sajta": {
    title: "Карта сайта — Freonn",
    description:
      "Основные разделы сайта freonn.ru: услуги, цены, блог, контакты, города МО. Полный перечень URL в sitemap-index.xml.",
    keywords: "карта сайта Freonn, разделы сайта, навигация",
  },
  "/politika-konfidencialnosti": {
    title: "Политика конфиденциальности — Freonn",
    description:
      "Как ООО «ЭКС» (Freonn) обрабатывает персональные данные посетителей сайта freonn.ru: цели, сроки, cookies и аналитика.",
    keywords:
      "политика конфиденциальности Freonn, персональные данные, обработка cookies",
  },
  "/slovar": {
    title: "Словарь ОВиК — термины инженерных систем — Freonn",
    description:
      "Словарь терминов по вентиляции, кондиционированию, дымоудалению и другим инженерным системам.",
    keywords: "словарь ОВиК, термины вентиляции, инженерные системы глоссарий",
  },
  "/kalkulyator-inzhenernyh-sistem": {
    title: "Калькулятор стоимости монтажа инженерных систем — Freonn",
    description:
      "Ориентировочный расчёт стоимости монтажа вентиляции, кондиционирования и других систем. Точная смета — после обследования.",
    keywords:
      "калькулятор стоимости монтажа, расчёт вентиляции, стоимость инженерных систем",
  },
  "/stati": {
    title: "Полезные статьи — гайды и сравнения по инженерным системам — Freonn",
    description:
      "Экспертные статьи, сравнения и гайды по вентиляции, кондиционированию, дымоудалению и отоплению. Практические рекомендации инженеров Freonn.",
    keywords:
      "статьи вентиляция, гид кондиционирование, сравнение систем дымоудаления, инженерные системы",
  },
};

const OBJECT_CATEGORY_SEO: Record<string, PageSeoMeta> = {
  "/promyshlennye-obekty": {
    title: "Инженерные системы для промышленных объектов — Freonn",
    description:
      "Проектирование и монтаж инженерных систем для промышленных предприятий: вентиляция, кондиционирование, дымоудаление, отопление. Опыт 15+ лет.",
    keywords:
      "инженерные системы промышленные объекты, вентиляция завод, монтаж производство",
  },
  "/kommercheskie-obekty": {
    title: "Инженерные системы для коммерческих объектов — Freonn",
    description:
      "Монтаж вентиляции и кондиционирования в торговых центрах, офисах, ресторанах. Под ключ, гарантия 1 год.",
    keywords:
      "инженерные системы коммерческие объекты, вентиляция торговый центр, монтаж офис",
  },
  "/premium-obekty": {
    title: "Инженерные системы для премиум-объектов — Freonn",
    description:
      "Инженерные системы премиум-класса для элитной недвижимости. Индивидуальный подход, скрытый монтаж, лучшее оборудование.",
    keywords:
      "инженерные системы премиум, вентиляция элитная недвижимость, монтаж премиум объект",
  },
};

const PRICING_SERVICE_META: Record<string, PageSeoMeta> = {
  ventilyaciya: {
    title: "Цены на монтаж вентиляции — Freonn",
    description:
      "Стоимость монтажа систем вентиляции зависит от типа объекта, площади, сложности системы и применяемого оборудования. Цены указаны ориентировочно — точный расчёт выполняется после обследования объекта.",
    keywords: "цены монтаж вентиляции, стоимость вентиляции, прайс вентиляция",
  },
  kondicionirovanie: {
    title: "Цены на монтаж кондиционирования — Freonn",
    description:
      "Стоимость монтажа кондиционирования зависит от типа системы, мощности оборудования и сложности монтажа. Цены указаны ориентировочно.",
    keywords:
      "цены монтаж кондиционирования, стоимость кондиционеров, прайс кондиционирование",
  },
  dymoudalenie: {
    title: "Цены на монтаж дымоудаления — Freonn",
    description:
      "Монтаж систем дымоудаления выполняется в соответствии с СП 7.13130 и требованиями МЧС. Стоимость зависит от площади объекта, типа системы и оборудования.",
    keywords:
      "цены дымоудаление, стоимость противодымной вентиляции, прайс дымоудаление",
  },
  peskostruj: {
    title: "Цены на пескоструйную обработку — Freonn",
    description:
      "Пескоструйная обработка металлоконструкций для подготовки поверхности под окраску или антикоррозионную защиту. Работаем с объектами любого размера.",
    keywords:
      "цены пескоструйная обработка, стоимость пескоструя, прайс металлоконструкции",
  },
  kompleks: {
    title: "Цены на монтаж инженерных систем — Freonn",
    description:
      "Комплексный монтаж всех инженерных систем под ключ: вентиляция, кондиционирование, отопление, водоснабжение, дымоудаление, электроснабжение. При комплексном заказе действует скидка до 15%.",
    keywords:
      "цены монтаж инженерных систем, стоимость комплексный монтаж, прайс инженерные системы",
  },
};

const PRICING_PATH_ALIASES: Record<string, string> = {
  "/ceny-na-montazh-ventilyacii": "ventilyaciya",
  "/ceny-na-montazh-kondicionirovaniya": "kondicionirovanie",
  "/ceny-na-montazh-dymoudaleniya": "dymoudalenie",
  "/ceny-na-montazh-inzhenernyh-sistem": "kompleks",
  "/ceny-na-peskostruj": "peskostruj",
};

export function getStaticSeoMeta(pathname: string): PageSeoMeta | null {
  const clean = pathname.replace(/\/+$/, "") || "/";

  if (STATIC_PAGE_SEO[clean]) return STATIC_PAGE_SEO[clean];
  if (OBJECT_CATEGORY_SEO[clean]) return OBJECT_CATEGORY_SEO[clean];

  const pricingAlias = PRICING_PATH_ALIASES[clean];
  if (pricingAlias) return PRICING_SERVICE_META[pricingAlias];

  if (clean.startsWith("/ceny/")) {
    const slug = clean.slice("/ceny/".length);
    const meta = PRICING_SERVICE_META[slug];
    if (meta) return meta;
  }

  if (clean.startsWith("/slovar/")) {
    const slug = clean.slice("/slovar/".length);
    const term = GLOSSARY_BY_SLUG[slug];
    if (term) {
      return {
        title: `${term.term} — словарь ОВиК — Freonn`,
        description: term.definition,
        keywords: `${term.term.toLowerCase()}, словарь ОВиК, инженерные системы`,
      };
    }
  }

  if (clean.startsWith("/kejs/")) {
    const slug = clean.slice("/kejs/".length);
    const study = CASE_STUDY_BY_SLUG[slug];
    if (study) {
      return {
        title: `${study.title} — кейс Freonn`,
        description: study.summary,
        keywords: `кейс ${study.city}, монтаж ${study.services.join(", ")}, Freonn`,
      };
    }
  }

  if (clean.startsWith("/stati/")) {
    const slug = clean.slice("/stati/".length);
    const page = CONTENT_PAGE_BY_SLUG[slug];
    if (page) {
      return {
        title: page.title,
        description: page.description,
        keywords: page.keywords,
        ogType: "article",
        article: {
          publishedTime: page.published,
          modifiedTime: page.modified,
          section: page.category,
          author: page.author,
        },
      };
    }
  }

  return null;
}

export function getStaticPageJsonLd(pathname: string): object[] | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const url = `https://freonn.ru${clean}`;

  if (STATIC_PAGE_SEO[clean]) {
    const page = STATIC_PAGE_SEO[clean];
    return [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: page.title,
        description: page.description,
        url,
        isPartOf: { "@id": "https://freonn.ru/#website" },
      },
    ];
  }

  if (OBJECT_CATEGORY_SEO[clean]) {
    const page = OBJECT_CATEGORY_SEO[clean];
    return [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: page.title,
        description: page.description,
        url,
        isPartOf: { "@id": "https://freonn.ru/#website" },
      },
    ];
  }

  const pricingAlias = PRICING_PATH_ALIASES[clean];
  if (pricingAlias) {
    const page = PRICING_SERVICE_META[pricingAlias];
    return [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: page.title,
        description: page.description,
        url,
        isPartOf: { "@id": "https://freonn.ru/#website" },
      },
    ];
  }

  if (clean.startsWith("/ceny/")) {
    const slug = clean.slice("/ceny/".length);
    const page = PRICING_SERVICE_META[slug];
    if (page) {
      return [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: page.description,
          url,
          isPartOf: { "@id": "https://freonn.ru/#website" },
        },
      ];
    }
  }

  if (clean.startsWith("/slovar/")) {
    const slug = clean.slice("/slovar/".length);
    const term = GLOSSARY_BY_SLUG[slug];
    if (term) {
      return [
        {
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          name: term.term,
          description: term.definition,
          url,
          inDefinedTermSet: {
            "@id": "https://freonn.ru/slovar#definedtermset",
          },
        },
      ];
    }
  }

  if (clean.startsWith("/kejs/")) {
    const slug = clean.slice("/kejs/".length);
    const study = CASE_STUDY_BY_SLUG[slug];
    if (study) {
      return [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${study.title} — кейс Freonn`,
          description: study.summary,
          url,
          isPartOf: { "@id": "https://freonn.ru/#website" },
        },
      ];
    }
  }

  if (clean.startsWith("/stati/")) {
    const slug = clean.slice("/stati/".length);
    const page = CONTENT_PAGE_BY_SLUG[slug];
    if (page) {
      const graph: object[] = [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${url}#article`,
          headline: page.h1,
          description: page.description,
          url,
          datePublished: page.published,
          dateModified: page.modified,
          author: { "@type": "Organization", name: page.author },
          publisher: { "@id": "https://freonn.ru/#organization" },
          isPartOf: { "@id": "https://freonn.ru/#website" },
          articleSection: page.category,
        },
      ];
      if (page.faq && page.faq.length > 0) {
        graph.push({
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: page.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        });
      }
      return graph;
    }
  }

  return null;
}
