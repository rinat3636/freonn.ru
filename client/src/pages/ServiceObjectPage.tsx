/*
 * FREONN SERVICE×OBJECT LANDING PAGE
 * Матрица: услуга × тип объекта = уникальная посадочная страница
 * Примеры: /ventilyaciya-sklad, /kondicionirovanie-ofis, /dymoudalenie-tc
 * SAFETY: AI-контент с полным graceful fallback
 */
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import NotFound from "@/pages/NotFound";
import { motion } from "framer-motion";
import { Phone, CheckCircle, ArrowRight } from "lucide-react";
import { ymGoal } from "@/lib/ym";
import { useState, useEffect } from "react";
import { SERVICES, OBJECT_TYPES } from "@shared/serviceObjects";

// Статические FAQ по умолчанию
const STATIC_FAQ: Record<string, Array<{ q: string; a: string }>> = {
  default: [
    { q: "Сколько стоит монтаж?", a: "Стоимость зависит от площади объекта и сложности системы. Точный расчёт — бесплатно после выезда инженера. Звоните: 8(800)101-2009." },
    { q: "Как долго длится монтаж?", a: "Сроки зависят от объёма работ. Небольшие объекты — от 3–5 дней, крупные проекты — 2–8 недель. Точные сроки определяются на этапе проектирования." },
    { q: "Есть ли у вас лицензии?", a: "Да, Freonn имеет все необходимые лицензии, допуски СРО и лицензию МЧС для противопожарных работ." },
    { q: "Работаете ли вы в Московской области?", a: "Да, работаем по всей Москве и Московской области. Выезд инженера — в течение 1 рабочего дня." },
    { q: "Какую гарантию вы даёте?", a: "Гарантия на монтажные работы — 1 год. На оборудование — гарантия производителя (1–3 года)." },
  ],
};

interface ServiceObjectPageProps {
  service: string; // ключ из SERVICES
  objectType: string; // ключ из OBJECT_TYPES
}

