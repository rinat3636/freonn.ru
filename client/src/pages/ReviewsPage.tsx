import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Star, MessageSquare, Building2 } from "lucide-react";
import { ymGoal, gaEvent } from "@/lib/ym";

export default function ReviewsPage() {
  useSEO({
    title: "Отзывы и благодарности — Freonn",
    description:
      "Оставьте отзыв о сотрудничестве с Freonn. Мы ценим обратную связь и публикуем отзывы на Яндекс, Google, 2GIS, Zoon и Flamp. Благодарим клиентов за доверие.",
    keywords: "отзывы Freonn, благодарности Freonn, оставить отзыв, монтаж вентиляции отзывы",
    canonical: "/otzyvy",
  });

  const [form, setForm] = useState({ name: "", company: "", email: "", text: "", rating: 5 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      toast.error("Укажите имя и текст отзыва");
      return;
    }
    ymGoal("review_submit", { rating: form.rating });
    gaEvent("review_submit", { rating: form.rating, name: form.name });
    gaEvent("generate_lead", { method: "review_submit", rating: form.rating, page_path: window.location.pathname });
    toast.success("Спасибо! Ваш отзыв отправлен на модерацию.");
    setForm({ name: "", company: "", email: "", text: "", rating: 5 });
  };

  const platforms = [
    { name: "Яндекс.Карты", url: "https://yandex.ru/maps/org/freonn/" },
    { name: "Google Maps", url: "https://g.page/freonn/review" },
    { name: "2GIS", url: "https://2gis.ru/moscow/firm/freonn/" },
    { name: "Zoon", url: "https://zoon.ru/msk/firms/freonn/" },
    { name: "Flamp", url: "https://flamp.ru/firm/freonn-1412657693/" },
  ];

  return (
    <PageLayout
      title="Отзывы и благодарности"
      breadcrumb={[{ label: "Главная", href: "/" }, { label: "Отзывы" }]}
    >
      <section className="py-14 bg-white">
        <div className="container max-w-4xl">
          <p className="text-gray-600 font-body leading-relaxed mb-10">
            Мы дорожим мнением наших клиентов. После сдачи каждого объекта просим оценить
            качество проектирования, монтажа и сервиса. Отзывы публикуются на независимых
            площадках и помогают нам становиться лучше. Если вы уже работали с Freonn —
            оставьте отзыв на удобной платформе или заполните форму ниже.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-14">
            <div className="bg-[#F7F8FF] rounded-2xl p-8">
              <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-4 flex items-center gap-2">
                <Building2 size={24} className="text-[#2D3092]" /> Независимые площадки
              </h2>
              <ul className="space-y-3">
                {platforms.map((p) => (
                  <li key={p.name}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2D3092] hover:underline font-body"
                    >
                      {p.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-4 flex items-center gap-2">
                <MessageSquare size={24} className="text-[#2D3092]" /> Оставить отзыв
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Компания / объект</Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (не публикуется)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Оценка</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setForm({ ...form, rating: star })}
                        className={`p-1 ${star <= form.rating ? "text-yellow-400" : "text-gray-300"}`}
                        aria-label={`Оценка ${star}`}
                      >
                        <Star size={24} fill="currentColor" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="text">Текст отзыва *</Label>
                  <Textarea
                    id="text"
                    rows={4}
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="bg-[#0F1340] hover:bg-[#2D3092] text-white">
                  Отправить отзыв
                </Button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-10">
            <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-4">
              Почему отзывы важны
            </h2>
            <p className="text-gray-600 font-body leading-relaxed">
              Реальные отзывы помогают будущим клиентам выбрать подрядчика, а нам — понять,
              что важно для бизнес-центров, складов, торговых центров и производственных
              объектов. Мы публикуем только проверенные отзывы и не редактируем их без
              согласования автора.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
