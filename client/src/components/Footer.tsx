/*
 * FREONN FOOTER — Full ceds.ru navigation structure
 * Brand: Freonn — dark navy #0F1340, red accent #B91C1C
 */
import { getFooterCityLinks, getFooterServiceGeoLinks } from "@shared/geoRoutes";
import { Phone, Mail, MapPin, Clock, Youtube } from "lucide-react";
import { ymGoal } from "@/lib/ym";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663524928365/d5oRPUYjSRzESZKpUgG9pW/freonn-logo_62401a1b.png";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  "О компании": [
    { label: "О нас", href: "/o-kompanii" },
    { label: "Новости", href: "/novosti" },
    { label: "Лицензии и сертификаты", href: "/sertifikaty" },
    { label: "Реквизиты", href: "/rekvizity" },
    { label: "Документы", href: "/dokumenty" },
    { label: "Вакансии", href: "/vakansii" },
    { label: "Партнёрам", href: "/partnery" },
    { label: "Контакты", href: "/contacts" },
  ],
  "Инженерные системы": [
    { label: "Проектирование ОВиК", href: "/proektirovanie-ovik" },
    { label: "Монтаж ОВиК", href: "/montazh-ovik" },
    { label: "Установка вентиляции", href: "/ustanovka-ventilyacii" },
    { label: "Установка кондиционирования", href: "/ustanovka-kondicionirovaniya" },
    { label: "Установка дымоудаления", href: "/ustanovka-dymoudaleniya" },
    { label: "Воздушное отопление", href: "/vozdushnoe-otoplenie" },
    { label: "Холодоснабжение", href: "/holodosnabzhenie" },
    { label: "Водоснабжение и канализация", href: "/vodosnabzhenie-i-kanalizaciya" },
    { label: "Электроснабжение и освещение", href: "/elektrosnabzhenie-i-osveshchenie" },
    { label: "Пескоструйная обработка", href: "/peskostrujnaya-obrabotka" },
    { label: "Пусконаладочные работы", href: "/puskonaladochnye-raboty" },
    { label: "Сервисное обслуживание", href: "/servisnoe-obsluzhivanie" },
  ],
  "Стоимость и прайсы": [
    { label: "Цены на монтаж вентиляции", href: "/ceny-na-montazh-ventilyacii" },
    { label: "Цены на монтаж кондиционирования", href: "/ceny-na-montazh-kondicionirovaniya" },
    { label: "Цены на монтаж дымоудаления", href: "/ceny-na-montazh-dymoudaleniya" },
    { label: "Цены на монтаж инженерных систем", href: "/ceny-na-montazh-inzhenernyh-sistem" },
    { label: "Цены на пескоструй", href: "/ceny-na-peskostruj" },
  ],
  "Блог": [
    { label: "Кратность и расчёт воздухообмена", href: "/blog/kratnost-i-raschet-vozduhoobmena" },
    { label: "Вентиляционное оборудование", href: "/blog/ventilyacionnoe-oborudovanie" },
    { label: "Рекуператор", href: "/blog/rekuperator" },
    { label: "Кондиционирование воздуха", href: "/blog/kondicionirovanie-vozduha" },
    { label: "Фильтры для вытяжек", href: "/blog/filtry-dlya-vytyazhek" },
    { label: "Канальные вентиляторы", href: "/blog/kanalnye-ventilyatory" },
    { label: "Монтаж вентиляции", href: "/blog/montazh-ventilyacii" },
    { label: "Автоматизация систем", href: "/blog/avtomatizaciya-sistem" },
    { label: "Технический аудит", href: "/blog/tekhnicheskij-audit" },
    { label: "Словарь терминов ОВиК", href: "/slovar" },
    { label: "Калькулятор стоимости", href: "/kalkulyator-inzhenernyh-sistem" },
    { label: "Карта сайта", href: "/karta-sajta" },
  ],
};

const cities = getFooterCityLinks();
const serviceGeoLinks = getFooterServiceGeoLinks();

