export interface CaseStudy {
  slug: string;
  title: string;
  city: string;
  citySlug: string;
  services: string[];
  area: string;
  summary: string;
  body: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "aero-city-moskva",
    title: "БЦ Aero City, Москва",
    city: "Москва",
    citySlug: "moskva",
    services: ["ventilyaciya", "kondicionirovanie"],
    area: "12 400 м²",
    summary: "Монтаж вентиляции и кондиционирования для коммерческого объекта в Москве.",
    body: [
      "Проект включал приточно-вытяжные системы, подбор оборудования под нагрузки офисных и торговых зон.",
      "Выполнены пусконаладочные работы и передача исполнительной документации.",
    ],
  },
  {
    slug: "logistika-himki",
    title: "Логистический комплекс, Химки",
    city: "Химки",
    citySlug: "khimki",
    services: ["ventilyaciya", "kondicionirovanie"],
    area: "12 000 м²",
    summary: "Приточно-вытяжная вентиляция и кондиционирование склада в Химкинском районе.",
    body: [
      "Объект с высокими потолками и зонированием по температурным режимам.",
      "Смонтированы системы с учётом требований пожарной безопасности.",
    ],
  },
  {
    slug: "proizvodstvo-podolsk",
    title: "Производственный цех, Подольск",
    city: "Подольск",
    citySlug: "podolsk",
    services: ["ventilyaciya", "dymoudalenie"],
    area: "8 500 м²",
    summary: "Вентиляция и дымоудаление для машиностроительного предприятия.",
    body: [
      "Учтены технологические выбросы и требования к кратности воздухообмена.",
      "Система сдана с актами и паспортами оборудования.",
    ],
  },
  {
    slug: "tc-krasnogorsk",
    title: "Торговый центр, Красногорск",
    city: "Красногорск",
    citySlug: "krasnogorsk",
    services: ["kondicionirovanie", "ventilyaciya"],
    area: "15 000 м²",
    summary: "Кондиционирование и вентиляция торгового комплекса.",
    body: [
      "Многозонное управление климатом, интеграция с диспетчеризацией объекта.",
    ],
  },
  {
    slug: "shkola-odintsovo",
    title: "Школа, Одинцово",
    city: "Одинцово",
    citySlug: "odintsovo",
    services: ["ventilyaciya", "dymoudalenie"],
    area: "6 200 м²",
    summary: "Вентиляция и противодымная защита образовательного учреждения.",
    body: [
      "Соблюдены нормы СанПиН по качеству воздуха и шуму оборудования.",
    ],
  },
  {
    slug: "servernaya-moskva",
    title: "Серверная комната, Москва",
    city: "Москва",
    citySlug: "moskva",
    services: ["kondicionirovanie"],
    area: "320 м²",
    summary: "Прецизионное кондиционирование серверной с резервированием.",
    body: [
      "Подобрано оборудование с мониторингом температуры и влажности 24/7.",
    ],
  },
  {
    slug: "sklad-domodedovo",
    title: "Склад, Домодедово",
    city: "Домодедово",
    citySlug: "domodedovo",
    services: ["ventilyaciya"],
    area: "9 800 м²",
    summary: "Промышленная вентиляция складского комплекса.",
    body: [
      "Расчёт воздухообмена по зонам хранения и отгрузки.",
    ],
  },
  {
    slug: "medcentr-mytishchi",
    title: "Медицинский центр, Мытищи",
    city: "Мытищи",
    citySlug: "mytishchi",
    services: ["ventilyaciya", "kondicionirovanie"],
    area: "4 100 м²",
    summary: "Вентиляция и кондиционирование клиники с HEPA-фильтрацией.",
    body: [
      "Зонирование давления в процедурных и палатах.",
    ],
  },
  {
    slug: "zavod-balashikha",
    title: "Производство, Балашиха",
    city: "Балашиха",
    citySlug: "balashikha",
    services: ["ventilyaciya", "otoplenie"],
    area: "11 000 м²",
    summary: "Вентиляция и воздушное отопление производственного цеха.",
    body: [
      "Промышленное исполнение с учётом тепловых нагрузок оборудования.",
    ],
  },
  {
    slug: "restoran-korolev",
    title: "Ресторан, Королёв",
    city: "Королёв",
    citySlug: "korolev",
    services: ["ventilyaciya"],
    area: "850 м²",
    summary: "Кухонная вытяжка и приток для ресторана.",
    body: [
      "Соответствие СанПиН, запахоулавливание, бесшумная работа в зале.",
    ],
  },
  {
    slug: "parking-lyubertsy",
    title: "Паркинг, Люберцы",
    city: "Люберцы",
    citySlug: "lyubertsy",
    services: ["dymoudalenie", "ventilyaciya"],
    area: "3 600 м²",
    summary: "Дымоудаление и вентиляция подземного паркинга.",
    body: [
      "Датчики CO, автоматика по нормам МЧС.",
    ],
  },
  {
    slug: "sport-zhukovsky",
    title: "Спортобъект, Жуковский",
    city: "Жуковский",
    citySlug: "zhukovsky",
    services: ["ventilyaciya", "kondicionirovanie"],
    area: "5 400 м²",
    summary: "Климатические системы для спортивного комплекса.",
    body: [
      "Расчёт нагрузок с учётом одновременного присутствия посетителей.",
    ],
  },
  {
    slug: "ofis-ramenskoe",
    title: "Бизнес-центр, Раменское",
    city: "Раменское",
    citySlug: "ramenskoe",
    services: ["kondicionirovanie"],
    area: "7 200 м²",
    summary: "VRF-системы для офисного здания.",
    body: [
      "Поэтажное зонирование, тихая работа, энергоэффективный режим.",
    ],
  },
  {
    slug: "holod-zelenograd",
    title: "Холодоснабжение, Зеленоград",
    city: "Зеленоград",
    citySlug: "zelenograd",
    services: ["holodosnabzhenie"],
    area: "2 100 м²",
    summary: "Чиллерная для технологического охлаждения.",
    body: [
      "Подбор мощности под сменные технологические режимы.",
    ],
  },
  {
    slug: "elektro-elektrostal",
    title: "Электроснабжение, Электросталь",
    city: "Электросталь",
    citySlug: "elektrostal",
    services: ["elektrosnabzhenie"],
    area: "6 000 м²",
    summary: "Электромонтаж и освещение производственного объекта.",
    body: [
      "Щитовые, кабельные линии, система аварийного освещения.",
    ],
  },
];

export const CASE_STUDY_BY_SLUG = Object.fromEntries(CASE_STUDIES.map((c) => [c.slug, c]));
