import { ymGoal } from "@/lib/ym";
/*
 * FREONN CITY PAGE — /:city (istra, odintsovo, khimki, etc.)
 * SEO-optimized city pages for local search
 */
import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import NotFound from "@/pages/NotFound";
import {
  buildServiceGeoPath,
  getCityAreaType,
  getCityEntry,
  isKnownCitySlug,
  type GeoSlug,
} from "@shared/geoRoutes";
import { useSEO } from "@/hooks/useSEO";
import { useAICityContent } from "@/hooks/useAICityContent";
import { useAISEO } from "@/hooks/useAISEO";
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
  if (city === "moskva" || city === "moskovskaya-oblast") {
    return buildServiceGeoPath(service.slug, city as GeoSlug);
  }
  return service.href;
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

// Уникальные LSI-описания для каждого города (SEO)
const cityDescriptions: Record<string, { district: string; lsi: string; objects: string }> = {
  "istra": {
    district: "Истринском районе",
    lsi: "Работаем с промышленными предприятиями, торговыми центрами, складскими комплексами и жилыми домами Истры и Истринского района. Монтируем системы вентиляции, кондиционирования, дымоудаления и отопления под ключ.",
    objects: "Производственные цеха, ТЦ, склады, коттеджи",
  },
  "odintsovo": {
    district: "Одинцовском районе",
    lsi: "Freonn выполняет монтаж инженерных систем в Одинцово и Одинцовском районе: офисные центры, торговые комплексы, производственные объекты. Проектирование и монтаж вентиляции, кондиционирования, дымоудаления.",
    objects: "Офисные центры, ТЦ, производства",
  },
  "khimki": {
    district: "городском округе Химки",
    lsi: "Монтаж систем вентиляции и кондиционирования в Химках: бизнес-центры, логистические терминалы, торговые центры. Freonn — опыт работы на крупных объектах Химкинского района.",
    objects: "Бизнес-центры, логистика, ТЦ",
  },
  "mytishchi": {
    district: "Мытищинском районе",
    lsi: "Проектирование и монтаж инженерных систем в Мытищах: вентиляция, кондиционирование, дымоудаление для промышленных предприятий, торговых центров и жилых комплексов.",
    objects: "Промышленные объекты, ЖК, ТЦ",
  },
  "podolsk": {
    district: "Подольском районе",
    lsi: "Freonn выполняет монтаж вентиляции и кондиционирования в Подольске и Подольском районе. Работаем с производственными предприятиями, складами, торговыми и офисными объектами.",
    objects: "Производства, склады, офисы",
  },
  "balashikha": {
    district: "Балашихинском районе",
    lsi: "Монтаж инженерных систем в Балашихе: вентиляция, кондиционирование, отопление для жилых комплексов, торговых центров и промышленных объектов Балашихинского района.",
    objects: "ЖК, ТЦ, промышленность",
  },
  "korolev": {
    district: "городском округе Королёв",
    lsi: "Freonn — монтаж вентиляции и кондиционирования в Королёве: научно-производственные предприятия, офисные центры, торговые объекты. Работаем по проектной документации.",
    objects: "НПО, офисы, ТЦ",
  },
  "lyubertsy": {
    district: "Люберецком районе",
    lsi: "Монтаж систем вентиляции, кондиционирования и дымоудаления в Люберцах. Freonn работает с промышленными объектами, торговыми центрами и жилыми комплексами Люберецкого района.",
    objects: "Промышленность, ТЦ, ЖК",
  },
  "serpukhov": {
    district: "Серпуховском районе",
    lsi: "Проектирование и монтаж инженерных систем в Серпухове: вентиляция, кондиционирование, отопление для промышленных предприятий, торговых центров и административных зданий.",
    objects: "Промышленность, ТЦ, административные здания",
  },
  "klin": {
    district: "Клинском районе",
    lsi: "Монтаж вентиляции и кондиционирования в Клину: производственные цеха, склады, торговые объекты. Freonn — комплексный монтаж инженерных систем в Клинском районе.",
    objects: "Производства, склады, торговля",
  },
  "solnechnogorsk": {
    district: "Солнечногорском районе",
    lsi: "Freonn выполняет монтаж инженерных систем в Солнечногорске: вентиляция, кондиционирование, дымоудаление для промышленных и коммерческих объектов Солнечногорского района.",
    objects: "Промышленность, коммерция",
  },
  "naro-fominsk": {
    district: "Нарофоминском районе",
    lsi: "Монтаж систем вентиляции и кондиционирования в Нарофоминске: производственные предприятия, торговые центры, административные здания. Работаем по всему Нарофоминскому району.",
    objects: "Производства, ТЦ, офисы",
  },
  "chekhov": {
    district: "Чеховском районе",
    lsi: "Freonn — монтаж вентиляции, кондиционирования и отопления в Чехове. Работаем с промышленными предприятиями, складскими комплексами и торговыми объектами Чеховского района.",
    objects: "Промышленность, склады, ТЦ",
  },
  "domodedovo": {
    district: "Домодедовском районе",
    lsi: "Монтаж инженерных систем в Домодедово: вентиляция, кондиционирование, дымоудаление для логистических терминалов, гостиниц, торговых центров вблизи аэропорта.",
    objects: "Логистика, гостиницы, ТЦ",
  },
  "ramenskoe": {
    district: "Раменском районе",
    lsi: "Freonn выполняет монтаж вентиляции и кондиционирования в Раменском: промышленные предприятия, торговые центры, жилые комплексы Раменского района.",
    objects: "Промышленность, ТЦ, ЖК",
  },
  "elektrostal": {
    district: "городском округе Электросталь",
    lsi: "Монтаж систем вентиляции и кондиционирования в Электростали: металлургические и машиностроительные предприятия, торговые объекты. Опыт работы на крупных промышленных объектах.",
    objects: "Металлургия, машиностроение, ТЦ",
  },
  "noginsk": {
    district: "Ногинском районе",
    lsi: "Freonn — монтаж инженерных систем в Ногинске и Ногинском районе: вентиляция, кондиционирование, отопление для промышленных предприятий и торговых объектов.",
    objects: "Промышленность, торговля",
  },
  "pushkino": {
    district: "Пушкинском районе",
    lsi: "Монтаж вентиляции и кондиционирования в Пушкино: торговые центры, офисные здания, жилые комплексы. Freonn работает по всему Пушкинскому району.",
    objects: "ТЦ, офисы, ЖК",
  },
  "sergiev-posad": {
    district: "Сергиево-Посадском районе",
    lsi: "Freonn выполняет монтаж инженерных систем в Сергиевом Посаде: вентиляция, кондиционирование, дымоудаление для промышленных и коммерческих объектов района.",
    objects: "Промышленность, коммерция, туризм",
  },
  "dmitrov": {
    district: "Дмитровском районе",
    lsi: "Монтаж вентиляции и кондиционирования в Дмитрове: производственные предприятия, торговые центры, складские комплексы Дмитровского района.",
    objects: "Производства, ТЦ, склады",
  },
  "dubna": {
    district: "городском округе Дубна",
    lsi: "Freonn — монтаж инженерных систем в Дубне: научно-исследовательские институты, производственные предприятия, офисные и торговые объекты наукограда.",
    objects: "НИИ, производства, офисы",
  },
  "kolomna": {
    district: "Коломенском районе",
    lsi: "Монтаж систем вентиляции, кондиционирования и отопления в Коломне: промышленные предприятия, торговые центры, административные здания Коломенского района.",
    objects: "Промышленность, ТЦ, администрация",
  },
  "zhukovsky": {
    district: "городском округе Жуковский",
    lsi: "Freonn выполняет монтаж инженерных систем в Жуковском: авиационные предприятия, производственные объекты, торговые центры и жилые комплексы.",
    objects: "Авиапром, производства, ЖК",
  },
  "lobnya": {
    district: "городском округе Лобня",
    lsi: "Монтаж вентиляции и кондиционирования в Лобне: торговые центры, логистические комплексы, промышленные предприятия вблизи аэропорта Шереметьево.",
    objects: "Логистика, ТЦ, промышленность",
  },
  "dolgoprudny": {
    district: "городском округе Долгопрудный",
    lsi: "Freonn — монтаж инженерных систем в Долгопрудном: научные и производственные предприятия, торговые объекты, жилые комплексы.",
    objects: "Наука, производства, ЖК",
  },
  "krasnogorsk": {
    district: "Красногорском районе",
    lsi: "Монтаж систем вентиляции и кондиционирования в Красногорске: бизнес-центры, торговые комплексы, административные здания Красногорского района.",
    objects: "Бизнес-центры, ТЦ, администрация",
  },
  "zelenograd": {
    district: "Зеленограде",
    lsi: "Freonn выполняет монтаж инженерных систем в Зеленограде: электронная промышленность, производственные предприятия, офисные и торговые объекты.",
    objects: "Электроника, производства, офисы",
  },
  "troitsk": {
    district: "Троицком административном округе",
    lsi: "Монтаж вентиляции и кондиционирования в Троицке: научные институты, производственные предприятия, жилые и коммерческие объекты наукограда.",
    objects: "Наука, производства, ЖК",
  },
  "moskva": {
    district: "Москве",
    lsi: "Freonn — профессиональный монтаж инженерных систем в Москве: вентиляция, кондиционирование, дымоудаление, отопление. Работаем с бизнес-центрами, ТЦ, промышленными предприятиями и жилыми комплексами по всей Москве.",
    objects: "Бизнес-центры, ТЦ, промышленные объекты, ЖК",
  },
  "moskovskaya-oblast": {
    district: "Московской области",
    lsi: "Freonn выполняет проектирование и монтаж инженерных систем по всей Московской области: вентиляция, кондиционирование, дымоудаление, отопление. Опыт 15+ лет, 1280+ объектов по всему региону.",
    objects: "Промышленные объекты, ТЦ, ЖК, склады",
  },
  "dzerzhinskij": {
    district: "Дзержинском",
    lsi: "Монтаж инженерных систем в Дзержинском: вентиляция, кондиционирование, дымоудаление для промышленных предприятий, торговых центров и жилых комплексов. Головной офис Freonn находится в Дзержинском.",
    objects: "Промышленные объекты, ТЦ, ЖК",
  },
  "volokolamsk": {
    district: "Волоколамском районе",
    lsi: "Freonn выполняет монтаж вентиляции и кондиционирования в Волоколамске: производственные предприятия, складские комплексы, торговые и административные здания Волоколамского района.",
    objects: "Производства, склады, торговля",
  },
  "ruza": {
    district: "Рузском районе",
    lsi: "Монтаж инженерных систем в Рузе: вентиляция, кондиционирование, отопление для промышленных и коммерческих объектов Рузского района. Выезд инженера и расчёт бесплатно.",
    objects: "Промышленность, склады, ТЦ",
  },
  "mozhaisk": {
    district: "Можайском районе",
    lsi: "Freonn — проектирование и монтаж вентиляции, кондиционирования и дымоудаления в Можайске. Работаем с производствами, торговыми центрами и административными зданиями Можайского района.",
    objects: "Производства, ТЦ, администрация",
  },
  "fryazevo": {
    district: "городском округе Фрязино",
    lsi: "Монтаж инженерных систем во Фрязево: вентиляция, кондиционирование, электроснабжение для научно-производственных предприятий, офисов и торговых объектов.",
    objects: "НПО, офисы, торговля",
  },
  "taldom": {
    district: "Талдомском районе",
    lsi: "Freonn выполняет монтаж вентиляции и кондиционирования в Талдоме: промышленные предприятия, торговые центры, складские комплексы Талдомского района.",
    objects: "Промышленность, склады, ТЦ",
  },
  "orekhovo-zuevo": {
    district: "Орехово-Зуевском городском округе",
    lsi: "Монтаж инженерных систем в Орехово-Зуево: вентиляция, кондиционирование, дымоудаление для текстильных и машиностроительных предприятий, торговых и жилых объектов.",
    objects: "Промышленность, ТЦ, ЖК",
  },
  "voskresensk": {
    district: "Воскресенском городском округе",
    lsi: "Freonn — монтаж вентиляции, кондиционирования и отопления в Воскресенске. Работаем с химическими производствами, складами, торговыми центрами и жилыми комплексами.",
    objects: "Химпром, склады, ЖК",
  },
  "kashira": {
    district: "Каширском городском округе",
    lsi: "Монтаж инженерных систем в Кашире: вентиляция, кондиционирование, дымоудаление для промышленных предприятий, логистических терминалов и торговых объектов.",
    objects: "Промышленность, логистика, ТЦ",
  },
  "stupino": {
    district: "Ступинском городском округе",
    lsi: "Freonn выполняет монтаж вентиляции и кондиционирования в Ступино: производственные цеха, склады, торговые центры и жилые комплексы Ступинского округа.",
    objects: "Производства, склады, ЖК",
  },
  "protvino": {
    district: "городском округе Протвино",
    lsi: "Монтаж инженерных систем в Протвино: вентиляция, кондиционирование, отопление для научных институтов, производственных и коммерческих объектов наукограда.",
    objects: "Наука, производства, офисы",
  },
  "shchelkovo": {
    district: "городском округе Щёлково",
    lsi: "Freonn — монтаж вентиляции, кондиционирования и дымоудаления в Щёлково. Работаем с промышленными предприятиями, торговыми центрами и жилыми комплексами Щёлковского округа.",
    objects: "Промышленность, ТЦ, ЖК",
  },
  "krasnoznamensk": {
    district: "городском округе Краснознаменск",
    lsi: "Монтаж инженерных систем в Краснознаменске: вентиляция, кондиционирование, электроснабжение для административных, торговых и жилых объектов закрытого города.",
    objects: "Администрация, торговля, ЖК",
  },
  "shcherbinka": {
    district: "районе Щербинка",
    lsi: "Freonn выполняет монтаж вентиляции и кондиционирования в Щербинке: промышленные предприятия, торговые центры, жилые комплексы южного округа Москвы.",
    objects: "Промышленность, ТЦ, ЖК",
  },
};

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

