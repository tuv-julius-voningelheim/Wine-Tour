import type { Aroma, Article, Grape, Producer, Region, Wine, WineStyle } from '../types'

export const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const regionLines = `
France|Bordeaux;Médoc;Margaux;Pauillac;Graves & Sauternes;Saint-Émilion;Pomerol;Bourgogne;Chablis;Côte de Nuits;Côte de Beaune;Côte Chalonnaise;Mâconnais;Champagne;Montagne de Reims;Vallée de la Marne;Côte des Blancs;Côte des Bar;Northern Rhône;Southern Rhône;Muscadet;Anjou-Saumur;Touraine;Vouvray;Centre-Loire;Alsace;Provence;Languedoc-Roussillon;Beaujolais;Jura;Savoie;Cahors;Madiran;Jurançon;Bergerac;Corsica
Italy|Piemonte;Barolo;Barbaresco;Asti & Monferrato;Toscana;Chianti Classico;Montalcino;Montepulciano;Bolgheri;Veneto;Valpolicella;Soave;Conegliano-Valdobbiadene;Collio;Colli Orientali;Trentino-Alto Adige;Franciacorta;Valtellina;Emilia-Romagna;Marche;Abruzzo;Campania;Puglia;Etna;Vittoria;Marsala;Sardegna
Spain|Rioja;Rioja Alta;Rioja Alavesa;Rioja Oriental;Ribera del Duero;Priorat & Montsant;Rías Baixas;Rueda;Jerez;Penedès;Bierzo;Toro;Jumilla & Yecla;Navarra;Basque Country & Txakoli
Portugal|Douro;Vinho Verde;Dão;Bairrada;Alentejo;Madeira;Setúbal;Lisboa & Tejo
Germany|Ahr;Baden;Franken;Hessische Bergstraße;Mittelrhein;Mosel;Nahe;Pfalz;Rheingau;Rheinhessen;Saale-Unstrut;Sachsen;Württemberg
Austria|Wachau;Kamptal;Kremstal;Weinviertel;Wagram;Vienna;Burgenland;Styria
Switzerland|Valais;Vaud & Lavaux;Graubünden;Geneva;Ticino;Three Lakes
Hungary|Tokaj;Eger;Villány;Somló
Greece|Santorini;Nemea;Naoussa;Mantinia;Crete
Georgia|Kakheti;Kartli;Imereti;Racha-Lechkhumi
Slovenia|Brda;Vipava;Kras & Istria;Podravje;Posavje
Croatia|Istria;Dalmatia & Pelješac;Slavonia & Kutjevo;Plešivica
England|Sussex;Kent
United States|Napa Valley;Oakville;Sonoma County;Paso Robles;Santa Barbara County;Lodi;Sierra Foothills;Willamette Valley;Umpqua Valley;Rogue Valley;Columbia Valley;Yakima Valley;Red Mountain;Walla Walla Valley;Finger Lakes;Monticello;Texas Hill Country
Canada|Okanagan Valley;Niagara Peninsula;Prince Edward County;Annapolis Valley
Argentina|Mendoza;Uco Valley;Luján de Cuyo;Maipú;Calchaquí Valleys;San Juan & Pedernal;Patagonia;Jujuy & Catamarca
Chile|Maipo;Colchagua;Casablanca;Aconcagua;Maule;Itata;Leyda & San Antonio
Uruguay|Canelones;Maldonado;Rivera
Brazil|Vale dos Vinhedos;Campanha Gaúcha
South Africa|Stellenbosch;Swartland;Constantia;Paarl;Franschhoek;Hemel-en-Aarde;Robertson
Australia|Barossa Valley;Eden Valley;Clare Valley;McLaren Vale;Coonawarra;Margaret River;Yarra Valley;Mornington Peninsula;Hunter Valley;Tasmania
New Zealand|Marlborough;Wairau Valley;Awatere Valley;Central Otago;Hawke's Bay;North Canterbury;Martinborough;Gisborne;Nelson
Lebanon|Bekaa Valley;Batroun
Israel|Judean Hills;Galilee & Golan Heights
Armenia|Vayots Dzor;Aragatsotn
China|Ningxia;Shandong
Japan|Yamanashi;Nagano;Hokkaido
Mexico|Valle de Guadalupe
Turkey|Thrace;Aegean;Cappadocia
Cyprus|Commandaria & Troodos
India|Nashik;Nandi Hills`.trim()

const countryCenters: Record<string, [number, number]> = {
  France:[46.3,2.1], Italy:[42.8,12.5], Spain:[40.2,-3.5], Portugal:[39.5,-8], Germany:[50.8,9], Austria:[47.6,14], Switzerland:[46.8,8.2], Hungary:[47.2,19.4], Greece:[38.5,23], Georgia:[41.8,44.6], Slovenia:[46.1,14.9], Croatia:[44.8,16], England:[51,-1], 'United States':[38,-100], Canada:[48,-109], Argentina:[-33.4,-67], Chile:[-33.5,-71], Uruguay:[-34,-56], Brazil:[-29,-52], 'South Africa':[-33,20], Australia:[-34,142], 'New Zealand':[-41.2,173], Lebanon:[33.9,35.8], Israel:[32,35], Armenia:[40.2,44.5], China:[37,105], Japan:[36.2,138], Mexico:[31.8,-116], Turkey:[39,35], Cyprus:[35,33], India:[20.5,77]
}

const grapesRaw = [
  ['Cabernet Sauvignon','red'],['Merlot','red'],['Cabernet Franc','red'],['Petit Verdot','red'],['Pinot Noir','red'],['Pinot Meunier','red'],['Gamay','red'],['Syrah / Shiraz','red'],['Grenache / Garnacha','red'],['Mourvèdre / Monastrell','red'],['Cinsault','red'],['Carignan','red'],['Tempranillo','red'],['Sangiovese','red'],['Nebbiolo','red'],['Barbera','red'],['Corvina','red'],['Aglianico','red'],['Montepulciano','red'],['Nero d’Avola','red'],['Nerello Mascalese','red'],['Malbec','red'],['Carmenère','red'],['Tannat','red'],['Pinotage','red'],['Zinfandel / Primitivo','red'],['Blaufränkisch / Lemberger','red'],['Zweigelt','red'],['Xinomavro','red'],['Agiorgitiko','red'],['Saperavi','red'],['Areni Noir','red'],['Touriga Nacional','red'],['Baga','red'],['Mencía','red'],['Listán Negro','red'],['País','red'],['Plavac Mali','red'],['Kalecik Karası','red'],['Öküzgözü','red'],['Mavro','red'],
  ['Chardonnay','white'],['Sauvignon Blanc','white'],['Riesling','white'],['Chenin Blanc','white'],['Sémillon','white'],['Pinot Gris','white'],['Pinot Blanc','white'],['Grüner Veltliner','white'],['Silvaner','white'],['Viognier','white'],['Marsanne','white'],['Roussanne','white'],['Gewürztraminer','white'],['Albariño / Alvarinho','white'],['Godello','white'],['Verdejo','white'],['Viura / Macabeo','white'],['Furmint','white'],['Assyrtiko','white'],['Carricante','white'],['Garganega','white'],['Verdicchio','white'],['Vermentino','white'],['Fiano','white'],['Arneis','white'],['Cortese','white'],['Glera','white'],['Muscat','white'],['Palomino','white'],['Pedro Ximénez','white'],['Rkatsiteli','white'],['Mtsvane','white'],['Kisi','white'],['Koshu','white'],['Torrontés','white'],['Sercial','white'],['Verdelho','white'],['Bual','white'],['Malmsey','white'],['Ribolla Gialla','white'],['Malvasia Istriana','white'],['Graševina','white'],['Narince','white'],['Xynisteri','white']
] as const

