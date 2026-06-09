import { buildServiceGeoPath } from "@shared/geoRoutes";
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import ProcessSection from "@/components/ProcessSection";
import { ymGoal } from "@/lib/ym";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";

type GeoKey = "moskva" | "moskovskaya-oblast";

export const GEO_SERVICES: Record<string, {
  name: string;
  genitive: string;
  slug: string;
  priceUrl?: string;
  features: string[];
}> = {
  ventilyaciya: {
    name: "Вентиляция",
    genitive: "вентиляции",
    slug: "ventilyaciya",
    priceUrl: "/ceny-na-montazh-ventilyacii",
    features: ["Приточно-вытяжные системы", "Промышленная вентиляция", "Рекуперация", "Автоматика"],
  },
  kondicionirovanie: {
    name: "Кондиционирование",
    genitive: "кондиционирования",
    slug: "kondicionirovanie",
    priceUrl: "/ceny-na-montazh-kondicionirovaniya",
    features: ["VRF/VRV", "Чиллеры и фанкойлы", "Прецизионные системы", "Канальные кондиционеры"],
  },
  dymoudalenie: {
    name: "Дымоудаление",
    genitive: "дымоудаления",
    slug: "dymoudalenie",
    priceUrl: "/ceny-na-montazh-dymoudaleniya",
    features: ["Противодымная вентиляция", "Подпор воздуха", "Клапаны дымоудаления", "Автоматика"],
  },
  otoplenie: {
    name: "Отопление",
    genitive: "отопления",
    slug: "otoplenie",
    features: ["Воздушное отопление", "Водяные системы", "ИТП", "Тепловые завесы"],
  },
  holodosnabzhenie: {
    name: "Холодоснабжение",
    genitive: "холодоснабжения",
    slug: "holodosnabzhenie",
    features: ["Чиллеры", "Технологическое охлаждение", "Фреоновые системы", "Холодильные камеры"],
  },
  vodosnabzhenie: {
    name: "Водоснабжение",
    genitive: "водоснабжения",
    slug: "vodosnabzhenie",
    features: ["Насосные станции", "Водоотведение", "Водоподготовка", "Ливневая канализация"],
  },
  elektrosnabzhenie: {
    name: "Электроснабжение",
    genitive: "электроснабжения",
    slug: "elektrosnabzhenie",
    features: ["Электрощитовые", "Кабельные линии", "Освещение", "АВР и заземление"],
  },
  peskostrujnayaObrabotka: {
    name: "Пескоструйная обработка",
    genitive: "пескоструйной обработки",
    slug: "peskostrujnaya-obrabotka",
    priceUrl: "/ceny-na-peskostruj",
    features: ["Очистка металла", "Подготовка под покраску", "Антикоррозийная обработка", "Выезд на объект"],
  },
};

export const GEO_REGIONS: Record<GeoKey, {
  name: string;
  phrase: string;
  areaType: "City" | "AdministrativeArea";
  description: string;
  coverageTitle: string;
  coverage: string[];
  nearby: Array<{ href: string; label: string }>;
}> = {
  moskva: {
    name: "Москва",
    phrase: "в Москве",
    areaType: "City",
    description: "Работаем с объектами внутри МКАД и в Новой Москве: бизнес-центрами, торговыми комплексами, складами, производственными площадками, медицинскими и образовательными учреждениями.",
    coverageTitle: "Районы и округа Москвы",
    coverage: ["ЦАО", "САО", "СВАО", "ВАО", "ЮВАО", "ЮАО", "ЮЗАО", "ЗАО", "СЗАО", "Зеленоград", "ТиНАО", "Новая Москва"],
    nearby: [
      { href: "/zelenograd", label: "Зеленоград" },
      { href: "/troitsk", label: "Троицк" },
      { href: "/shcherbinka", label: "Щербинка" },
      { href: "/khimki", label: "Химки" },
      { href: "/krasnogorsk", label: "Красногорск" },
    ],
  },
  "moskovskaya-oblast": {
    name: "Московская область",
    phrase: "в Московской области",
    areaType: "AdministrativeArea",
    description: "Выезжаем на промышленные, складские, коммерческие и социальные объекты по всей Московской области. Инженер обследует площадку, готовит техническое решение и смету.",
    coverageTitle: "Приоритетные города МО",
    coverage: ["Химки", "Красногорск", "Одинцово", "Мытищи", "Балашиха", "Подольск", "Люберцы", "Домодедово", "Раменское", "Дзержинский", "Коломна", "Дмитров"],
    nearby: [
      { href: "/khimki", label: "Химки" },
      { href: "/odintsovo", label: "Одинцово" },
      { href: "/krasnogorsk", label: "Красногорск" },
      { href: "/mytishchi", label: "Мытищи" },
      { href: "/podolsk", label: "Подольск" },
      { href: "/balashikha", label: "Балашиха" },
    ],
  },
};

