import { ymGoal } from "@/lib/ym";
/*
 * FREONN 404 PAGE — noindex, nofollow
 * Брендированная страница 404 на русском языке
 */
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, Phone, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";

export default function NotFound() {
  const [, setLocation] = useLocation();

  useSEO({
    title: "Страница не найдена (404) | Freonn",
    description: "Запрашиваемая страница не найдена. Перейдите на главную или воспользуйтесь навигацией.",
    canonical: "/404",
    noIndex: true,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FF]">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Big 404 */}
            <div className="relative mb-8">
              <span className="font-heading font-bold text-[160px] leading-none text-[#0F1340]/5 select-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-[#B91C1C]/10 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🔧</span>
                </div>
              </div>
            </div>

            <h1 className="font-heading font-bold text-[#0F1340] text-3xl lg:text-4xl mb-4">
              Страница не найдена
            </h1>
            <p className="text-gray-500 font-body text-lg mb-8 leading-relaxed">
              Возможно, страница была перемещена или удалена.<br />
              Воспользуйтесь навигацией или свяжитесь с нами.
            </p>

            {/* Quick links */}
            <div className="grid sm:grid-cols-3 gap-3 mb-8 text-left">
              {[
                { label: "Услуги", href: "/uslugi", desc: "Все инженерные системы" },
                { label: "Цены", href: "/ceny", desc: "Прайс-лист на монтаж" },
                { label: "Объекты", href: "/obekty", desc: "Выполненные проекты" },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="bg-white rounded-xl p-4 border border-gray-100 hover:border-[#B91C1C]/30 hover:shadow-md transition-all group"
                >
                  <div className="font-heading font-semibold text-[#0F1340] text-sm mb-1 group-hover:text-[#B91C1C] transition-colors flex items-center gap-1">
                    {link.label} <ArrowRight size={12} />
                  </div>
                  <div className="text-gray-400 text-xs font-body">{link.desc}</div>
                </a>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setLocation("/")}
                className="btn-dark inline-flex items-center gap-2 justify-center"
              >
                <Home size={16} /> На главную
              </button>
              <a
                href="tel:88001012009"
                className="btn-dark inline-flex items-center gap-2 justify-center"
              >
                <Phone size={16} /> 8(800)101-2009
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
