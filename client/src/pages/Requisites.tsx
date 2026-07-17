import { ymGoal } from "@/lib/ym";
/*
 * FREONN REQUISITES PAGE — /rekvizity
 */
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import { Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

const requisites = [
  { label: "Полное наименование", value: "ООО «ЭКС»" },
  { label: "Краткое наименование", value: "ООО «ЭКС»" },
  { label: "ИНН", value: "3604084591" },
  { label: "КПП", value: "360401001" },
  { label: "ОГРН", value: "1243600003569" },
  { label: "Юридический адрес", value: "Воронежская область, г. Калач, ул. Красина, д. 3, оф. 3" },
  { label: "Фактический адрес", value: "Московская область, г. Дзержинский, ул. Ленина, д. 2Б" },
  { label: "Расчётный счёт", value: "40702810801500098765" },
  { label: "Банк", value: "АО «Тинькофф Банк»" },
  { label: "БИК", value: "044525974" },
  { label: "Корреспондентский счёт", value: "30101810145250000974" },
  { label: "ОКПО", value: "48372910" },
  { label: "ОКВЭД", value: "43.22 — Производство санитарно-технических работ, монтаж отопительных систем и систем кондиционирования воздуха" },
  { label: "Генеральный директор", value: "Бондарев Денис Сергеевич" },
  { label: "Телефон", value: "8(800)101-2009" },
  { label: "Email", value: "freonn@internet.ru" },
  { label: "Сайт", value: "freonn.ru" },
];

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start gap-4 py-3.5 border-b border-gray-100 last:border-0 group">
      <div className="w-52 flex-shrink-0">
        <span className="text-gray-400 font-body text-sm">{label}</span>
      </div>
      <div className="flex-1 flex items-start gap-2">
        <span className="text-[#0F1340] font-body text-sm font-medium">{value}</span>
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0 text-gray-400 hover:text-[#2D3092]"
          title="Скопировать"
        >
          {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

export default function RequisitesPage() {

  useSEO({
    title: "Реквизиты компании Freonn",
    description: "Официальные реквизиты ООО Freonn: ИНН, КПП, ОГРН, банковские реквизиты для заключения договора на монтаж инженерных систем.",
    keywords: "реквизиты Freonn, ИНН инженерная компания, договор монтаж вентиляции",
    canonical: "/rekvizity",
    breadcrumbs: [{ name: "Реквизиты", url: "/rekvizity" }],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://freonn.ru/rekvizity#webpage",
      name: "Реквизиты компании Freonn",
      description: "Официальные реквизиты ООО «ЭКС» (Freonn): ИНН, КПП, ОГРН, банковские реквизиты.",
      url: "https://freonn.ru/rekvizity",
      isPartOf: { "@id": "https://freonn.ru/#website" },
      about: { "@id": "https://freonn.ru/#organization" },
    },
  });
  return (
    <PageLayout
      title="Реквизиты компании"
      breadcrumb={[{ label: "Реквизиты" }]}
    >
      <section className="py-16 bg-white">
        <div className="container max-w-3xl">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#0F1340] rounded-xl flex items-center justify-center">
                <span className="text-white font-heading font-black text-lg">F</span>
              </div>
              <div>
                <h2 className="font-heading font-bold text-[#0F1340] text-lg">ООО «ЭКС»</h2>
                <p className="text-gray-400 font-body text-sm">Инженерная компания</p>
              </div>
            </div>
            <div>
              {requisites.map((req, i) => (
                <CopyRow key={i} label={req.label} value={req.value} />
              ))}
            </div>
          </div>

          <div className="mt-6 bg-[#F7F8FF] rounded-2xl p-5">
            <p className="text-gray-500 font-body text-sm text-center">
              Для получения счёта, договора или закрывающих документов — свяжитесь с нами по телефону{" "}
              <a href="tel:88001012009" className="text-[#2D3092] font-semibold hover:underline">8(800)101-2009</a>{" "}
              или по email{" "}
              <a href="mailto:freonn@internet.ru" className="text-[#2D3092] font-semibold hover:underline">freonn@internet.ru</a>
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
