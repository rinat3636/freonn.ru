/*
 * FREONN VACANCIES PAGE — /vakansii
 */
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import { motion } from "framer-motion";
import { MapPin, Clock, Briefcase, ArrowRight, CheckCircle } from "lucide-react";
import { ymGoal } from "@/lib/ym";

const vacancies = [
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

const benefits = [
  "Официальное трудоустройство по ТК РФ",
  "Конкурентная заработная плата",
  "Оплата мобильной связи",
  "Корпоративный транспорт на объекты",
  "Обучение и повышение квалификации",
  "Дружный коллектив профессионалов",
];

const parseSalaryMin = (salary: string): number => {
  const digits = salary.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};

const jobPostings = vacancies.map((v, i) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting" as const,
  "@id": `https://freonn.ru/vakansii#jobposting-${i}`,
  title: v.title,
  description: `${v.title}. ${v.duties.join(" ")}`,
  url: "https://freonn.ru/vakansii",
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
  datePosted: "2026-07-17",
  validThrough: "2026-12-31",
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

export default function VacanciesPage() {

  useSEO({
    title: "Вакансии — работа в инженерной компании Freonn",
    description: "Открытые вакансии в Freonn: монтажники вентиляции, инженеры-проектировщики, менеджеры. Официальное трудоустройство, достойная зарплата, обучение.",
    keywords: "вакансии монтажник вентиляции, работа инженер Москва, вакансии инженерная компания",
    canonical: "/vakansii",
    breadcrumbs: [{ name: "Вакансии", url: "/vakansii" }],
    jsonLd: jobPostings,
  });
  return (
    <PageLayout
      title="Вакансии"
      breadcrumb={[{ label: "Вакансии" }]}
    >
      {/* Intro */}
      <section className="py-14 bg-white">
        <div className="container">
          <div className="max-w-3xl mb-10">
            <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-4">Работайте с профессионалами</h2>
            <p className="text-gray-600 font-body leading-relaxed mb-6">
              Freonn — динамично развивающаяся инженерная компания. Мы ищем профессионалов, которые хотят расти вместе с нами. Если вы любите своё дело и стремитесь к результату — будем рады видеть вас в нашей команде.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle size={15} className="mt-0.5 flex-shrink-0 text-[#2D3092]" />
                  <span className="text-gray-700 font-body text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vacancies list */}
          <div className="space-y-6">
            {vacancies.map((vacancy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white border border-gray-100 hover:border-[#2D3092]/30 hover:shadow-md transition-all rounded-2xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="bg-[#2D3092]/10 text-[#2D3092] text-xs px-2.5 py-1 rounded-full font-body font-medium">
                        {vacancy.department}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400 text-xs font-body">
                        <Clock size={12} /> {vacancy.type}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400 text-xs font-body">
                        <MapPin size={12} /> {vacancy.location}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-[#0F1340] text-lg mb-1">{vacancy.title}</h3>
                    <p className="text-[#B91C1C] font-heading font-semibold text-base mb-4">{vacancy.salary}</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="font-heading font-semibold text-[#0F1340] text-sm mb-2">Требования:</p>
                        <ul className="space-y-1">
                          {vacancy.requirements.map((r, j) => (
                            <li key={j} className="flex items-start gap-2 text-gray-600 text-xs font-body">
                              <span className="text-[#2D3092] mt-0.5">•</span> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-[#0F1340] text-sm mb-2">Обязанности:</p>
                        <ul className="space-y-1">
                          {vacancy.duties.map((d, j) => (
                            <li key={j} className="flex items-start gap-2 text-gray-600 text-xs font-body">
                              <span className="text-[#2D3092] mt-0.5">•</span> {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="lg:ml-4 flex-shrink-0">
                    <a
                      href="/contacts"
                      onClick={() => ymGoal("vacancy_apply_click")}
                      className="btn-dark inline-flex items-center gap-2 whitespace-nowrap"
                    >
                      Откликнуться <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Open application */}
          <div className="mt-10 bg-[#F7F8FF] rounded-2xl p-6 text-center">
            <Briefcase size={32} className="text-[#2D3092] mx-auto mb-3" />
            <h3 className="font-heading font-bold text-[#0F1340] text-lg mb-2">Не нашли подходящую вакансию?</h3>
            <p className="text-gray-500 font-body text-sm mb-4">
              Отправьте нам своё резюме — мы рассмотрим вашу кандидатуру и свяжемся при появлении подходящей позиции.
            </p>
            <a href="/contacts" onClick={() => ymGoal("vacancy_resume_click")} className="btn-dark inline-flex items-center gap-2">
              Отправить резюме <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      <ContactSection />
    </PageLayout>
  );
}
