import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import { Award, Users, HardHat, ClipboardCheck, Phone } from "lucide-react";

export default function TeamPage() {
  useSEO({
    title: "Команда Freonn — инженеры и проектировщики",
    description:
      "Команда Freonn: проектировщики, инженеры, сметчики и прорабы с опытом от 8 лет. Лицензии, допуски СРО, сертификация производителей оборудования.",
    keywords: "команда Freonn, инженеры Freonn, проектировщики ОВиК, монтажники вентиляции, сертифицированные специалисты",
    canonical: "/team",
  });

  const departments = [
    {
      title: "Проектный отдел",
      icon: <ClipboardCheck size={28} className="text-[#2D3092]" />,
      items: ["Главный инженер по проектированию", "Теплотехники и вентиляционщики", "Электротехники", "Сметчики и ПТО"],
    },
    {
      title: "Монтажные бригады",
      icon: <HardHat size={28} className="text-[#2D3092]" />,
      items: ["Бригадиры с опытом от 10 лет", "Монтажники вентиляции и кондиционирования", "Электромонтажники", "Слесари-сантехники и теплосети"],
    },
    {
      title: "Сервис и согласования",
      icon: <Users size={28} className="text-[#2D3092]" />,
      items: ["Инженеры по пусконаладке", "Специалисты по согласованию с МЧС и эксплуатацией", "Менеджеры проектов", "Отдел технической поддержки"],
    },
  ];

  return (
    <PageLayout
      title="Команда Freonn"
      breadcrumb={[{ label: "Главная", href: "/" }, { label: "Команда" }]}
    >
      <section className="py-14 bg-white">
        <div className="container max-w-4xl">
          <p className="text-gray-600 font-body leading-relaxed mb-10">
            Freonn — это команда из более чем 30 инженеров, проектировщиков и монтажников.
            Средний опыт специалистов в инженерных системах — от 8 лет. Мы постоянно повышаем
            квалификацию, проходим сертификацию у производителей оборудования и работаем по
            внутренним стандартам качества.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            <div className="bg-[#F7F8FF] p-6 rounded-2xl text-center">
              <div className="text-3xl font-heading font-bold text-[#0F1340]">30+</div>
              <div className="text-gray-600 font-body text-sm">инженеров и монтажников</div>
            </div>
            <div className="bg-[#F7F8FF] p-6 rounded-2xl text-center">
              <div className="text-3xl font-heading font-bold text-[#0F1340]">15</div>
              <div className="text-gray-600 font-body text-sm">лет средний опыт руководства</div>
            </div>
            <div className="bg-[#F7F8FF] p-6 rounded-2xl text-center">
              <div className="text-3xl font-heading font-bold text-[#0F1340]">8+</div>
              <div className="text-gray-600 font-body text-sm">лет средний стаж специалистов</div>
            </div>
          </div>

          <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-6">Структура команды</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {departments.map((dept) => (
              <div key={dept.title} className="border border-gray-200 rounded-2xl p-6">
                <div className="mb-4">{dept.icon}</div>
                <h3 className="font-heading font-bold text-[#0F1340] text-lg mb-3">{dept.title}</h3>
                <ul className="space-y-2">
                  {dept.items.map((item) => (
                    <li key={item} className="text-gray-600 font-body text-sm flex items-start gap-2">
                      <Award size={14} className="mt-1 flex-shrink-0 text-[#B91C1C]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-[#0F1340] text-white rounded-2xl p-8">
            <h2 className="font-heading font-bold text-xl mb-3">Приглашаем к сотрудничеству</h2>
            <p className="font-body text-white/80 mb-4">
              Ищем инженеров, прорабов и проектировщиков. Если у вас есть опыт в ОВиК,
              электроснабжении или холодоснабжении — отправьте резюме или позвоните.
            </p>
            <a
              href="tel:88001012009"
              className="inline-flex items-center gap-2 bg-[#B91C1C] hover:bg-[#991b1b] text-white px-5 py-2.5 rounded-lg font-body font-medium transition-colors"
            >
              <Phone size={18} /> 8 (800) 101-20-09
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
