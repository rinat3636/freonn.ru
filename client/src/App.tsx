import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import PreloaderScreen from "./components/PreloaderScreen";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FreonnAuthProvider } from "./contexts/FreonnAuthContext";
import UnifiedLoginPage from "./components/freonn-group/UnifiedLoginPage";
import Home from "./pages/Home";
import ContactsPage from "./pages/Contacts";
import AboutCompanyPage from "./pages/AboutCompany";
import BlogPage from "./pages/Blog";
import BlogArticlePage from "./pages/BlogArticle";
import FAQPage from "./pages/FAQ";
import ServicesPage from "./pages/Services";
import ObjectsPage from "./pages/Objects";
import PricingPage from "./pages/Pricing";
import ServicePageComponent from "./pages/ServicePage";
import ObjectCategoryPage from "./pages/ObjectCategory";
import CityPage from "./pages/CityPage";
import NewsPage from "./pages/News";
import VacanciesPage from "./pages/Vacancies";
import RequisitesPage from "./pages/Requisites";
import GuaranteePage from "./pages/Guarantee";
import PromotionsPage from "./pages/Promotions";
import PartnersPage from "./pages/Partners";
import DocumentsPage from "./pages/Documents";
import PricingServicePage from "./pages/PricingServicePage";
import ComingSoon from "./pages/ComingSoon";
import ThanksPage from "./pages/Thanks";
import AppCallback from "./pages/auth/AppCallback";
import PolitikaKonfidencialnostiPage from "./pages/PolitikaKonfidencialnosti";
import KartaSajtaPage from "./pages/KartaSajta";
import ServiceObjectPage, { SERVICES, OBJECT_TYPES } from "./pages/ServiceObjectPage";
import ServiceGeoPage, { SERVICE_GEO_ROUTES } from "./pages/ServiceGeoPage";