const aromaSpecs: Array<[string,string,string,string,WineStyle[]]> = [
  ['Lemon','Citrus','Fresh lemon peel and squeezed juice.','Fruit character most often associated with grape and fermentation.',['white','sparkling']],
  ['Grapefruit','Citrus','Pink grapefruit peel, pith and bright juice.','A primary fruit association.',['white','rose']],
  ['Green apple','Orchard','A just-cut crisp apple with tart freshness.','A primary fruit association, especially in cool climates.',['white','sparkling']],
  ['Pear','Orchard','Ripe pear flesh with a gentle floral sweetness.','A primary fruit association.',['white','sparkling']],
  ['Peach','Stone fruit','White peach skin and ripe yellow flesh.','A primary fruit association that often develops with ripeness.',['white','sweet']],
  ['Apricot','Stone fruit','Ripe apricot, from fresh to softly dried.','Often linked to ripe fruit or concentration.',['white','sweet']],
  ['Pineapple','Tropical','Fresh pineapple with vivid sweet-and-sour lift.','A warm-climate or ripe-fruit association.',['white']],
  ['Passion fruit','Tropical','The fragrant, tart pulp of a ripe passion fruit.','A primary aroma common in some aromatic whites.',['white']],
  ['Strawberry','Red fruit','Fresh strawberry and its delicate leafy edge.','A primary fruit association.',['rose','red']],
  ['Raspberry','Red fruit','Bright crushed raspberry with gentle tang.','A primary fruit association.',['rose','red']],
  ['Red cherry','Red fruit','Fresh cherry flesh and a subtle stone note.','A primary fruit association.',['red']],
  ['Blackberry','Black fruit','Ripe blackberry, sometimes moving toward bramble.','A primary fruit association in fuller reds.',['red','fortified']],
  ['Cassis','Black fruit','Concentrated blackcurrant fruit and leaf.','A primary fruit association strongly linked with Cabernet Sauvignon.',['red']],
  ['Plum','Black fruit','Red to black plum flesh, fresh or softly stewed.','A primary fruit association.',['red','fortified']],
  ['Violet','Floral','Fresh violet petals, delicate but distinctive.','A grape-derived floral association.',['red']],
  ['Rose','Floral','Rose petal and fragrant rose water.','A primary floral association.',['white','red','sweet']],
  ['Grass','Herbal','Fresh-cut grass and crushed green leaves.','A primary herbal association.',['white']],
  ['Mint','Herbal','Cool fresh mint leaf.','A primary herbal association shaped by site and grape.',['red']],
  ['Black pepper','Spice','Freshly cracked black peppercorn.','A grape-derived spice association, notably in Syrah.',['red']],
  ['Wet stone','Earth & mineral','Rain on stone: a cool, clean sensory association.','Mineral language describes perception; it does not mean rock is dissolved in wine.',['white','sparkling']],
  ['Slate','Earth & mineral','A dry, stony impression reminiscent of warm slate.','A sensory association, not a literal ingredient.',['white']],
  ['Forest floor','Earth & mineral','Damp leaves, woodland earth and mushroom.','Often emerges as red wine develops in bottle.',['red']],
  ['Brioche','Fermentation','Warm brioche crust with butter and yeast.','Often develops through lees contact and bottle ageing.',['sparkling','white']],
  ['Cream','Fermentation','Soft dairy richness rather than sweetness.','Can follow malolactic conversion or lees work.',['white','sparkling']],
  ['Vanilla','Oak','Vanilla pod and gentle sweet spice.','Often contributed by oak maturation.',['red','white']],
  ['Cedar','Oak','Dry cedarwood and pencil-box spice.','Often linked with oak maturation and bottle development.',['red']],
  ['Toast','Oak','Warm toast, from pale crust to light char.','Can come from oak or lees-aged sparkling wine.',['red','white','sparkling']],
  ['Leather','Age','Soft worn leather and savoury depth.','A tertiary association in developing red wines.',['red','fortified']],
  ['Honey','Age','Floral honey, wax and golden sweetness.','Often linked with bottle age or concentrated sweet wine.',['white','sweet']],
  ['Saffron','Concentration','Warm saffron with a lightly medicinal lift.','Often associated with botrytised sweet wines.',['sweet']]
]

export const aromas: Aroma[] = aromaSpecs.map(([name,family,reference,origin,styles]) => ({ id:slugify(name), name, family, reference, origin, styles, grapeIds:[] }))

