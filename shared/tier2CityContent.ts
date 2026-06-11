import type { CityContent } from "./cityContent";
import { CITY_BY_SLUG } from "./geoRoutes";

/** Tier-2 города (~44): лёгкая уникализация district + lsi */
const TIER2_DISTRICT: Record<string, string> = {
  solnechnogorsk: "Солнечногорском районе",
  volokolamsk: "Волоколамском районе",
  ruza: "Рузском районе",
  mozhaisk: "Можайском районе",
  "naro-fominsk": "Наро-Фоминском районе",
  chekhov: "Чеховском районе",
  fryazevo: "городском округе Фрязево",
  pushkino: "Пушкинском городском округе",
  dubna: "городском округе Дубна",
  taldom: "Талдомском районе",
  "orekhovo-zuevo": "Орехово-Зуевском городском округе",
  voskresensk: "Воскресенском городском округе",
  kashira: "Каширском городском округе",
  stupino: "Ступинском городском округе",
  protvino: "городском округе Протвино",
  lobnya: "городском округе Лобня",
  krasnoznamensk: "городском округе Краснознаменск",
  troitsk: "городском округе Троицк",
  shcherbinka: "городском округе Щербинка",
  vidnoye: "Ленинском городском округе",
  reutov: "городском округе Реутов",
  kotelniki: "городском округе Котельники",
  lytkarino: "городском округе Лыткарино",
  fryazino: "городском округе Фрязино",
  ivanteevka: "городском округе Ивантеевка",
  krasnoarmeysk: "городском округе Красноармейск",
  hotkovo: "городском округе Хотьково",
  pushchino: "городском округе Пущино",
  chernogolovka: "городском округе Черноголовка",
  zvenigorod: "городском округе Звенигород",
  kubinka: "городском округе Кубинка",
  aprelevka: "городском округе Апрелевка",
  bronnitsy: "городском округе Бронницы",
  egorevsk: "городском округе Егорьевск",
  ozery: "городском округе Озёры",
  "pavlovsky-posad": "городском округе Павловский Посад",
  roshal: "городском округе Рошаль",
  shatura: "городском округе Шатура",
  vereya: "Наро-Фоминском районе",
  yakhroma: "Дмитровском районе",
  "staraya-kupavna": "Ногинском районе",
  elektrogorsk: "Ногинском районе",
  "likino-dulevo": "Орехово-Зуевском городском округе",
  krasnozavodsk: "Сергиево-Посадском районе",
};

function buildTier2Entry(slug: string): CityContent {
  const city = CITY_BY_SLUG[slug];
  const district = TIER2_DISTRICT[slug] ?? `городе ${city.name}`;
  return {
    district,
    lsi: `Freonn выполняет проектирование и монтаж вентиляции, кондиционирования, дымоудаления и отопления ${city.phrase}. Работаем с промышленными предприятиями, торговыми центрами, складами и жилыми комплексами ${city.name} и близлежащих населённых пунктов.`,
    objects: "Промышленные объекты, ТЦ, склады, ЖК",
  };
}

export const TIER2_CITY_CONTENT: Record<string, CityContent> = Object.fromEntries(
  Object.keys(TIER2_DISTRICT).map((slug) => [slug, buildTier2Entry(slug)])
);
