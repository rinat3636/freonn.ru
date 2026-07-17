import { ymGoal } from "@/lib/ym";
/*
 * FREONN PRICING SERVICE PAGE — /ceny/:service
 * Detailed pricing tables for each service type
 */
import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";

interface PriceRow {
  name: string;
  unit: string;
  price: string;
  note?: string;
}

interface PriceSection {
  title: string;
  rows: PriceRow[];
}

interface ServicePricingData {
  title: string;
  subtitle: string;
  description: string;
  breadcrumb: { label: string; href?: string }[];
  sections: PriceSection[];
  includes: string[];
  note: string;
}

const pricingData: Record<string, ServicePricingData> = {
  ventilyaciya: {
    title: "Цены на монтаж вентиляции",
    subtitle: "Стоимость монтажа систем вентиляции",
    description: "Стоимость монтажа систем вентиляции зависит от типа объекта, площади, сложности системы и применяемого оборудования. Цены указаны ориентировочно — точный расчёт выполняется после обследования объекта.",
    breadcrumb: [{ label: "Цены", href: "/ceny" }, { label: "Вентиляция" }],
    sections: [
      {
        title: "Монтаж воздуховодов",
        rows: [
          { name: "Воздуховод прямоугольный до 200×200 мм", unit: "п.м.", price: "от 350 ₽" },
          { name: "Воздуховод прямоугольный 200×200 — 500×500 мм", unit: "п.м.", price: "от 550 ₽" },
          { name: "Воздуховод прямоугольный свыше 500×500 мм", unit: "п.м.", price: "от 850 ₽" },
          { name: "Воздуховод круглый Ø100–200 мм", unit: "п.м.", price: "от 280 ₽" },
          { name: "Воздуховод круглый Ø250–400 мм", unit: "п.м.", price: "от 420 ₽" },
          { name: "Воздуховод гибкий (гофра)", unit: "п.м.", price: "от 180 ₽" },
        ],
      },
      {
        title: "Монтаж оборудования",
        rows: [
          { name: "Приточно-вытяжная установка до 1000 м³/ч", unit: "шт.", price: "от 12 000 ₽" },
          { name: "Приточно-вытяжная установка 1000–5000 м³/ч", unit: "шт.", price: "от 25 000 ₽" },
          { name: "Приточно-вытяжная установка свыше 5000 м³/ч", unit: "шт.", price: "от 45 000 ₽" },
          { name: "Вентилятор канальный", unit: "шт.", price: "от 3 500 ₽" },
          { name: "Вентилятор крышный", unit: "шт.", price: "от 8 000 ₽" },
          { name: "Клапан воздушный регулирующий", unit: "шт.", price: "от 1 500 ₽" },
          { name: "Диффузор/решётка вентиляционная", unit: "шт.", price: "от 600 ₽" },
        ],
      },
      {
        title: "Дополнительные работы",
        rows: [
          { name: "Пусконаладочные работы", unit: "система", price: "от 8 000 ₽" },
          { name: "Балансировка системы вентиляции", unit: "система", price: "от 5 000 ₽" },
          { name: "Проектирование системы вентиляции", unit: "м²", price: "от 150 ₽" },
          { name: "Техническое обслуживание (1 раз)", unit: "система", price: "от 6 000 ₽" },
        ],
      },
    ],
    includes: [
      "Выезд инженера и обследование объекта",
      "Разработка схемы системы",
      "Поставка материалов и оборудования",
      "Монтажные работы",
      "Пусконаладочные работы",
      "Исполнительная документация",
    ],
    note: "Цены указаны без учёта стоимости оборудования и материалов. Окончательная стоимость определяется после обследования объекта и согласования проекта.",
  },
  kondicionirovanie: {
    title: "Цены на монтаж кондиционирования",
    subtitle: "Стоимость монтажа систем кондиционирования",
    description: "Стоимость монтажа кондиционирования зависит от типа системы (сплит, мульти-сплит, VRF/VRV, чиллер+фанкойл), мощности оборудования и сложности монтажа.",
    breadcrumb: [{ label: "Цены", href: "/ceny" }, { label: "Кондиционирование" }],
    sections: [
      {
        title: "Монтаж сплит-систем",
        rows: [
          { name: "Сплит-система до 2,5 кВт (9 BTU)", unit: "шт.", price: "от 5 000 ₽" },
          { name: "Сплит-система 3,5–5 кВт (12–18 BTU)", unit: "шт.", price: "от 6 500 ₽" },
          { name: "Сплит-система 7–9 кВт (24–30 BTU)", unit: "шт.", price: "от 8 500 ₽" },
          { name: "Кассетный кондиционер", unit: "шт.", price: "от 12 000 ₽" },
          { name: "Канальный кондиционер", unit: "шт.", price: "от 15 000 ₽" },
          { name: "Напольно-потолочный кондиционер", unit: "шт.", price: "от 10 000 ₽" },
        ],
      },
      {
        title: "Монтаж VRF/VRV систем",
        rows: [
          { name: "Наружный блок VRF до 10 кВт", unit: "шт.", price: "от 18 000 ₽" },
          { name: "Наружный блок VRF 10–30 кВт", unit: "шт.", price: "от 35 000 ₽" },
          { name: "Наружный блок VRF свыше 30 кВт", unit: "шт.", price: "от 55 000 ₽" },
          { name: "Внутренний блок VRF (любой тип)", unit: "шт.", price: "от 8 000 ₽" },
          { name: "Медный трубопровод (фреонопровод)", unit: "п.м.", price: "от 450 ₽" },
        ],
      },
      {
        title: "Монтаж чиллеров и фанкойлов",
        rows: [
          { name: "Чиллер до 50 кВт", unit: "шт.", price: "от 45 000 ₽" },
          { name: "Чиллер 50–200 кВт", unit: "шт.", price: "от 85 000 ₽" },
          { name: "Фанкойл настенный/кассетный", unit: "шт.", price: "от 6 500 ₽" },
          { name: "Трубопровод холодоносителя", unit: "п.м.", price: "от 380 ₽" },
        ],
      },
    ],
    includes: [
      "Выезд инженера и обследование объекта",
      "Прокладка межблочных коммуникаций",
      "Монтаж внутренних и наружных блоков",
      "Заправка фреоном (при необходимости)",
      "Пусконаладочные работы",
      "Гарантия 1 год",
    ],
    note: "Цены указаны на монтажные работы без учёта стоимости оборудования. Дополнительно оплачивается кабель, трубки, теплоизоляция.",
  },
  dymoudalenie: {
    title: "Цены на монтаж дымоудаления",
    subtitle: "Стоимость монтажа систем противодымной вентиляции",
    description: "Монтаж систем дымоудаления выполняется в соответствии с СП 7.13130 и требованиями МЧС. Стоимость зависит от площади объекта, типа системы и применяемого оборудования.",
    breadcrumb: [{ label: "Цены", href: "/ceny" }, { label: "Дымоудаление" }],
    sections: [
      {
        title: "Монтаж воздуховодов дымоудаления",
        rows: [
          { name: "Воздуховод дымоудаления до 500×500 мм", unit: "п.м.", price: "от 650 ₽" },
          { name: "Воздуховод дымоудаления 500×500 — 1000×1000 мм", unit: "п.м.", price: "от 1 100 ₽" },
          { name: "Воздуховод дымоудаления свыше 1000×1000 мм", unit: "п.м.", price: "от 1 800 ₽" },
          { name: "Огнезащитная обработка воздуховода", unit: "м²", price: "от 350 ₽" },
        ],
      },
      {
        title: "Монтаж оборудования",
        rows: [
          { name: "Вентилятор дымоудаления до 10 000 м³/ч", unit: "шт.", price: "от 18 000 ₽" },
          { name: "Вентилятор дымоудаления 10 000–30 000 м³/ч", unit: "шт.", price: "от 35 000 ₽" },
          { name: "Клапан дымоудаления (нормально закрытый)", unit: "шт.", price: "от 4 500 ₽" },
          { name: "Огнезадерживающий клапан", unit: "шт.", price: "от 3 500 ₽" },
          { name: "Клапан подпора воздуха", unit: "шт.", price: "от 4 000 ₽" },
          { name: "Шкаф управления системой дымоудаления", unit: "шт.", price: "от 25 000 ₽" },
        ],
      },
      {
        title: "Дополнительные работы",
        rows: [
          { name: "Пусконаладочные работы", unit: "система", price: "от 15 000 ₽" },
          { name: "Сдача системы пожарному надзору", unit: "система", price: "от 20 000 ₽" },
          { name: "Проектирование системы дымоудаления", unit: "м²", price: "от 200 ₽" },
        ],
      },
    ],
    includes: [
      "Монтаж в соответствии с СП 7.13130",
      "Огнезащитная обработка воздуховодов",
      "Монтаж клапанов и вентиляторов",
      "Прокладка кабелей управления",
      "Пусконаладочные работы",
      "Сдача системы пожарному надзору",
    ],
    note: "Для систем дымоудаления обязательно наличие лицензии МЧС у исполнителя. Freonn имеет все необходимые допуски.",
  },
  peskostruj: {
    title: "Цены на пескоструйную обработку",
    subtitle: "Стоимость пескоструйной обработки металлоконструкций",
    description: "Пескоструйная обработка металлоконструкций для подготовки поверхности под окраску или антикоррозионную защиту. Работаем с объектами любого размера.",
    breadcrumb: [{ label: "Цены", href: "/ceny" }, { label: "Пескоструй" }],
    sections: [
      {
        title: "Пескоструйная обработка",
        rows: [
          { name: "Обработка металлоконструкций Sa 2 (лёгкая)", unit: "м²", price: "от 180 ₽" },
          { name: "Обработка металлоконструкций Sa 2.5 (тщательная)", unit: "м²", price: "от 280 ₽" },
          { name: "Обработка металлоконструкций Sa 3 (до металлического блеска)", unit: "м²", price: "от 420 ₽" },
          { name: "Обработка труб и трубопроводов", unit: "п.м.", price: "от 350 ₽" },
          { name: "Обработка воздуховодов", unit: "м²", price: "от 250 ₽" },
        ],
      },
      {
        title: "Дополнительные услуги",
        rows: [
          { name: "Грунтование после пескоструя (1 слой)", unit: "м²", price: "от 120 ₽" },
          { name: "Антикоррозионная обработка", unit: "м²", price: "от 200 ₽" },
          { name: "Доставка оборудования на объект", unit: "выезд", price: "от 5 000 ₽" },
          { name: "Работа в стеснённых условиях (надбавка)", unit: "%", price: "+30%" },
        ],
      },
    ],
    includes: [
      "Выезд на объект и оценка объёма работ",
      "Подготовка поверхности",
      "Пескоструйная обработка до нужной степени",
      "Уборка отработанного абразива",
      "Акт выполненных работ",
    ],
    note: "Минимальный объём заказа — 50 м². Для небольших объёмов применяется минимальная стоимость выезда.",
  },
  kompleks: {
    title: "Цены на комплексный монтаж инженерных систем",
    subtitle: "Комплексный монтаж инженерных систем",
    description: "Комплексный монтаж вентиляции, кондиционирования, отопления, водоснабжения, дымоудаления и электроснабжения. Расчёт стоимости под ключ, скидка до 15% при заказе нескольких систем.",
    breadcrumb: [{ label: "Цены", href: "/ceny" }, { label: "Комплекс" }],
    sections: [
      {
        title: "Комплексный монтаж по типу объекта",
        rows: [
          { name: "Офис / торговое помещение до 500 м²", unit: "м²", price: "от 2 500 ₽" },
          { name: "Офис / торговое помещение 500–2000 м²", unit: "м²", price: "от 1 800 ₽" },
          { name: "Производственный цех до 2000 м²", unit: "м²", price: "от 1 500 ₽" },
          { name: "Производственный цех 2000–10 000 м²", unit: "м²", price: "от 1 200 ₽" },
          { name: "Склад до 5000 м²", unit: "м²", price: "от 900 ₽" },
          { name: "Жилой дом / коттедж", unit: "м²", price: "от 3 500 ₽" },
        ],
      },
      {
        title: "Проектирование",
        rows: [
          { name: "Проект ОВ (отопление, вентиляция)", unit: "м²", price: "от 150 ₽" },
          { name: "Проект ВК (водоснабжение, канализация)", unit: "м²", price: "от 120 ₽" },
          { name: "Проект ЭО (электроснабжение, освещение)", unit: "м²", price: "от 130 ₽" },
          { name: "Комплексный проект всех разделов", unit: "м²", price: "от 350 ₽" },
        ],
      },
      {
        title: "Сервисное обслуживание",
        rows: [
          { name: "ТО систем вентиляции (1 раз в год)", unit: "система", price: "от 8 000 ₽" },
          { name: "ТО систем кондиционирования (1 раз в год)", unit: "система", price: "от 5 000 ₽" },
          { name: "Комплексное ТО всех систем", unit: "объект", price: "от 25 000 ₽" },
          { name: "Договор на сервисное обслуживание (год)", unit: "объект", price: "от 60 000 ₽" },
        ],
      },
    ],
    includes: [
      "Обследование объекта и техническое задание",
      "Разработка проектной документации",
      "Поставка оборудования и материалов",
      "Монтаж всех инженерных систем",
      "Пусконаладочные работы",
      "Сдача объекта с полным пакетом документов",
    ],
    note: "При комплексном заказе монтажа нескольких систем одновременно действует скидка до 15% на монтажные работы.",
  },
  montazh: {
    title: "Цены на монтажные работы по инженерным системам",
    subtitle: "Монтаж инженерных систем по готовому проекту",
    description: "Стоимость монтажных работ по вентиляции, кондиционированию, отоплению, водоснабжению, дымоудалению и электроснабжению. Работаем по проектам заказчика, гарантия до 3 лет.",
    breadcrumb: [{ label: "Цены", href: "/ceny" }, { label: "Монтаж" }],
    sections: [
      {
        title: "Монтажные работы по типу системы",
        rows: [
          { name: "Монтаж системы вентиляции", unit: "шт.", price: "от 25 000 ₽" },
          { name: "Монтаж системы кондиционирования", unit: "шт.", price: "от 35 000 ₽" },
          { name: "Монтаж системы отопления", unit: "шт.", price: "от 30 000 ₽" },
          { name: "Монтаж водоснабжения и канализации", unit: "шт.", price: "от 20 000 ₽" },
          { name: "Монтаж электроснабжения", unit: "шт.", price: "от 25 000 ₽" },
          { name: "Монтаж системы дымоудаления", unit: "шт.", price: "от 50 000 ₽" },
        ],
      },
      {
        title: "Дополнительные работы",
        rows: [
          { name: "Пусконаладочные работы", unit: "система", price: "от 8 000 ₽" },
          { name: "Балансировка и настройка", unit: "система", price: "от 5 000 ₽" },
          { name: "Исполнительная документация", unit: "объект", price: "от 10 000 ₽" },
          { name: "Выезд инженера-наладчика", unit: "выезд", price: "от 5 000 ₽" },
        ],
      },
    ],
    includes: [
      "Выезд инженера и обследование объекта",
      "Монтаж согласно проектной документации",
      "Пусконаладочные работы",
      "Тестирование и сдача системы",
      "Гарантия на монтажные работы",
      "Исполнительная документация",
    ],
    note: "Стоимость указана ориентировочно. Точный расчёт выполняется после изучения проекта и объёма работ.",
  },
  "kompleksnaya-realizaciya": {
    title: "Цены на комплексную реализацию инженерных систем под ключ",
    subtitle: "Проектирование, поставка, монтаж и сдача объекта",
    description: "Комплексная реализация инженерных систем под ключ: от проектирования и поставки оборудования до монтажа, пусконаладки и сдачи объекта. Скидка до 15%.",
    breadcrumb: [{ label: "Цены", href: "/ceny" }, { label: "Комплексная реализация" }],
    sections: [
      {
        title: "Этапы комплексной реализации",
        rows: [
          { name: "Проектирование ОВ/ВК/ЭО", unit: "м²", price: "от 120 ₽" },
          { name: "Поставка оборудования", unit: "объект", price: "по запросу" },
          { name: "Комплексный монтаж", unit: "м²", price: "от 1 200 ₽" },
          { name: "Пусконаладочные работы", unit: "система", price: "от 8 000 ₽" },
          { name: "Сдача объекта с документацией", unit: "объект", price: "от 25 000 ₽" },
        ],
      },
      {
        title: "Сервисное обслуживание после сдачи",
        rows: [
          { name: "ТО систем вентиляции (1 раз в год)", unit: "система", price: "от 8 000 ₽" },
          { name: "ТО систем кондиционирования (1 раз в год)", unit: "система", price: "от 5 000 ₽" },
          { name: "Комплексное ТО всех систем", unit: "объект", price: "от 25 000 ₽" },
        ],
      },
    ],
    includes: [
      "Обследование объекта и техническое задание",
      "Разработка проектной документации",
      "Поставка оборудования и материалов",
      "Монтаж всех инженерных систем",
      "Пусконаладочные работы",
      "Сдача объекта с полным пакетом документов",
    ],
    note: "При заказе проектирования, поставки и монтажа одновременно действует комплексная скидка до 15%.",
  },
};

