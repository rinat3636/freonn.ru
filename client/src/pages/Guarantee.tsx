import { ymGoal } from "@/lib/ym";
/*
 * FREONN GUARANTEE PAGE — /garantiya
 */
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Clock, Phone, FileText, Wrench, ArrowRight } from "lucide-react";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663524928365/d5oRPUYjSRzESZKpUgG9pW";

const guaranteeItems = [
  {
    icon: Shield,
    title: "1 год на монтажные работы",
    desc: "Гарантируем качество монтажа всех инженерных систем в течение 12 месяцев с момента сдачи объекта.",
  },
  {
    icon: Wrench,
    title: "Гарантия производителя на оборудование",
    desc: "На всё установленное оборудование действует гарантия производителя: от 1 до 5 лет в зависимости от бренда.",
  },
  {
    icon: Clock,
    title: "Выезд в течение 24 часов",
    desc: "При возникновении гарантийного случая наш специалист выедет на объект в течение 24 часов.",
  },
  {
    icon: FileText,
    title: "Полный пакет документов",
    desc: "Передаём исполнительную документацию, паспорта оборудования, акты скрытых работ и гарантийные талоны.",
  },
];

const conditions = [
  "Гарантия действует при условии соблюдения правил эксплуатации оборудования",
  "Гарантийное обслуживание осуществляется только при наличии договора и актов выполненных работ",
  "Гарантия не распространяется на расходные материалы (фильтры, ремни, подшипники)",
  "Гарантия не действует при механических повреждениях, вызванных действиями третьих лиц",
  "Гарантийные работы выполняются бесплатно при подтверждении гарантийного случая",
  "Срок устранения гарантийных неисправностей — до 5 рабочих дней",
];

export default function GuaranteePage() {

  useSEO({
    title: "Гарантии на монтаж инженерных систем — Freonn",
    description: "Freonn предоставляет гарантию 1 год на монтажные работы и до 5 лет на оборудование производителя. Официальный договор, гарантийное обслуживание, техническая поддержка.",
    keywords: "гарантия монтаж вентиляции, гарантийное обслуживание кондиционирование, гарантия инженерные системы",
    canonical: "/garantii",
    breadcrumbs: [{ name: "Гарантия", url: "/garantii" }],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://freonn.ru/garantii#webpage",
      name: "Гарантии на монтаж инженерных систем — Freonn",
      description: "Freonn предоставляет гарантию до 5 лет на все виды монтажных работ.",
      url: "https://freonn.ru/garantii",
      isPartOf: { "@id": "https://freonn.ru/#website" },
      about: { "@id": "https://freonn.ru/#organization" },
    },
  });
  return (
    <PageLayout
      title="Гарантия на работы"
      breadcrumb={[{ label: "Гарантия" }]}
    >
      {/* Main guarantee */}
      <section className="py-14 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-14">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} className="text-[#B91C1C]" />
                <span className="text-[#B91C1C] font-heading font-semibold text-sm uppercase tracking-wider">
                  Гарантия качества
                </span>
              </div>
              <h2 className="font-heading font-bold text-[#0F1340] text-2xl lg:text-3xl mb-4">
                Мы отвечаем за каждый объект
              </h2>
              <p className="text-gray-600 font-body leading-relaxed mb-6">
                Freonn предоставляет официальную гарантию на все выполненные работы. Мы уверены в качестве монтажа и используем только сертифицированное оборудование от проверенных производителей.
              </p>
              <div className="bg-[#0F1340] text-white rounded-2xl p-5 mb-6">
                <div className="text-5xl font-heading font-black text-[#B91C1C] mb-1">12</div>
                <div className="text-white font-heading font-bold text-lg">месяцев гарантии</div>
                <div className="text-white/60 font-body text-sm">на все монтажные работы</div>
              </div>
              <a href="/contacts" className="btn-dark inline-flex items-center gap-2">
                Связаться с нами <ArrowRight size={16} />
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src={`${CDN}/freonn-ventilation-unit-5ebe3bmzqsCGdGpvbDz2zo.webp`}
                alt="Гарантия качества Freonn"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Guarantee items */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {guaranteeItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="bg-[#F7F8FF] rounded-2xl p-5"
                >
                  <div className="w-10 h-10 bg-[#2D3092] rounded-xl flex items-center justify-center mb-4">
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-[#0F1340] text-sm mb-2">{item.title}</h3>
                  <p className="text-gray-500 font-body text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Conditions */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h3 className="font-heading font-bold text-[#0F1340] text-lg mb-5">Условия гарантийного обслуживания</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {conditions.map((cond, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle size={15} className="mt-0.5 flex-shrink-0 text-[#2D3092]" />
                  <span className="text-gray-600 font-body text-sm">{cond}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact for warranty */}
          <div className="mt-8 bg-[#B91C1C]/5 border border-[#B91C1C]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <Phone size={24} className="text-[#B91C1C] flex-shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-heading font-bold text-[#0F1340] text-base mb-1">Гарантийный случай?</h3>
              <p className="text-gray-500 font-body text-sm">Позвоните нам или оставьте заявку — выедем в течение 24 часов.</p>
            </div>
            <div className="flex gap-3">
              <a href="tel:88001012009" className="btn-dark whitespace-nowrap">8(800)101-2009</a>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </PageLayout>
  );
}
