/*
 * FREONN CONTACTS PAGE — /contacts
 */
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";

export default function ContactsPage() {

  useSEO({
    title: "Контакты — Freonn инженерная компания",
    description: "Свяжитесь с нами: 8(800)101-2009 (бесплатно). Офис в Дзержинском, Московская область. Выезд инженера по Москве и МО. Оставьте заявку онлайн — ответим в течение 15 минут.",
    keywords: "контакты Freonn, телефон инженерной компании, заявка на вентиляцию, вызов инженера Москва, адрес офиса",
    canonical: "/contacts",
    breadcrumbs: [{ name: "Контакты", url: "/contacts" }],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Контакты Freonn",
      url: "https://freonn.ru/contacts",
      description: "Контактная информация инженерной компании Freonn. Телефон, адрес, форма обратной связи.",
      mainEntity: {
        "@type": "LocalBusiness",
        name: "Freonn",
        telephone: "+78001012009",
        email: "freonn@internet.ru",
        url: "https://freonn.ru",
        address: {
          "@type": "PostalAddress",
          streetAddress: "ул. Ленина, д. 2Б",
          addressCountry: "RU",
          addressRegion: "Московская область",
          addressLocality: "Дзержинский",
          postalCode: "143500",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 55.9167,
          longitude: 36.8667,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "19:00",
          },
        ],
      },
    },
  });
  return (
    <PageLayout
      title="Контакты"
      breadcrumb={[{ label: "Контакты" }]}
    >
      <ContactSection />
    </PageLayout>
  );
}