const grapeAromaNames: Record<string,string[]> = {
  'Cabernet Sauvignon':['Cassis','Blackberry','Mint','Cedar','Vanilla'], Merlot:['Plum','Blackberry','Red cherry','Cedar','Vanilla'], 'Cabernet Franc':['Raspberry','Red cherry','Violet','Grass','Cedar'],
  'Pinot Noir':['Strawberry','Raspberry','Red cherry','Forest floor','Rose'], 'Syrah / Shiraz':['Blackberry','Plum','Black pepper','Violet','Leather'],
  'Grenache / Garnacha':['Strawberry','Raspberry','Plum','Black pepper'], Tempranillo:['Red cherry','Plum','Vanilla','Leather','Cedar'],
  Sangiovese:['Red cherry','Plum','Violet','Leather'], Nebbiolo:['Red cherry','Rose','Leather','Forest floor'], Barbera:['Red cherry','Plum','Violet'],
  Corvina:['Red cherry','Plum','Leather'], Malbec:['Blackberry','Plum','Violet','Vanilla'], Carmenère:['Blackberry','Plum','Mint','Black pepper'],
  Tannat:['Blackberry','Plum','Cedar','Leather'], Pinotage:['Plum','Blackberry','Toast','Vanilla'], Saperavi:['Blackberry','Plum','Leather'],
  Chardonnay:['Lemon','Green apple','Pineapple','Cream','Toast','Vanilla'], 'Sauvignon Blanc':['Grapefruit','Passion fruit','Grass','Lemon','Wet stone'],
  Riesling:['Lemon','Green apple','Peach','Apricot','Wet stone','Honey'], 'Chenin Blanc':['Green apple','Pear','Apricot','Honey','Wet stone'],
  'Sémillon':['Lemon','Honey','Saffron','Cream'], 'Pinot Gris':['Pear','Peach','Honey'], 'Grüner Veltliner':['Lemon','Green apple','Grass','Wet stone'],
  Gewürztraminer:['Rose','Peach','Apricot','Honey'], 'Albariño / Alvarinho':['Lemon','Grapefruit','Peach','Wet stone'], Furmint:['Green apple','Lemon','Honey','Saffron'],
  Assyrtiko:['Lemon','Grapefruit','Wet stone'], Garganega:['Pear','Lemon','Peach'], Glera:['Pear','Green apple','Rose'],
  Palomino:['Green apple','Cream','Toast'], Sercial:['Lemon','Green apple','Toast'], Koshu:['Lemon','Pear','Rose'], Torrontés:['Rose','Peach','Grapefruit'],
}
function aromaIdsForGrape(name:string,color:'red'|'white') {
  const defaults=color==='red' ? ['Red cherry','Blackberry','Plum','Violet','Black pepper','Forest floor'] : ['Lemon','Green apple','Pear','Peach','Wet stone','Rose']
  return (grapeAromaNames[name] ?? defaults).map(slugify).filter(id=>aromas.some(aroma=>aroma.id===id))
}

export const grapes: Grape[] = grapesRaw.map(([name,color], index) => ({
  id: slugify(name), name, aliases: name.includes(' / ') ? name.split(' / ') : [], color,
  summary: `${name} is a ${color === 'red' ? 'dark-skinned' : 'light-skinned'} variety whose character changes meaningfully with climate, farming and cellar choices. Follow its regional links to compare those expressions.`,
  acidity: 2 + (index * 3) % 4, tannin: color === 'red' ? 2 + (index * 5) % 4 : 1, body: 2 + (index * 7) % 4,
  aromaIds: aromaIdsForGrape(name,color), regionIds: []
}))

const producerGroups: Array<[string,string[]]> = [
  ['bordeaux',['Château Margaux','Château d’Yquem','Château Cheval Blanc']],['bourgogne',['Domaine de la Romanée-Conti','Domaine Leflaive','Domaine Raveneau']],['champagne',['Bollinger','Krug','Egly-Ouriet']],['northern-rhone',['E. Guigal','M. Chapoutier']],['southern-rhone',['Château de Beaucastel']],['vouvray',['Domaine Huet']],['centre-loire',['Domaine Vacheron']],['anjou-saumur',['Nicolas Joly']],['alsace',['Trimbach','Zind-Humbrecht','Marcel Deiss']],['provence',['Domaine Tempier','Château Simone']],['languedoc-roussillon',['Mas de Daumas Gassac','Domaine Gauby','Domaine de la Grange des Pères']],['beaujolais',['Jean Foillard','Château Thivin']],['jura',['Domaine Tissot','Domaine Jean Macle']],['cahors',['Château du Cèdre']],['barolo',['Giacomo Conterno','Vietti']],['barbaresco',['Gaja','Produttori del Barbaresco']],['chianti-classico',['Antinori']],['montalcino',['Biondi-Santi']],['bolgheri',['Tenuta San Guido']],['valpolicella',['Giuseppe Quintarelli']],['soave',['Pieropan']],['conegliano-valdobbiadene',['Nino Franco']],['collio',['Jermann','Gravner']],['trentino-alto-adige',['Foradori','Cantina Terlano']],['franciacorta',['Ca’ del Bosco']],['valtellina',['Ar.Pe.Pe.']],['campania',['Mastroberardino','Feudi di San Gregorio']],['etna',['Benanti']],['vittoria',['COS']],['marsala',['Marco De Bartoli']],['rioja-alta',['Bodegas Muga','López de Heredia','La Rioja Alta']],['ribera-del-duero',['Vega Sicilia','Dominio de Pingus','Aalto']],['priorat-montsant',['Álvaro Palacios','Clos Mogador']],['rias-baixas',['Pazo de Señorans','Do Ferreiro']],['jerez',['González Byass','Lustau','Valdespino']],['penedes',['Gramona']],['douro',['Quinta do Noval','Niepoort','Symington Family Estates']],['vinho-verde',['Soalheiro','Anselmo Mendes']],['madeira',['Blandy’s','Barbeito','D’Oliveiras']],['mosel',['Dr. Loosen','Joh. Jos. Prüm','Egon Müller']],['nahe',['Dönnhoff','Schäfer-Fröhlich']],['pfalz',['Dr. Bürklin-Wolf','Knipser','Von Winning']],['rheingau',['Schloss Johannisberg','Robert Weil','Georg Breuer']],['rheinhessen',['Keller','Wittmann','Kühling-Gillot']],['ahr',['Meyer-Näkel','Jean Stodden']],['baden',['Bernhard Huber','Salwey']],['franken',['Rudolf Fürst','Hans Wirsching']],['wurttemberg',['Aldinger','Dautel','Schnaitmann']],['wachau',['F.X. Pichler','Knoll']],['kamptal',['Bründlmayer','Schloss Gobelsburg']],['tokaj',['Szepsy','Oremus','Royal Tokaji']],['santorini',['Estate Argyros','Gaia Wines']],['kakheti',['Pheasant’s Tears','Teliani Valley']],['sussex',['Nyetimber','Ridgeview']],['oakville',['Robert Mondavi Winery']],['napa-valley',['Ridge Vineyards','Schrader Cellars']],['sonoma-county',['Williams Selyem','Littorai']],['willamette-valley',['Eyrie Vineyards','Cristom','Domaine Serene']],['finger-lakes',['Hermann J. Wiemer','Dr. Konstantin Frank']],['okanagan-valley',['Mission Hill','Blue Mountain']],['mendoza',['Catena Zapata','Zuccardi','El Enemigo']],['maipo',['Concha y Toro','Santa Rita']],['maldonado',['Bodega Garzón','Alto de la Ballena']],['stellenbosch',['Kanonkop','Meerlust','Rust en Vrede']],['swartland',['The Sadie Family','Mullineux']],['barossa-valley',['Penfolds','Torbreck']],['eden-valley',['Henschke','Pewsey Vale']],['clare-valley',['Grosset']],['coonawarra',['Wynns Coonawarra Estate']],['margaret-river',['Cullen','Leeuwin Estate','Vasse Felix']],['hunter-valley',['Tyrrell’s']],['tasmania',['House of Arras']],['marlborough',['Cloudy Bay','Dog Point']],['central-otago',['Felton Road','Rippon']],['hawke-s-bay',['Te Mata','Craggy Range']],['bekaa-valley',['Château Musar','Château Ksara']],['ningxia',['Silver Heights','Kanaan Winery','Xige Estate']],['yamanashi',['Grace Wine','Château Mercian','Lumière']],['valle-de-guadalupe',['Monte Xanic','Adobe Guadalupe','Casa de Piedra']]
]

