import { ymGoal } from "@/lib/ym";
/*
 * FREONN OBJECT CATEGORY PAGE — /promyshlennye-obekty, /kommercheskie-obekty, /premium-obekty
 */
import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";
import { ArrowRight, CheckCircle, Building2, Factory, Star } from "lucide-react";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663524928365/d5oRPUYjSRzESZKpUgG9pW";

const categoryData = {
  "promyshlennye-obekty": {
    title: "Промышленные объекты",
    subtitle: "Инженерные системы для производства и промышленности",
    description: "Freonn специализируется на проектировании и монтаже инженерных систем для промышленных предприятий: производственные цеха, склады, заводы, фабрики. Работаем с объектами от 1000 м², обеспечиваем соответствие всем требованиям промышленной безопасности.",
    icon: Factory,
    color: "#2D3092",
    breadcrumb: [{ label: "Объекты", href: "/obekty" }, { label: "Промышленные" }],
    projects: [
      {
        title: "Монтаж инженерных систем в производственном цеху Arida Home",
        area: "2 800 м²",
        location: "Московская область",
        systems: ["Вентиляция", "Кондиционирование"],
        img: `${CDN}/ru-hvac-production_2fc3fdd7.jpg`,
      },
      {
        title: "Кондиционирование на производстве Квант",
        area: "1 500 м²",
        location: "Москва",
        systems: ["Кондиционирование", "Вентиляция", "Пусконаладка"],
        img: `${CDN}/proj-industrial-vent_1f44b222.jpg`,
      },
      {
        title: "Монтаж приточно-вытяжной вентиляции в цеху ООО «Ресна»",
        area: "3 200 м²",
        location: "Московская область",
        systems: ["Вентиляция", "Циклон"],
        img: `${CDN}/ru-industrial-ventilation_4939c0aa.jpg`,
      },
      {
        title: "Монтаж систем вентиляции и кондиционирования в корпусе ГК «Электронинвест»",
        area: "4 500 м²",
        location: "Москва",
        systems: ["Вентиляция", "Кондиционирование"],
        img: `${CDN}/freonn-industrial-hvac-CUToKRXqhd5NqVLbfLUTwL.webp`,
      },
      {
        title: "Пескоструйная обработка металлоконструкций на заводе",
        area: "800 м²",
        location: "Московская область",
        systems: ["Пескоструй", "Вентиляция"],
        img: `${CDN}/freonn-sandblasting-real_78a6f8d6.jpg`,
      },
      {
        title: "Вентиляция и дымоудаление на складском комплексе",
        area: "6 000 м²",
        location: "Подмосковье",
        systems: ["Вентиляция", "Дымоудаление"],
        img: `${CDN}/freonn-ventilation-unit-5ebe3bmzqsCGdGpvbDz2zo.webp`,
      },
    ],
    features: [
      "Проектирование по ГОСТ и СП",
      "Работа с объектами от 1000 м²",
      "Соответствие требованиям промбезопасности",
      "Лицензия МЧС на системы дымоудаления",
      "Полный пакет исполнительной документации",
      "Гарантия 1 год на монтажные работы",
    ],
  },
  "kommercheskie-obekty": {
    title: "Коммерческие объекты",
    subtitle: "Инженерные системы для бизнеса и коммерции",
    description: "Проектируем и монтируем инженерные системы для торговых центров, бизнес-центров, ресторанов, отелей, фитнес-клубов и других коммерческих объектов. Создаём комфортный микроклимат, который повышает лояльность клиентов и продуктивность сотрудников.",
    icon: Building2,
    color: "#B91C1C",
    breadcrumb: [{ label: "Объекты", href: "/obekty" }, { label: "Коммерческие" }],
    projects: [
      {
        title: "Монтаж вентиляции и кондиционирования в БЦ «Aero City»",
        area: "5 200 м²",
        location: "Москва",
        systems: ["Вентиляция", "Кондиционирование"],
        img: `${CDN}/freonn-commercial-ac-25u7KoLKzpAUCxypUsYPv5.webp`,
      },
      {
        title: "Монтаж инженерных систем в отеле Доброград",
        area: "8 000 м²",
        location: "Владимирская область",
        systems: ["Вентиляция", "Кондиционирование", "Дымоудаление"],
        img: `${CDN}/proj-ductwork_f5dd8a8d.jpg`,
      },
      {
        title: "Установка системы вентиляции в школе танцев «Lotos»",
        area: "600 м²",
        location: "Москва",
        systems: ["Вентиляция"],
        img: `${CDN}/equip-ventilation_25987b56.jpg`,
      },
      {
        title: "Вентиляция, кондиционирование и отопление для фитнес-центра Vysota",
        area: "3 500 м²",
        location: "Москва",
        systems: ["Вентиляция", "Кондиционирование", "Отопление"],
        img: `${CDN}/freonn-commercial-ac-25u7KoLKzpAUCxypUsYPv5.webp`,
      },
      {
        title: "Монтаж короба для системы кондиционирования в Третьяковской галерее",
        area: "1 200 м²",
        location: "Москва",
        systems: ["Кондиционирование"],
        img: `${CDN}/proj-fancoil_49fccb2c.jpg`,
      },
      {
        title: "Монтаж вентиляции и кондиционирования в ресторанном комплексе",
        area: "1 800 м²",
        location: "Москва",
        systems: ["Вентиляция", "Кондиционирование", "Автоматизация"],
        img: `${CDN}/freonn-chiller-E9FzvTdbvYDJ9o4F7zSQNh.webp`,
      },
    ],
    features: [
      "Опыт работы с ТЦ, БЦ, отелями, ресторанами",
      "Минимальный простой бизнеса при монтаже",
      "Работа в ночное время по согласованию",
      "Системы автоматизации и диспетчеризации",
      "Сервисное обслуживание после сдачи",
      "Гарантия 1 год на монтажные работы",
    ],
  },
  "premium-obekty": {
    title: "Премиум объекты",
    subtitle: "Инженерные системы для элитной недвижимости",
    description: "Создаём инженерные системы для элитных жилых комплексов, загородных домов, пентхаусов и премиум-объектов. Используем оборудование ведущих мировых брендов, обеспечиваем бесшумную работу и максимальный комфорт.",
    icon: Star,
    color: "#2D3092",
    breadcrumb: [{ label: "Объекты", href: "/obekty" }, { label: "Премиум" }],
    projects: [
      {
        title: "Система климат-контроля в элитном ЖК «Садовые Кварталы»",
        area: "450 м²",
        location: "Москва, Хамовники",
        systems: ["VRF-система", "Рекуперация", "Автоматизация"],
        img: `${CDN}/freonn-commercial-ac-25u7KoLKzpAUCxypUsYPv5.webp`,
      },
      {
        title: "Полный инженерный пакет для загородного дома в Рублёвке",
        area: "1 200 м²",
        location: "Рублёво-Успенское шоссе",
        systems: ["Вентиляция", "Кондиционирование", "Отопление", "Водоснабжение"],
        img: `${CDN}/proj-fancoil_49fccb2c.jpg`,
      },
      {
        title: "Скрытая система кондиционирования в пентхаусе",
        area: "380 м²",
        location: "Москва, Пресня",
        systems: ["Канальное кондиционирование", "Рекуперация"],
        img: `${CDN}/equip-ac_decafa77.webp`,
      },
      {
        title: "Система увлажнения и очистки воздуха в апартаментах",
        area: "290 м²",
        location: "Москва, Арбат",
        systems: ["Вентиляция", "Увлажнение", "Очистка воздуха"],
        img: `${CDN}/freonn-ventilation-unit-5ebe3bmzqsCGdGpvbDz2zo.webp`,
      },
      {
        title: "Тёплый пол и радиаторное отопление в таунхаусе",
        area: "520 м²",
        location: "Подмосковье, Барвиха",
        systems: ["Тёплый пол", "Отопление", "Водоснабжение"],
        img: `${CDN}/ru-hvac-production_2fc3fdd7.jpg`,
      },
      {
        title: "Умный дом: интеграция инженерных систем под единое управление",
        area: "780 м²",
        location: "Москва, Остоженка",
        systems: ["Автоматизация", "Вентиляция", "Кондиционирование", "Отопление"],
        img: `${CDN}/freonn-chiller-E9FzvTdbvYDJ9o4F7zSQNh.webp`,
      },
    ],
    features: [
      "Оборудование Daikin, Mitsubishi, Carrier, Zehnder",
      "Бесшумные системы — до 25 дБ",
      "Скрытый монтаж без нарушения интерьера",
      "Системы умного дома и автоматизации",
      "Индивидуальный дизайн-проект",
      "Гарантия 2 года на монтажные работы",
    ],
  },
};

