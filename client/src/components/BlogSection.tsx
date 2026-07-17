/*
 * FREONN BLOG — Full article list from ceds.ru
 * Clean article layout with reading time
 * Brand: Freonn — dark navy #0F1340, red accent #B91C1C
 */
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ymGoal } from "@/lib/ym";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663524928365/d5oRPUYjSRzESZKpUgG9pW";

const articles = [
  {
    title: "Профессиональный монтаж тепловых пунктов (ИТП) в Москве",
    category: "Отопление",
    readTime: "7 минут",
    img: `${CDN}/equip-heating_49ba3696.jpg`,
    href: "/blog/montazh-teplovyh-punktov",
    excerpt: "Монтаж ИТП под ключ — это комплекс работ, выполняемый силами специализированной сертифицированной организации. Рассказываем о всех этапах и требованиях.",
  },
  {
    title: "Автоматизация инженерных систем",
    category: "Автоматизация",
    readTime: "7 минут",
    img: `${CDN}/equip-electrical_a91c8ffb.jpg`,
    href: "/blog/avtomatizaciya-sistem",
    excerpt: "Автоматизация и диспетчеризация инженерных систем — это методы управления и мониторинга различными техническими системами в помещениях.",
  },
  {
    title: "Технический аудит инженерных систем",
    category: "Обслуживание",
    readTime: "5 минут",
    img: `${CDN}/ru-hvac-production_2fc3fdd7.jpg`,
    href: "/blog/tekhnicheskij-audit",
    excerpt: "Аудит инженерных систем зданий и сооружений помогает определить их фактическое состояние, причины возникающих проблем и оценить эффективность.",
  },
  {
    title: "Монтаж вентиляции — этапы работы, нормативы и требования СНиП",
    category: "Вентиляция",
    readTime: "5 минут",
    img: `${CDN}/ru-industrial-ventilation_4939c0aa.jpg`,
    href: "/blog/montazh-ventilyacii",
    excerpt: "Монтаж системы вентиляции требует знания норм и требований, а также учёта специфики объекта — рассказываем подробно о всех нюансах.",
  },
  {
    title: "ККБ для приточной установки",
    category: "Кондиционирование",
    readTime: "7 минут",
    img: `${CDN}/equip-ac_decafa77.webp`,
    href: "/blog/kkb-dlya-pritochnoj-ustanovki",
    excerpt: "ККБ для приточной установки — это часть воздухораспределительной системы. Играет важную роль в обеспечении чистого и комфортного воздухообмена в зданиях.",
  },
  {
    title: "Вентиляция в школе — вытяжная, приточная, приточно-вытяжная",
    category: "Вентиляция",
    readTime: "9 минут",
    img: `${CDN}/equip-ventilation_25987b56.jpg`,
    href: "/blog/ventilyaciya-v-shkole",
    excerpt: "Вентиляция в школе — система, предназначенная для обеспечения циркуляции свежего воздуха внутри учебных классов и удаления загрязнённого воздуха.",
  },
  {
    title: "Кондиционирование кинотеатра",
    category: "Кондиционирование",
    readTime: "5 минут",
    img: `${CDN}/equip-ac_decafa77.webp`,
    href: "/blog/kondicionirovanie-kinoteatra",
    excerpt: "Кинотеатры предъявляют особые требования к системам кондиционирования: тихая работа, равномерное распределение воздуха, точный контроль температуры.",
  },
  {
    title: "Вентиляция медицинских учреждений",
    category: "Вентиляция",
    readTime: "7 минут",
    img: `${CDN}/ru-hvac-production_2fc3fdd7.jpg`,
    href: "/blog/ventilyaciya-medicinskih-uchrezhdenij",
    excerpt: "Медицинские учреждения требуют особых решений вентиляции: поддержание чистоты воздуха, зонирование давления, соответствие СанПиН.",
  },
  {
    title: "Кондиционирование серверной комнаты",
    category: "Кондиционирование",
    readTime: "7 минут",
    img: `${CDN}/equip-electrical_a91c8ffb.jpg`,
    href: "/blog/kondicionirovanie-servernoj-komnaty",
    excerpt: "Серверные комнаты требуют прецизионного охлаждения с точным контролем температуры и влажности. Рассматриваем все варианты решений.",
  },
  {
    title: "Воздушное отопление производственного помещения (цеха)",
    category: "Отопление",
    readTime: "5 минут",
    img: `${CDN}/equip-heating_49ba3696.jpg`,
    href: "/blog/vozdushnoe-otoplenie-ceha",
    excerpt: "Воздушное отопление — наиболее эффективный способ обогрева производственных помещений большого объёма. Разбираем схемы и оборудование.",
  },
  {
    title: "Вентиляция автостоянки (парковки, паркинга)",
    category: "Вентиляция",
    readTime: "5 минут",
    img: `${CDN}/ru-industrial-ventilation_4939c0aa.jpg`,
    href: "/blog/ventilyaciya-avtostoyanka",
    excerpt: "Вентиляция паркинга — обязательное требование пожарной безопасности. Рассматриваем нормативы, схемы и оборудование для подземных и надземных стоянок.",
  },
  {
    title: "Диспетчеризация систем вентиляции и кондиционирования",
    category: "Автоматизация",
    readTime: "8 минут",
    img: `${CDN}/equip-electrical_a91c8ffb.jpg`,
    href: "/blog/dispetcherizaciya-sistem",
    excerpt: "Диспетчеризация позволяет управлять всеми инженерными системами здания из единого центра, снижая затраты на обслуживание и повышая надёжность.",
  },
];