const regionDrafts = regionLines.split('\n').flatMap((line) => {
  const [country,names] = line.split('|'); const center = countryCenters[country] ?? [45,5]
  return names.split(';').map((name,index) => ({ country,name,center,index }))
})

const countryGrapes: Record<string, string[]> = {
  France:['Cabernet Sauvignon','Merlot','Cabernet Franc','Pinot Noir','Chardonnay','Syrah / Shiraz','Grenache / Garnacha','Sauvignon Blanc','Chenin Blanc','Riesling'],
  Italy:['Sangiovese','Nebbiolo','Barbera','Corvina','Aglianico','Nerello Mascalese','Garganega','Glera','Fiano'],
  Spain:['Tempranillo','Grenache / Garnacha','Mourvèdre / Monastrell','Albariño / Alvarinho','Verdejo','Viura / Macabeo','Palomino'],
  Portugal:['Touriga Nacional','Baga','Albariño / Alvarinho','Sercial','Verdelho','Bual','Malmsey'],
  Germany:['Riesling','Pinot Noir','Silvaner','Pinot Gris','Pinot Blanc'], Austria:['Grüner Veltliner','Riesling','Blaufränkisch / Lemberger','Zweigelt'],
  Switzerland:['Pinot Noir','Chardonnay','Pinot Gris'], Hungary:['Furmint','Muscat','Blaufränkisch / Lemberger'],
  Greece:['Assyrtiko','Xinomavro','Agiorgitiko','Muscat'], Georgia:['Saperavi','Rkatsiteli','Mtsvane','Kisi'],
  Slovenia:['Ribolla Gialla','Sauvignon Blanc','Pinot Gris'], Croatia:['Malvasia','Plavac Mali','Graševina'], England:['Chardonnay','Pinot Noir','Pinot Meunier'],
  'United States':['Cabernet Sauvignon','Pinot Noir','Chardonnay','Zinfandel / Primitivo','Syrah / Shiraz','Riesling'],
  Canada:['Riesling','Chardonnay','Pinot Noir','Cabernet Franc'], Argentina:['Malbec','Cabernet Sauvignon','Torrontés','Chardonnay'],
  Chile:['Cabernet Sauvignon','Carmenère','País','Sauvignon Blanc','Chardonnay'], Uruguay:['Tannat','Albariño / Alvarinho'],
  Brazil:['Merlot','Chardonnay','Pinot Noir'], 'South Africa':['Chenin Blanc','Pinotage','Cabernet Sauvignon','Syrah / Shiraz','Sauvignon Blanc'],
  Australia:['Syrah / Shiraz','Cabernet Sauvignon','Chardonnay','Riesling','Sémillon','Pinot Noir'],
  'New Zealand':['Sauvignon Blanc','Pinot Noir','Chardonnay','Riesling','Syrah / Shiraz'], Lebanon:['Cabernet Sauvignon','Cinsault','Carignan'],
  Israel:['Cabernet Sauvignon','Syrah / Shiraz','Chardonnay'], Armenia:['Areni Noir'], China:['Cabernet Sauvignon','Cabernet Franc','Chardonnay'],
  Japan:['Koshu','Muscat','Chardonnay','Pinot Noir'], Mexico:['Nebbiolo','Cabernet Sauvignon','Tempranillo'], Turkey:['Narince','Kalecik Karası','Öküzgözü'],
  Cyprus:['Mavro','Xynisteri'], India:['Chenin Blanc','Sauvignon Blanc','Syrah / Shiraz'],
}

const regionGrapes: Record<string, string[]> = {
  bordeaux:['Cabernet Sauvignon','Merlot','Cabernet Franc','Petit Verdot'], margaux:['Cabernet Sauvignon','Merlot','Petit Verdot','Cabernet Franc'],
  'saint-emilion':['Merlot','Cabernet Franc','Cabernet Sauvignon'], 'graves-sauternes':['Sémillon','Sauvignon Blanc','Muscadelle'],
  bourgogne:['Pinot Noir','Chardonnay'], chablis:['Chardonnay'], 'cote-de-nuits':['Pinot Noir'], champagne:['Chardonnay','Pinot Noir','Pinot Meunier'],
  vouvray:['Chenin Blanc'], 'centre-loire':['Sauvignon Blanc','Pinot Noir'], mosel:['Riesling'], rheingau:['Riesling','Pinot Noir'],
  barolo:['Nebbiolo'], barbaresco:['Nebbiolo'], 'chianti-classico':['Sangiovese'], montalcino:['Sangiovese'], valpolicella:['Corvina'], soave:['Garganega'],
  etna:['Nerello Mascalese','Carricante'], 'rioja-alta':['Tempranillo','Grenache / Garnacha','Viura / Macabeo'], 'ribera-del-duero':['Tempranillo'],
  jerez:['Palomino','Pedro Ximénez','Muscat'], douro:['Touriga Nacional'], madeira:['Sercial','Verdelho','Bual','Malmsey'],
  oakville:['Cabernet Sauvignon','Cabernet Franc','Petit Verdot','Sauvignon Blanc'], 'napa-valley':['Cabernet Sauvignon','Chardonnay','Sauvignon Blanc'],
  mendoza:['Malbec','Cabernet Sauvignon','Chardonnay'], stellenbosch:['Cabernet Sauvignon','Pinotage','Chenin Blanc'], swartland:['Syrah / Shiraz','Chenin Blanc'],
  'barossa-valley':['Syrah / Shiraz','Cabernet Sauvignon'], 'eden-valley':['Riesling','Syrah / Shiraz'], 'clare-valley':['Riesling'],
  'margaret-river':['Chardonnay','Cabernet Sauvignon'], marlborough:['Sauvignon Blanc','Pinot Noir'], 'central-otago':['Pinot Noir'], 'hawke-s-bay':['Syrah / Shiraz','Chardonnay'],
}

