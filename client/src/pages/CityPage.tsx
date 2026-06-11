import { ymGoal } from "@/lib/ym";
/*
 * FREONN CITY PAGE — /:city (istra, odintsovo, khimki, etc.)
 * SEO-optimized city pages for local search
 */
import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import NotFound from "@/pages/NotFound";
import {
  buildServiceLocationPath,
  getCityAreaType,
  getCityEntry,
  isKnownCitySlug,
} from "@shared/geoRoutes";
import { getCityContent } from "@shared/cityContent";
import { getCityTier, isMatrixCity, getTier1NearbyLinks } from "@shared/geoTiers";
import { getCity3dLinks, getCityServiceLinks } from "@shared/seoMatrix";
import { useSEO } from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, MapPin, Clock, Phone, Wind, Thermometer, Flame, Snowflake, ShieldAlert, Droplets, Zap, Hammer } from "lucide-react";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663524928365/d5oRPUYjSRzESZKpUgG9pW";

// City name mapping for proper display
const services = [
  { icon: Wind, name: "Вентиляция", slug: "ventilyaciya", href: "/ventilyaciya", desc: "Приточно-вытяжные системы для промышленных и коммерческих объектов" },
  { icon: Thermometer, name: "Кондиционирование", slug: "kondicionirovanie", href: "/kondicionirovanie", desc: "Сплит-системы, VRF/VRV, чиллеры и фанкойлы" },
  { icon: ShieldAlert, name: "Дымоудаление", slug: "dymoudalenie", href: "/dymoudalenie", desc: "Системы противодымной защиты по нормам МЧС" },
  { icon: Flame, name: "Отопление", slug: "otoplenie", href: "/otoplenie", desc: "Воздушное, водяное и электрическое отопление" },
  { icon: Snowflake, name: "Холодоснабжение", slug: "holodosnabzhenie", href: "/holodosnabzhenie", desc: "Промышленные холодильные системы и чиллеры" },
  { icon: Droplets, name: "Водоснабжение", slug: "vodosnabzhenie", href: "/vodosnabzhenie", desc: "Системы водоснабжения и канализации" },
  { icon: Zap, name: "Электроснабжение", slug: "elektrosnabzhenie", href: "/elektrosnabzhenie", desc: "Электромонтажные работы и освещение" },
  { icon: Hammer, name: "Пескоструй", slug: "peskostrujnaya-obrabotka", href: "/peskostrujnaya-obrabotka", desc: "Пескоструйная обработка металлоконструкций" },
];

function getServiceHref(city: string, service: (typeof services)[number]) {
  return buildServiceLocationPath(service.slug, city);
}

const advantages = [
  "Выезд инженера в течение 1 дня",
  "Бесплатный расчёт стоимости",
  "Работаем с объектами от 500 м²",
  "Гарантия 1 год на монтажные работы",
  "Полный пакет исполнительной документации",
  "Сервисное обслуживание после сдачи",
];

const moscowServiceLinks = [
  { href: "/ventilyaciya-moskva", label: "Монтаж вентиляции в Москве" },
  { href: "/kondicionirovanie-moskva", label: "Кондиционирование в Москве" },
  { href: "/dymoudalenie-moskva", label: "Дымоудаление в Москве" },
  { href: "/otoplenie-moskva", label: "Отопление в Москве" },
  { href: "/ceny-na-montazh-ventilyacii", label: "Цены на вентиляцию" },
  { href: "/ceny-na-montazh-kondicionirovaniya", label: "Цены на кондиционирование" },
];

const regionServiceLinks = [
  { href: "/ventilyaciya-moskovskaya-oblast", label: "Монтаж вентиляции в МО" },
  { href: "/kondicionirovanie-moskovskaya-oblast", label: "Кондиционирование в МО" },
  { href: "/dymoudalenie-moskovskaya-oblast", label: "Дымоудаление в МО" },
  { href: "/otoplenie-moskovskaya-oblast", label: "Отопление в МО" },
  { href: "/elektrosnabzhenie-moskovskaya-oblast", label: "Электроснабжение в МО" },
  { href: "/holodosnabzhenie-moskovskaya-oblast", label: "Холодоснабжение в МО" },
];