interface PricingServicePageProps {
  service: string;
}

export default function PricingServicePage({ service }: PricingServicePageProps) {
  const data = pricingData[service] || pricingData["kompleks"];

  useSEO({
    title: `${data.title} — Freonn`,
    description: data.description.slice(0, 160),
    keywords: `цены ${data.title.toLowerCase()}, стоимость монтажа, прайс-лист, Freonn`,
    canonical: `/ceny/${service}`,
    breadcrumbs: [
      { name: "Цены", url: "/ceny" },
      { name: data.title, url: `/ceny/${service}` },
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `https://freonn.ru/ceny/${service}#webpage`,
      name: `${data.title} — Freonn`,
      description: data.description.slice(0, 160),
      url: `https://freonn.ru/ceny/${service}`,
      isPartOf: { "@id": "https://freonn.ru/#website" },
      provider: { "@id": "https://freonn.ru/#organization" },
    },
  });

  return (
    <PageLayout title={data.title} breadcrumb={data.breadcrumb}>
      {/* Intro */}
      <section className="py-14 bg-white">
        <div className="container">
          <div className="max-w-3xl mb-10">
            <p className="text-gray-600 font-body leading-relaxed">{data.description}</p>
          </div>

          {/* Price tables */}
          <div className="space-y-8">
            {data.sections.map((section, si) => (
              <motion.div
                key={si}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: si * 0.1 }}
              >
                <h3 className="font-heading font-bold text-[#0F1340] text-lg mb-4">{section.title}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#0F1340] text-white">
                        <th className="text-left font-heading font-semibold text-sm px-4 py-3 rounded-tl-xl">Наименование работ</th>
                        <th className="text-center font-heading font-semibold text-sm px-4 py-3 w-24">Ед.</th>
                        <th className="text-right font-heading font-semibold text-sm px-4 py-3 rounded-tr-xl w-36">Стоимость</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row, ri) => (
                        <tr key={ri} className={`border-b border-gray-100 ${ri % 2 === 0 ? "bg-white" : "bg-[#F7F8FF]"}`}>
                          <td className="font-body text-sm text-gray-700 px-4 py-3">{row.name}</td>
                          <td className="font-body text-sm text-gray-500 px-4 py-3 text-center">{row.unit}</td>
                          <td className="font-heading font-semibold text-[#B91C1C] text-sm px-4 py-3 text-right whitespace-nowrap">{row.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ))}
          </div>

          {/* What's included */}
          <div className="mt-10 grid lg:grid-cols-2 gap-6">
            <div className="bg-[#F7F8FF] rounded-2xl p-6">
              <h3 className="font-heading font-bold text-[#0F1340] text-base mb-4">Что входит в стоимость</h3>
              <div className="space-y-2">
                {data.includes.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="mt-0.5 flex-shrink-0 text-[#2D3092]" />
                    <span className="text-gray-700 font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#B91C1C]/5 border border-[#B91C1C]/20 rounded-2xl p-6">
              <h3 className="font-heading font-bold text-[#0F1340] text-base mb-3">Важно знать</h3>
              <p className="text-gray-600 font-body text-sm leading-relaxed mb-4">{data.note}</p>
              <div className="flex flex-col gap-3">
                <a href="/contacts" className="btn-dark inline-flex items-center gap-2 justify-center">
                  Получить точный расчёт <ArrowRight size={14} />
                </a>
                <a href="tel:88001012009" className="btn-dark inline-flex items-center gap-2 justify-center">
                  <Phone size={14} /> 8(800)101-2009
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </PageLayout>
  );
}