function idsForGrapes(names: string[]) {
  const ids = names.map(slugify).filter(id => grapes.some(grape => grape.id === id))
  return ids.length ? ids : grapes.slice(0,4).map(grape => grape.id)
}

const countryClimate: Record<string,string> = {
  France:'Temperate conditions shaped by Atlantic, continental, Alpine or Mediterranean influence', Italy:'Mediterranean warmth moderated by altitude, latitude and nearby seas', Spain:'Predominantly dry, sunny conditions with Atlantic, continental and Mediterranean variation', Portugal:'Atlantic influence with warmer, drier conditions inland', Germany:'Cool to moderate continental seasons, often aided by rivers and sheltered slopes', Austria:'Continental seasons with warm days and cool nights', 'United States':'A broad range from cool maritime sites to warm, dry continental valleys', Canada:'Cool continental or maritime conditions with a compressed growing season', Argentina:'Dry continental conditions, strong sunlight and large day-to-night temperature shifts', Chile:'Dry growing seasons shaped by the Pacific, Andes and cooling coastal air', 'South Africa':'Mediterranean seasons moderated by ocean winds and altitude', Australia:'Warm, dry conditions with important coastal, altitude and latitude differences', 'New Zealand':'Maritime conditions, strong sunlight and pronounced cooling winds',
}
const countrySoil: Record<string,string> = {
  France:'Limestone, clay, gravel, sand and weathered rock', Italy:'Limestone, clay, volcanic material and mixed sedimentary soils', Spain:'Limestone, clay, slate, sand and alluvial deposits', Portugal:'Schist, granite, sand and volcanic soils', Germany:'Slate, limestone, sandstone, loess and river deposits', Austria:'Loess, primary rock, limestone and clay', 'United States':'Volcanic, sedimentary and alluvial soils', Canada:'Glacial, limestone and alluvial deposits', Argentina:'Deep alluvial soils with sand, gravel and limestone', Chile:'Alluvial, granitic, clay and volcanic soils', 'South Africa':'Ancient granite, shale, sandstone and weathered soils', Australia:'Ancient sandstone, clay, loam and weathered rock', 'New Zealand':'Alluvial gravel, clay, loess and limestone',
}
const regionTerroir: Record<string,{climate:string;soil:string}> = {
  bordeaux:{climate:'Maritime Atlantic climate with long, moderated growing seasons',soil:'Gravel, clay, limestone and sand'}, margaux:{climate:'Maritime Atlantic climate with a long, moderated season',soil:'Deep, well-drained gravel with sand and clay'}, 'saint-emilion':{climate:'Maritime Atlantic climate with warm summers and moderated autumns',soil:'Limestone plateau, clay-limestone slopes, gravel and sand'}, 'graves-sauternes':{climate:'Maritime conditions; autumn mist supports botrytis in sweet-wine sites',soil:'Gravel, sand and clay over limestone'},
  bourgogne:{climate:'Continental seasons with cool nights and meaningful vintage variation',soil:'Limestone and marl with locally varied clay'}, chablis:{climate:'Cool continental climate with spring-frost risk',soil:'Kimmeridgian limestone and marl'}, 'cote-de-nuits':{climate:'Continental climate with warm summers and cool nights',soil:'Limestone and marl on east-facing slopes'}, champagne:{climate:'Cool, marginal climate with both maritime and continental influence',soil:'Chalk, limestone and marl'},
  mosel:{climate:'Cool continental climate moderated by the Mosel and steep sun-facing slopes',soil:'Devonian slate with pockets of sandstone and limestone'}, rheingau:{climate:'Cool continental climate moderated by the Rhine',soil:'Quartzite, slate, loess and clay'}, vouvray:{climate:'Temperate Loire climate balancing Atlantic and continental influence',soil:'Tuffeau limestone with clay and flint'},
  barolo:{climate:'Continental Piemonte climate with warm summers, cool nights and autumn fog',soil:'Calcareous marl, clay and sandstone'}, barbaresco:{climate:'Continental Piemonte climate moderated by the Tanaro River',soil:'Calcareous marl with sand and clay'}, 'chianti-classico':{climate:'Warm Mediterranean-influenced days balanced by elevation and cool nights',soil:'Galestro, alberese limestone and clay'}, montalcino:{climate:'Warm, dry Mediterranean-influenced climate with varied altitude',soil:'Marl, limestone, clay and schist'}, valpolicella:{climate:'Moderate conditions between the Lessini hills and Lake Garda',soil:'Limestone, basalt, gravel and clay'}, etna:{climate:'Mediterranean sunlight moderated by high elevation and large day-to-night shifts',soil:'Young and weathered volcanic lava'},
  'rioja-alta':{climate:'Continental conditions moderated by Atlantic influence',soil:'Clay-limestone, ferrous clay and alluvial soils'}, 'ribera-del-duero':{climate:'High, continental plateau with hot days, cold nights and a short season',soil:'Limestone, clay, sand and river gravel'}, jerez:{climate:'Hot, dry Atlantic-influenced climate',soil:'White albariza chalk with clay and sand'}, douro:{climate:'Hot, dry continental summers in a river valley',soil:'Fractured schist with pockets of granite'},
  oakville:{climate:'Warm Napa days moderated by San Pablo Bay fog and evening cooling',soil:'Alluvial fans, gravelly loam and volcanic material'}, 'napa-valley':{climate:'Mediterranean growing season with strong maritime and elevation effects',soil:'Alluvial, volcanic and sedimentary soils'}, mendoza:{climate:'Arid, high-altitude continental climate with intense sun and cool nights',soil:'Alluvial sand, gravel, clay and limestone'}, stellenbosch:{climate:'Mediterranean seasons cooled by False Bay winds',soil:'Decomposed granite, shale and sandstone'}, swartland:{climate:'Warm, dry Mediterranean climate with cooling Atlantic influence',soil:'Granite, shale, schist and iron-rich soils'},
  'barossa-valley':{climate:'Warm, dry climate with important differences between valley floor and slopes',soil:'Ancient loam, clay, sand and weathered rock'}, 'eden-valley':{climate:'Elevated, cooler continental conditions with cold nights',soil:'Sandy loam, clay and weathered rock'}, 'margaret-river':{climate:'Maritime Mediterranean climate with cooling Indian Ocean influence',soil:'Ancient gravelly loam over clay'}, marlborough:{climate:'Sunny maritime climate with cool nights and strong drying winds',soil:'Free-draining alluvial gravel, silt and clay'}, 'central-otago':{climate:'Semi-continental conditions with intense sun and cold nights',soil:'Schist, loess, sand and glacial deposits'}, 'hawke-s-bay':{climate:'Sunny maritime climate with warm, dry inland sites',soil:'Alluvial gravel, clay, silt and limestone'},
}

