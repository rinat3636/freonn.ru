import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import { useSEO } from "@/hooks/useSEO";

export default function CalculatorPage() {
  const [area, setArea] = useState("1000");
  const [system, setSystem] = useState("ventilyaciya");

  useSEO({
    title: "Калькулятор стоимости монтажа инженерных систем — Freonn",
    description: "Ориентировочный расчёт стоимости монтажа вентиляции, кондиционирования и других систем. Точная смета — после обследования.",
    canonical: "/kalkulyator-inzhenernyh-sistem",
    breadcrumbs: [{ name: "Калькулятор", url: "/kalkulyator-inzhenernyh-sistem" }],
  });

  const sqm = Math.max(100, Number(area) || 0);
  const rates: Record<string, { label: string; min: number; max: number }> = {
    ventilyaciya: { label: "Вентиляция", min: 800, max: 2500 },
    kondicionirovanie: { label: "Кондиционирование", min: 1200, max: 3500 },
    dymoudalenie: { label: "Дымоудаление", min: 600, max: 1800 },
    kompleks: { label: "Комплекс ОВиК", min: 1500, max: 4000 },
  };
  const rate = rates[system] ?? rates.ventilyaciya;
  const low = Math.round((sqm * rate.min) / 1000) * 1000;
  const high = Math.round((sqm * rate.max) / 1000) * 1000;

  return (
    <PageLayout title="Калькулятор стоимости" breadcrumb={[{ label: "Калькулятор" }]}>
      <section className="py-14 bg-white">
        <div className="container max-w-xl">
          <p className="text-gray-600 font-body mb-8">
            Ориентировочный диапазон для коммерческих объектов в Москве и МО. Не является публичной офертой.
          </p>
          <label className="block mb-4">
            <span className="text-sm font-heading text-[#0F1340]">Площадь объекта, м²</span>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3 font-body"
              min={100}
            />
          </label>
          <label className="block mb-8">
            <span className="text-sm font-heading text-[#0F1340]">Тип системы</span>
            <select
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3 font-body"
            >
              {Object.entries(rates).map(([key, r]) => (
                <option key={key} value={key}>{r.label}</option>
              ))}
            </select>
          </label>
          <div className="bg-[#F7F8FF] rounded-xl p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Ориентир для {rate.label.toLowerCase()}</p>
            <p className="font-heading font-bold text-2xl text-[#0F1340]">
              от {low.toLocaleString("ru-RU")} до {high.toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>
      </section>
      <ContactSection />
    </PageLayout>
  );
}
