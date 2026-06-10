import NotFound from "@/pages/NotFound";
import CityPage from "@/pages/CityPage";
import ServiceObjectCityPage from "@/pages/ServiceObjectCityPage";
import ServiceAliasCityPage from "@/pages/ServiceAliasCityPage";
import PricingCityPage from "@/pages/PricingCityPage";
import {
  isResolvableCitySlug,
  parsePriceCityPath,
  parseServiceAliasCityPath,
  parseServiceObjectCityPath,
} from "@shared/seoMatrix";

interface MatrixLandingPageProps {
  slug: string;
}

export default function MatrixLandingPage({ slug }: MatrixLandingPageProps) {
  const path = `/${slug}`;
  const soc = parseServiceObjectCityPath(path);
  if (soc) {
    return (
      <ServiceObjectCityPage
        serviceSlug={soc.service}
        objectSlug={soc.object}
        citySlug={soc.city}
      />
    );
  }

  const sac = parseServiceAliasCityPath(path);
  if (sac) {
    return <ServiceAliasCityPage aliasSlug={sac.alias} citySlug={sac.city} />;
  }

  const pc = parsePriceCityPath(path);
  if (pc) {
    return <PricingCityPage serviceSlug={pc.service} citySlug={pc.city} />;
  }

  if (isResolvableCitySlug(slug)) {
    return <CityPage city={slug} />;
  }

  return <NotFound />;
}
