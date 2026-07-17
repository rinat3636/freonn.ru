export interface Vacancy {
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  requirements: string[];
  duties: string[];
}

export const vacancies: Vacancy[] = [
  {
    title: "Инженер-проектировщик ОВиК",
    department: "Проектирование",
    type: "Полная занятость",
    location: "Москва / Удалённо",
    salary: "от 120 000 ₽",
    requirements: [
      "Высшее техническое образование (ТГВ, ОВиК)",
      "Опыт проектирования от 3 лет",
      "Знание AutoCAD, Revit, MagiCAD",
      "Знание СП 60.13330, ГОСТ, СНиП",
    ],
    duties: [
      "Разработка проектной документации разделов ОВ, ВК",
      "Расчёт систем вентиляции и кондиционирования",
      "Согласование проектов с заказчиком",
      "Авторский надзор за монтажом",
    ],
  },
  {
    title: "Монтажник систем вентиляции и кондиционирования",
    department: "Монтаж",
    type: "Полная занятость",
    location: "Москва и МО",
    salary: "от 80 000 ₽",
    requirements: [
      "Опыт монтажа вентиляции от 2 лет",
      "Умение читать проектную документацию",
      "Допуск к работам на высоте",
      "Наличие инструмента приветствуется",
    ],
    duties: [
      "Монтаж воздуховодов и вентиляционного оборудования",
      "Установка приточно-вытяжных установок",
      "Монтаж систем кондиционирования",
      "Участие в пусконаладочных работах",
    ],
  },
  {
    title: "Монтажник систем дымоудаления",
    department: "Монтаж",
    type: "Полная занятость",
    location: "Москва и МО",
    salary: "от 90 000 ₽",
    requirements: [
      "Опыт монтажа дымоудаления от 2 лет",
      "Знание требований СП 7.13130",
      "Допуск к работам на высоте",
      "Готовность к командировкам",
    ],
    duties: [
      "Монтаж систем дымоудаления и противодымной вентиляции",
      "Установка клапанов и огнезадерживающих клапанов",
      "Прокладка кабелей управления",
      "Участие в сдаче объектов пожарному надзору",
    ],
  },
  {
    title: "Менеджер по продажам инженерных систем",
    department: "Продажи",
    type: "Полная занятость",
    location: "Москва",
    salary: "от 70 000 ₽ + %",
    requirements: [
      "Опыт продаж B2B от 2 лет",
      "Понимание инженерных систем (желательно)",
      "Навыки работы с CRM",
      "Коммуникабельность и настойчивость",
    ],
    duties: [
      "Поиск и привлечение новых клиентов",
      "Ведение переговоров и заключение договоров",
      "Подготовка коммерческих предложений",
      "Сопровождение сделок до подписания актов",
    ],
  },
  {
    title: "Руководитель монтажного участка",
    department: "Монтаж",
    type: "Полная занятость",
    location: "Москва и МО",
    salary: "от 150 000 ₽",
    requirements: [
      "Высшее техническое образование",
      "Опыт руководства монтажными бригадами от 5 лет",
      "Знание нормативной базы по ОВиК",
      "Опыт сдачи объектов надзорным органам",
    ],
    duties: [
      "Организация и контроль монтажных работ",
      "Управление бригадами монтажников",
      "Контроль качества и сроков выполнения работ",
      "Взаимодействие с заказчиком и проектировщиками",
    ],
  },
];

function parseSalaryMin(salary: string): number {
  const digits = salary.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function buildJobPostingsJsonLd(
  pageUrl: string,
  datePosted = "2026-07-17",
  validThrough = "2026-12-31"
): object[] {
  return vacancies.map((v, i) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": `${pageUrl}#jobposting-${i}`,
    title: v.title,
    description: `${v.title}. ${v.duties.join(" ")}`,
    url: pageUrl,
    hiringOrganization: { "@id": "https://freonn.ru/#organization" },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ул. Ленина, д. 2Б",
        addressLocality: "Дзержинский",
        addressRegion: "Московская обл.",
        postalCode: "143500",
        addressCountry: "RU",
      },
    },
    employmentType: "FULL_TIME",
    datePosted,
    validThrough,
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "RUB",
      value: {
        "@type": "QuantitativeValue",
        minValue: parseSalaryMin(v.salary),
        unitText: "MONTH",
      },
    },
  }));
}
