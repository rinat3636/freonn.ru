export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  relatedHref?: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { slug: "ventilyaciya", term: "Вентиляция", definition: "Организация воздухообмена в помещении для удаления загрязнений и подачи свежего воздуха.", relatedHref: "/ventilyaciya" },
  { slug: "kondicionirovanie", term: "Кондиционирование", definition: "Поддержание температуры, влажности и качества воздуха в заданных пределах.", relatedHref: "/kondicionirovanie" },
  { slug: "dymoudalenie", term: "Дымоудаление", definition: "Система удаления продуктов горения при пожаре для эвакуации людей.", relatedHref: "/dymoudalenie" },
  { slug: "vrf-sistema", term: "VRF-система", definition: "Мультизональная система кондиционирования с одним наружным и несколькими внутренними блоками.", relatedHref: "/kondicionirovanie" },
  { slug: "chiller", term: "Чиллер", definition: "Холодильная машина для охлаждения воды или другого теплоносителя в системах кондиционирования.", relatedHref: "/holodosnabzhenie" },
  { slug: "fankojl", term: "Фанкойл", definition: "Устройство для охлаждения или нагрева воздуха с помощью водяного теплообменника.", relatedHref: "/kondicionirovanie" },
  { slug: "rekuperator", term: "Рекуператор", definition: "Теплообменник для использования энергии удаляемого воздуха для подогрева приточного.", relatedHref: "/ventilyaciya" },
  { slug: "kkb", term: "ККБ (компрессорно-конденсаторный блок)", definition: "Наружный блок системы кондиционирования с компрессором и конденсатором.", relatedHref: "/kondicionirovanie" },
  { slug: "pritochnaya-ustanovka", term: "Приточная установка", definition: "Агрегат для подачи и подготовки наружного воздуха в помещение.", relatedHref: "/ventilyaciya" },
  { slug: "vozduhoobmen", term: "Кратность воздухообмена", definition: "Отношение объёма подаваемого воздуха в час к объёму помещения.", relatedHref: "/blog/kratnost-i-raschet-vozduhoobmena" },
  { slug: "ovik", term: "ОВиК", definition: "Отопление, вентиляция и кондиционирование — комплекс инженерных систем здания.", relatedHref: "/proektirovanie-ovik" },
  { slug: "itp", term: "ИТП", definition: "Индивидуальный тепловой пункт — узел ввода и распределения тепла в здании.", relatedHref: "/otoplenie" },
  { slug: "puskonaladka", term: "Пусконаладка", definition: "Комплекс работ по настройке и проверке систем после монтажа.", relatedHref: "/puskonaladochnye-raboty" },
  { slug: "ispolnitelnaya-dokumentaciya", term: "Исполнительная документация", definition: "Комплект документов, подтверждающих соответствие смонтированных систем проекту.", relatedHref: "/dokumenty" },
  { slug: "dispetcherizaciya", term: "Диспетчеризация", definition: "Централизованный мониторинг и управление инженерными системами здания.", relatedHref: "/blog/dispetcherizaciya-sistem" },
  { slug: "hepa-filtr", term: "HEPA-фильтр", definition: "Высокоэффективный фильтр тонкой очистки воздуха, используется в медучреждениях.", relatedHref: "/ventilyaciya-bolnica-moskva" },
  { slug: "podpor-vozduha", term: "Подпор воздуха", definition: "Создание избыточного давления для предотвращения проникновения дыма в защищаемые зоны.", relatedHref: "/dymoudalenie" },
  { slug: "teplovaya-zavesa", term: "Тепловая завеса", definition: "Поток нагретого воздуха у проёма для снижения теплопотерь и проникновения холодного воздуха.", relatedHref: "/otoplenie" },
  { slug: "peskostruj", term: "Пескоструйная обработка", definition: "Очистка металлических поверхностей абразивом под высоким давлением.", relatedHref: "/peskostrujnaya-obrabotka" },
  { slug: "montazh-pod-klyuch", term: "Монтаж под ключ", definition: "Полный цикл: проектирование, поставка, монтаж, пусконаладка и сдача документации.", relatedHref: "/uslugi" },
];

export const GLOSSARY_BY_SLUG = Object.fromEntries(GLOSSARY_TERMS.map((t) => [t.slug, t]));
