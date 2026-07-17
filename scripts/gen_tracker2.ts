import { SERVICE_SLUGS } from '../shared/geoRoutes';
import { SERVICE_ALIASES, PRICE_CITY_SERVICES, buildServiceAliasCityPath, buildPriceCityPath } from '../shared/seoMatrix';
import { CONTENT_PAGES } from '../shared/contentPages';
import fs from 'fs';

const existing = new Set(['/ceny','/contacts','/','/dymoudalenie','/about/']);
const out:string[] = [];
function add(u:string){ if(!existing.has(u)){ existing.add(u); out.push(u); } }

['/uslugi','/karta-sajta','/team','/otzyvy','/stati','/o-kompanii','/faq','/slovar','/kejs','/akcii','/novosti','/vakansii','/dokumenty','/partnery','/oplata-i-dostavka','/rekvizity','/garantii','/politika-konfidencialnosti','/polzovatelskoe-soglashenie','/kalkulyator','/blog','/contacts','/ceny'].forEach(add);
['moskva','moskovskaya-oblast','dzerzhinskij','khimki','odintsovo','lyubertsy','mytishchi','balashikha','podolsk','noginsk','domodedovo','dmitrov','istra'].forEach(c=>add(`/${c}`));
add('/stati');
CONTENT_PAGES.forEach(p=>add(`/stati/${p.slug}`));
const geoCities = ['moskva','moskovskaya-oblast','khimki','odintsovo','lyubertsy','mytishchi','balashikha','podolsk'];
SERVICE_SLUGS.forEach(s=>{
  add(`/${s}`);
  add(`/ceny/${s}`);
  geoCities.forEach(c=>add(`/${s}-${c}`));
});
const topObjects = ['sklad','ofis','tc','zavod','restoran'];
SERVICE_SLUGS.forEach(s=>{
  topObjects.forEach(o=>add(`/${s}-${o}`));
});
SERVICE_ALIASES.forEach(a=>{
  add(`/${a.slug}`);
  ['moskva','moskovskaya-oblast','khimki','odintsovo','lyubertsy'].forEach(c=>{
    add(buildServiceAliasCityPath(a.slug,c));
  });
});
PRICE_CITY_SERVICES.forEach(s=>{
  geoCities.forEach(c=>add(buildPriceCityPath(s,c)));
});
['/blog/tekhnicheskij-audit','/blog/ventilyacionnoe-oborudovanie','/blog/kkb-dlya-pritochnoj-ustanovki','/blog/ventilyaciya-avtostoyanka'].forEach(add);
add('/obekty');
['sklad','ofis','tc','zavod','restoran'].forEach(o=>add(`/obekty/${o}`));

const full = out.map(u => 'https://freonn.ru' + u);
const tracker = full.slice(0,95);
fs.writeFileSync('/home/ubuntu/yandex_tracker_urls.txt', tracker.join('\n'), 'utf-8');
const bing = full.slice(0,100);
fs.writeFileSync('/home/ubuntu/bing_urls.txt', bing.join('\n'), 'utf-8');
console.log('tracker ' + tracker.length + ', bing ' + bing.length + ' written');
