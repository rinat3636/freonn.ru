/*
 * FREONN THANKS PAGE — /spasibo
 * Shown after successful form submission for Yandex.Metrika conversion tracking
 */
import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { ymGoal } from "@/lib/ym";
import { CheckCircle, Phone, ArrowRight, Clock, Shield, Wrench, FileText } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

const REDIRECT_SECONDS = 10;

export default function ThanksPage() {
  const [, navigate] = useLocation();
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  useSEO({
    title: "Спасибо за заявку — Freonn",
    description: "Ваша заявка принята. Наш специалист свяжется с вами в ближайшее время.",
    canonical: "/spasibo",
    noIndex: true,
  });

  // Fire Yandex.Metrika conversion goal on page load
  useEffect(() => {
    ymGoal("form_submit");
  }, []);

  // Countdown timer with auto-redirect
  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = (countdown / REDIRECT_SECONDS) * circumference;

  const steps = [
    {
      icon: <Phone className="w-6 h-6 text-white" />,
      title: "Перезвоним",
      desc: "Менеджер свяжется с вами в течение 30 минут и уточнит детали",
    },
    {
      icon: <Wrench className="w-6 h-6 text-white" />,
      title: "Выедем на объект",
      desc: "Инженер проведёт бесплатный замер и оценку объёма работ",
    },
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      title: "Пришлём КП",
      desc: "Вы получите коммерческое предложение с точными ценами и сроками",
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Гарантия",
      desc: "Выполним работы с гарантией и сдадим объект в срок",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0F1340]">
      <Header />

      {/* Hero block */}
      <section className="relative flex-1 flex items-center overflow-hidden bg-[#0F1340] pt-24 pb-16">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Red left accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B91C1C]" />

        <div className="container max-w-4xl relative z-10 text-white text-center">
          {/* Check icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <div className="w-28 h-28 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-0.5 w-10 bg-[#B91C1C]" />
              <span className="text-[#B91C1C] font-heading uppercase tracking-widest text-sm font-semibold">
                Заявка принята
              </span>
              <div className="h-0.5 w-10 bg-[#B91C1C]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tight mb-4">
              Спасибо за обращение!
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-2">
              Ваша заявка успешно отправлена в компанию <span className="text-white font-semibold">Freonn</span>.
            </p>
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm mb-10">
              <Clock className="w-4 h-4" />
              <span>Режим работы: Пн–Сб 9:00–19:00</span>
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {steps.map((step, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left hover:bg-white/8 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-[#B91C1C]/20 border border-[#B91C1C]/40 flex items-center justify-center mb-3">
                  {step.icon}
                </div>
                <p className="font-heading font-semibold text-white text-sm uppercase tracking-wide mb-1">
                  {step.title}
                </p>
                <p className="text-white/55 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <a
              href="tel:88001012009"
              className="inline-flex items-center justify-center gap-2 bg-[#B91C1C] text-white px-8 py-3.5 rounded-full font-heading font-semibold uppercase tracking-wide hover:bg-[#a01818] transition-colors"
            >
              <Phone className="w-4 h-4" />
              8-800-101-2009
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-full font-heading font-semibold uppercase tracking-wide hover:border-white/60 hover:bg-white/5 transition-colors"
            >
              На главную
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <circle
                  cx="26"
                  cy="26"
                  r={radius}
                  fill="none"
                  stroke="#B91C1C"
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
                {countdown}
              </span>
            </div>
            <p className="text-white/40 text-sm">
              Переход на главную через {countdown} сек.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