export default function Footer() {
  return (
    <footer className="bg-[#080D2E] text-white">
      <div className="container py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {/* Logo & description */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <img src={LOGO_URL} alt="Freonn" className="h-10 w-auto mb-4" loading="lazy" decoding="async" width="160" height="40" />
            <p className="text-white/60 text-sm font-body leading-relaxed mb-6 max-w-xs">
              Инженерная компания Freonn — проектирование, монтаж и обслуживание инженерных систем для промышленности, бизнеса и премиум недвижимости в Москве и Московской области.
            </p>
            <div className="space-y-2.5 mb-6">
              <a href="tel:88001012009" onClick={() => ymGoal("phone_click")} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-body">
                <Phone size={14} className="text-[#B91C1C] flex-shrink-0" /> 8(800)101-2009
              </a>
              <a href="mailto:freonn@internet.ru" onClick={() => ymGoal("email_click")} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-body">
                <Mail size={14} className="text-[#B91C1C] flex-shrink-0" /> freonn@internet.ru
              </a>
              <div className="flex items-start gap-2 text-white/60 text-sm font-body">
                <MapPin size={14} className="text-[#B91C1C] flex-shrink-0 mt-0.5" />
                Московская обл., г. Дзержинский, ул. Ленина 2Б
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm font-body">
                <Clock size={14} className="text-[#B91C1C] flex-shrink-0" />
                Пн–Сб: 9:00 – 19:00
              </div>
            </div>
            {/* Yandex rating */}
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-5">
              {/* Yandex Maps pin icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 flex-shrink-0" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#FC3F1D"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-heading font-bold text-lg leading-none">4,9</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4].map(i => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="#FFC107"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32L2.27 6.62l5.34-.78z"/></svg>
                    ))}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-3.5 h-3.5">
                      <defs><linearGradient id="hstar"><stop offset="80%" stopColor="#FFC107"/><stop offset="80%" stopColor="#ffffff20"/></linearGradient></defs>
                      <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32L2.27 6.62l5.34-.78z" fill="url(#hstar)"/>
                    </svg>
                  </div>
                </div>
                <div className="text-white/50 text-xs font-body mt-0.5">Рейтинг в Яндексе</div>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <a href="https://www.youtube.com/@freonn" target="_blank" rel="noopener noreferrer" onClick={() => ymGoal("social_click", { platform: "YouTube" })} className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#B91C1C] flex items-center justify-center transition-colors" title="YouTube">
                <Youtube size={16} />
              </a>
              <a href="https://vk.com/freonn" target="_blank" rel="noopener noreferrer" onClick={() => ymGoal("social_click", { platform: "VK" })} className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#B91C1C] flex items-center justify-center transition-colors text-xs font-bold" title="ВКонтакте">
                ВК
              </a>
              <a href="https://dzen.ru/freonn" target="_blank" rel="noopener noreferrer" onClick={() => ymGoal("social_click", { platform: "Dzen" })} className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#B91C1C] flex items-center justify-center transition-colors text-xs font-bold" title="Яндекс Дзен">
                Дз
              </a>
              <a href="https://max.ru/id3604084591_biz" target="_blank" rel="noopener noreferrer" onClick={() => ymGoal("messenger_click", { messenger: "MAX" })} className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#B91C1C] flex items-center justify-center transition-colors" title="MAX — наши работы">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720" className="w-4 h-4">
                  <path fill="currentColor" d="M350.4,9.6C141.8,20.5,4.1,184.1,12.8,390.4c3.8,90.3,40.1,168,48.7,253.7,2.2,22.2-4.2,49.6,21.4,59.3,31.5,11.9,79.8-8.1,106.2-26.4,9-6.1,17.6-13.2,24.2-22,27.3,18.1,53.2,35.6,85.7,43.4,143.1,34.3,299.9-44.2,369.6-170.3C799.6,291.2,622.5-4.6,350.4,9.6h0ZM269.4,504c-11.3,8.8-22.2,20.8-34.7,27.7-18.1,9.7-23.7-.4-30.5-16.4-21.4-50.9-24-137.6-11.5-190.9,16.8-72.5,72.9-136.3,150-143.1,78-6.9,150.4,32.7,183.1,104.2,72.4,159.1-112.9,316.2-256.4,218.6h0Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-heading font-semibold text-white uppercase text-xs tracking-wider mb-4 pb-2 border-b border-white/10">
                {section}
              </h4>
              <ul className="space-y-1.5">
                {links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="text-white/50 hover:text-[#B91C1C] transition-colors text-xs font-body leading-relaxed">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-6 sm:gap-8 mt-10 pt-8 border-t border-white/10">
          <div>
            <h4 className="font-heading font-semibold text-white uppercase text-xs tracking-wider mb-4 pb-2 border-b border-white/10">
              Города Москвы и МО
            </h4>
            <ul className="columns-2 gap-4 space-y-1.5">
              {cities.map((city) => (
                <li key={city.href} className="break-inside-avoid">
                  <a href={city.href} className="text-white/50 hover:text-[#B91C1C] transition-colors text-xs font-body">
                    {city.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white uppercase text-xs tracking-wider mb-4 pb-2 border-b border-white/10">
              Услуги в регионе
            </h4>
            <ul className="columns-2 gap-4 space-y-1.5">
              {serviceGeoLinks.map((link) => (
                <li key={link.href} className="break-inside-avoid">
                  <a href={link.href} className="text-white/50 hover:text-[#B91C1C] transition-colors text-xs font-body">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30 font-body">
          <div>© 2011 ООО «ЭКС». Сайт носит исключительно информационный характер и не является публичной офертой.
            {' · '}
            <a href="https://freonn.pro" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors" style={{ color: 'rgba(237,28,36,0.5)' }}>
              Промышленные здания: freonn.pro
            </a>
          </div>
          <div className="flex gap-4">
            <a href="/politika-konfidencialnosti" className="hover:text-white/60 transition-colors">Политика конфиденциальности</a>
            <a href="/karta-sajta" className="hover:text-white/60 transition-colors">Карта сайта</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
