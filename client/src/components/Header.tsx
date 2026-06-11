/*
 * FREONN HEADER — Bold Technical Expressionism
 * Always transparent background.
 * On dark sections (data-theme="dark"): white logo (inverted), white nav, white border button "ЗАЯВКА", white burger.
 * On light sections (data-theme="light"): colored logo (normal), dark navy nav, red-border button "ЗАЯВКА", dark burger.
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, ChevronDown, Menu, X } from "lucide-react";
import UnifiedAccountBanner from "@/components/freonn-group/UnifiedAccountBanner";
import { AuthNavActions } from "@/components/freonn-group/AuthNavActions";
import { isFreonnAuthNavVisible } from "@/lib/freonn-group/config";
import { toast } from "sonner";
import { ymGoal } from "@/lib/ym";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663524928365/d5oRPUYjSRzESZKpUgG9pW/freonn-logo_62401a1b.png";

const navItems = [
  { label: "О компании", href: "/o-kompanii" },
  {
    label: "Услуги", href: "/uslugi", children: [
      { label: "Вентиляция", href: "/ustanovka-ventilyacii" },
      { label: "Кондиционирование", href: "/ustanovka-kondicionirovaniya" },
      { label: "Дымоудаление", href: "/ustanovka-dymoudaleniya" },
      { label: "Отопление и теплоснабжение", href: "/vozdushnoe-otoplenie" },
      { label: "Холодоснабжение", href: "/holodosnabzhenie" },
      { label: "Водоснабжение и канализация", href: "/vodosnabzhenie-i-kanalizaciya" },
      { label: "Электроснабжение", href: "/elektrosnabzhenie-i-osveshchenie" },
      { label: "Пескоструйная обработка", href: "/peskostrujnaya-obrabotka" },
    ]
  },
  { label: "Цены", href: "/ceny" },
  { label: "Объекты", href: "/obekty" },
  { label: "Блог", href: "/blog" },
  { label: "Вопросы", href: "/faq" },
  { label: "Контакты", href: "/contacts" },
];

const topBarLinks = [
  { label: "Акции", href: "/akcii" },
  { label: "Гарантии", href: "/garantii" },
  { label: "Сертификаты", href: "/sertifikaty" },
];

// theme-color map: route prefix -> color
const ROUTE_THEME_COLORS: { prefix: string; color: string }[] = [
  { prefix: "/", color: "#0A0E2E" }, // Home — dark hero
  { prefix: "/thanks", color: "#0F1340" },
  { prefix: "/contacts", color: "#ffffff" },
  { prefix: "/o-kompanii", color: "#ffffff" },
  { prefix: "/uslugi", color: "#ffffff" },
  { prefix: "/ustanovka-", color: "#ffffff" },
  { prefix: "/vozdushnoe-", color: "#ffffff" },
  { prefix: "/holodosnabzhenie", color: "#ffffff" },
  { prefix: "/vodosnabzhenie-", color: "#ffffff" },
  { prefix: "/elektrosnabzhenie-", color: "#ffffff" },
  { prefix: "/peskostrujnaya-", color: "#ffffff" },
  { prefix: "/ceny", color: "#ffffff" },
  { prefix: "/obekty", color: "#ffffff" },
  { prefix: "/blog", color: "#ffffff" },
  { prefix: "/faq", color: "#ffffff" },
  { prefix: "/garantii", color: "#ffffff" },
  { prefix: "/akcii", color: "#ffffff" },
];

export default function Header() {
  const showFreonnAuth = isFreonnAuthNavVisible();
  const headerTop = showFreonnAuth ? 36 : 0;
  // isDark: true = over dark bg (white elements), false = over light bg (colored elements)
  const [isDark, setIsDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [location] = useLocation();

  // Update theme-color based on scroll position — matches visible section bg
  useEffect(() => {
    // Ensure meta tag exists
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta') as HTMLMetaElement;
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }

    const setColor = (color: string) => {
      const m = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
      if (m) m.setAttribute('content', color);
    };

    const updateThemeColor = () => {
      const scrollY = window.scrollY;
      let matched = location === '/' ? '#0A0E2E' : '#ffffff';

      const themeSections = document.querySelectorAll('[data-theme]');
      themeSections.forEach((section) => {
        const el = section as HTMLElement;
        const top = el.offsetTop - 10;
        const bottom = top + el.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          const theme = el.dataset.theme;
          if (theme === 'dark') {
            // Check if it's the Hero section (has video bg)
            matched = el.classList.contains('bg-[#0A0E2E]') ? '#1a2a6c' : '#1e3a7a';
          } else {
            // light sections: check actual bg color
            if (el.classList.contains('bg-[#F7F8FF]')) matched = '#F7F8FF';
            else matched = '#ffffff';
          }
        }
      });

      setColor(matched);
    };

    // Set initial color based on route
    setColor(location === '/' ? '#1a2a6c' : '#ffffff');
    updateThemeColor();

    window.addEventListener('scroll', updateThemeColor, { passive: true });
    return () => window.removeEventListener('scroll', updateThemeColor);
  }, [location]);

  useEffect(() => {
    const checkBackground = () => {
      const scrollY = window.scrollY;
      const headerHeight = 70;
      const checkPoint = scrollY + headerHeight / 2;

      const sections = document.querySelectorAll("[data-theme]");
      let currentTheme = "dark"; // default to dark (white elements)

      if (sections.length === 0) {
        currentTheme = scrollY < 100 ? "dark" : "light";
      } else {
        sections.forEach((section) => {
          const el = section as HTMLElement;
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (checkPoint >= top && checkPoint < bottom) {
            currentTheme = el.dataset.theme || "dark";
          }
        });
      }

      const dark = currentTheme === "dark";
      setIsDark(dark);

    };

    window.addEventListener("scroll", checkBackground, { passive: true });
    checkBackground();
    return () => window.removeEventListener("scroll", checkBackground);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleTopLink = () => toast.info("Раздел в разработке");

  // Always transparent — only text/icon colours change
  const navTextClass = isDark
    ? "text-white hover:text-white/70"
    : "text-[#0F1340] hover:text-[#B91C1C]";

  const ctaBtnClass = isDark
    ? "border-white text-white hover:bg-white hover:text-[#0F1340]"
    : "border-[#B91C1C] text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white";

  const burgerClass = isDark
    ? "text-white hover:text-white/70"
    : "text-[#0F1340] hover:text-[#B91C1C]";

  const logoFilter = ""; // logo always in original colors

  return (
    <>
    {showFreonnAuth ? (
      <div className="fixed inset-x-0 top-0 z-[60]">
        <UnifiedAccountBanner />
      </div>
    ) : null}
    <header className="fixed left-0 right-0 z-50 w-full transition-all duration-300 bg-transparent" style={{ top: headerTop, paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="container flex items-center gap-3 sm:gap-4 lg:gap-6 py-3 sm:py-4">
        {/* Logo */}
        <a href="/" className="flex-shrink-0 flex flex-col items-center">
          <img
            src={LOGO_URL}
            alt="Freonn"
            className={`h-9 sm:h-11 w-auto transition-all duration-300 ${logoFilter}`}
            fetchPriority="high"
            decoding="async"
            width="160"
            height="44"
          />
          <span className="text-[9px] sm:text-[10px] font-heading font-bold tracking-[0.25em] uppercase leading-none mt-0.5 select-none">
            {'Engineering'.split('').map((char, i) => (
              <span key={i} style={{ color: i % 2 === 0 ? '#B91C1C' : '#2D3092' }}>{char}</span>
            ))}
          </span>
        </a>

        <div className="flex-1" />

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-0">
          {navItems.map(item => (
            <div key={item.label} className="relative group flex-shrink-0">
              <a
                href={item.href}
                className={`flex items-center gap-1 px-3 xl:px-4 py-2 whitespace-nowrap text-sm font-heading font-medium uppercase tracking-wide transition-colors duration-300 ${navTextClass}`}
              >
                {item.label}
                {item.children && (
                  <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-200" />
                )}
              </a>
              {item.children && (
                <div className="absolute top-full left-0 w-64 bg-[#0F1340]/95 backdrop-blur-sm border-t-2 border-[#B91C1C] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-b-lg">
                  {item.children.map(child => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white font-body border-b border-white/10 last:border-0"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {showFreonnAuth ? (
          <div className="hidden lg:block flex-shrink-0">
            <AuthNavActions />
          </div>
        ) : null}

        {/* CTA button — desktop */}
        <a
          href="/contacts"
          onClick={() => ymGoal("header_cta_click")}
          className={`hidden lg:inline-flex items-center text-sm py-2 px-5 xl:px-6 rounded-full font-heading font-bold uppercase tracking-wide transition-all duration-300 flex-shrink-0 border-2 ${ctaBtnClass}`}
        >
          Заявка
        </a>

        {showFreonnAuth ? (
          <div className="lg:hidden flex-shrink-0 scale-90">
            <AuthNavActions className="gap-1" />
          </div>
        ) : null}

        {/* Mobile CTA button */}
        <a
          href="/contacts"
          onClick={() => ymGoal("header_cta_click")}
          className={`lg:hidden text-xs py-2 px-4 flex-shrink-0 font-heading font-bold uppercase tracking-wide rounded-full border-2 transition-all duration-300 ${ctaBtnClass}`}
        >
          Заявка
        </a>

        {/* Mobile menu toggle */}
        <button
          className={`lg:hidden p-2 flex-shrink-0 transition-colors duration-300 ${burgerClass}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop burger */}
        <button
          className={`hidden lg:flex p-2 flex-shrink-0 transition-colors duration-300 ${burgerClass}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile menu — full screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 top-0 bg-[#0F1340] text-white z-[100] overflow-y-auto"
          >
            {/* Mobile menu header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <img src={LOGO_URL} alt="Freonn" className="h-9 w-auto brightness-0 invert" loading="lazy" decoding="async" width="160" height="36" />
              <button onClick={() => setMobileOpen(false)} className="p-2 text-white/80 hover:text-white">
                <X size={24} />
              </button>
            </div>
            {/* Contact info */}
            <div className="px-4 py-4 bg-[#B91C1C]/10 border-b border-white/10">
              <a href="tel:88001012009" onClick={() => ymGoal("phone_click")} className="flex items-center gap-2 text-white font-heading font-semibold text-lg mb-1">
                <Phone size={18} className="text-[#B91C1C]" /> 8(800)101-2009
              </a>
              <p className="text-white/50 text-xs font-body">Бесплатно по России · Пн-Сб 9:00–19:00</p>
            </div>
            {/* Nav links */}
            <div className="flex flex-col">
              {navItems.map(item => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className="w-full flex items-center justify-between py-4 px-4 border-b border-white/10 font-heading font-medium uppercase text-sm tracking-wide hover:text-[#B91C1C] transition-colors"
                      >
                        {item.label}
                        <ChevronDown size={16} className={`transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-[#1a2060]"
                          >
                            {item.children.map(child => (
                              <a
                                key={child.label}
                                href={child.href}
                                onClick={() => { setMobileOpen(false); ymGoal("nav_child_click", { label: child.label }); }}
                                className="block py-3 px-8 text-sm text-white/70 hover:text-[#B91C1C] border-b border-white/5 font-body transition-colors"
                              >
                                {child.label}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => { setMobileOpen(false); ymGoal("nav_click", { label: item.label }); }}
                      className="block py-4 px-4 border-b border-white/10 font-heading font-medium uppercase text-sm tracking-wide hover:text-[#B91C1C] transition-colors"
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
            {showFreonnAuth ? (
              <div className="px-4 pt-4">
                <AuthNavActions variant="stack" onNavigate={() => setMobileOpen(false)} />
              </div>
            ) : null}

            {/* Bottom CTA */}
            <div className="p-4 mt-2 flex flex-col gap-3">
              <a href="/contacts" onClick={() => { setMobileOpen(false); ymGoal("mobile_engineer_click"); }} className="btn-primary text-center text-base py-3">
                Вызвать инженера
              </a>
              <a href="/contacts" onClick={() => { setMobileOpen(false); ymGoal("mobile_tender_click"); }} className="btn-outline text-center text-base py-3 border-white text-white rounded-full">
                Пригласить в тендер
              </a>
              <a
                href="https://max.ru/id3604084591_biz"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { setMobileOpen(false); ymGoal("mobile_works_click"); }}
                className="btn-outline text-center text-base py-3"
              >
                Наши работы
              </a>
            </div>
            {/* Footer links in mobile menu */}
            <div className="px-4 pb-6 flex flex-wrap gap-3">
              {topBarLinks.map(link => (
                <a key={link.href} href={link.href} className="text-white/40 text-xs font-body hover:text-white/70 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}
