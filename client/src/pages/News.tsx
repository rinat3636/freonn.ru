/*
 * FREONN NEWS PAGE — /novosti
 */
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663524928365/d5oRPUYjSRzESZKpUgG9pW";

const news = [
  {
    date: "15 марта 2025",
    category: "Проекты",
    title: "Завершён монтаж инженерных систем в БЦ «Aero City»",
    excerpt: "Команда Freonn успешно завершила монтаж систем вентиляции и кондиционирования в бизнес-центре «Aero City» площадью 5 200 м². Проект реализован в срок, заказчик принял объект без замечаний.",
    img: `${CDN}/freonn-commercial-ac-25u7KoLKzpAUCxypUsYPv5.webp`,
    href: "/kejs/aero-city-moskva",
  },
  {
    date: "2 февраля 2025",
    category: "Компания",
    title: "Freonn получила лицензию МЧС на монтаж систем дымоудаления",
    excerpt: "Компания Freonn успешно прошла лицензирование МЧС России и получила право на проектирование, монтаж и обслуживание систем противодымной вентиляции и дымоудаления.",
    img: `${CDN}/equip-smoke_77c22382.webp`,
  },
  {
    date: "18 января 2025",
    category: "Проекты",
    title: "Сдан объект: вентиляция и отопление для производства Arida Home",
    excerpt: "Завершён монтаж приточно-вытяжной вентиляции и системы воздушного отопления на производстве аромадиффузоров Arida Home в Московской области. Площадь объекта — 2 800 м².",
    img: `${CDN}/ru-hvac-production_2fc3fdd7.jpg`,
  },
  {
    date: "5 декабря 2024",
    category: "Оборудование",
    title: "Freonn стал официальным партнёром Daikin в России",
    excerpt: "Компания Freonn получила статус авторизованного дилера и монтажной организации Daikin — одного из ведущих мировых производителей климатического оборудования.",
    img: `${CDN}/equip-ac_decafa77.webp`,
  },
  {
    date: "20 ноября 2024",
    category: "Проекты",
    title: "Монтаж VRF-системы в Третьяковской галерее",
    excerpt: "Freonn выполнил монтаж крышного короба для VRF-системы кондиционирования в историческом здании Третьяковской галереи. Работы выполнены с соблюдением всех требований к историческим объектам.",
    img: `${CDN}/proj-fancoil_49fccb2c.jpg`,
  },
  {
    date: "8 октября 2024",
    category: "Компания",
    title: "Открыт новый офис в Москве",
    excerpt: "Компания Freonn открыла новый офис в Москве для удобства клиентов. Теперь вы можете приехать к нам для консультации или обсуждения проекта лично.",
    img: `${CDN}/freonn-ventilation-unit-5ebe3bmzqsCGdGpvbDz2zo.webp`,
  },
  {
    date: "15 сентября 2024",
    category: "Проекты",
    title: "Завершён генеральный проект для фитнес-центра Vysota",
    excerpt: "Freonn реализовал генеральный инженерный проект для фитнес-центра Vysota: вентиляция, кондиционирование, отопление, тёплый пол и освещение на площади 3 500 м².",
    img: `${CDN}/freonn-chiller-E9FzvTdbvYDJ9o4F7zSQNh.webp`,
  },
  {
    date: "1 августа 2024",
    category: "Компания",
    title: "Freonn вошёл в рейтинг лучших инженерных компаний Подмосковья",
    excerpt: "По итогам 2024 года компания Freonn вошла в топ-10 инженерных компаний Московской области по версии отраслевого рейтинга. Критерии оценки: качество работ, сроки и отзывы клиентов.",
    img: `${CDN}/ru-industrial-ventilation_4939c0aa.jpg`,
  },
  {
    date: "12 июня 2024",
    category: "Проекты",
    title: "Монтаж систем вентиляции в Московском училище олимпийского резерва",
    excerpt: "Завершён монтаж вентиляции, дымоудаления и VRF-систем в Московском училище олимпийского резерва №1. Объект сдан в эксплуатацию с полным пакетом документов.",
    img: `${CDN}/proj-ductwork_f5dd8a8d.jpg`,
  },
];

const categoryColors: Record<string, string> = {
  "Проекты": "bg-[#2D3092]/10 text-[#2D3092]",
  "Компания": "bg-[#B91C1C]/10 text-[#B91C1C]",
  "Оборудование": "bg-green-100 text-green-700",
};

export default function NewsPage() {

  useSEO({
    title: "Новости компании Freonn",
    description: "Последние новости инженерной компании Freonn: новые объекты, сертификаты, акции, обновления оборудования и технологий монтажа.",
    keywords: "новости Freonn, инженерная компания новости, вентиляция новости",
    canonical: "/novosti",
    breadcrumbs: [{ name: "Новости", url: "/novosti" }],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": "https://freonn.ru/novosti#blog",
      name: "Новости компании Freonn",
      description: "Последние новости инженерной компании Freonn.",
      url: "https://freonn.ru/novosti",
      publisher: { "@id": "https://freonn.ru/#organization" },
      blogPost: news.slice(0, 5).map((item, i) => ({
        "@type": "BlogPosting",
        headline: item.title,
        description: item.excerpt,
        datePublished: item.date,
        url: item.href ? `https://freonn.ru${item.href}` : `https://freonn.ru/novosti#post-${i}`,
      })),
    },
  });
  return (
    <PageLayout
      title="Новости компании"
      breadcrumb={[{ label: "Новости" }]}
    >
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, i) => {
              const card = (
                <>
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-body font-medium ${categoryColors[item.category] || "bg-gray-100 text-gray-600"}`}>
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400 text-xs font-body">
                        <Calendar size={12} /> {item.date}
                      </span>
                    </div>
                    <h2 className="font-heading font-semibold text-[#0F1340] text-sm leading-snug mb-2 group-hover:text-[#2D3092] transition-colors line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-500 text-xs font-body leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                    {"href" in item && item.href ? (
                      <span className="inline-flex items-center gap-1 mt-3 text-[#2D3092] text-xs font-body font-medium">
                        Подробнее <ArrowRight size={12} />
                      </span>
                    ) : null}
                  </div>
                </>
              );

              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group bg-white border border-gray-100 hover:border-[#2D3092]/30 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
              >
                {"href" in item && item.href ? (
                  <a href={item.href} className="block">{card}</a>
                ) : (
                  card
                )}
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <ContactSection />
    </PageLayout>
  );
}