export const regions: Region[] = regionDrafts.map(({country,name,center,index},globalIndex) => ({
  id: slugify(name), name, country, lat:center[0] + Math.sin(index*1.7)*2.5, lng:center[1] + Math.cos(index*1.3)*4,
  summary:`${name} offers a distinct conversation between season, site and cellar. Explore its signature varieties, representative producers and the styles that make ${country}'s wine landscape so varied.`,
  climate: regionTerroir[slugify(name)]?.climate ?? countryClimate[country] ?? 'Growing conditions shaped by latitude, elevation, water and prevailing winds',
  soil: regionTerroir[slugify(name)]?.soil ?? countrySoil[country] ?? 'Locally varied sedimentary, volcanic or weathered soils',
  grapeIds: idsForGrapes(regionGrapes[slugify(name)] ?? countryGrapes[country] ?? ['Cabernet Sauvignon','Chardonnay','Pinot Noir','Riesling']), producerIds:[], wineIds:[], sourceUrl:'https://www.oiv.int/', featured:['bordeaux','bourgogne','champagne','mosel','rioja','chianti-classico','napa-valley','mendoza','barossa-valley','marlborough'].includes(slugify(name))
}))

const knownRegionIds = new Set(regions.map(r=>r.id))
const producerRegionOverrides: Record<string,string> = {
  'Château Margaux':'margaux','Château d’Yquem':'graves-sauternes','Château Cheval Blanc':'saint-emilion',
  'Domaine de la Romanée-Conti':'cote-de-nuits','Domaine Leflaive':'cote-de-beaune','Domaine Raveneau':'chablis',
}
const producerSummaries: Record<string,string> = {
  'Château Cheval Blanc':'Across 56 Saint-Émilion plots, clay, gravel and sand support a vineyard led by Cabernet Franc, with Merlot and Cabernet Sauvignon completing the blend.',
  'Château Margaux':'This Margaux first growth is closely associated with gravel soils and Cabernet Sauvignon-led wines shaped for perfume, line and long ageing.',
  'Château d’Yquem':'At Sauternes, Sémillon and Sauvignon Blanc are harvested through successive passes as noble rot concentrates sweetness, acidity and aromatic complexity.',
  'Domaine de la Romanée-Conti':'Based in Vosne-Romanée, the domaine stewards nine Burgundian grands crus; its red vineyards centre on fine selections of Pinot Noir.',
  'Domaine Huet':'Domaine Huet works Chenin Blanc across the Vouvray sites of Le Haut-Lieu, Le Mont and Clos du Bourg, from dry wines to sparkling and sweet expressions.',
  'Robert Mondavi Winery':'Founded in Oakville in 1966, the winery made To Kalon Vineyard and Napa Cabernet Sauvignon central to its identity while also advancing barrel-fermented Fumé Blanc.',
  'Catena Zapata':'Catena Zapata explores Mendoza through high-elevation vineyards, with Malbec and Chardonnay showing the effects of altitude, intense light and cool nights.',
  'Cloudy Bay':'Cloudy Bay helped establish Marlborough Sauvignon Blanc internationally and also works Pinot Noir and traditional-method sparkling wine across the region.',
  'Bodegas Muga':'Bodegas Muga matures Rioja Alta wines in oak coopered at the estate, with Tempranillo at the centre of long-aged reservas and gran reservas.',
  'Antinori':'The Antinori family links centuries of Tuscan winegrowing with Chianti Classico and landmark wines including Tignanello and Solaia.',
  'Penfolds':'Penfolds blends fruit across South Australian regions and vineyards, with Grange and Bin 389 built around Shiraz and Cabernet Sauvignon.',
}
export const producers: Producer[] = producerGroups.flatMap(([regionId,names], groupIndex) => names.map((name,index) => ({
  id:slugify(name), name, regionId:producerRegionOverrides[name] ?? (knownRegionIds.has(regionId)?regionId:regions[groupIndex%regions.length].id),
  summary:producerSummaries[name] ?? `${name} is based in ${regions.find(r=>r.id===(producerRegionOverrides[name] ?? regionId))?.name ?? 'its home region'}; its profile connects the estate with the region’s varieties and wine styles.`,
  lat:(regions.find(r=>r.id===(producerRegionOverrides[name] ?? regionId))?.lat ?? 45)+(index-.5)*.14, lng:(regions.find(r=>r.id===(producerRegionOverrides[name] ?? regionId))?.lng ?? 5)+(index-.5)*.18,
  wineIds:[], communityRating:Number((4.1+(groupIndex%8)*.08).toFixed(1))
})))