const categoryColors: Record<string, string> = {
  "Вентиляция": "bg-[#2D3092]/10 text-[#2D3092]",
  "Кондиционирование": "bg-[#B91C1C]/10 text-[#B91C1C]",
  "Отопление": "bg-orange-100 text-orange-700",
  "Автоматизация": "bg-purple-100 text-purple-700",
  "Обслуживание": "bg-green-100 text-green-700",
};

export default function BlogSection() {
  return (
    <section data-theme="light" id="blog" className="py-20 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-0.5 w-10 bg-[#B91C1C]" />
            <span className="text-[#B91C1C] font-heading font-semibold uppercase text-sm tracking-widest">
              Блог
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-[#0F1340]">
              Новое в нашем блоге
            </h2>
            <a href="/blog" onClick={() => ymGoal("blog_all_click")} className="inline-flex items-center gap-2 text-[#2D3092] font-heading font-semibold hover:text-[#B91C1C] transition-colors text-sm uppercase tracking-wide">
              Все статьи <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>

        {/* Featured article (first) + grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Featured — spans 2 columns */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 group cursor-pointer"
          >
            <a href={articles[0].href} onClick={() => ymGoal("blog_article_click", { article: articles[0].title })} className="block">
              <div className="overflow-hidden aspect-[16/8] mb-4 relative rounded-2xl">
                <img
                  src={articles[0].img}
                  alt={articles[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1340]/50 to-transparent" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-heading font-semibold uppercase px-2.5 py-1 tracking-wide rounded-full ${categoryColors[articles[0].category] || "bg-gray-100 text-gray-600"}`}>
                  {articles[0].category}
                </span>

              </div>
              <h3 className="font-heading font-bold text-[#0F1340] text-xl mb-2 group-hover:text-[#2D3092] transition-colors leading-snug">
                {articles[0].title}
              </h3>
              <p className="text-gray-500 text-sm font-body leading-relaxed mb-3">{articles[0].excerpt}</p>
              <span className="inline-flex items-center gap-1 text-[#B91C1C] text-sm font-heading font-semibold group-hover:gap-2 transition-all">
                Читать далее <ArrowRight size={14} />
              </span>
            </a>
          </motion.article>

          {/* Right column — stacked articles */}
          <div className="space-y-6">
            {articles.slice(1, 4).map((article, i) => (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer flex gap-4 border-b border-gray-100 pb-5 last:border-0"
              >
                <a href={article.href} onClick={() => ymGoal("blog_article_click", { article: article.title })} className="flex gap-4 w-full">
                  <div className="w-20 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={article.img}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-heading font-semibold uppercase px-2 py-0.5 tracking-wide rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-600"}`}>
                        {article.category}
                      </span>

                    </div>
                    <h3 className="font-heading font-semibold text-[#0F1340] text-sm leading-snug group-hover:text-[#2D3092] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Bottom rows — remaining articles in 3 columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8 pt-8 border-t border-gray-100">
          {articles.slice(4).map((article, i) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className="group cursor-pointer"
            >
              <a href={article.href} onClick={() => ymGoal("blog_article_click", { article: article.title })} className="block">
                <div className="overflow-hidden aspect-[16/9] mb-3 rounded-xl">
                  <img
                    src={article.img}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-heading font-semibold uppercase px-2.5 py-0.5 tracking-wide rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-600"}`}>
                    {article.category}
                  </span>

                </div>
                <h3 className="font-heading font-semibold text-[#0F1340] text-xs mb-2 group-hover:text-[#2D3092] transition-colors leading-snug line-clamp-3">
                  {article.title}
                </h3>
                <span className="text-[#B91C1C] text-xs font-heading font-semibold group-hover:underline">
                  Читать далее →
                </span>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