export default function ServiceObjectPage({ service, objectType }: ServiceObjectPageProps) {
  const svc = SERVICES[service];
  const obj = OBJECT_TYPES[objectType];
  const [faq, setFaq] = useState<Array<{ q: string; a: string }>>(STATIC_FAQ.default);
  const [faqLoaded, setFaqLoaded] = useState(false);

  if (!svc || !obj) {
    return <NotFound />;
  }

  const pageTitle = `${svc.name} в ${obj.namePrep} — монтаж под ключ`;
  const pageDesc = `Профессиональный монтаж ${svc.nameGen} в ${obj.namePrep} в Москве и МО. Freonn — 15 лет опыта, 1280+ объектов. Бесплатный расчёт: 8(800)101-2009.`;
  const canonical = `/${svc.slug}-${obj.slug}`;

  // AI FAQ загрузка (контент страницы; JSON-LD только в SSR)
  useEffect(() => {
    if (faqLoaded) return;
    const cacheKey = `freonn_faq_${service}_${objectType}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < 7 * 24 * 60 * 60 * 1000) {
          setFaq(data);
          setFaqLoaded(true);
          return;
        }
      }
    } catch { /* ignore */ }

    fetch("/api/seo/service-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: `${service}-${objectType}`,
        title: `${svc.name} для ${obj.name}`,
        description: obj.description,
      }),
      signal: AbortSignal.timeout(12000),
    })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json?.faq && Array.isArray(json.faq) && json.faq.length > 0 && !json.fallback) {
          setFaq(json.faq);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({ data: json.faq, ts: Date.now() }));
          } catch { /* ignore */ }
        }
        setFaqLoaded(true);
      })
      .catch(() => setFaqLoaded(true));
  }, [service, objectType, faqLoaded, svc.name, obj.description]);

  useSEO({
    title: pageTitle,
    description: pageDesc,
    keywords: `${svc.nameGen} ${obj.name.toLowerCase()}, монтаж ${svc.nameGen} в ${obj.namePrep}, ${svc.nameGen} Москва`,
    canonical,
    breadcrumbs: [
      { name: "Услуги", url: "/uslugi" },
      { name: svc.name, url: `/${svc.slug}` },
      { name: obj.name, url: canonical },
    ],
  });

  return (
    <PageLayout
      title={`${svc.name} для ${obj.name}`}
      breadcrumb={[
        { label: "Услуги", href: "/uslugi" },
        { label: svc.name, href: `/${svc.slug}` },
        { label: obj.name },
      ]}
    >
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-[#0F1340] to-[#1a1f5e] text-white">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[#B91C1C] font-heading font-semibold text-sm uppercase tracking-widest mb-3">
              Freonn — Инженерная компания
            </p>
            <h1 className="font-heading font-bold text-3xl md:text-4xl leading-tight mb-4">
              {svc.name} в {obj.namePrep}
            </h1>
            <p className="text-white/80 font-body text-lg mb-8 max-w-2xl">
              {obj.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/contacts" onClick={() => ymGoal("sop_contact_click")} className="btn-primary inline-flex items-center gap-2 justify-center">
                Получить расчёт бесплатно <ArrowRight size={16} />
              </a>
              <a href="tel:88001012009" className="btn-outline-white inline-flex items-center gap-2 justify-center">
                <Phone size={16} /> 8(800)101-2009
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Особенности объекта */}
      <section className="py-12 bg-white">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-6">
            Особенности {svc.nameGen} для {obj.name.toLowerCase()}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {obj.features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
              >
                <CheckCircle className="text-[#B91C1C] mt-0.5 shrink-0" size={20} />
                <span className="font-body text-[#0F1340] font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-gray-600 font-body leading-relaxed">
            Freonn выполняет монтаж {svc.nameGen} в {obj.namePrep} под ключ — от проектирования до пусконаладки и сдачи в эксплуатацию.
            Работаем в Москве и Московской области. Опыт 15+ лет, 1280+ реализованных объектов, 25 монтажных бригад.
          </p>
        </div>
      </section>

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container max-w-4xl">
            <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-6">
              Часто задаваемые вопросы
            </h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-xl p-5 border border-gray-100"
                >
                  <h3 className="font-heading font-semibold text-[#0F1340] mb-2">{item.q}</h3>
                  <p className="font-body text-gray-600 leading-relaxed">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-[#B91C1C] text-white">
        <div className="container max-w-3xl text-center">
          <h2 className="font-heading font-bold text-2xl mb-3">
            Нужна {svc.name.toLowerCase()} для {obj.name.toLowerCase()}?
          </h2>
          <p className="font-body text-white/80 mb-6">
            Выезд инженера и расчёт стоимости — бесплатно. Перезвоним в течение 30 минут.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contacts" onClick={() => ymGoal("sop_bottom_contact_click")} className="bg-white text-[#B91C1C] font-heading font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition inline-flex items-center gap-2 justify-center">
              Оставить заявку <ArrowRight size={16} />
            </a>
            <a href="tel:88001012009" className="border-2 border-white text-white font-heading font-bold px-6 py-3 rounded-full hover:bg-white/10 transition inline-flex items-center gap-2 justify-center">
              <Phone size={16} /> 8(800)101-2009
            </a>
          </div>
        </div>
      </section>

      {/* Внутренняя перелинковка */}
      <section className="py-10 bg-white">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-[#0F1340] text-xl mb-4">
            Другие услуги для {obj.name.toLowerCase()}
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SERVICES)
              .filter(([key]) => key !== service)
              .map(([key, s]) => (
                <a
                  key={key}
                  href={`/${s.slug}-${obj.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-[#0F1340] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition"
                >
                  {s.name} для {obj.name.toLowerCase()}
                </a>
              ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(OBJECT_TYPES)
              .filter(([key]) => key !== objectType)
              .slice(0, 5)
              .map(([key, o]) => (
                <a
                  key={key}
                  href={`/${svc.slug}-${o.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-[#B91C1C] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition"
                >
                  {svc.name} для {o.name.toLowerCase()}
                </a>
              ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
