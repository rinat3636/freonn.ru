import {
  buildServiceLocationPath,
  getCityAreaType,
  getCityEntry,
  type GeoSlug,
} from "@shared/geoRoutes";
import { getCityContent } from "@shared/cityContent";
import { getCityTier, getTier1NearbyLinks } from "@shared/geoTiers";
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import ProcessSection from "@/components/ProcessSection";
import { ymGoal } from "@/lib/ym";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";
import { GEO_SERVICES, GEO_REGIONS } from "@shared/serviceGeo";

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

function buildFaq(serviceName: string, serviceGenitive: string, regionPhrase: string, cityName: string, cityTier: 0 | 1 | 2) {
  const faq = [
    {
      q: `Сколько стоит монтаж ${serviceGenitive} ${regionPhrase}?`,
      a: "Стоимость зависит от площади, мощности оборудования, трассировки, высоты потолков и требований к автоматике. Точный расчёт готовим после обследования объекта.",
    },
    {
      q: `Выезжает ли инженер Freonn ${regionPhrase}?`,
      a: `Да, инженер Freonn выезжает на объект ${regionPhrase}, собирает исходные данные, оценивает технические ограничения и готовит решение для сметы.`,
    },
    {
      q: `Какие объекты вы берёте для услуги «${serviceName}» ${regionPhrase}?`,
      a: "Работаем с коммерческими, промышленными и социальными объектами от 500 м²: офисами, складами, производствами, ТЦ, школами, клиниками и спортобъектами.",
    },
    {
      q: "Какие документы передаются после монтажа?",
      a: "Передаём исполнительную документацию, акты, паспорта оборудования и документы по пусконаладке. Состав зависит от проекта и требований заказчика.",
    },
  ];

  if (cityTier === 2) {
    faq.unshift({
      q: `Работаете ли вы ${regionPhrase} и в других городах МО?`,
      a: `Да, Freonn выполняет монтаж ${serviceGenitive} ${regionPhrase} и по всей Московской области. Для крупных проектов также работаем в Москве и ключевых городах Подмосковья.`,
    });
  }

  return faq;
}

function resolveLocationContext(locationSlug: string) {
  const region = GEO_REGIONS[locationSlug as GeoSlug];
  if (region) {
    return {
      name: region.name,
      phrase: region.phrase,
      areaType: region.areaType,
      description: region.description,
      coverageTitle: region.coverageTitle,
      coverage: region.coverage,
      nearby: region.nearby,
      cityHref: `/${locationSlug}`,
      proofTitle:
        locationSlug === "moskva" ? "Опыт на объектах Москвы" : "Опыт на объектах Московской области",
      proofCases: locationSlug === "moskva" ? proofCasesMoscow : proofCasesRegion,
      omitRegionMeta: locationSlug === "moskovskaya-oblast",
    };
  }

  const city = getCityEntry(locationSlug);
  if (!city) return null;

  const cityContent = getCityContent(locationSlug, city.name);
  const cityTier = getCityTier(locationSlug);

  return {
    name: city.name,
    phrase: city.phrase,
    areaType: getCityAreaType(locationSlug),
    description: `${cityContent.lsi} Специализация Freonn — монтаж инженерных систем для коммерческих и промышленных объектов от 500 м².`,
    coverageTitle: `Работаем ${city.phrase}`,
    coverage: [city.name, "Московская область", "Москва"],
    nearby: cityTier <= 1 ? getTier1NearbyLinks(locationSlug) : getTier1NearbyLinks(locationSlug, 3),
    cityHref: `/${locationSlug}`,
    proofTitle: `Опыт на объектах ${city.name} и МО`,
    proofCases: proofCasesRegion,
    omitRegionMeta: true,
  };
}

interface ServiceGeoPageProps {
  serviceKey: string;
  locationSlug: string;
}

export default function ServiceGeoPage({ serviceKey, locationSlug }: ServiceGeoPageProps) {
  const service = GEO_SERVICES[serviceKey];
  const location = resolveLocationContext(locationSlug);

  if (!service || !location) return null;

  const canonical = `/${service.slug}-${locationSlug}`;
  const title = `${service.name} ${location.phrase}`;
  const metaTitle = `Монтаж ${service.genitive} ${location.phrase} — Freonn`;
  const description = `Монтаж ${service.genitive} ${location.phrase} для коммерческих и промышленных объектов. Проектирование, монтаж, пусконаладка, гарантия. Бесплатный расчёт.`;
  const faq = buildFaq(service.name, service.genitive, location.phrase, location.name, getCityTier(locationSlug));

  const relatedServiceGeo = Object.entries(GEO_SERVICES)
    .filter(([key]) => key !== serviceKey)
    .map(([, svc]) => ({
      href: buildServiceLocationPath(svc.slug, locationSlug),
      label: `${svc.name} ${location.phrase}`,
    }));

  const moscowLinks =
    locationSlug !== "moskva" && locationSlug !== "moskovskaya-oblast"
      ? [
          { href: buildServiceLocationPath(service.slug, "moskva"), label: `${service.name} в Москве` },
          { href: buildServiceLocationPath(service.slug, "moskovskaya-oblast"), label: `${service.name} в МО` },
        ]
      : [];

  useSEO({
    title: metaTitle,
    description,
    keywords: `монтаж ${service.genitive} ${location.name}, ${service.name.toLowerCase()} ${location.name}, инженерные системы ${location.name}, Freonn`,
    canonical,
    omitRegionMeta: location.omitRegionMeta,
    breadcrumbs: [
      { name: "Услуги", url: "/uslugi" },
      { name: service.name, url: `/${service.slug}` },
      { name: location.name, url: canonical },
    ],
  });

  return (
    <PageLayout
      title={title}
      breadcrumb={[
        { label: "Услуги", href: "/uslugi" },
        { label: service.name, href: `/${service.slug}` },
        { label: location.name },
      ]}
    >
      <section className="py-14 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="font-heading font-bold text-[#0F1340] text-2xl lg:text-3xl mb-4">
                Монтаж {service.genitive} {location.phrase} под ключ
              </h2>
              <p className="text-gray-600 font-body leading-relaxed mb-5">
                {location.description} Freonn выполняет обследование, проектирование, поставку оборудования, монтаж, пусконаладочные работы и сдачу исполнительной документации.
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
                <a href={location.cityHref} className="px-4 py-2 bg-white hover:bg-[#0F1340] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors">
                  {location.name}
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
                {location.coverageTitle}
              </h2>
              <div className="flex flex-wrap gap-2">
                {location.coverage.map((item) => (
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
                {location.nearby.map((link) => (
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
            {location.proofTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {location.proofCases.map((item) => (
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
            Другие услуги {location.phrase}
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
          {moscowLinks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-heading font-semibold text-[#0F1340] text-base mb-3">
                Основной регион
              </h3>
              <div className="flex flex-wrap gap-2">
                {moscowLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 bg-white border border-gray-200 hover:bg-[#0F1340] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
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
