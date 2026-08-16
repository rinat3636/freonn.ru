import { useState } from "react";
import { useLocation } from "wouter";
import { Send } from "lucide-react";
import { formatPhone, submitLead } from "@/lib/leads";

export default function HeroLeadForm() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = "+7" + phoneDigits;
    if (!name || phoneDigits.length < 10) return;
    setSending(true);
    const ok = await submitLead({
      name,
      phone,
      service: "Монтаж вентиляции",
      message: "Заявка с формы в hero",
      pageUrl: window.location.href,
      referrer: document.referrer || undefined,
    });
    setSending(false);
    if (ok) {
      setDone(true);
      setTimeout(() => navigate("/spasibo"), 1200);
    }
  };

  if (done) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-[#B91C1C]/40 p-5 rounded-2xl shadow-sm text-center">
        <div className="font-heading font-semibold text-[#0F1340] mb-1">Спасибо!</div>
        <div className="text-[#0F1340]/60 text-sm font-body">Мы перезвоним в ближайшее время.</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm border border-[#B91C1C]/40 p-5 rounded-2xl shadow-sm">
      <div className="text-[#0F1340]/60 text-xs font-body mb-3 uppercase tracking-wider">Бесплатная консультация</div>
      <div className="space-y-3">
        <input
          required
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          className="w-full bg-white border border-[#0F1340]/15 text-[#0F1340] placeholder-[#0F1340]/40 px-4 py-2.5 text-sm font-body focus:outline-none focus:border-[#B91C1C] transition-colors rounded-xl"
        />
        <div className="flex items-center bg-white border border-[#0F1340]/15 focus-within:border-[#B91C1C] transition-colors rounded-xl overflow-hidden">
          <span className="pl-4 pr-1 py-2.5 text-sm font-body text-[#0F1340] select-none whitespace-nowrap">+7</span>
          <input
            required
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={formatPhone(phoneDigits)}
            onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="(___) ___-__-__"
            className="flex-1 bg-transparent text-[#0F1340] placeholder-[#0F1340]/40 pr-4 py-2.5 text-sm font-body focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          className="w-full flex items-center justify-center gap-2 text-sm font-heading font-semibold uppercase tracking-wide px-5 py-3 rounded-full border border-[#B91C1C] bg-[#B91C1C] text-white hover:bg-[#991818] transition-all duration-300 disabled:opacity-60"
        >
          {sending ? "Отправляем..." : <><Send size={14} /> Перезвоните мне</>}
        </button>
      </div>
      <p className="text-[#0F1340]/40 text-[10px] font-body mt-2 leading-tight">
        Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
      </p>
    </form>
  );
}