const regionLinks = [
  { href: "/khimki", label: "Химки" },
  { href: "/krasnogorsk", label: "Красногорск" },
  { href: "/odintsovo", label: "Одинцово" },
  { href: "/mytishchi", label: "Мытищи" },
  { href: "/balashikha", label: "Балашиха" },
  { href: "/podolsk", label: "Подольск" },
  { href: "/lyubertsy", label: "Люберцы" },
  { href: "/domodedovo", label: "Домодедово" },
  { href: "/dzerzhinskij", label: "Дзержинский" },
  { href: "/zelenograd", label: "Зеленоград" },
  { href: "/troitsk", label: "Троицк" },
  { href: "/dolgoprudny", label: "Долгопрудный" },
];

const geoProofItems = [
  {
    title: "Документы и допуски",
    text: "Работаем по договору, передаём исполнительную документацию, паспорта оборудования, акты и документы по пусконаладке.",
  },
  {
    title: "Коммерческие объекты от 500 м²",
    text: "Берём в работу бизнес-центры, склады, торговые центры, производства, школы, клиники, рестораны и спортивные объекты.",
  },
  {
    title: "Выезд инженера",
    text: "Инженер выезжает на объект, фиксирует исходные данные, оценивает ограничения и готовит техническое решение для сметы.",
  },
  {
    title: "Гарантия и сервис",
    text: "Даём гарантию на монтажные работы, помогаем с сервисным обслуживанием и настройкой инженерных систем после сдачи.",
  },
];

const geoCaseLinks = [
  { href: "/ventilyaciya-ofis", label: "Вентиляция офисов" },
  { href: "/ventilyaciya-sklad", label: "Вентиляция складов" },
  { href: "/dymoudalenie-tc", label: "Дымоудаление ТЦ" },
  { href: "/kondicionirovanie-dc", label: "Кондиционирование серверных" },
  { href: "/otoplenie-zavod", label: "Отопление производств" },
  { href: "/elektrosnabzhenie-sklad", label: "Электроснабжение складов" },
];

const getCityData = (city: string, cityName: string) => getCityContent(city, cityName);

function getCityPageMeta(city: string, cityName: string, cityIn: string) {
  if (city === "moskva") {
    return {
      title: "Монтаж инженерных систем в Москве — Freonn",
      description:
        "Проектирование и монтаж вентиляции, кондиционирования, дымоудаления и отопления в Москве. Бизнес-центры, ТЦ, склады, производства. Выезд инженера, гарантия 1 год.",
      keywords:
        "монтаж вентиляции Москва, кондиционирование Москва, инженерные системы Москва, дымоудаление Москва, Freonn",
    };
  }
  if (city === "moskovskaya-oblast") {
    return {
      title: "Монтаж инженерных систем в Московской области — Freonn",
      description:
        "Проектирование и монтаж инженерных систем по всей Московской области: вентиляция, кондиционирование, дымоудаление, отопление. 1280+ объектов, выезд инженера.",
      keywords:
        "монтаж вентиляции Московская область, кондиционирование МО, инженерные системы Подмосковье, Freonn",
    };
  }
  return {
    title: `Монтаж инженерных систем ${cityIn} — Freonn`,
    description: `Проектирование и монтаж инженерных систем ${cityIn}: вентиляция, кондиционирование, дымоудаление, отопление. Бесплатный выезд инженера, гарантия 1 год.`,
    keywords: `монтаж вентиляции ${cityName}, кондиционирование ${cityName}, инженерные системы ${cityName}, дымоудаление ${cityName}, отопление ${cityName}`,
  };
}

const moscowHubContent = {
  moskva: {
    servicesTitle: "Инженерные системы для объектов Москвы",
    servicesText: "Freonn работает с объектами в Москве: бизнес-центрами в пределах МКАД и ТТК, торговыми центрами, складами, производственными площадками, медицинскими и образовательными учреждениями. Выполняем обследование, проектирование, монтаж, пусконаладку и сервисное обслуживание инженерных систем под ключ.",
    coverageTitle: "Выезд инженера по районам Москвы",
    coverageText: "Работаем во всех административных округах столицы: ЦАО, САО, СВАО, ВАО, ЮВАО, ЮАО, ЮЗАО, ЗАО, СЗАО, Зеленоград, Троицк, Щербинка. Ниже — ключевые направления в Московской области.",
  },
  "moskovskaya-oblast": {
    servicesTitle: "Монтаж инженерных систем по Московской области",
    servicesText: "Freonn выполняет проекты в пригородах и промышленных зонах Подмосковья: логистические парки, производственные площадки, торговые центры, жилые комплексы и социальные объекты. Выезд инженера по всему региону, головной офис — в Дзержинском.",
    coverageTitle: "Выезд инженера по городам МО",
    coverageText: "Работаем в Химках, Красногорске, Одинцово, Мытищах, Балашихе, Подольске, Люберцах, Домодедово, Раменском, Коломне, Дмитрове и других городах области. Ниже — популярные направления.",
  },
};