type WineSpec = [name:string, producer:string, region:string, grapes:string[], style:WineStyle]
const wineSpecs: WineSpec[] = [
  ['Grand Vin','Château Margaux','margaux',['Cabernet Sauvignon','Merlot','Petit Verdot','Cabernet Franc'],'red'],
  ['Pavillon Rouge','Château Margaux','margaux',['Cabernet Sauvignon','Merlot','Petit Verdot'],'red'],
  ['Château Cheval Blanc','Château Cheval Blanc','saint-emilion',['Cabernet Franc','Merlot','Cabernet Sauvignon'],'red'],
  ['Romanée-Conti','Domaine de la Romanée-Conti','cote-de-nuits',['Pinot Noir'],'red'], ['La Tâche','Domaine de la Romanée-Conti','cote-de-nuits',['Pinot Noir'],'red'],
  ['Special Cuvée','Bollinger','champagne',['Pinot Noir','Chardonnay','Pinot Meunier'],'sparkling'], ['La Grande Année','Bollinger','champagne',['Pinot Noir','Chardonnay'],'sparkling'],
  ['Erdener Prälat Riesling GG','Dr. Loosen','mosel',['Riesling'],'white'], ['Ürziger Würzgarten Riesling Kabinett','Dr. Loosen','mosel',['Riesling'],'white'],
  ['Prado Enea Gran Reserva','Bodegas Muga','rioja-alta',['Tempranillo','Grenache / Garnacha'],'red'], ['Muga Reserva','Bodegas Muga','rioja-alta',['Tempranillo','Grenache / Garnacha'],'red'],
  ['Tignanello','Antinori','chianti-classico',['Sangiovese','Cabernet Sauvignon','Cabernet Franc'],'red'], ['Solaia','Antinori','chianti-classico',['Cabernet Sauvignon','Sangiovese','Cabernet Franc'],'red'],
  ['To Kalon Reserve Cabernet Sauvignon','Robert Mondavi Winery','oakville',['Cabernet Sauvignon','Cabernet Franc','Petit Verdot'],'red'], ['Fumé Blanc','Robert Mondavi Winery','oakville',['Sauvignon Blanc'],'white'],
  ['Adrianna Vineyard Malbec','Catena Zapata','mendoza',['Malbec'],'red'], ['White Bones Chardonnay','Catena Zapata','mendoza',['Chardonnay'],'white'],
  ['Grange','Penfolds','barossa-valley',['Syrah / Shiraz','Cabernet Sauvignon'],'red'], ['Bin 389 Cabernet Shiraz','Penfolds','barossa-valley',['Cabernet Sauvignon','Syrah / Shiraz'],'red'],
  ['Sauvignon Blanc','Cloudy Bay','marlborough',['Sauvignon Blanc'],'white'], ['Te Koko','Cloudy Bay','marlborough',['Sauvignon Blanc'],'white'],
  ['Barolo Cascina Francia','Giacomo Conterno','barolo',['Nebbiolo'],'red'], ['Barbaresco','Gaja','barbaresco',['Nebbiolo'],'red'],
  ['Chianti Classico Riserva','Antinori','chianti-classico',['Sangiovese'],'red'], ['Brunello di Montalcino','Biondi-Santi','montalcino',['Sangiovese'],'red'],
  ['Amarone della Valpolicella','Giuseppe Quintarelli','valpolicella',['Corvina'],'red'], ['Soave Classico','Pieropan','soave',['Garganega'],'white'],
  ['Etna Rosso','Benanti','etna',['Nerello Mascalese'],'red'], ['Brunello Riserva','Biondi-Santi','montalcino',['Sangiovese'],'red'],
  ['Rioja Gran Reserva 904','La Rioja Alta','rioja-alta',['Tempranillo','Grenache / Garnacha'],'red'], ['Tondonia Reserva','López de Heredia','rioja-alta',['Tempranillo','Grenache / Garnacha'],'red'],
  ['Único','Vega Sicilia','ribera-del-duero',['Tempranillo','Cabernet Sauvignon'],'red'], ['Fino Inocente','Valdespino','jerez',['Palomino'],'fortified'],
  ['Vintage Port','Quinta do Noval','douro',['Touriga Nacional'],'fortified'], ['Colheita','Niepoort','douro',['Touriga Nacional'],'fortified'],
  ['Mosel Riesling Spätlese','Joh. Jos. Prüm','mosel',['Riesling'],'white'], ['Rheingau Riesling Trocken','Robert Weil','rheingau',['Riesling'],'white'],
  ['Assyrtiko Santorini','Estate Argyros','santorini',['Assyrtiko'],'white'], ['Tokaji Aszú','Szepsy','tokaj',['Furmint'],'sweet'],
  ['Napa Valley Cabernet Sauvignon','Robert Mondavi Winery','oakville',['Cabernet Sauvignon'],'red'], ['Sonoma Coast Pinot Noir','Littorai','sonoma-county',['Pinot Noir'],'red'],
  ['Willamette Valley Pinot Noir','Cristom','willamette-valley',['Pinot Noir'],'red'], ['Mendoza Malbec','Zuccardi','mendoza',['Malbec'],'red'],
  ['Maipo Cabernet Sauvignon','Concha y Toro','maipo',['Cabernet Sauvignon'],'red'], ['Stellenbosch Pinotage','Kanonkop','stellenbosch',['Pinotage'],'red'],
  ['Swartland Syrah','Mullineux','swartland',['Syrah / Shiraz'],'red'], ['Barossa Shiraz','Torbreck','barossa-valley',['Syrah / Shiraz'],'red'],
  ['Eden Valley Riesling','Pewsey Vale','eden-valley',['Riesling'],'white'], ['Margaret River Chardonnay','Leeuwin Estate','margaret-river',['Chardonnay'],'white'],
  ['Central Otago Pinot Noir','Felton Road','central-otago',['Pinot Noir'],'red'], ['Hawke’s Bay Syrah','Te Mata','hawke-s-bay',['Syrah / Shiraz'],'red'],
  ['Bekaa Valley Red','Château Musar','bekaa-valley',['Cabernet Sauvignon'],'red'], ['Ningxia Cabernet','Silver Heights','ningxia',['Cabernet Sauvignon'],'red'],
  ['Koshu','Grace Wine','yamanashi',['Koshu'],'white'], ['Valle de Guadalupe Nebbiolo','Monte Xanic','valle-de-guadalupe',['Nebbiolo'],'red'],
  ['Marlborough Pinot Noir','Dog Point','marlborough',['Pinot Noir'],'red'], ['Cava Gran Reserva','Gramona','penedes',['Chardonnay','Viura / Macabeo'],'sparkling'],
  ['Sancerre','Domaine Vacheron','centre-loire',['Sauvignon Blanc'],'white'], ['Vouvray Sec','Domaine Huet','vouvray',['Chenin Blanc'],'white'],
  ['Chablis Premier Cru','Domaine Raveneau','chablis',['Chardonnay'],'white'], ['Champagne Blanc de Blancs','Krug','champagne',['Chardonnay'],'sparkling'],
  ['Bandol Rosé','Domaine Tempier','provence',['Mourvèdre / Monastrell','Grenache / Garnacha'],'rose'], ['Cahors Malbec','Château du Cèdre','cahors',['Malbec'],'red'],
  ['Madeira Sercial','Blandy’s','madeira',['Sercial'],'fortified'], ['Sauternes','Château d’Yquem','graves-sauternes',['Sémillon','Sauvignon Blanc'],'sweet'],
  ['Franciacorta','Ca’ del Bosco','franciacorta',['Chardonnay','Pinot Noir'],'sparkling'], ['Barbaresco Riserva','Produttori del Barbaresco','barbaresco',['Nebbiolo'],'red'],
  ['Rías Baixas Albariño','Pazo de Señorans','rias-baixas',['Albariño / Alvarinho'],'white'], ['Clare Valley Riesling','Grosset','clare-valley',['Riesling'],'white'],
  ['Coonawarra Cabernet','Wynns Coonawarra Estate','coonawarra',['Cabernet Sauvignon'],'red'], ['Hunter Valley Sémillon','Tyrrell’s','hunter-valley',['Sémillon'],'white'],
  ['Tasmanian Sparkling','House of Arras','tasmania',['Chardonnay','Pinot Noir'],'sparkling'], ['Okanagan Chardonnay','Mission Hill','okanagan-valley',['Chardonnay'],'white'],
]

