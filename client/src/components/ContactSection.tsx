/*
 * FREONN CONTACT — Bold Technical Expressionism
 * Dark navy section with contact form + company details
 */
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { Phone, Mail, MapPin, Clock, Send, Paperclip, X as XIcon } from "lucide-react";
import { toast } from "sonner";
import { ymGoal, gaEvent } from "@/lib/ym";

// Format digits into +7 (XXX) XXX-XX-XX mask
function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 10);
  let result = "";
  if (d.length > 0) result += "(" + d.slice(0, 3);
  if (d.length >= 3) result += ") " + d.slice(3, 6);
  if (d.length >= 6) result += "-" + d.slice(6, 8);
  if (d.length >= 8) result += "-" + d.slice(8, 10);
  return result;
}

export default function ContactSection() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", type: "Монтаж" });
  const [phoneDigits, setPhoneDigits] = useState("");
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 20 * 1024 * 1024) {
      toast.error("Файл слишком большой. Максимум 20 МБ.");
      return;
    }
    setFile(selected);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", selected);
      const res = await fetch("/api/upload-file", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setFileUrl(data.url);
        toast.success("Файл загружен!");
      } else {
        toast.error("Ошибка загрузки файла");
        setFile(null);
      }
    } catch {
      toast.error("Ошибка загрузки файла");
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          service: form.type,
          message: form.message,
          fileUrl: fileUrl || undefined,
          fileName: file?.name || undefined,
          pageUrl: window.location.href,
          referrer: document.referrer || undefined,
        }),
      });
      if (res.ok) {
        try {
          const { isLoggedIn } = await import("@/lib/freonn-group/auth-storage");
          const { isFreonnApiConfigured } = await import("@/lib/freonn-group/config");
          const { submitFreonnRequest } = await import("@/lib/freonn-group/orders");
          if (isFreonnApiConfigured() && isLoggedIn()) {
            await submitFreonnRequest({
              serviceLabel: form.type,
              message: form.message,
              fileUrl: fileUrl || undefined,
            });
          }
        } catch (syncErr) {
          console.warn("[Contact] Freonn Group request sync", syncErr);
        }
        ymGoal("form_submit", { service: form.type });
        gaEvent("generate_lead", { service: form.type, page_path: window.location.pathname });
        setForm({ name: "", phone: "", email: "", message: "", type: "Монтаж" });
        setPhoneDigits("");
        setFile(null);
        setFileUrl(null);
        navigate("/spasibo");
      } else {
        toast.error("Ошибка при отправке. Позвоните нам: 8(800)101-2009");
      }
    } catch {
      toast.error("Ошибка соединения. Позвоните нам: 8(800)101-2009");
    } finally {
      setSending(false);
    }
  };

  return (
    <section data-theme="dark" id="contacts" className="py-20 bg-gradient-to-br from-[#0F1340] to-[#2D3092] text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="container relative z-10">
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
              Контакты
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl">
            Свяжитесь с нами
          </h2>
          {/* Мессенджеры */}
          <div className="flex items-center gap-3 mt-5">
            <a
              href="https://t.me/freonnru"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ymGoal("messenger_click", { messenger: "Telegram" })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-body font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" className="w-5 h-5 flex-shrink-0 rounded-full">
                <defs>
                  <linearGradient id="tg-contact" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#2AABEE"/>
                    <stop offset="1" stopColor="#229ED9"/>
                  </linearGradient>
                </defs>
                <circle cx="120" cy="120" r="120" fill="url(#tg-contact)"/>
                <path fill="#fff" d="M54 117.3l109.4-42.2c5.1-1.8 9.5.4 7.9 7.6l-18.6 87.7c-1.4 6.1-5 7.6-10.1 4.7l-28-20.6-13.5 13c-1.5 1.5-2.8 2.7-5.7 2.7l2-28.6 51.8-46.8c2.2-2-0.5-3.1-3.4-1.1L76.5 139.4 49.3 131c-6-1.9-6.1-6 1.7-8.7z"/>
              </svg>
              Telegram
            </a>
            <a
              href="https://max.ru/u/f9LHodD0cOKaaN2mz0PfvjFBVqonxag-nu9wJD4VwYn1oKPsJlN6H4e2nVA"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ymGoal("messenger_click", { messenger: "MAX" })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-body font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720" className="w-5 h-5 flex-shrink-0">
                <path fill="#fff" d="M350.4,9.6C141.8,20.5,4.1,184.1,12.8,390.4c3.8,90.3,40.1,168,48.7,253.7,2.2,22.2-4.2,49.6,21.4,59.3,31.5,11.9,79.8-8.1,106.2-26.4,9-6.1,17.6-13.2,24.2-22,27.3,18.1,53.2,35.6,85.7,43.4,143.1,34.3,299.9-44.2,369.6-170.3C799.6,291.2,622.5-4.6,350.4,9.6h0ZM269.4,504c-11.3,8.8-22.2,20.8-34.7,27.7-18.1,9.7-23.7-.4-30.5-16.4-21.4-50.9-24-137.6-11.5-190.9,16.8-72.5,72.9-136.3,150-143.1,78-6.9,150.4,32.7,183.1,104.2,72.4,159.1-112.9,316.2-256.4,218.6h0Z"/>
              </svg>
              MAX
            </a>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-heading font-semibold text-xl mb-6">Оставить заявку</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-white/70 text-sm font-body mb-1.5">Ваше имя *</label>
                  <input
                    id="contact-name"
                    required
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-2.5 text-sm font-body focus:outline-none focus:border-[#B91C1C] transition-colors rounded-xl"
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-white/70 text-sm font-body mb-1.5">Телефон *</label>
                  <div className="flex items-center bg-white/10 border border-white/20 focus-within:border-[#B91C1C] transition-colors rounded-xl overflow-hidden">
                    <span className="pl-4 pr-1 py-2.5 text-sm font-body text-white select-none whitespace-nowrap">+7</span>
                    <input
                      id="contact-phone"
                      required
                      type="tel"
                      autoComplete="tel"
                      inputMode="numeric"
                      value={formatPhone(phoneDigits)}
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setPhoneDigits(raw);
                        setForm({ ...form, phone: "+7" + raw });
                      }}
                      className="flex-1 bg-transparent text-white placeholder-white/40 pr-4 py-2.5 text-sm font-body focus:outline-none"
                      placeholder="(___) ___-__-__"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-white/70 text-sm font-body mb-1.5">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-2.5 text-sm font-body focus:outline-none focus:border-[#B91C1C] transition-colors rounded-xl"
                  placeholder="email@company.ru"
                />
              </div>
              <div>
                <label htmlFor="contact-type" className="block text-white/70 text-sm font-body mb-1.5">Тип услуги</label>
                <select
                  id="contact-type"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white px-4 py-2.5 text-sm font-body focus:outline-none focus:border-[#B91C1C] transition-colors rounded-xl"
                >
                  {["Монтаж вентиляции", "Монтаж кондиционирования", "Монтаж дымоудаления", "Монтаж отопления", "Холодоснабжение", "Водоснабжение и канализация", "Электроснабжение", "Пескоструйная обработка", "Проектирование ОВиК", "Комплексный проект", "Пусконаладочные работы", "Сервисное обслуживание", "Консультация"].map(opt => (
                    <option key={opt} value={opt} className="bg-[#0F1340]">{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-white/70 text-sm font-body mb-1.5">Описание задачи</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-2.5 text-sm font-body focus:outline-none focus:border-[#B91C1C] transition-colors resize-none rounded-xl"
                  placeholder="Опишите ваш объект и задачу..."
                />
              </div>
              {/* File attachment */}
              <div>
                <label className="block text-white/70 text-sm font-body mb-1.5">Прикрепить документ (необязательно)</label>
                {file ? (
                  <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5">
                    <Paperclip size={16} className="text-[#B91C1C] flex-shrink-0" />
                    <span className="text-white/80 text-sm font-body flex-1 truncate">
                      {uploading ? "Загружаем..." : file.name}
                    </span>
                    {!uploading && (
                      <button type="button" onClick={removeFile} className="text-white/50 hover:text-white transition-colors flex-shrink-0">
                        <XIcon size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  <label className="flex items-center gap-2 bg-white/10 border border-dashed border-white/30 hover:border-[#B91C1C] rounded-xl px-4 py-3 cursor-pointer transition-colors group">
                    <Paperclip size={16} className="text-white/50 group-hover:text-[#B91C1C] transition-colors flex-shrink-0" />
                    <span className="text-white/50 group-hover:text-white/80 text-sm font-body transition-colors">Нажмите для выбора файла (PDF, Word, Excel, до 20 МБ)</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip,.rar,.dwg,.dxf"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
              <button
                type="submit"
                disabled={sending || uploading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {sending ? "Отправляем..." : (
                  <>
                    <Send size={16} />
                    Отправить заявку
                  </>
                )}
              </button>
              <p className="text-white/40 text-xs font-body">
                Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
              </p>
            </form>
          </motion.div>

          {/* Company details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-heading font-semibold text-xl mb-6">Контактная информация</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B91C1C]/20 flex items-center justify-center flex-shrink-0 rounded-full">
                    <Phone size={18} className="text-[#B91C1C]" />
                  </div>
                  <div>
                    <div className="text-white/60 text-xs font-body mb-0.5">Телефон</div>
                    <a href="tel:88001012009" onClick={() => ymGoal("phone_click")} className="text-white font-heading font-semibold text-lg hover:text-[#B91C1C] transition-colors">
                      8(800)101-2009
                    </a>
                    <div className="text-white/50 text-xs font-body">Бесплатно по России</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B91C1C]/20 flex items-center justify-center flex-shrink-0 rounded-full">
                    <Mail size={18} className="text-[#B91C1C]" />
                  </div>
                  <div>
                    <div className="text-white/60 text-xs font-body mb-0.5">Email</div>
                    <a href="mailto:freonn@internet.ru" className="text-white font-body hover:text-[#B91C1C] transition-colors">
                      freonn@internet.ru
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B91C1C]/20 flex items-center justify-center flex-shrink-0 rounded-full">
                    <MapPin size={18} className="text-[#B91C1C]" />
                  </div>
                  <div>
                    <div className="text-white/60 text-xs font-body mb-0.5">Адрес офиса</div>
                    <div className="text-white font-body">Московская обл., г. Дзержинский, ул. Ленина 2Б</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B91C1C]/20 flex items-center justify-center flex-shrink-0 rounded-full">
                    <Clock size={18} className="text-[#B91C1C]" />
                  </div>
                  <div>
                    <div className="text-white/60 text-xs font-body mb-0.5">Режим работы</div>
                    <div className="text-white font-body">Пн–Сб: 9:00 – 19:00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Реквизиты */}
            <div className="bg-white/10 border border-white/20 p-6 rounded-2xl">
              <h4 className="font-heading font-semibold text-white text-base mb-4 uppercase tracking-wide">
                Реквизиты компании
              </h4>
              <div className="space-y-2 text-sm font-body">
                {[
                  ["Наименование", "ООО «ЭКС»"],
                  ["ИНН", "3604084591"],
                  ["КПП", "360401001"],
                  ["ОГРН", "1243600003569"],
                  ["Юридический адрес", "Воронежская обл., г. Калач, ул. Красина, д. 3, оф. 3"],
                  ["Фактический адрес", "Московская обл., г. Дзержинский, ул. Ленина, д. 2Б"],
                ].map(([key, val]) => (
                  <div key={key} className="flex gap-3">
                    <span className="text-white/50 flex-shrink-0 w-36">{key}:</span>
                    <span className="text-white/90">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Способы оплаты — коммерческий фактор Яндекса */}
            <div className="bg-white/10 border border-white/20 p-6 rounded-2xl">
              <h4 className="font-heading font-semibold text-white text-base mb-4 uppercase tracking-wide">
                Способы оплаты
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "🏦", label: "Безналичный расчёт", desc: "Счёт для юрлиц и ИП" },
                  { icon: "💳", label: "Картой онлайн", desc: "Виза, Мастеркард, МИР" },
                  { icon: "💵", label: "Наличными", desc: "Для физических лиц" },
                  { icon: "📊", label: "Лизинг/рассрочка", desc: "До 12 месяцев" },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-white text-xs font-heading font-semibold">{item.label}</div>
                      <div className="text-white/50 text-xs font-body">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Карта Яндекс — важный коммерческий фактор */}
            <div className="rounded-2xl overflow-hidden border border-white/20">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A&source=constructor&ll=37.8488%2C55.6316&z=14&l=map&pt=37.8488%2C55.6316%2Cpm2rdm~"
                width="100%"
                height="200"
                frameBorder="0"
                title="Офис Freonn на карте"
                aria-label="Офис Freonn на Яндекс.Картах"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