interface ObjectCategoryPageProps {
  category: "promyshlennye-obekty" | "kommercheskie-obekty" | "premium-obekty";
}

export default function ObjectCategoryPage({ category }: ObjectCategoryPageProps) {
  const data = categoryData[category];
  const Icon = data.icon;

  const seoTitles: Record<string, string> = {
    "promyshlennye-obekty": "Инженерные системы для промышленных объектов — Freonn",
    "kommercheskie-obekty": "Инженерные системы для коммерческих объектов — Freonn",
    "premium-obekty": "Инженерные системы для премиум-объектов — Freonn",
  };
  const seoDescs: Record<string, string> = {
    "promyshlennye-obekty": "Проектирование и монтаж инженерных систем для промышленных предприятий: вентиляция, кондиционирование, дымоудаление, отопление. Опыт 15+ лет.",
    "kommercheskie-obekty": "Монтаж вентиляции и кондиционирования в торговых центрах, офисах, ресторанах. Под ключ, гарантия 1 год.",
    "premium-obekty": "Инженерные системы премиум-класса для элитной недвижимости. Индивидуальный подход, скрытый монтаж, лучшее оборудование.",
  };
  useSEO({
    title: seoTitles[category] || data.title + " — Freonn",
    description: seoDescs[category] || data.description.slice(0, 160),
    keywords: data.title.toLowerCase() + ", инженерные системы, вентиляция, кондиционирование",
    canonical: "/" + category,
    breadcrumbs: [
      { name: "Объекты", url: "/obekty" },
      { name: data.title, url: `/${category}` },
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `https://freonn.ru/${category}#webpage`,
      name: seoTitles[category] || data.title + " — Freonn",
      description: seoDescs[category] || data.description.slice(0, 160),
      url: `https://freonn.ru/${category}`,
      isPartOf: { "@id": "https://freonn.ru/#website" },
      author: { "@id": "https://freonn.ru/#organization" },
    },
  });

  return (
    <PageLayout title={data.title} breadcrumb={data.breadcrumb}>
      {/* Intro */}
      <section className="py-14 bg-white">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${data.color}15` }}>
                <Icon size={20} style={{ color: data.color }} />
              </div>
              <p className="font-heading font-semibold text-sm uppercase tracking-wider" style={{ color: data.color }}>
                {data.subtitle}
              </p>
            </div>
            <p className="text-gray-600 font-body text-base leading-relaxed mb-8">{data.description}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {data.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: data.color }} />
                  <span className="text-gray-700 font-body text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-14 bg-[#F7F8FF]">
        <div className="container">
          <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-8">Выполненные проекты</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((project, i) => (
              <motion.a
                key={i}
                href="https://max.ru/id3604084591_biz"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow block group"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-[#0F1340] text-sm leading-snug mb-3 group-hover:text-[#2D3092] transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-body mb-3">
                    <span>📍 {project.location}</span>
                    <span>📐 {project.area}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.systems.map((s, j) => (
                      <span key={j} className="text-xs px-2 py-0.5 rounded-full font-body" style={{ backgroundColor: `${data.color}10`, color: data.color }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="text-[#B91C1C] text-xs font-heading font-semibold uppercase tracking-wide group-hover:underline">
                    Информация об объекте →
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#0F1340] text-white">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl mb-3">Хотите реализовать похожий проект?</h2>
          <p className="text-white/70 font-body mb-6">
            Оставьте заявку — наш инженер свяжется с вами в течение 30 минут и рассчитает стоимость.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contacts" className="btn-dark inline-flex items-center gap-2 justify-center">
              Получить расчёт <ArrowRight size={16} />
            </a>
            <a href="tel:88001012009" className="btn-outline border-white/30 text-white hover:bg-white/10 inline-flex items-center gap-2 justify-center">
              8(800)101-2009
            </a>
          </div>
        </div>
      </section>

      <ContactSection />
    </PageLayout>
  );
}