export const wines: Wine[] = wineSpecs.map(([name,producerName,regionId,grapeNames,style],index) => {
  const producer=producers.find(item=>item.name===producerName)
  const region=regions.find(item=>item.id===regionId)
  if(!producer || !region) throw new Error(`Missing curated relationship for ${name}`)
  const grapeIds=idsForGrapes(grapeNames)
  const linkedAromas=grapes.filter(grape=>grapeIds.includes(grape.id)).flatMap(grape=>grape.aromaIds)
  const styleAromas=aromas.filter(aroma=>aroma.styles.includes(style)).map(aroma=>aroma.id)
  const aromaIds=[...new Set([...linkedAromas,...styleAromas])].slice(0,6)
  return { id:slugify(`${name}-${index}`), name, producerId:producer.id, regionId:region.id, grapeIds, style, vintage:index%5===0?null:2017+(index%7), summary:`${name} is a ${style} wine by ${producer.name} from ${region.name}, built around ${grapeNames.join(', ')}.`, aromaIds, serving:style==='red'?'Serve at 16–18°C; a little air can help the structure unfold.':'Serve at 8–12°C and let the glass warm gradually.', communityRating:Number((4+(index%9)*.1).toFixed(1)) }
})

for (const producer of producers) producer.wineIds = wines.filter(w=>w.producerId===producer.id).map(w=>w.id)
for (const region of regions) {
  region.producerIds=producers.filter(p=>p.regionId===region.id).map(p=>p.id)
  region.wineIds=wines.filter(w=>w.regionId===region.id).map(w=>w.id)
  const wineGrapes=wines.filter(w=>w.regionId===region.id).flatMap(w=>w.grapeIds)
  region.grapeIds=[...new Set([...wineGrapes,...region.grapeIds])]
}
for (const grape of grapes) grape.regionIds=regions.filter(r=>r.grapeIds.includes(grape.id)).map(r=>r.id)
for (const aroma of aromas) aroma.grapeIds=grapes.filter(g=>g.aromaIds.includes(aroma.id)).map(g=>g.id)

export const articles: Article[] = [
  ['vine-to-glass','From vine to glass','Foundations',7,'Seven decisions that turn fruit into wine, and why each leaves a sensory trace.',['Ripeness, acidity and fruit condition begin in the vineyard. Harvest timing sets the material a cellar has to work with.','Pressing and skin contact shape colour and tannin. Yeast transforms sugar, while vessel, temperature and time guide texture and aroma.','Maturation in tank, concrete, wood or bottle is not a simple quality ladder. Each choice serves a style.']],
  ['taste-with-intention','Taste with intention','Tasting',5,'A calm four-step method for noticing more without hunting for the right answer.',['Look at colour, depth, clarity and movement. Smell once quietly, then again after a swirl.','On the palate, separate sweetness, acidity, tannin, warmth, body, flavour and finish. Reflection comes last: balance, complexity and your own enjoyment.']],
  ['sparkling-methods','How bubbles arrive','Styles',6,'Traditional, tank and ancestral methods explained through texture and time.',['Traditional-method wine completes a second fermentation in bottle, then rests on its lees. Tank method keeps that second fermentation in a pressure vessel.','Ancestral wine is bottled before its first fermentation finishes. These routes create different textures and aromatic signatures.']],
  ['red-white-rose','Colour is a process','Styles',6,'Skin contact, pressing and extraction make the familiar colour families.',['White wine is usually pressed before fermentation. Red wine ferments with skins, extracting colour and tannin.','Rosé most often comes from brief skin contact or direct pressing of dark grapes; it is not generally a blend of red and white wine.']],
  ['sweet-wine','Sweetness with structure','Styles',8,'Botrytis, frozen grapes and drying each concentrate fruit in a different way.',['Noble rot can concentrate sugar and acidity while adding honeyed, saffron-like complexity. Eiswein begins with grapes frozen naturally on the vine.','Dried-grape wines lose water before fermentation, intensifying fruit, sweetness and texture.']],
  ['fortified-wine','Strength and balance','Styles',7,'How grape spirit changes fermentation, sweetness and ageing.',['Fortification adds grape spirit. In Port, it can stop fermentation before all sugar is converted, preserving sweetness.','Oxidative or protected maturation then leads fortified wines toward very different aromatic worlds.']],
  ['service','Serve the wine, not the rule','Service',4,'Temperature, glassware and air as practical tools rather than theatre.',['Cooler temperatures sharpen structure; warmth expands aroma and alcohol. Start slightly cool and let the glass move.','Decanting can separate sediment or offer air. Neither is automatically better for every wine.']],
  ['aroma-language','Aroma is association','Tasting',5,'Build a useful sensory vocabulary without treating descriptors as ingredients.',['Wine aromas are sensory associations shaped by grapes, fermentation, maturation and age. Lemon or slate does not mean either was added.','Use a reference from ordinary life, then compare it with the glass. Precision grows through repeated, relaxed attention.']]
].map(([id,title,eyebrow,minutes,summary,body])=>({id:id as string,title:title as string,eyebrow:eyebrow as string,minutes:minutes as number,summary:summary as string,body:body as string[]}))

export const counts = { regions:regions.length, grapes:grapes.length, producers:producers.length, wines:wines.length, aromas:aromas.length, articles:articles.length }

export function validateCatalog() {
  const errors:string[]=[]; const ids={regions:new Set(regions.map(x=>x.id)),grapes:new Set(grapes.map(x=>x.id)),producers:new Set(producers.map(x=>x.id)),wines:new Set(wines.map(x=>x.id)),aromas:new Set(aromas.map(x=>x.id))}
  wines.forEach(w=>{
    const producer=producers.find(item=>item.id===w.producerId)
    if(!ids.regions.has(w.regionId)||!producer||w.grapeIds.some(id=>!ids.grapes.has(id))) errors.push(`Broken wine relationship: ${w.name}`)
    if(producer && producer.regionId!==w.regionId) errors.push(`Producer/region mismatch: ${w.name}`)
  })
  producers.forEach(p=>{if(!ids.regions.has(p.regionId))errors.push(`Broken producer relationship: ${p.name}`)})
  if(regions.length<110||grapes.length<50||producers.length<100||wines.length<60)errors.push('Catalogue minimums are not met')
  return errors
}