const objectTypes = [
  "Бизнес-центры",
  "Торговые центры",
  "Склады и логистика",
  "Производственные цеха",
  "Медицинские учреждения",
  "Школы и спортобъекты",
];

const proofCasesMoscow = [
  {
    title: "БЦ Aero City, Москва",
    text: "Монтаж вентиляции и кондиционирования для коммерческого объекта в Москве с подбором оборудования и пусконаладкой.",
  },
  {
    title: "Московское училище олимпийского резерва N1",
    text: "Вентиляция, дымоудаление, VRF-системы, поставка материалов и исполнительная документация.",
  },
  {
    title: "Комбинат Очаково, Москва",
    text: "Монтаж вентиляции и противопожарных клапанов на промышленном объекте столицы.",
  },
];

const proofCasesRegion = [
  {
    title: "Логистический комплекс, Химки",
    text: "Монтаж приточно-вытяжной вентиляции и кондиционирования на складе площадью 12 000 м² в Химкинском районе.",
  },
  {
    title: "Производственный цех, Подольск",
    text: "Вентиляция и дымоудаление для машиностроительного предприятия в Подольском районе с пусконаладкой.",
  },
  {
    title: "Торговый центр, Красногорск",
    text: "Кондиционирование и вентиляция для торгового комплекса в Красногорском районе Московской области.",
  },
];

function buildFaq(serviceName: string, serviceGenitive: string, regionPhrase: string) {
  return [
    {
      q: `Сколько стоит монтаж ${serviceGenitive} ${regionPhrase}?`,
      a: "Стоимость зависит от площади, мощности оборудования, трассировки, высоты потолков и требований к автоматике. Точный расчёт готовим после обследования объекта.",
    },
    {
      q: "Выезжает ли инженер на объект?",
      a: "Да, инженер Freonn выезжает на объект, собирает исходные данные, оценивает технические ограничения и готовит решение для сметы.",
    },
    {
      q: `Какие объекты вы берёте для услуги «${serviceName}»?`,
      a: "Работаем с коммерческими, промышленными и социальными объектами от 500 м²: офисами, складами, производствами, ТЦ, школами, клиниками и спортобъектами.",
    },
    {
      q: "Какие документы передаются после монтажа?",
      a: "Передаём исполнительную документацию, акты, паспорта оборудования и документы по пусконаладке. Состав зависит от проекта и требований заказчика.",
    },
  ];
}

export const SERVICE_GEO_ROUTES = Object.entries(GEO_SERVICES).flatMap(([serviceKey, service]) =>
  Object.keys(GEO_REGIONS).map((regionKey) => ({
    path: `/${service.slug}-${regionKey}`,
    serviceKey,
    regionKey: regionKey as GeoKey,
  }))
);

interface ServiceGeoPageProps {
  serviceKey: string;
  regionKey: GeoKey;
}

