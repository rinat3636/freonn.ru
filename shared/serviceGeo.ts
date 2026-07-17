/**
 * Данные гео-услуг (Service × City / Region) для ServiceGeoPage и роутера.
 */

export type GeoKey = "moskva" | "moskovskaya-oblast";

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

export function getServiceKeyBySlug(serviceSlug: string): string | undefined {
  return Object.entries(GEO_SERVICES).find(([, service]) => service.slug === serviceSlug)?.[0];
}