// Получить описание для города (с fallback)
const getCityData = (city: string, cityName: string) => {
  return cityDescriptions[city] || {
    district: `${cityName}ском районе`,
    lsi: `Freonn выполняет полный комплекс работ по проектированию, монтажу и обслуживанию инженерных систем в ${cityName}е и прилегающем районе. Работаем с промышленными предприятиями, коммерческой недвижимостью и жилыми объектами.`,
    objects: "Промышленные объекты, коммерческая недвижимость",
  };
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

  // AI-генерация уникального LSI-контента для города (с fallback на статику)
  const aiCityContent = useAICityContent(city, cityName, staticCityData);
  const cityData = aiCityContent;

  // AI-генерация мета-тегов (с fallback на статику)
  const aiMeta = useAISEO({
    type: "city",
    fallbackTitle: `Монтаж вентиляции и кондиционирования ${cityIn} — Freonn`,
    fallbackDescription: `Проектирование и монтаж инженерных систем ${cityIn}: вентиляция, кондиционирование, дымоудаление, отопление. Бесплатный выезд инженера, гарантия 1 год.`,
    fallbackKeywords: `монтаж вентиляции ${cityName}, кондиционирование ${cityName}, инженерные системы ${cityName}, дымоудаление ${cityName}, отопление ${cityName}`,
    data: { cityName },
    cacheKey: `city_${city}`,
  });

  useSEO({
    title: aiMeta.title,
    description: aiMeta.description,
    keywords: aiMeta.keywords,
    canonical: `/${city}`,
    omitRegionMeta: true,
    breadcrumbs: [{ name: cityName, url: `/${city}` }],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Монтаж инженерных систем в ${cityName}`,
      description: `Проектирование и монтаж вентиляции, кондиционирования, дымоудаления и отопления ${cityIn}. Бесплатный выезд инженера.`,
      url: `https://freonn.ru/${city}`,
      provider: {
        "@type": "LocalBusiness",
        name: "Freonn",
        url: "https://freonn.ru",
        telephone: "+78001012009",
      },
      areaServed: {
        "@type": getCityAreaType(city),
        name: cityName,
      },
      serviceType: "Монтаж инженерных систем",
      serviceOutput: {
        "@type": "Thing",
        name: "Монтаж инженерных систем",
      },
    },
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

      {/* AI FAQ Section — показывается если AI вернул FAQ */}
      {aiCityContent.faq && aiCityContent.faq.length > 0 && (
        <section className="py-14 bg-[#F7F8FF]">
          <div className="container max-w-3xl">
            <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-8">
              Часто задаваемые вопросы — {cityName}
            </h2>
            <div className="space-y-4">
              {aiCityContent.faq.map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-heading font-semibold text-[#0F1340] text-base mb-2">{item.q}</h3>
                  <p className="text-gray-600 font-body text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