export default function ServiceGeoPage({ serviceKey, regionKey }: ServiceGeoPageProps) {
  const service = GEO_SERVICES[serviceKey];
  const region = GEO_REGIONS[regionKey];

  if (!service || !region) return null;

  const canonical = `/${service.slug}-${regionKey}`;
  const title = `${service.name} ${region.phrase}`;
  const metaTitle = `Монтаж ${service.genitive} ${region.phrase} — Freonn`;
  const description = `Монтаж ${service.genitive} ${region.phrase} для коммерческих и промышленных объектов. Проектирование, монтаж, пусконаладка, гарантия. Бесплатный расчёт.`;
  const faq = buildFaq(service.name, service.genitive, region.phrase);

  const proofCases = regionKey === "moskva" ? proofCasesMoscow : proofCasesRegion;
  const relatedServiceGeo = Object.entries(GEO_SERVICES)
    .filter(([key]) => key !== serviceKey)
    .map(([, svc]) => ({
      href: buildServiceGeoPath(svc.slug, regionKey),
      label: `${svc.name} ${region.phrase}`,
    }));

  useSEO({
    title: metaTitle,
    description,
    keywords: `монтаж ${service.genitive} ${region.name}, ${service.name.toLowerCase()} ${region.name}, инженерные системы ${region.name}, Freonn`,
    canonical,
    omitRegionMeta: regionKey === "moskovskaya-oblast",
    breadcrumbs: [
      { name: "Услуги", url: "/uslugi" },
      { name: service.name, url: `/${service.slug}` },
      { name: region.name, url: canonical },
    ],
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: title,
        description,
        url: `https://freonn.ru${canonical}`,
        provider: { "@id": "https://freonn.ru/#organization" },
        areaServed: { "@type": region.areaType, name: region.name },
        serviceType: service.name,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  });

  return (
    <PageLayout
      title={title}
      breadcrumb={[
        { label: "Услуги", href: "/uslugi" },
        { label: service.name, href: `/${service.slug}` },
        { label: region.name },
      ]}
    >
      <section className="py-14 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="font-heading font-bold text-[#0F1340] text-2xl lg:text-3xl mb-4">
                Монтаж {service.genitive} {region.phrase} под ключ
              </h2>
              <p className="text-gray-600 font-body leading-relaxed mb-5">
                {region.description} Freonn выполняет обследование, проектирование, поставку оборудования, монтаж, пусконаладочные работы и сдачу исполнительной документации.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-7">
                {service.features.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-[#2D3092]" />
                    <span className="text-gray-700 font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-7">
                {objectTypes.map((item) => (
                  <span key={item} className="text-xs px-3 py-1.5 bg-[#F7F8FF] text-[#0F1340] font-body rounded-full">
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/contacts" className="btn-dark inline-flex items-center gap-2 justify-center">
                  Получить расчёт <ArrowRight size={16} />
                </a>
                <a href="tel:88001012009" onClick={() => ymGoal("phone_click")} className="btn-dark inline-flex items-center gap-2 justify-center">
                  <Phone size={16} /> 8(800)101-2009
                </a>
              </div>
            </div>
            <div className="bg-[#F7F8FF] rounded-xl p-6 border border-gray-100">
              <h2 className="font-heading font-bold text-[#0F1340] text-xl mb-4">
                Что входит в работу
              </h2>
              <ul className="space-y-3 font-body text-sm text-gray-600 mb-6">
                <li>Выезд инженера на объект и сбор исходных данных.</li>
                <li>Подбор оборудования под нагрузки, нормы и режим эксплуатации.</li>
                <li>Монтаж силами собственных бригад и контроль сроков.</li>
                <li>Пусконаладка, исполнительная документация и гарантия.</li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <a href={`/${service.slug}`} className="px-4 py-2 bg-white hover:bg-[#0F1340] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors">
                  Основная услуга
                </a>
                {service.priceUrl && (
                  <a href={service.priceUrl} className="px-4 py-2 bg-white hover:bg-[#B91C1C] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors">
                    Цены
                  </a>
                )}
                <a href="/moskva" className="px-4 py-2 bg-white hover:bg-[#0F1340] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors">
                  Москва
                </a>
                <a href="/moskovskaya-oblast" className="px-4 py-2 bg-white hover:bg-[#0F1340] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors">
                  Московская область
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#F7F8FF]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-5">
                {region.coverageTitle}
              </h2>
              <div className="flex flex-wrap gap-2">
                {region.coverage.map((item) => (
                  <span key={item} className="px-4 py-2 bg-white text-[#0F1340] rounded-full text-sm font-body">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-5">
                География рядом
              </h2>
              <div className="flex flex-wrap gap-2">
                {region.nearby.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 bg-white hover:bg-[#B91C1C] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-6">
            {regionKey === "moskva" ? "Опыт на объектах Москвы" : "Опыт на объектах Московской области"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {proofCases.map((item) => (
              <div key={item.title} className="bg-[#F7F8FF] rounded-xl p-5 border border-gray-100">
                <h3 className="font-heading font-semibold text-[#0F1340] text-base mb-2">{item.title}</h3>
                <p className="text-gray-600 font-body text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <a href="/obekty" className="btn-dark inline-flex items-center gap-2">
              Смотреть объекты <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container">
          <h2 className="font-heading font-bold text-[#0F1340] text-xl mb-4">
            Другие услуги {region.phrase}
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedServiceGeo.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 bg-[#F7F8FF] hover:bg-[#0F1340] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#F7F8FF]">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-6">
            Частые вопросы
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {faq.map((item) => (
              <div key={item.q} className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-heading font-semibold text-[#0F1340] text-base mb-2">{item.q}</h3>
                <p className="text-gray-600 font-body text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection />
      <ContactSection />
    </PageLayout>
  );
}