interface CityPageProps {
  city: string;
}

export default function CityPage({ city }: CityPageProps) {
  const cityEntry = getCityEntry(city);

  // Неизвестный slug — показываем 404, не создаём мусорный контент
  if (!cityEntry || !isKnownCitySlug(city)) {
    return <NotFound />;
  }

  const cityName = cityEntry.name;
  const cityIn = cityEntry.phrase;
  const showMoscowSeo = city === "moskva" || city === "moskovskaya-oblast";
  const serviceGeoLinks = city === "moskovskaya-oblast" ? regionServiceLinks : moscowServiceLinks;
  const staticCityData = getCityData(city, cityName);
  const cityTier = getCityTier(city);
  const city3dLinks = getCity3dLinks(city);
  const cityData = staticCityData;
  const pageMeta = getCityPageMeta(city, cityName, cityIn);

  useSEO({
    title: pageMeta.title,
    description: pageMeta.description,
    keywords: pageMeta.keywords,
    canonical: `/${city}`,
    omitRegionMeta: true,
    breadcrumbs: [{ name: cityName, url: `/${city}` }],
  });

  return (
    <PageLayout
      title={`Инженерные системы — ${cityName}`}
      breadcrumb={[{ label: cityName }]}
    >
      {/* Intro */}
      <section className="py-14 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-[#B91C1C]" />
                <span className="text-[#B91C1C] font-heading font-semibold text-sm uppercase tracking-wider">
                  {cityName} и {cityData.district}
                </span>
              </div>
              <h2 className="font-heading font-bold text-[#0F1340] text-2xl lg:text-3xl mb-4">
                Монтаж инженерных систем {cityIn}
              </h2>
              <p className="text-gray-600 font-body leading-relaxed mb-6">
                {cityData.lsi}
              </p>
              <div className="inline-flex items-center gap-2 bg-[#F7F8FF] rounded-lg px-3 py-1.5 mb-4">
                <span className="text-[#2D3092] text-xs font-heading font-semibold">Объекты:</span>
                <span className="text-gray-600 text-xs font-body">{cityData.objects}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {advantages.map((adv, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="mt-0.5 flex-shrink-0 text-[#2D3092]" />
                    <span className="text-gray-700 font-body text-sm">{adv}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/contacts" className="btn-dark inline-flex items-center gap-2 justify-center">
                  Вызвать инженера <ArrowRight size={16} />
                </a>
                <a href="tel:88001012009" onClick={() => ymGoal("phone_click")} className="btn-dark inline-flex items-center gap-2 justify-center">
                  <Phone size={16} /> 8(800)101-2009
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src={`${CDN}/freonn-ventilation-unit-5ebe3bmzqsCGdGpvbDz2zo.webp`}
                  alt={`Монтаж инженерных систем ${cityIn}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#B91C1C] text-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <div>
                    <p className="font-heading font-bold text-sm">Выезд сегодня</p>
                    <p className="text-white/80 text-xs font-body">Пн–Сб 9:00–19:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-14 bg-[#F7F8FF]">
        <div className="container">
          <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-2">
            Наши услуги {cityIn}
          </h2>
          <p className="text-gray-500 font-body mb-8">Полный комплекс инженерных работ под ключ</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.a
                  key={i}
                  href={getServiceHref(city, service)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group bg-white rounded-xl p-5 hover:shadow-md transition-all border border-gray-100 hover:border-[#2D3092]/20"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#2D3092]/10 flex items-center justify-center mb-3 group-hover:bg-[#2D3092] transition-colors">
                    <Icon size={18} className="text-[#2D3092] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-heading font-semibold text-[#0F1340] text-sm mb-1.5">{service.name}</h3>
                  <p className="text-gray-500 font-body text-xs leading-relaxed">{service.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-[#B91C1C] text-xs font-heading font-semibold">
                    Подробнее <ArrowRight size={12} />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {!showMoscowSeo && (
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container">
            <h2 className="font-heading font-bold text-[#0F1340] text-xl mb-4">
              Услуги Freonn {cityIn}
            </h2>
            <div className="flex flex-wrap gap-2">
              {getCityServiceLinks(city).slice(0, 8).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 bg-[#F7F8FF] hover:bg-[#0F1340] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            {cityTier === 2 && (
              <>
                <p className="mt-6 text-gray-600 font-body text-sm">
                  Также работаем по всей{" "}
                  <a href="/moskovskaya-oblast" className="text-[#2D3092] font-semibold hover:underline">
                    Московской области
                  </a>{" "}
                  и в{" "}
                  <a href="/moskva" className="text-[#2D3092] font-semibold hover:underline">
                    Москве
                  </a>
                  .
                </p>
                <div className="mt-4">
                  <h3 className="font-heading font-semibold text-[#0F1340] text-sm mb-2">Ближайшие ключевые города</h3>
                  <div className="flex flex-wrap gap-2">
                    {getTier1NearbyLinks(city, 3).map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="px-3 py-1.5 bg-[#F7F8FF] hover:bg-[#0F1340] hover:text-white text-[#0F1340] rounded-full text-xs font-body transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {isMatrixCity(city) && city3dLinks.length > 0 && (
        <section className="py-12 bg-[#F7F8FF] border-t border-gray-100">
          <div className="container">
            <h2 className="font-heading font-bold text-[#0F1340] text-xl mb-4">
              Объекты {cityIn}
            </h2>
            <div className="flex flex-wrap gap-2">
              {city3dLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 bg-white hover:bg-[#0F1340] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {showMoscowSeo && (
        <section className="py-12 bg-white">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-10">
              <div>
                <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-4">
                  {moscowHubContent[city as keyof typeof moscowHubContent].servicesTitle}
                </h2>
                <p className="text-gray-600 font-body leading-relaxed mb-5">
                  {moscowHubContent[city as keyof typeof moscowHubContent].servicesText}
                </p>
                <div className="flex flex-wrap gap-2">
                  {serviceGeoLinks.map((link) => (
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
              <div>
                <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-4">
                  {moscowHubContent[city as keyof typeof moscowHubContent].coverageTitle}
                </h2>
                <p className="text-gray-600 font-body leading-relaxed mb-5">
                  {moscowHubContent[city as keyof typeof moscowHubContent].coverageText}
                </p>
                <div className="flex flex-wrap gap-2">
                  {regionLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2 bg-gray-100 hover:bg-[#B91C1C] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {showMoscowSeo && (
        <section className="py-12 bg-[#F7F8FF]">
          <div className="container">
            <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-6">
              Почему нам доверяют объекты {cityIn}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {geoProofItems.map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100">
                  <h3 className="font-heading font-semibold text-[#0F1340] text-base mb-2">{item.title}</h3>
                  <p className="text-gray-600 font-body text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <h2 className="font-heading font-bold text-[#0F1340] text-xl mb-4">
                Популярные задачи по объектам
              </h2>
              <div className="flex flex-wrap gap-2">
                {geoCaseLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 bg-white hover:bg-[#0F1340] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="py-14 bg-white">
        <div className="container">
          <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-8">Как мы работаем</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Заявка", desc: "Оставьте заявку на сайте или позвоните нам. Ответим в течение 30 минут." },
              { step: "02", title: "Выезд инженера", desc: "Инженер приедет на объект, проведёт обследование и составит техническое задание." },
              { step: "03", title: "Проект и смета", desc: "Разработаем проект и смету. Согласуем с вами все детали и стоимость." },
              { step: "04", title: "Монтаж и сдача", desc: "Выполним монтаж в срок, сдадим объект с полным пакетом документов." },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-heading font-black text-[#2D3092]/10 mb-2">{item.step}</div>
                <h3 className="font-heading font-bold text-[#0F1340] text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 font-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#0F1340] text-white">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl mb-3">
            Нужны инженерные системы {cityIn}?
          </h2>
          <p className="text-white/70 font-body mb-6">
            Оставьте заявку — наш инженер свяжется с вами в течение 30 минут и рассчитает стоимость бесплатно.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contacts" className="btn-dark inline-flex items-center gap-2 justify-center">
              Получить расчёт <ArrowRight size={16} />
            </a>
            <a href="tel:88001012009" onClick={() => ymGoal("phone_click")} className="btn-outline border-white/30 text-white hover:bg-white/10 inline-flex items-center gap-2 justify-center">
              8(800)101-2009
            </a>
          </div>
        </div>
      </section>

      <ContactSection />
    </PageLayout>
  );
}
