import { ArrowRight, MapPin } from "lucide-react";
import { CITY_BY_SLUG } from "@shared/geoRoutes";
import { HOME_FEATURED_TIER1, getMoscowCoreServiceLinks } from "@shared/geoTiers";

export default function HomeGeoSection() {
  const moscowLinks = getMoscowCoreServiceLinks();
  const featuredCities = HOME_FEATURED_TIER1.map((slug) => ({
    href: `/${slug}`,
    label: CITY_BY_SLUG[slug].name,
  }));

  return (
    <section className="py-16 bg-[#F7F8FF] border-t border-gray-100">
      <div className="container">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={18} className="text-[#B91C1C]" />
          <span className="text-[#B91C1C] font-heading font-semibold text-sm uppercase tracking-wider">
            Москва и Московская область
          </span>
        </div>
        <h2 className="font-heading font-bold text-[#0F1340] text-2xl lg:text-3xl mb-4">
          Монтаж инженерных систем в Москве и ключевых городах МО
        </h2>
        <p className="text-gray-600 font-body max-w-3xl mb-8">
          Основной фокус Freonn — коммерческие и промышленные объекты в Москве и приоритетных городах Подмосковья.
          Выезд инженера, проектирование и монтаж под ключ.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-semibold text-[#0F1340] mb-3">Главные направления</h3>
            <div className="flex flex-wrap gap-2">
              <a href="/moskva" className="px-4 py-2 bg-[#0F1340] text-white rounded-full text-sm font-body">
                Москва
              </a>
              <a href="/moskovskaya-oblast" className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-body hover:border-[#2D3092]">
                Московская область
              </a>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h3 className="font-heading font-semibold text-[#0F1340] mb-3">Услуги в Москве</h3>
            <div className="flex flex-wrap gap-2">
              {moscowLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 bg-white hover:bg-[#0F1340] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-heading font-semibold text-[#0F1340] mb-3">Ключевые города МО</h3>
          <div className="flex flex-wrap gap-2">
            {featuredCities.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 px-4 py-2 bg-white hover:bg-[#B91C1C] hover:text-white text-[#0F1340] rounded-full text-sm font-body transition-colors"
              >
                {link.label} <ArrowRight size={12} />
              </a>
            ))}
            <a href="/karta-sajta" className="px-4 py-2 text-[#2D3092] text-sm font-body hover:underline">
              Все города на карте сайта
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