function Router() {
  return (
    <Switch>
      {/* Main pages */}
      <Route path={"/"} component={Home} />
      <Route path={"/contacts"} component={ContactsPage} />
      <Route path={"/o-kompanii"} component={AboutCompanyPage} />
      <Route path={"/blog"} component={BlogPage} />
      <Route path={"/blog/:slug"} component={BlogArticlePage} />
      <Route path={"/faq"} component={FAQPage} />
      <Route path={"/uslugi"} component={ServicesPage} />
      <Route path={"/obekty"} component={ObjectsPage} />
      <Route path={"/ceny"} component={PricingPage} />

      {/* Service pages */}
      <Route path={"/ventilyaciya"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/kondicionirovanie"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/dymoudalenie"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/otoplenie"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/holodosnabzhenie"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/vodosnabzhenie"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/peskostrujnaya-obrabotka"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/elektrosnabzhenie"}>{() => <ServicePageComponent />}</Route>

      {/* Footer service aliases */}
      <Route path={"/ustanovka-ventilyacii"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/ustanovka-kondicionirovaniya"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/ustanovka-dymoudaleniya"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/vozdushnoe-otoplenie"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/vodosnabzhenie-i-kanalizaciya"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/elektrosnabzhenie-i-osveshchenie"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/proektirovanie-ovik"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/montazh-ovik"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/puskonaladochnye-raboty"}>{() => <ServicePageComponent />}</Route>
      <Route path={"/servisnoe-obsluzhivanie"}>{() => <ServicePageComponent />}</Route>

      {/* Pricing sub-pages */}
      <Route path={"/ceny-na-montazh-ventilyacii"}>{() => <PricingServicePage service="ventilyaciya" />}</Route>
      <Route path={"/ceny-na-montazh-kondicionirovaniya"}>{() => <PricingServicePage service="kondicionirovanie" />}</Route>
      <Route path={"/ceny-na-montazh-dymoudaleniya"}>{() => <PricingServicePage service="dymoudalenie" />}</Route>
      <Route path={"/ceny-na-montazh-inzhenernyh-sistem"}>{() => <PricingServicePage service="kompleks" />}</Route>
      <Route path={"/ceny-na-peskostruj"}>{() => <PricingServicePage service="peskostruj" />}</Route>
      <Route path={"/ceny/:slug"}>
        {(params) => <PricingServicePage service={params.slug || "kompleks"} />}
      </Route>

      {/* Object category pages */}
      <Route path={"/promyshlennye-obekty"}>{() => <ObjectCategoryPage category="promyshlennye-obekty" />}</Route>
      <Route path={"/kommercheskie-obekty"}>{() => <ObjectCategoryPage category="kommercheskie-obekty" />}</Route>
      <Route path={"/premium-obekty"}>{() => <ObjectCategoryPage category="premium-obekty" />}</Route>

      {/* Company sub-pages */}
      <Route path={"/licenzii-i-sertifikaty"} component={DocumentsPage} />
      <Route path={"/sertifikaty"} component={DocumentsPage} />
      <Route path={"/rekvizity"} component={RequisitesPage} />
      <Route path={"/garantii"} component={GuaranteePage} />
      <Route path={"/garantiya"} component={GuaranteePage} />
      <Route path={"/akcii"} component={PromotionsPage} />
      <Route path={"/novosti"} component={NewsPage} />
      <Route path={"/vakansii"} component={VacanciesPage} />
      <Route path={"/dokumenty"} component={DocumentsPage} />
      <Route path={"/partnery"} component={PartnersPage} />
      <Route path={"/partneram"} component={PartnersPage} />
      <Route path={"/oplata-i-dostavka"}>
        {() => (
          <ComingSoon
            title="Оплата и доставка"
            breadcrumb={[{ label: "О компании", href: "/o-kompanii" }, { label: "Оплата" }]}
          />
        )}
      </Route>
      <Route path={"/sotrudniki"}>
        {() => (
          <ComingSoon
            title="Сотрудники"
            breadcrumb={[{ label: "Сотрудники" }]}
          />
        )}
      </Route>
      <Route path={"/video-kejsy"}>
        {() => (
          <ComingSoon
            title="Видео кейсы"
            breadcrumb={[{ label: "Видео кейсы" }]}
          />
        )}
      </Route>
      <Route path={"/poleznye-materialy"}>
        {() => (
          <ComingSoon
            title="Полезные материалы"
            breadcrumb={[{ label: "Полезные материалы" }]}
          />
        )}
      </Route>

      <Route path={"/spasibo"} component={ThanksPage} />
      <Route path={"/auth/login"} component={UnifiedLoginPage} />
      <Route path={"/auth/app-callback"} component={AppCallback} />
      <Route path={"/politika-konfidencialnosti"} component={PolitikaKonfidencialnostiPage} />
      <Route path={"/karta-sajta"} component={KartaSajtaPage} />

      {/* Service × Object matrix landing pages */}
      {Object.keys(SERVICES).flatMap(svc =>
        Object.keys(OBJECT_TYPES).map(obj => {
          const svcData = SERVICES[svc];
          const objData = OBJECT_TYPES[obj];
          const path = `/${svcData.slug}-${objData.slug}`;
          return (
            <Route key={path} path={path}>
              {() => <ServiceObjectPage service={svc} objectType={obj} />}
            </Route>
          );
        })
      )}

      {/* Service × Geo landing pages for Moscow and Moscow region */}
      {SERVICE_GEO_ROUTES.map((route) => (
        <Route key={route.path} path={route.path}>
          {() => <ServiceGeoPage serviceKey={route.serviceKey} regionKey={route.regionKey} />}
        </Route>
      ))}

      {/* City pages — MUST be last before 404 */}
      <Route path={"/:city"}>
        {(params) => <CityPage city={params.city || ""} />}
      </Route>

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <FreonnAuthProvider>
        <TooltipProvider>
          <Toaster />
          {!preloaderDone && (
            <PreloaderScreen onDone={() => setPreloaderDone(true)} />
          )}
          <Router />
        </TooltipProvider>
        </FreonnAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
