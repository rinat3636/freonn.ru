/*
 * FREONN COMING SOON PAGE — for pages under development
 * noindex: true — не индексируем незаконченные страницы
 */
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";
import { ymGoal } from "@/lib/ym";

interface ComingSoonProps {
  title: string;
  breadcrumb: { label: string; href?: string }[];
  body?: string;
  links?: { label: string; href: string }[];
}

export default function ComingSoon({ title, breadcrumb, body, links }: ComingSoonProps) {
  useSEO({
    title,
    description: `${title} — раздел в разработке. Freonn — инженерная компания в Москве и МО.`,
    noIndex: true,
  });

  return (
    <PageLayout title={title} breadcrumb={breadcrumb}>
      <section className="py-20 bg-white">
        <div className="container max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-[#0F1340]/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔧</span>
            </div>
            <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-3">
              Раздел в разработке
            </h2>
            <p className="text-gray-500 font-body mb-6 leading-relaxed">
              {body ||
                "Этот раздел сайта находится в разработке. Пока вы можете связаться с нами напрямую — мы ответим на все вопросы."}
            </p>
            {links && links.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-body text-[#2D3092] hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/contacts" onClick={() => ymGoal("coming_soon_contact_click")} className="btn-dark inline-flex items-center gap-2 justify-center">
                <Phone size={16} /> Связаться с нами
              </a>
              <a href="/" onClick={() => ymGoal("coming_soon_home_click")} className="btn-dark inline-flex items-center gap-2 justify-center">
                На главную <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
