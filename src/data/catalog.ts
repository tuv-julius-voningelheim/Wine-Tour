import type { Aroma, Article, Grape, Producer, Region, Wine, WineStyle } from '../types'
import { regionCoordinates } from './regionCoordinates'

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
  ['Cabernet Sauvignon','red'],['Merlot','red'],['Cabernet Franc','red'],['Petit Verdot','red'],['Pinot Noir','red'],['Pinot Meunier','red'],['Gamay','red'],['Syrah / Shiraz','red'],['Grenache / Garnacha','red'],['Mourvèdre / Monastrell','red'],['Cinsault','red'],['Carignan','red'],['Tempranillo','red'],['Sangiovese','red'],['Nebbiolo','red'],['Barbera','red'],['Corvina','red'],['Aglianico','red'],['Montepulciano','red'],['Nero d’Avola','red'],['Nerello Mascalese','red'],['Malbec','red'],['Carmenère','red'],['Tannat','red'],['Pinotage','red'],['Zinfandel / Primitivo','red'],['Blaufränkisch / Lemberger','red'],['Zweigelt','red'],['Xinomavro','red'],['Agiorgitiko','red'],['Saperavi','red'],['Areni Noir','red'],['Touriga Nacional','red'],['Baga','red'],['Mencía','red'],['Listán Negro','red'],['País','red'],['Plavac Mali','red'],['Kalecik Karası','red'],['Öküzgözü','red'],['Mavro','red'],['Poulsard','red'],['Trousseau','red'],['Graciano','red'],
  ['Teroldego','red'],['Frappato','red'],['Mondeuse','red'],
  ['Chardonnay','white'],['Sauvignon Blanc','white'],['Riesling','white'],['Chenin Blanc','white'],['Sémillon','white'],['Pinot Gris','white'],['Pinot Blanc','white'],['Grüner Veltliner','white'],['Silvaner','white'],['Viognier','white'],['Marsanne','white'],['Roussanne','white'],['Gewürztraminer','white'],['Albariño / Alvarinho','white'],['Godello','white'],['Verdejo','white'],['Viura / Macabeo','white'],['Furmint','white'],['Assyrtiko','white'],['Carricante','white'],['Garganega','white'],['Verdicchio','white'],['Vermentino','white'],['Fiano','white'],['Arneis','white'],['Cortese','white'],['Glera','white'],['Muscat','white'],['Palomino','white'],['Pedro Ximénez','white'],['Rkatsiteli','white'],['Mtsvane','white'],['Kisi','white'],['Koshu','white'],['Torrontés','white'],['Sercial','white'],['Verdelho','white'],['Bual','white'],['Malmsey','white'],['Ribolla Gialla','white'],['Malvasia Istriana','white'],['Graševina','white'],['Narince','white'],['Xynisteri','white'],['Savagnin','white'],['Aligoté','white'],['Muscadelle','white'],['Xarel-lo','white'],['Parellada','white'],['Malvasia','white'],['Clairette','white'],['Grillo','white'],['Grenache Blanc','white'],['Obaideh','white'],['Merwah','white'],['Melon de Bourgogne','white'],['Petit Manseng','white'],['Gros Manseng','white'],['Jacquère','white'],['Hondarrabi Zuri','white']
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

const additionalAromaSpecs: Array<[string,string,string,string,WineStyle[]]> = [
  ['Lime','Citrus','Fresh lime zest, pith and tart juice.','A primary fruit association often found in youthful, high-acid whites.',['white','sparkling']],
  ['Orange peel','Citrus','Fresh orange zest through to dried peel.','A primary or developed fruit association depending on its freshness.',['white','rose','sweet','fortified']],
  ['Bergamot','Citrus','Fragrant bergamot peel, floral and gently bitter.','A precise citrus association common in aromatic varieties.',['white','sweet']],
  ['Red apple','Orchard','Ripe red apple skin and sweet-tart flesh.','A primary fruit association that can broaden with bottle age.',['white','sparkling']],
  ['Quince','Orchard','Firm quince, somewhere between pear, citrus and blossom.','A primary association often useful for Chenin Blanc and mature whites.',['white','sweet']],
  ['Nectarine','Stone fruit','Smooth-skinned nectarine with juicy yellow flesh.','A ripe primary fruit association.',['white','rose']],
  ['Mirabelle','Stone fruit','Small golden plum with honeyed, gently tart flesh.','A primary stone-fruit association in ripe whites.',['white','sweet']],
  ['Mango','Tropical','Ripe mango flesh with resinous sweetness.','A warm-site or late-harvest primary fruit association.',['white','sweet']],
  ['Lychee','Tropical','Perfumed lychee flesh with rose-like lift.','A grape-derived association strongly linked with aromatic whites.',['white','sweet']],
  ['Banana','Tropical','Fresh banana and pear-drop sweetness.','Often a fermentation-derived ester, especially after cool, rapid fermentation.',['white','rose','red']],
  ['Cranberry','Red fruit','Tart cranberry with a dry, bright edge.','A primary association in lighter, high-acid red wines.',['rose','red']],
  ['Pomegranate','Red fruit','Sweet-tart pomegranate juice and skin.','A primary association spanning rosé and light red styles.',['rose','red']],
  ['Black cherry','Black fruit','Dark cherry flesh with a ripe, gently bitter stone.','A primary fruit association in medium- to full-bodied reds.',['red','fortified']],
  ['Blueberry','Black fruit','Fresh blueberry with cool, dusky sweetness.','A primary dark-fruit association.',['red']],
  ['Fig','Black fruit','Fresh or dried fig with dark, seedy sweetness.','A ripe-fruit or developed association in warm-climate and fortified wines.',['red','fortified']],
  ['Elderflower','Floral','Elderflower blossom: airy, green and muscat-like.','A primary floral association in aromatic whites.',['white','sparkling']],
  ['Honeysuckle','Floral','Sweet honeysuckle blossom with a waxy edge.','A primary floral association often found in fuller whites.',['white','sweet']],
  ['Orange blossom','Floral','Fragrant citrus blossom, fresh and lightly honeyed.','A primary floral association in Mediterranean and aromatic whites.',['white','sweet']],
  ['Tomato leaf','Herbal','Crushed tomato leaf: green, leafy and slightly bitter.','A grape-derived pyrazine association found in some Bordeaux varieties.',['red','white']],
  ['Fennel','Herbal','Fresh fennel frond and anise-like seed.','A primary herbal association in some Mediterranean wines.',['white','red']],
  ['Eucalyptus','Herbal','Cool eucalyptus leaf and menthol.','A site- and grape-linked herbal association in some red wines.',['red']],
  ['Thyme','Herbal','Dry wild thyme with a resinous Mediterranean edge.','A primary herbal association often described as garrigue.',['rose','red']],
  ['White pepper','Spice','Ground white pepper: warm, fine and gently earthy.','A grape-derived spice association common in cool-climate Syrah.',['red']],
  ['Clove','Spice','Sweet clove bud with warming phenolic spice.','Can arise from oak maturation or grape character.',['red','fortified']],
  ['Cinnamon','Spice','Cinnamon bark with sweet, dry warmth.','Often associated with maturation in oak or bottle.',['red','sweet','fortified']],
  ['Anise','Spice','Star anise and liquorice-root freshness.','A primary or maturation-linked spice association.',['red','fortified']],
  ['Liquorice','Spice','Dark liquorice root: sweet, bitter and earthy.','A common association in concentrated red wines.',['red','fortified']],
  ['Chalk','Earth & mineral','Dry chalk dust and cool limestone.','A tactile sensory association rather than a literal mineral transfer.',['white','sparkling']],
  ['Flint','Earth & mineral','Struck flint, smoke and a cool stony edge.','Can describe reduction or a broader stony sensory association.',['white','sparkling']],
  ['Mushroom','Earth & mineral','Fresh mushroom cap and damp woodland.','A tertiary association in bottle-aged wines.',['white','red','sparkling']],
  ['Truffle','Earth & mineral','Earthy black truffle with savoury depth.','A tertiary association in mature red wine.',['red']],
  ['Bread dough','Fermentation','Rising bread dough: yeasty, cereal and soft.','A secondary aroma from yeast and lees contact.',['white','sparkling']],
  ['Yogurt','Fermentation','Tangy yogurt and cultured cream.','A secondary association linked with malolactic conversion.',['white','red']],
  ['Coconut','Oak','Fresh coconut flesh and husk.','Often linked with American oak lactones.',['red','white','fortified']],
  ['Smoke','Oak','Wood smoke and a cool charred edge.','Can arise from toasted oak or reductive winemaking; context matters.',['red','white']],
  ['Coffee','Oak','Roasted coffee bean and dark toast.','A secondary aroma associated with strongly toasted oak.',['red','fortified']],
  ['Chocolate','Oak','Cocoa powder through to dark chocolate.','A maturation association in rich red and fortified wines.',['red','fortified']],
  ['Tobacco','Age','Dry tobacco leaf and cedar-lined cigar box.','A tertiary association in mature red wines.',['red','fortified']],
  ['Dried fruit','Age','Dried cherry, prune and fruit leather.','A tertiary association from bottle age, drying or oxidative maturation.',['red','sweet','fortified']],
  ['Walnut','Age','Dry walnut skin and roasted nut.','A tertiary oxidative association, classic in some fortified wines.',['white','fortified']],
  ['Beeswax','Age','Warm beeswax with honeyed, gently savoury depth.','A tertiary association in mature white wine.',['white','sweet']],
  ['Marmalade','Concentration','Bitter orange marmalade with peel and caramelised citrus.','Often associated with botrytised, late-harvest or oxidative sweet wine.',['sweet','fortified']],
  ['Raisin','Concentration','Sun-dried raisin with concentrated sweetness.','Associated with dried grapes, very ripe fruit or fortified styles.',['red','sweet','fortified']],
  ['Damp cardboard','Wine condition','Damp cardboard and a musty cellar.','A warning sign commonly associated with cork taint.',['white','rose','red','sparkling','sweet','fortified']],
  ['Vinegar','Wine condition','Sharp vinegar and solvent-like lift.','Elevated volatile acidity can dominate freshness and fruit.',['white','rose','red','sparkling','sweet','fortified']],
  ['Bruised apple','Wine condition','Cut apple left to brown in the air.','An oxidative association that may be intentional or a condition fault.',['white','rose','red','sparkling','sweet','fortified']],
  ['Struck match','Wine condition','A just-struck match with sulfurous smoke.','A reductive sulfur association; a trace can add complexity, excess can mask fruit.',['white','red','sparkling']],
]

const aromaTier = (family:string): Aroma['tier'] => family==='Fermentation'||family==='Oak' ? 'secondary' : family==='Age'||family==='Concentration' ? 'tertiary' : 'primary'
const aromaSubfamilies: Record<string,string> = {
  Lemon:'Sharp citrus', Lime:'Sharp citrus', Grapefruit:'Bitter citrus', 'Orange peel':'Sweet citrus', Bergamot:'Aromatic citrus',
  'Green apple':'Crisp orchard', Pear:'Crisp orchard', Quince:'Crisp orchard', 'Red apple':'Ripe orchard',
  Peach:'Soft stone fruit', Nectarine:'Soft stone fruit', Apricot:'Golden stone fruit', Mirabelle:'Golden stone fruit',
  Pineapple:'Fresh tropical', 'Passion fruit':'Fresh tropical', Mango:'Rich tropical', Lychee:'Perfumed tropical', Banana:'Fermentation ester',
  Strawberry:'Soft red berries', Raspberry:'Tart red berries', Cranberry:'Tart red berries', 'Red cherry':'Red stone fruit', Pomegranate:'Tart red fruit',
  Blackberry:'Bramble fruit', Cassis:'Currant fruit', Blueberry:'Blue fruit', 'Black cherry':'Dark stone fruit', Plum:'Dark stone fruit', Fig:'Dried & ripe fruit',
  Violet:'Purple flowers', Rose:'Petals', Elderflower:'White flowers', Honeysuckle:'White flowers', 'Orange blossom':'White flowers',
  Grass:'Fresh green', Mint:'Cool herbs', 'Tomato leaf':'Leafy green', Fennel:'Anise herbs', Eucalyptus:'Cool herbs', Thyme:'Dried Mediterranean herbs',
  'Black pepper':'Peppercorn', 'White pepper':'Peppercorn', Clove:'Sweet spice', Cinnamon:'Sweet spice', Anise:'Dark spice', Liquorice:'Dark spice',
  'Wet stone':'Stone', Slate:'Stone', Chalk:'Stone', Flint:'Smoke & reduction', 'Forest floor':'Woodland', Mushroom:'Fungi', Truffle:'Fungi',
  Brioche:'Baked lees', Toast:'Baked lees', 'Bread dough':'Fresh yeast', Cream:'Dairy conversion', Yogurt:'Dairy conversion',
  Vanilla:'Sweet oak', Coconut:'Sweet oak', Cedar:'Dry wood', Smoke:'Toast & char', Coffee:'Roast', Chocolate:'Roast',
  Leather:'Savoury development', Tobacco:'Savoury development', 'Dried fruit':'Fruit development', Walnut:'Oxidative development', Beeswax:'White-wine development',
  Honey:'Honeyed concentration', Saffron:'Botrytis spice', Marmalade:'Botrytis citrus', Raisin:'Dried-grape concentration',
  'Damp cardboard':'Cork taint', Vinegar:'Volatile acidity', 'Bruised apple':'Oxidation', 'Struck match':'Reduction',
}
export const aromas: Aroma[] = [...aromaSpecs,...additionalAromaSpecs].map(([name,family,reference,origin,styles]) => ({
  id:slugify(name), name, family, subfamily:aromaSubfamilies[name] ?? family, reference, origin, styles, grapeIds:[], tier:family==='Wine condition'?'secondary':aromaTier(family),
  intensity:['A fleeting suggestion','Clearly present','A defining note'],
}))

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

const grapeOrigins: Record<string,string> = {
  'cabernet-sauvignon':'Bordeaux, France', merlot:'Bordeaux, France', 'cabernet-franc':'South-west France and the Loire', 'petit-verdot':'Bordeaux, France',
  'pinot-noir':'Bourgogne, France', 'pinot-meunier':'France', gamay:'Bourgogne and Beaujolais, France', 'syrah-shiraz':'Northern Rhône, France',
  'grenache-garnacha':'Aragón, Spain', 'mourvedre-monastrell':'Mediterranean Spain', cinsault:'Southern France', carignan:'Aragón and the western Mediterranean',
  tempranillo:'Northern Spain', sangiovese:'Central Italy', nebbiolo:'Piemonte, Italy', barbera:'Piemonte, Italy', corvina:'Veneto, Italy',
  aglianico:'Southern Italy, with ancient Greek ancestry', montepulciano:'Central Italy', 'nero-d-avola':'Sicily, Italy', 'nerello-mascalese':'Sicily, Italy',
  malbec:'South-west France', carmenere:'Bordeaux, France', tannat:'South-west France', pinotage:'South Africa', 'zinfandel-primitivo':'Croatian Adriatic ancestry',
  'blaufrankisch-lemberger':'Central Europe', zweigelt:'Austria', xinomavro:'Northern Greece', agiorgitiko:'Peloponnese, Greece', saperavi:'Georgia',
  'areni-noir':'Vayots Dzor, Armenia', 'touriga-nacional':'Portugal', baga:'Portugal', mencía:'North-west Spain', 'listan-negro':'Canary Islands, Spain',
  país:'Spain, later established in Chile', 'plavac-mali':'Dalmatia, Croatia', 'kalecik-karas':'Central Anatolia, Türkiye', öküzgözü:'Eastern Anatolia, Türkiye', mavro:'Cyprus',
  chardonnay:'Bourgogne, France', 'sauvignon-blanc':'France', riesling:'Rhine valley, Germany', 'chenin-blanc':'Loire, France', semillon:'South-west France',
  'pinot-gris':'Bourgogne, France', 'pinot-blanc':'Bourgogne, France', 'gruner-veltliner':'Austria', silvaner:'Central Europe', viognier:'Northern Rhône, France',
  marsanne:'Northern Rhône, France', roussanne:'Northern Rhône, France', gewurztraminer:'Central Europe', 'albarino-alvarinho':'Atlantic Iberia', godello:'North-west Spain',
  verdejo:'Castilla y León, Spain', 'viura-macabeo':'North-east Spain', furmint:'Carpathian basin', assyrtiko:'Santorini, Greece', carricante:'Etna, Sicily',
  garganega:'Veneto, Italy', verdicchio:'Central Italy', vermentino:'Western Mediterranean', fiano:'Campania, Italy', arneis:'Piemonte, Italy', cortese:'Piemonte, Italy',
  glera:'North-east Italy', muscat:'Ancient eastern Mediterranean family', palomino:'Andalucía, Spain', 'pedro-ximenez':'Andalucía, Spain', rkatsiteli:'Georgia',
  mtsvane:'Kakheti, Georgia', kisi:'Kakheti, Georgia', koshu:'Japan', torrontes:'Argentina', sercial:'Madeira and Portugal', verdelho:'Portugal and Madeira',
  bual:'Portugal and Madeira', malmsey:'Mediterranean Malvasia family', 'ribolla-gialla':'Friuli and western Slovenia', 'malvasia-istriana':'Istria', grasevina:'Central Europe',
  narince:'Tokat, Türkiye', xynisteri:'Cyprus', mondeuse:'Savoie, France', 'melon-de-bourgogne':'Bourgogne ancestry, now centred in Muscadet',
  'petit-manseng':'South-west France, especially Jurançon', 'gros-manseng':'South-west France, especially Jurançon', jacquere:'Savoie, France', 'hondarrabi-zuri':'Basque Country, Spain',
}
const earlyRipening = new Set(['pinot-noir','pinot-meunier','gamay','chardonnay','pinot-gris','pinot-blanc','glera','zweigelt'])
const lateRipening = new Set(['cabernet-sauvignon','petit-verdot','mourvedre-monastrell','carignan','nebbiolo','aglianico','touriga-nacional','tannat','saperavi','assyrtiko'])
const highAcid = new Set(['pinot-noir','gamay','nebbiolo','barbera','sangiovese','xinomavro','riesling','chenin-blanc','sauvignon-blanc','assyrtiko','furmint','carricante','verdicchio','albarino-alvarinho'])
const softAcid = new Set(['grenache-garnacha','cinsault','viognier','gewurztraminer','marsanne','roussanne','glera','mavro'])
const highTannin = new Set(['cabernet-sauvignon','petit-verdot','mourvedre-monastrell','nebbiolo','aglianico','tannat','saperavi','touriga-nacional','baga','xinomavro','sagrantino'])
const lightBody = new Set(['pinot-noir','gamay','cinsault','schiava','glera','muscadet','koshu','xynisteri'])
const fullBody = new Set(['cabernet-sauvignon','syrah-shiraz','mourvedre-monastrell','aglianico','malbec','tannat','saperavi','touriga-nacional','viognier','marsanne','roussanne','semillon'])
const droughtTolerant = new Set(['grenache-garnacha','mourvedre-monastrell','carignan','cinsault','assyrtiko','agiorgitiko','touriga-nacional','vermentino','xynisteri'])
const aromaticGrapes = new Set(['riesling','sauvignon-blanc','gewurztraminer','muscat','torrontes','viognier','albarino-alvarinho','narince'])

function structureFor(name:string,color:'red'|'white') {
  const id=slugify(name)
  return {
    acidity:highAcid.has(id)?5:softAcid.has(id)?2:4,
    tannin:color==='white'?1:highTannin.has(id)?5:lightBody.has(id)?2:3,
    body:fullBody.has(id)?5:lightBody.has(id)?2:color==='red'?4:3,
  }
}

export const grapes: Grape[] = grapesRaw.map(([name,color], index) => ({
  id: slugify(name), name, aliases: name.includes(' / ') ? name.split(' / ') : [], color,
  summary: `${name} is a ${color === 'red' ? 'dark-skinned' : 'light-skinned'} variety whose character changes meaningfully with climate, farming and cellar choices. Follow its regional links to compare those expressions.`,
  ...structureFor(name,color), aromaIds: aromaIdsForGrape(name,color), regionIds: [],
  origin:grapeOrigins[slugify(name)] ?? 'A historic variety with a long record in its classic linked regions',
  ripening:earlyRipening.has(slugify(name))?'Early ripening; site and spring-frost exposure matter.':lateRipening.has(slugify(name))?'Late ripening; it needs a sufficiently long season to develop flavour and phenolic maturity.':'Mid-season ripening, with timing shaped strongly by crop level and site.',
  climateFit:droughtTolerant.has(slugify(name))?'Well adapted to dry conditions once established, though balanced water access still shapes quality.':earlyRipening.has(slugify(name))?'Often strongest in cool to moderate sites where freshness can be retained.':'Adaptable across moderate climates; the best expression depends on matching heat, light and water to the variety.',
  viticulture:droughtTolerant.has(slugify(name))?'Canopy shade, old-vine balance and careful harvest timing help avoid sunburn or excessive concentration.':'Growers manage canopy, yield, airflow and harvest date to balance flavour maturity with acidity and healthy fruit.',
  winemaking:color==='red'?'Skin contact controls colour, tannin and texture; extraction can range from gentle infusion to firmer maceration, followed by maturation in tank, concrete, amphora or wood.':aromaticGrapes.has(slugify(name))?'Cool, protective handling can retain primary perfume; lees contact, skin contact or neutral vessels can add texture without obscuring aroma.':'Pressing decisions, fermentation temperature, lees work and vessel choice determine whether the wine feels linear, creamy, mineral or broad.',
  styles:color==='red'?['Fresh, fruit-led red','Site-driven dry red','Mature, savoury cellar style']:['Fresh dry white','Textural, site-led white','Sweet or sparkling expression where tradition allows'],
  pairings:color==='red'?(highTannin.has(slugify(name))?['Braised beef','Roast lamb','Hard aged cheese']:['Roast poultry','Mushrooms','Charred vegetables']):(highAcid.has(slugify(name))?['Shellfish','Fresh cheeses','Herb-led dishes']:['Roast fish','Creamy vegetables','Mildly spiced dishes']),
}))

const producerGroups: Array<[string,string[]]> = [
  ['bordeaux',['Château Margaux','Château d’Yquem','Château Cheval Blanc']],['bourgogne',['Domaine de la Romanée-Conti','Domaine Leflaive','Domaine Raveneau']],['champagne',['Bollinger','Krug','Egly-Ouriet']],['northern-rhone',['E. Guigal','M. Chapoutier']],['southern-rhone',['Château de Beaucastel']],['vouvray',['Domaine Huet']],['centre-loire',['Domaine Vacheron']],['anjou-saumur',['Nicolas Joly']],['alsace',['Trimbach','Zind-Humbrecht','Marcel Deiss']],['provence',['Domaine Tempier','Château Simone']],['languedoc-roussillon',['Mas de Daumas Gassac','Domaine Gauby','Domaine de la Grange des Pères']],['beaujolais',['Jean Foillard','Château Thivin']],['jura',['Domaine Tissot','Domaine Jean Macle']],['cahors',['Château du Cèdre']],['barolo',['Giacomo Conterno','Vietti']],['barbaresco',['Gaja','Produttori del Barbaresco']],['chianti-classico',['Antinori']],['montalcino',['Biondi-Santi']],['bolgheri',['Tenuta San Guido']],['valpolicella',['Giuseppe Quintarelli']],['soave',['Pieropan']],['conegliano-valdobbiadene',['Nino Franco']],['collio',['Jermann','Gravner']],['trentino-alto-adige',['Foradori','Cantina Terlano']],['franciacorta',['Ca’ del Bosco']],['valtellina',['Ar.Pe.Pe.']],['campania',['Mastroberardino','Feudi di San Gregorio']],['etna',['Benanti']],['vittoria',['COS']],['marsala',['Marco De Bartoli']],['rioja-alta',['Bodegas Muga','López de Heredia','La Rioja Alta']],['ribera-del-duero',['Vega Sicilia','Dominio de Pingus','Aalto']],['priorat-montsant',['Álvaro Palacios','Clos Mogador']],['rias-baixas',['Pazo de Señorans','Do Ferreiro']],['jerez',['González Byass','Lustau','Valdespino']],['penedes',['Gramona']],['douro',['Quinta do Noval','Niepoort','Symington Family Estates']],['vinho-verde',['Soalheiro','Anselmo Mendes']],['madeira',['Blandy’s','Barbeito','D’Oliveiras']],['mosel',['Dr. Loosen','Joh. Jos. Prüm','Egon Müller']],['nahe',['Dönnhoff','Schäfer-Fröhlich']],['pfalz',['Dr. Bürklin-Wolf','Knipser','Von Winning']],['rheingau',['Schloss Johannisberg','Robert Weil','Georg Breuer']],['rheinhessen',['Keller','Wittmann','Kühling-Gillot']],['ahr',['Meyer-Näkel','Jean Stodden']],['baden',['Bernhard Huber','Salwey']],['franken',['Rudolf Fürst','Hans Wirsching']],['wurttemberg',['Aldinger','Dautel','Schnaitmann']],['wachau',['F.X. Pichler','Knoll']],['kamptal',['Bründlmayer','Schloss Gobelsburg']],['tokaj',['Szepsy','Oremus','Royal Tokaji']],['santorini',['Estate Argyros','Gaia Wines']],['kakheti',['Pheasant’s Tears','Teliani Valley']],['sussex',['Nyetimber','Ridgeview']],['oakville',['Robert Mondavi Winery']],['napa-valley',['Ridge Vineyards','Schrader Cellars']],['sonoma-county',['Williams Selyem','Littorai']],['willamette-valley',['Eyrie Vineyards','Cristom','Domaine Serene']],['finger-lakes',['Hermann J. Wiemer','Dr. Konstantin Frank']],['okanagan-valley',['Mission Hill','Blue Mountain']],['mendoza',['Catena Zapata','Zuccardi','El Enemigo']],['maipo',['Concha y Toro','Santa Rita']],['maldonado',['Bodega Garzón','Alto de la Ballena']],['stellenbosch',['Kanonkop','Meerlust','Rust en Vrede']],['swartland',['The Sadie Family','Mullineux']],['barossa-valley',['Penfolds','Torbreck']],['eden-valley',['Henschke','Pewsey Vale']],['clare-valley',['Grosset']],['coonawarra',['Wynns Coonawarra Estate']],['margaret-river',['Cullen','Leeuwin Estate','Vasse Felix']],['hunter-valley',['Tyrrell’s']],['tasmania',['House of Arras']],['marlborough',['Cloudy Bay','Dog Point']],['central-otago',['Felton Road','Rippon']],['hawke-s-bay',['Te Mata','Craggy Range']],['bekaa-valley',['Château Musar','Château Ksara']],['ningxia',['Silver Heights','Kanaan Winery','Xige Estate']],['yamanashi',['Grace Wine','Château Mercian','Lumière']],['valle-de-guadalupe',['Monte Xanic','Adobe Guadalupe','Casa de Piedra']],
  ['pfalz',['Ökonomierat Rebholz','Friedrich Becker']],['rheingau',['Künstler','Leitz']],['rheinhessen',['Battenfeld Spanier']],['baden',['Dr. Heger']],
  ['napa-valley',['Opus One','Dominus Estate','Spottswoode Estate Vineyard & Winery','Stag’s Leap Wine Cellars','Chateau Montelena','Shafer Vineyards','Dunn Vineyards','Frog’s Leap Winery']],
  ['marlborough',['Allan Scott Family Winemakers','Astrolabe Wines','Auntsfield Estate','Blank Canvas Wines','FROMM Winery','Framingham Wines','Jules Taylor Wines','Te Whare Ra']],['central-otago',['Chard Farm','Mt Difficulty Wines','Nanny Goat Vineyard']],
  ['stellenbosch',['Tokara','Ken Forrester Wines','De Toren Private Cellar','Spier Wine Farm','Lanzerac']],['franschhoek',['Boekenhoutskloof']],['robertson',['De Wetshof Estate']],['constantia',['Groot Constantia','Klein Constantia']],['hemel-en-aarde',['Hamilton Russell Vineyards']],
  ['barossa-valley',['Yalumba','Seppeltsfield']],['mclaren-vale',['d’Arenberg']],['margaret-river',['Moss Wood']],['yarra-valley',['Giant Steps']],
  ['margaux',['Château Palmer']],['pauillac',['Château Latour']],['graves-sauternes',['Château Haut-Brion']],['saint-emilion',['Château-Figeac']]
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
  medoc:['Cabernet Sauvignon','Merlot','Cabernet Franc','Petit Verdot'],pauillac:['Cabernet Sauvignon','Merlot','Cabernet Franc','Petit Verdot'],pomerol:['Merlot','Cabernet Franc','Cabernet Sauvignon'],
  'cote-de-beaune':['Chardonnay','Pinot Noir','Aligoté'],'cote-chalonnaise':['Pinot Noir','Chardonnay','Aligoté'],maconnais:['Chardonnay','Pinot Noir'],
  'montagne-de-reims':['Pinot Noir','Chardonnay','Pinot Meunier'],'vallee-de-la-marne':['Pinot Meunier','Pinot Noir','Chardonnay'],'cote-des-blancs':['Chardonnay'],'cote-des-bar':['Pinot Noir','Chardonnay'],
  'northern-rhone':['Syrah / Shiraz','Viognier','Marsanne','Roussanne'],'southern-rhone':['Grenache / Garnacha','Syrah / Shiraz','Mourvèdre / Monastrell','Cinsault'],
  muscadet:['Melon de Bourgogne'],'anjou-saumur':['Chenin Blanc','Cabernet Franc','Sauvignon Blanc'],touraine:['Sauvignon Blanc','Chenin Blanc','Cabernet Franc'],
  alsace:['Riesling','Pinot Gris','Gewürztraminer','Pinot Blanc'],provence:['Grenache / Garnacha','Cinsault','Mourvèdre / Monastrell','Syrah / Shiraz'],
  'languedoc-roussillon':['Grenache / Garnacha','Syrah / Shiraz','Mourvèdre / Monastrell','Carignan','Cinsault'],beaujolais:['Gamay'],
  jura:['Savagnin','Chardonnay','Poulsard','Trousseau'],savoie:['Jacquère','Mondeuse','Aligoté'],cahors:['Malbec'],madiran:['Tannat','Cabernet Franc'],
  jurancon:['Petit Manseng','Gros Manseng'],bergerac:['Merlot','Cabernet Franc','Sauvignon Blanc','Sémillon'],corsica:['Vermentino','Grenache / Garnacha'],
  piemonte:['Nebbiolo','Barbera','Cortese','Arneis'],'asti-monferrato':['Barbera','Muscat','Cortese'],toscana:['Sangiovese','Cabernet Sauvignon','Merlot'],
  montepulciano:['Sangiovese'],bolgheri:['Cabernet Sauvignon','Merlot','Cabernet Franc'],veneto:['Corvina','Garganega','Glera'],
  'conegliano-valdobbiadene':['Glera'],collio:['Ribolla Gialla','Pinot Gris','Sauvignon Blanc'],'colli-orientali':['Ribolla Gialla','Pinot Gris','Sauvignon Blanc'],
  'trentino-alto-adige':['Pinot Gris','Chardonnay','Teroldego'],'franciacorta':['Chardonnay','Pinot Noir'],'valtellina':['Nebbiolo'],'emilia-romagna':['Barbera','Sangiovese'],
  marche:['Verdicchio','Montepulciano'],abruzzo:['Montepulciano'],campania:['Aglianico','Fiano'],puglia:['Zinfandel / Primitivo','Aglianico'],
  vittoria:['Nero d’Avola','Frappato'],marsala:['Grillo'],sardegna:['Vermentino','Grenache / Garnacha','Carignan'],
  rioja:['Tempranillo','Grenache / Garnacha','Graciano','Viura / Macabeo'],'rioja-alavesa':['Tempranillo','Grenache / Garnacha','Viura / Macabeo'],'rioja-oriental':['Grenache / Garnacha','Tempranillo','Graciano'],
  'priorat-montsant':['Grenache / Garnacha','Carignan','Syrah / Shiraz'],'rias-baixas':['Albariño / Alvarinho'],rueda:['Verdejo','Sauvignon Blanc','Viura / Macabeo'],
  penedes:['Xarel-lo','Parellada','Viura / Macabeo'],bierzo:['Mencía','Godello'],toro:['Tempranillo'],
  'jumilla-yecla':['Mourvèdre / Monastrell'],navarra:['Grenache / Garnacha','Tempranillo'],'basque-country-txakoli':['Hondarrabi Zuri'],
  ahr:['Pinot Noir'],baden:['Pinot Noir','Chardonnay','Pinot Gris'],franken:['Silvaner','Riesling'],'hessische-bergstra-e':['Riesling','Pinot Noir'],mittelrhein:['Riesling','Pinot Noir'],
  nahe:['Riesling','Pinot Noir'],pfalz:['Riesling','Pinot Noir','Pinot Gris'],rheinhessen:['Riesling','Silvaner','Pinot Noir'],'saale-unstrut':['Riesling','Pinot Blanc'],sachsen:['Riesling','Pinot Blanc'],wurttemberg:['Blaufränkisch / Lemberger','Pinot Noir','Riesling'],
  'uco-valley':['Malbec','Cabernet Sauvignon','Chardonnay'],'lujan-de-cuyo':['Malbec','Cabernet Sauvignon'],'maipu':['Malbec','Cabernet Sauvignon'],'calchaqui-valleys':['Torrontés','Malbec'],'san-juan-pedernal':['Syrah / Shiraz','Malbec'],'patagonia':['Pinot Noir','Malbec','Chardonnay'],'jujuy-catamarca':['Torrontés','Malbec'],
  constantia:['Sauvignon Blanc','Sémillon','Muscat'],paarl:['Syrah / Shiraz','Chenin Blanc','Cabernet Sauvignon'],franschhoek:['Cabernet Sauvignon','Syrah / Shiraz','Chardonnay'],'hemel-en-aarde':['Pinot Noir','Chardonnay'],robertson:['Chardonnay','Sauvignon Blanc','Syrah / Shiraz'],
  'wairau-valley':['Sauvignon Blanc','Pinot Noir'],'awatere-valley':['Sauvignon Blanc','Pinot Noir'],'north-canterbury':['Pinot Noir','Chardonnay','Riesling'],martinborough:['Pinot Noir','Sauvignon Blanc'],gisborne:['Chardonnay','Gewürztraminer'],nelson:['Sauvignon Blanc','Pinot Noir','Chardonnay'],
}

function idsForGrapes(names: string[]) {
  const requested=names.map(name=>({name,id:slugify(name)}))
  const missing=requested.filter(item=>!grapes.some(grape=>grape.id===item.id))
  if(missing.length) throw new Error(`Unknown grape reference: ${missing.map(item=>item.name).join(', ')}`)
  return requested.map(item=>item.id)
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

const countrySources: Record<string,{label:string;url:string}> = {
  France:{label:'Vins de France',url:'https://www.vins-france.com/'}, Italy:{label:'Federdoc',url:'https://www.federdoc.com/'}, Spain:{label:'Foods and Wines from Spain',url:'https://www.foodswinesfromspain.com/'},
  Portugal:{label:'Wines of Portugal',url:'https://winesofportugal.com/'}, Germany:{label:'German Wine Institute',url:'https://www.winesofgermany.com/'}, Austria:{label:'Austrian Wine',url:'https://www.austrianwine.com/'},
  Switzerland:{label:'Swiss Wine',url:'https://www.swisswine.ch/'}, Hungary:{label:'Wines of Hungary',url:'https://winesofhungary.hu/'}, Greece:{label:'Wines of Greece',url:'https://winesofgreece.org/'},
  Georgia:{label:'National Wine Agency of Georgia',url:'https://wine.gov.ge/En/'}, Slovenia:{label:'Wines of Slovenia',url:'https://www.winesofslovenia.com/'}, Croatia:{label:'Croatian Chamber of Economy',url:'https://croatianwine.eu/'},
  England:{label:'WineGB',url:'https://winegb.co.uk/'}, 'United States':{label:'TTB wine appellations',url:'https://www.ttb.gov/wine/american-viticultural-area-ava'}, Canada:{label:'Wine Growers Canada',url:'https://www.winegrowerscanada.ca/'},
  Argentina:{label:'Wines of Argentina',url:'https://www.winesofargentina.org/'}, Chile:{label:'Wines of Chile',url:'https://www.winesofchile.org/'}, Uruguay:{label:'INAVI Uruguay',url:'https://www.inavi.com.uy/'},
  Brazil:{label:'Wines of Brasil',url:'https://www.winesofbrasil.com/'}, 'South Africa':{label:'Wines of South Africa',url:'https://www.wosa.co.za/'}, Australia:{label:'Wine Australia',url:'https://www.wineaustralia.com/'},
  'New Zealand':{label:'New Zealand Winegrowers',url:'https://www.nzwine.com/'}, Lebanon:{label:'Union Vinicole du Liban',url:'https://www.lebanesewines.com/'}, Israel:{label:'Israel Wine Producers Association',url:'https://www.israelwines.co.il/'},
  Armenia:{label:'Vine and Wine Foundation of Armenia',url:'https://vwfa.am/'}, China:{label:'OIV country profile',url:'https://www.oiv.int/'}, Japan:{label:'Wines of Japan',url:'https://www.winesofjapan.com/'},
  Mexico:{label:'Consejo Mexicano Vitivinícola',url:'https://uvayvino.org.mx/'}, Turkey:{label:'Wines of Turkey',url:'https://www.winesofturkey.org/'}, Cyprus:{label:'Cyprus Wine Museum',url:'https://www.cypruswinemuseum.com/'},
  India:{label:'Indian Grape Processing Board',url:'https://www.igpb.in/'},
}
const localZones: Record<string,string[]> = {
  bordeaux:['Left Bank','Right Bank','Entre-Deux-Mers'], medoc:['Saint-Estèphe','Pauillac','Saint-Julien','Margaux'], champagne:['Montagne de Reims','Vallée de la Marne','Côte des Blancs','Côte des Bar'],
  bourgogne:['Chablis','Côte de Nuits','Côte de Beaune','Côte Chalonnaise','Mâconnais'], mosel:['Upper Mosel','Middle Mosel','Lower Mosel'],
  rheingau:['Hochheim','Rüdesheim','Assmannshausen'], rioja:['Rioja Alta','Rioja Alavesa','Rioja Oriental'], douro:['Baixo Corgo','Cima Corgo','Douro Superior'],
  piemonte:['Langhe','Roero','Monferrato'], toscana:['Chianti Classico','Montalcino','Montepulciano','Bolgheri'], mendoza:['Luján de Cuyo','Maipú','Uco Valley'],
  'napa-valley':['Calistoga','St Helena','Rutherford','Oakville','Yountville','Los Carneros'], 'sonoma-county':['Russian River Valley','Sonoma Coast','Dry Creek Valley','Alexander Valley'],
  'barossa-valley':['Northern Grounds','Central Grounds','Southern Grounds'], marlborough:['Wairau Valley','Southern Valleys','Awatere Valley'], stellenbosch:['Simonsberg','Helderberg','Bottelary','Jonkershoek Valley'],
  'central-otago':['Bannockburn','Gibbston','Cromwell Basin','Alexandra','Wanaka'], 'okanagan-valley':['Lake Country','Kelowna','Naramata Bench','Okanagan Falls','Oliver–Osoyoos'],
}
const countryPairings: Record<string,string[]> = {
  France:['Roast poultry','Local cheese','Slow-cooked vegetables'], Italy:['Pasta with regional sauces','Cured meats','Aged cheese'], Spain:['Grilled lamb','Rice dishes','Jamón and tapas'],
  Portugal:['Salt cod','Slow-cooked pork','Sheep cheese'], Germany:['River fish','Roast pork','Herb-led vegetable dishes'], Austria:['Schnitzel','Freshwater fish','Mushroom dishes'],
  Greece:['Grilled seafood','Lamb with herbs','Aged sheep cheese'], Argentina:['Wood-grilled beef','Empanadas','Roasted squash'], Chile:['Grilled meats','Pacific seafood','Corn and pepper dishes'],
  'South Africa':['Cape Malay spices','Braai-grilled meat','Roast vegetables'], Australia:['Chargrilled beef','Roast lamb','Coastal seafood'], 'New Zealand':['Green-lipped mussels','Lamb','Herb-led vegetables'],
  Japan:['Sashimi','Tempura','Delicate mountain vegetables'], Georgia:['Khachapuri','Walnut sauces','Chargrilled meat'],
}
function regionStyles(grapeIds:string[],country:string) {
  const linked=grapes.filter(grape=>grapeIds.includes(grape.id))
  const hasRed=linked.some(grape=>grape.color==='red'), hasWhite=linked.some(grape=>grape.color==='white')
  return [...(hasRed?['Dry red wines shaped by site and extraction']:[]),...(hasWhite?['Dry white wines ranging from taut to textural']:[]),...(country==='France'||country==='Italy'||country==='Spain'||country==='Germany'?['Traditional sparkling or sweet specialities where local rules allow']:[])].slice(0,3)
}

export const regions: Region[] = regionDrafts.map(({country,name,center}) => {
  const id=slugify(name), coordinate=regionCoordinates[id] ?? center
  const grapeIds=idsForGrapes(regionGrapes[id] ?? countryGrapes[country] ?? ['Cabernet Sauvignon','Chardonnay','Pinot Noir','Riesling'])
  const climate=regionTerroir[id]?.climate ?? countryClimate[country] ?? 'Growing conditions shaped by latitude, elevation, water and prevailing winds'
  const soil=regionTerroir[id]?.soil ?? countrySoil[country] ?? 'Locally varied sedimentary, volcanic or weathered soils'
  const source=countrySources[country] ?? {label:'International Organisation of Vine and Wine',url:'https://www.oiv.int/'}
  const hemisphere=coordinate[0]>=0?'Northern':'Southern'
  return {
    id,name,country,lat:coordinate[0],lng:coordinate[1],
    summary:`${name} is understood through the interaction of season, site, local varieties and cellar tradition. Its position within ${country} gives growers a distinct set of choices rather than a single fixed flavour.`,
    climate,soil,grapeIds,producerIds:[],wineIds:[],sourceUrl:source.url,
    history:`Winegrowing in ${name} has evolved through local farming, trade and changing appellation or geographical rules. Today, established traditions sit beside closer study of individual sites, heritage vines and climate adaptation.`,
    growingSeason:`In the ${hemisphere.toLowerCase()} hemisphere, budbreak, flowering, véraison and harvest move through a season governed by ${climate.toLowerCase()}. Vintage conditions alter yield, ripeness, acidity and picking decisions.`,
    viticulture:`Growers in ${name} match variety, rootstock, canopy, yield and harvest date to ${soil.toLowerCase()}. Slope, aspect, water access and wind can matter as much as the regional average.`,
    wineStyles:regionStyles(grapeIds,country), subregions:localZones[id] ?? [],
    pairings:countryPairings[country] ?? ['Seasonal vegetables','Roast poultry','Regional cheeses'],
    keyFacts:[`${Math.abs(coordinate[0]).toFixed(1)}° ${coordinate[0]>=0?'north':'south'} latitude`,`${grapeIds.length} linked benchmark varieties`,`${localZones[id]?.length ?? 0} named local zones in this atlas`],
    sources:[source,{label:'OIV standards and statistics',url:'https://www.oiv.int/'}],
    featured:['bordeaux','bourgogne','champagne','mosel','rioja','chianti-classico','napa-valley','mendoza','barossa-valley','marlborough'].includes(id),
  }
})

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
const producerWebsites: Record<string,string> = {
  'Château Cheval Blanc':'https://www.chateau-cheval-blanc.com/', 'Château Margaux':'https://www.chateau-margaux.com/', 'Château d’Yquem':'https://yquem.fr/',
  'Domaine de la Romanée-Conti':'https://www.romanee-conti.fr/', 'Domaine Huet':'https://www.domainehuet.com/', 'Robert Mondavi Winery':'https://robertmondaviwinery.com/',
  'Catena Zapata':'https://catenazapata.com/', 'Cloudy Bay':'https://www.cloudybay.com/', Antinori:'https://www.antinori.it/', Penfolds:'https://www.penfolds.com/',
  'Ökonomierat Rebholz':'https://www.vdp.de/de/die-winzer/pfalz/rebholz','Friedrich Becker':'https://www.vdp.de/de/weingueter','Künstler':'https://www.vdp.de/de/weingueter','Leitz':'https://www.vdp.de/de/weingueter','Battenfeld Spanier':'https://www.vdp.de/de/die-winzer/rheinhessen/battenfeld-spanier','Dr. Heger':'https://www.vdp.de/de/weingueter',
  'Opus One':'https://napavintners.com/wineries/','Dominus Estate':'https://napavintners.com/wineries/','Spottswoode Estate Vineyard & Winery':'https://napavintners.com/wineries/','Stag’s Leap Wine Cellars':'https://napavintners.com/wineries/','Chateau Montelena':'https://napavintners.com/wineries/','Shafer Vineyards':'https://napavintners.com/wineries/','Dunn Vineyards':'https://napavintners.com/wineries/','Frog’s Leap Winery':'https://napavintners.com/wineries/',
  'Allan Scott Family Winemakers':'https://www.nzwine.com/en/visit/?filter-region=marlborough','Astrolabe Wines':'https://www.nzwine.com/en/winery/astrolabe-wines','Auntsfield Estate':'https://www.nzwine.com/en/winery/auntsfield-estate','Blank Canvas Wines':'https://www.nzwine.com/en/winery/blank-canvas','FROMM Winery':'https://www.nzwine.com/en/visit/?filter-region=marlborough','Framingham Wines':'https://www.nzwine.com/en/winery/framingham-wines','Jules Taylor Wines':'https://www.nzwine.com/en/winery/jules-taylor-wines','Te Whare Ra':'https://www.nzwine.com/en/winery/te-whare-ra-twr-wines','Chard Farm':'https://www.nzwine.com/en/regions/centralotago/','Mt Difficulty Wines':'https://www.nzwine.com/en/regions/centralotago/','Nanny Goat Vineyard':'https://www.nzwine.com/en/regions/centralotago/',
  Tokara:'https://www.wosa.co.za/EncounterSA/Exhibitors/','Ken Forrester Wines':'https://www.wosa.co.za/EncounterSA/Exhibitors/','De Toren Private Cellar':'https://www.wosa.co.za/EncounterSA/Exhibitors/','Spier Wine Farm':'https://www.wosa.co.za/EncounterSA/Exhibitors/',Lanzerac:'https://www.wosa.co.za/EncounterSA/Exhibitors/',Boekenhoutskloof:'https://www.wosa.co.za/EncounterSA/Exhibitors/','De Wetshof Estate':'https://www.wosa.co.za/EncounterSA/Exhibitors/','Groot Constantia':'https://www.wosa.co.za/EncounterSA/Exhibitors/','Klein Constantia':'https://www.wosa.co.za/EncounterSA/Exhibitors/','Hamilton Russell Vineyards':'https://www.wosa.co.za/EncounterSA/Exhibitors/',
  Yalumba:'https://www.yalumba.com/au/','Seppeltsfield':'https://seppeltsfield.com.au/','d’Arenberg':'https://www.darenberg.com.au/','Moss Wood':'https://www.mosswood.com.au/','Giant Steps':'https://www.giantstepswine.com.au/',
  'Château Palmer':'https://chateaux.fgvb.fr/','Château Latour':'https://chateaux.fgvb.fr/','Château Haut-Brion':'https://chateaux.fgvb.fr/','Château-Figeac':'https://chateaux.fgvb.fr/',
}
export const producers: Producer[] = producerGroups.flatMap(([regionId,names], groupIndex) => names.map((name) => {
  const resolvedRegionId=producerRegionOverrides[name] ?? (knownRegionIds.has(regionId)?regionId:regions[groupIndex%regions.length].id)
  const region=regions.find(item=>item.id===resolvedRegionId)!
  return {
    id:slugify(name),name,regionId:resolvedRegionId,regionIds:[resolvedRegionId],
    summary:producerSummaries[name] ?? `${name} is based in ${region.name}. Read the estate through the region’s climate, soils, linked varieties and cellar choices rather than through reputation alone.`,
    lat:region.lat,lng:region.lng,wineIds:[],communityRating:Number((4.1+(groupIndex%8)*.08).toFixed(1)),
    philosophy:`The profile of ${name} is best understood as a set of decisions: how sites are farmed, when fruit is picked, how extraction is handled and which vessels preserve or reshape the character of ${region.name}.`,
    vineyard:`Vineyard work responds to ${region.climate.toLowerCase()} and ${region.soil.toLowerCase()}. Canopy, crop level, soil cover, water and parcel selection influence the fruit that reaches the cellar.`,
    cellar:'Fermentation and maturation are style choices rather than a quality hierarchy. Temperature, skin contact, lees, oxygen and vessel each leave a sensory trace.',
    speciality:`A regional perspective centred on ${region.grapeIds.slice(0,3).map(id=>grapes.find(grape=>grape.id===id)?.name).filter(Boolean).join(', ')}.`,
    sourceUrl:producerWebsites[name] ?? region.sourceUrl,
  }
}))

type WineSpec = [name:string, producer:string, region:string, grapes:string[], style:WineStyle, sourceUrl?:string]
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
  // France — estate and appellation sources
  ['Pavillon Blanc du Château Margaux','Château Margaux','margaux',['Sauvignon Blanc'],'white'],
  ['Margaux du Château Margaux','Château Margaux','margaux',['Cabernet Sauvignon','Merlot'],'red'],
  ['Y d’Yquem','Château d’Yquem','graves-sauternes',['Sauvignon Blanc','Sémillon'],'white'],
  ['Le Petit Cheval','Château Cheval Blanc','saint-emilion',['Merlot','Cabernet Franc'],'red'],
  ['Richebourg Grand Cru','Domaine de la Romanée-Conti','cote-de-nuits',['Pinot Noir'],'red'],
  ['Échézeaux Grand Cru','Domaine de la Romanée-Conti','cote-de-nuits',['Pinot Noir'],'red'],
  ['Grands Échézeaux Grand Cru','Domaine de la Romanée-Conti','cote-de-nuits',['Pinot Noir'],'red'],
  ['Montrachet Grand Cru','Domaine de la Romanée-Conti','cote-de-beaune',['Chardonnay'],'white'],
  ['Puligny-Montrachet','Domaine Leflaive','cote-de-beaune',['Chardonnay'],'white'],
  ['Chevalier-Montrachet Grand Cru','Domaine Leflaive','cote-de-beaune',['Chardonnay'],'white'],
  ['Bâtard-Montrachet Grand Cru','Domaine Leflaive','cote-de-beaune',['Chardonnay'],'white'],
  ['Chablis Grand Cru Les Clos','Domaine Raveneau','chablis',['Chardonnay'],'white'],
  ['Chablis Grand Cru Valmur','Domaine Raveneau','chablis',['Chardonnay'],'white'],
  ['Chablis 1er Cru Montée de Tonnerre','Domaine Raveneau','chablis',['Chardonnay'],'white'],
  ['R.D. Extra Brut','Bollinger','champagne',['Pinot Noir','Chardonnay'],'sparkling'],
  ['PN AYC','Bollinger','champagne',['Pinot Noir'],'sparkling'],
  ['Vieilles Vignes Françaises','Bollinger','champagne',['Pinot Noir'],'sparkling'],
  ['Grande Cuvée','Krug','champagne',['Pinot Noir','Chardonnay','Pinot Meunier'],'sparkling'],
  ['Krug Rosé','Krug','champagne',['Pinot Noir','Chardonnay','Pinot Meunier'],'rose'],
  ['Clos du Mesnil','Krug','cote-des-blancs',['Chardonnay'],'sparkling'],
  ['Grand Cru Brut Tradition','Egly-Ouriet','montagne-de-reims',['Pinot Noir','Chardonnay'],'sparkling'],
  ['Blanc de Noirs Vieilles Vignes','Egly-Ouriet','montagne-de-reims',['Pinot Noir'],'sparkling'],
  ['Côte-Rôtie La Mouline','E. Guigal','northern-rhone',['Syrah / Shiraz','Viognier'],'red'],
  ['Côte-Rôtie La Turque','E. Guigal','northern-rhone',['Syrah / Shiraz','Viognier'],'red'],
  ['Côte-Rôtie La Landonne','E. Guigal','northern-rhone',['Syrah / Shiraz'],'red'],
  ['Condrieu La Doriane','E. Guigal','northern-rhone',['Viognier'],'white'],
  ['Ermitage Le Pavillon','M. Chapoutier','northern-rhone',['Syrah / Shiraz'],'red'],
  ['Hermitage Chante-Alouette','M. Chapoutier','northern-rhone',['Marsanne'],'white'],
  ['Châteauneuf-du-Pape Rouge','Château de Beaucastel','southern-rhone',['Grenache / Garnacha','Mourvèdre / Monastrell','Syrah / Shiraz','Cinsault'],'red'],
  ['Hommage à Jacques Perrin','Château de Beaucastel','southern-rhone',['Mourvèdre / Monastrell','Grenache / Garnacha','Syrah / Shiraz'],'red'],
  ['Le Mont Sec','Domaine Huet','vouvray',['Chenin Blanc'],'white'],
  ['Clos du Bourg Demi-Sec','Domaine Huet','vouvray',['Chenin Blanc'],'sweet'],
  ['Pétillant','Domaine Huet','vouvray',['Chenin Blanc'],'sparkling'],
  ['Sancerre Les Romains','Domaine Vacheron','centre-loire',['Sauvignon Blanc'],'white'],
  ['Sancerre Belle Dame','Domaine Vacheron','centre-loire',['Pinot Noir'],'red'],
  ['Coulée de Serrant','Nicolas Joly','anjou-saumur',['Chenin Blanc'],'white'],
  ['Clos de la Bergerie','Nicolas Joly','anjou-saumur',['Chenin Blanc'],'white'],
  ['Riesling Clos Sainte Hune','Trimbach','alsace',['Riesling'],'white'],
  ['Riesling Cuvée Frédéric Émile','Trimbach','alsace',['Riesling'],'white'],
  ['Gewurztraminer Cuvée des Seigneurs de Ribeaupierre','Trimbach','alsace',['Gewürztraminer'],'white'],
  ['Riesling Rangen de Thann Clos Saint Urbain','Zind-Humbrecht','alsace',['Riesling'],'white'],
  ['Gewurztraminer Herrenweg de Turckheim','Zind-Humbrecht','alsace',['Gewürztraminer'],'white'],
  ['Bandol Rouge','Domaine Tempier','provence',['Mourvèdre / Monastrell','Grenache / Garnacha','Cinsault'],'red'],
  ['Bandol La Migoua','Domaine Tempier','provence',['Mourvèdre / Monastrell','Grenache / Garnacha','Cinsault'],'red'],
  ['Bandol La Tourtine','Domaine Tempier','provence',['Mourvèdre / Monastrell','Grenache / Garnacha','Cinsault'],'red'],
  ['Palette Blanc','Château Simone','provence',['Clairette','Grenache / Garnacha'],'white'],
  ['Palette Rouge','Château Simone','provence',['Grenache / Garnacha','Mourvèdre / Monastrell','Cinsault'],'red'],
  ['Mas de Daumas Gassac Rouge','Mas de Daumas Gassac','languedoc-roussillon',['Cabernet Sauvignon'],'red'],
  ['Mas de Daumas Gassac Blanc','Mas de Daumas Gassac','languedoc-roussillon',['Viognier','Chardonnay'],'white'],
  ['La Muntada','Domaine Gauby','languedoc-roussillon',['Grenache / Garnacha','Carignan','Syrah / Shiraz'],'red'],
  ['Vieilles Vignes Rouge','Domaine Gauby','languedoc-roussillon',['Grenache / Garnacha','Carignan','Syrah / Shiraz'],'red'],
  ['Morgon Côte du Py','Jean Foillard','beaujolais',['Gamay'],'red'],
  ['Morgon Corcelette','Jean Foillard','beaujolais',['Gamay'],'red'],
  ['Cuvée Zaccharie','Château Thivin','beaujolais',['Gamay'],'red'],
  ['Vin Jaune En Spois','Domaine Tissot','jura',['Savagnin'],'white'],
  ['Savagnin Ouillé','Domaine Tissot','jura',['Savagnin'],'white'],
  ['Château-Chalon Vin Jaune','Domaine Jean Macle','jura',['Savagnin'],'white'],
  ['Côtes du Jura Blanc','Domaine Jean Macle','jura',['Chardonnay','Savagnin'],'white'],
  ['Le Cèdre','Château du Cèdre','cahors',['Malbec'],'red'],
  ['Extra Libre','Château du Cèdre','cahors',['Malbec'],'red'],

  // Italy
  ['Barolo Monfortino Riserva','Giacomo Conterno','barolo',['Nebbiolo'],'red'],
  ['Barolo Francia','Giacomo Conterno','barolo',['Nebbiolo'],'red'],
  ['Barolo Castiglione','Vietti','barolo',['Nebbiolo'],'red'],
  ['Barolo Ravera','Vietti','barolo',['Nebbiolo'],'red'],
  ['Barolo Brunate','Vietti','barolo',['Nebbiolo'],'red'],
  ['Barbaresco Sorì San Lorenzo','Gaja','barbaresco',['Nebbiolo'],'red'],
  ['Barbaresco Sorì Tildìn','Gaja','barbaresco',['Nebbiolo'],'red'],
  ['Barbaresco Costa Russi','Gaja','barbaresco',['Nebbiolo'],'red'],
  ['Barbaresco Riserva Ovello','Produttori del Barbaresco','barbaresco',['Nebbiolo'],'red'],
  ['Barbaresco Riserva Rabajà','Produttori del Barbaresco','barbaresco',['Nebbiolo'],'red'],
  ['Pèppoli Chianti Classico','Antinori','chianti-classico',['Sangiovese','Merlot','Syrah / Shiraz'],'red'],
  ['Rosso di Montalcino','Biondi-Santi','montalcino',['Sangiovese'],'red'],
  ['Sassicaia','Tenuta San Guido','bolgheri',['Cabernet Sauvignon','Cabernet Franc'],'red'],
  ['Guidalberto','Tenuta San Guido','bolgheri',['Cabernet Sauvignon','Merlot'],'red'],
  ['Valpolicella Classico Superiore','Giuseppe Quintarelli','valpolicella',['Corvina'],'red'],
  ['Alzero','Giuseppe Quintarelli','valpolicella',['Cabernet Franc','Cabernet Sauvignon','Merlot'],'red'],
  ['Primofiore','Giuseppe Quintarelli','valpolicella',['Corvina','Cabernet Franc','Cabernet Sauvignon'],'red'],
  ['Soave Classico Calvarino','Pieropan','soave',['Garganega'],'white'],
  ['Soave Classico La Rocca','Pieropan','soave',['Garganega'],'white'],
  ['Valdobbiadene Prosecco Superiore Rustico','Nino Franco','conegliano-valdobbiadene',['Glera'],'sparkling'],
  ['Primo Franco','Nino Franco','conegliano-valdobbiadene',['Glera'],'sparkling'],
  ['Vintage Tunina','Jermann','collio',['Sauvignon Blanc','Chardonnay','Ribolla Gialla'],'white'],
  ['Where Dreams Have No End','Jermann','collio',['Chardonnay'],'white'],
  ['Ribolla','Gravner','collio',['Ribolla Gialla'],'white'],
  ['Breg','Gravner','collio',['Sauvignon Blanc','Pinot Gris','Chardonnay','Riesling'],'white'],
  ['Granato','Foradori','trentino-alto-adige',['Teroldego'],'red'],
  ['Morei','Foradori','trentino-alto-adige',['Teroldego'],'red'],
  ['Terlaner Cuvée','Cantina Terlano','trentino-alto-adige',['Pinot Blanc','Chardonnay','Sauvignon Blanc'],'white'],
  ['Pinot Bianco Vorberg Riserva','Cantina Terlano','trentino-alto-adige',['Pinot Blanc'],'white'],
  ['Cuvée Prestige','Ca’ del Bosco','franciacorta',['Chardonnay','Pinot Noir'],'sparkling'],
  ['Annamaria Clementi','Ca’ del Bosco','franciacorta',['Chardonnay','Pinot Noir'],'sparkling'],
  ['Sassella Rocce Rosse','Ar.Pe.Pe.','valtellina',['Nebbiolo'],'red'],
  ['Grumello Buon Consiglio','Ar.Pe.Pe.','valtellina',['Nebbiolo'],'red'],
  ['Taurasi Radici','Mastroberardino','campania',['Aglianico'],'red'],
  ['Fiano di Avellino Radici','Mastroberardino','campania',['Fiano'],'white'],
  ['Serpico','Feudi di San Gregorio','campania',['Aglianico'],'red'],
  ['Pietracalda Fiano di Avellino','Feudi di San Gregorio','campania',['Fiano'],'white'],
  ['Etna Bianco Superiore Pietramarina','Benanti','etna',['Carricante'],'white'],
  ['Etna Rosso Serra della Contessa','Benanti','etna',['Nerello Mascalese'],'red'],
  ['Cerasuolo di Vittoria Classico','COS','vittoria',['Nero d’Avola','Frappato'],'red'],
  ['Pithos Rosso','COS','vittoria',['Nero d’Avola','Frappato'],'red'],
  ['Vecchio Samperi','Marco De Bartoli','marsala',['Grillo'],'fortified'],
  ['Marsala Superiore Oro Vigna La Miccia','Marco De Bartoli','marsala',['Grillo'],'fortified'],
  // Spain and Portugal
  ['Torre Muga','Bodegas Muga','rioja-alta',['Tempranillo','Graciano','Carignan'],'red'],
  ['Aro','Bodegas Muga','rioja-alta',['Tempranillo','Graciano'],'red'],
  ['Muga Blanco','Bodegas Muga','rioja-alta',['Viura / Macabeo','Malvasia'],'white'],
  ['Viña Tondonia Reserva Blanco','López de Heredia','rioja-alta',['Viura / Macabeo','Malvasia'],'white'],
  ['Viña Bosconia Reserva','López de Heredia','rioja-alta',['Tempranillo','Grenache / Garnacha','Graciano'],'red'],
  ['Viña Ardanza Reserva','La Rioja Alta','rioja-alta',['Tempranillo','Grenache / Garnacha'],'red'],
  ['Gran Reserva 890','La Rioja Alta','rioja-alta',['Tempranillo','Graciano'],'red'],
  ['Viña Alberdi Reserva','La Rioja Alta','rioja-alta',['Tempranillo'],'red'],
  ['Valbuena 5º','Vega Sicilia','ribera-del-duero',['Tempranillo','Merlot'],'red'],
  ['Pingus','Dominio de Pingus','ribera-del-duero',['Tempranillo'],'red'],
  ['Flor de Pingus','Dominio de Pingus','ribera-del-duero',['Tempranillo'],'red'],
  ['PSI','Dominio de Pingus','ribera-del-duero',['Tempranillo','Grenache / Garnacha'],'red'],
  ['Aalto','Aalto','ribera-del-duero',['Tempranillo'],'red'],
  ['Aalto PS','Aalto','ribera-del-duero',['Tempranillo'],'red'],
  ['L’Ermita','Álvaro Palacios','priorat-montsant',['Grenache / Garnacha'],'red'],
  ['Finca Dofí','Álvaro Palacios','priorat-montsant',['Grenache / Garnacha','Carignan'],'red'],
  ['Camins del Priorat','Álvaro Palacios','priorat-montsant',['Grenache / Garnacha','Carignan','Syrah / Shiraz'],'red'],
  ['Clos Mogador','Clos Mogador','priorat-montsant',['Grenache / Garnacha','Carignan','Syrah / Shiraz','Cabernet Sauvignon'],'red'],
  ['Nelin','Clos Mogador','priorat-montsant',['Grenache Blanc','Viura / Macabeo'],'white'],
  ['Albariño Selección de Añada','Pazo de Señorans','rias-baixas',['Albariño / Alvarinho'],'white'],
  ['Albariño','Pazo de Señorans','rias-baixas',['Albariño / Alvarinho'],'white'],
  ['Cepas Vellas','Do Ferreiro','rias-baixas',['Albariño / Alvarinho'],'white'],
  ['Adina','Do Ferreiro','rias-baixas',['Albariño / Alvarinho'],'white'],
  ['Tío Pepe Fino','González Byass','jerez',['Palomino'],'fortified'],
  ['Apóstoles Palo Cortado','González Byass','jerez',['Palomino','Pedro Ximénez'],'fortified'],
  ['Noé Pedro Ximénez','González Byass','jerez',['Pedro Ximénez'],'sweet'],
  ['East India Solera','Lustau','jerez',['Palomino','Pedro Ximénez'],'fortified'],
  ['Papirusa Manzanilla','Lustau','jerez',['Palomino'],'fortified'],
  ['Emperatriz Eugenia Oloroso','Lustau','jerez',['Palomino'],'fortified'],
  ['Tío Diego Amontillado','Valdespino','jerez',['Palomino'],'fortified'],
  ['Don Gonzalo Oloroso','Valdespino','jerez',['Palomino'],'fortified'],
  ['Imperial Brut','Gramona','penedes',['Xarel-lo','Viura / Macabeo','Chardonnay'],'sparkling'],
  ['III Lustros','Gramona','penedes',['Xarel-lo','Viura / Macabeo'],'sparkling'],
  ['Celler Batlle','Gramona','penedes',['Xarel-lo','Viura / Macabeo'],'sparkling'],
  ['Quinta do Noval Nacional Vintage Port','Quinta do Noval','douro',['Touriga Nacional'],'fortified'],
  ['Late Bottled Vintage Port','Quinta do Noval','douro',['Touriga Nacional'],'fortified'],
  ['Cedro do Noval','Quinta do Noval','douro',['Touriga Nacional','Syrah / Shiraz'],'red'],
  ['Redoma Tinto','Niepoort','douro',['Touriga Nacional'],'red'],
  ['Batuta','Niepoort','douro',['Touriga Nacional'],'red'],
  ['Charme','Niepoort','douro',['Touriga Nacional'],'red'],
  ['Graham’s Vintage Port','Symington Family Estates','douro',['Touriga Nacional'],'fortified'],
  ['Dow’s Vintage Port','Symington Family Estates','douro',['Touriga Nacional'],'fortified'],
  ['Soalheiro Alvarinho','Soalheiro','vinho-verde',['Albariño / Alvarinho'],'white'],
  ['Primeiras Vinhas','Soalheiro','vinho-verde',['Albariño / Alvarinho'],'white'],
  ['Granit','Soalheiro','vinho-verde',['Albariño / Alvarinho'],'white'],
  ['Parcela Única','Anselmo Mendes','vinho-verde',['Albariño / Alvarinho'],'white'],
  ['Contacto','Anselmo Mendes','vinho-verde',['Albariño / Alvarinho'],'white'],
  ['Curtimenta','Anselmo Mendes','vinho-verde',['Albariño / Alvarinho'],'white'],
  ['10 Year Old Sercial','Blandy’s','madeira',['Sercial'],'fortified'],
  ['10 Year Old Malmsey','Blandy’s','madeira',['Malmsey'],'fortified'],
  ['Rainwater Medium Dry','Barbeito','madeira',['Verdelho'],'fortified'],
  ['Frasqueira Sercial','Barbeito','madeira',['Sercial'],'fortified'],
  ['Malvazia Reserva','D’Oliveiras','madeira',['Malmsey'],'fortified'],
  ['Verdelho Reserva','D’Oliveiras','madeira',['Verdelho'],'fortified'],

  // Germany and Austria
  ['Wehlener Sonnenuhr Riesling Auslese','Joh. Jos. Prüm','mosel',['Riesling'],'sweet'],
  ['Graacher Himmelreich Riesling Kabinett','Joh. Jos. Prüm','mosel',['Riesling'],'white'],
  ['Scharzhofberger Riesling Kabinett','Egon Müller','mosel',['Riesling'],'white'],
  ['Scharzhofberger Riesling Spätlese','Egon Müller','mosel',['Riesling'],'sweet'],
  ['Hermannshöhle Riesling GG','Dönnhoff','nahe',['Riesling'],'white'],
  ['Oberhäuser Brücke Riesling Spätlese','Dönnhoff','nahe',['Riesling'],'sweet'],
  ['Tonschiefer Riesling Trocken','Dönnhoff','nahe',['Riesling'],'white'],
  ['Felseneck Riesling GG','Schäfer-Fröhlich','nahe',['Riesling'],'white'],
  ['Stromberg Riesling GG','Schäfer-Fröhlich','nahe',['Riesling'],'white'],
  ['Kirchenstück Riesling GG','Dr. Bürklin-Wolf','pfalz',['Riesling'],'white'],
  ['Pechstein Riesling GG','Dr. Bürklin-Wolf','pfalz',['Riesling'],'white'],
  ['Kirschgarten Spätburgunder GG','Knipser','pfalz',['Pinot Noir'],'red'],
  ['Chardonnay Réserve','Knipser','pfalz',['Chardonnay'],'white'],
  ['Kirchenstück Riesling GG','Von Winning','pfalz',['Riesling'],'white'],
  ['Sauvignon Blanc 500','Von Winning','pfalz',['Sauvignon Blanc'],'white'],
  ['Gelblack Riesling Trocken','Schloss Johannisberg','rheingau',['Riesling'],'white'],
  ['Silberlack Riesling GG','Schloss Johannisberg','rheingau',['Riesling'],'white'],
  ['Kiedrich Gräfenberg Riesling GG','Robert Weil','rheingau',['Riesling'],'white'],
  ['Kiedrich Gräfenberg Riesling Spätlese','Robert Weil','rheingau',['Riesling'],'sweet'],
  ['Berg Schlossberg Riesling','Georg Breuer','rheingau',['Riesling'],'white'],
  ['Terra Montosa Riesling','Georg Breuer','rheingau',['Riesling'],'white'],
  ['G-Max Riesling','Keller','rheinhessen',['Riesling'],'white'],
  ['Hubacker Riesling GG','Keller','rheinhessen',['Riesling'],'white'],
  ['Kirchspiel Riesling GG','Keller','rheinhessen',['Riesling'],'white'],
  ['Morstein Riesling GG','Wittmann','rheinhessen',['Riesling'],'white'],
  ['Kirchspiel Riesling GG','Wittmann','rheinhessen',['Riesling'],'white'],
  ['Pettenthal Riesling GG','Kühling-Gillot','rheinhessen',['Riesling'],'white'],
  ['Ölberg Riesling GG','Kühling-Gillot','rheinhessen',['Riesling'],'white'],
  ['Unendlich Riesling Smaragd','F.X. Pichler','wachau',['Riesling'],'white'],
  ['Loibner Loibenberg Grüner Veltliner Smaragd','F.X. Pichler','wachau',['Grüner Veltliner'],'white'],
  ['Ried Schütt Riesling Smaragd','Knoll','wachau',['Riesling'],'white'],
  ['Vinothekfüllung Grüner Veltliner Smaragd','Knoll','wachau',['Grüner Veltliner'],'white'],
  ['Heiligenstein Riesling Alte Reben','Bründlmayer','kamptal',['Riesling'],'white'],
  ['Lamm Grüner Veltliner','Schloss Gobelsburg','kamptal',['Grüner Veltliner'],'white'],

  // Central Europe, Mediterranean and Caucasus
  ['Tokaji Aszú 6 Puttonyos','Oremus','tokaj',['Furmint'],'sweet'],
  ['Tokaji Eszencia','Royal Tokaji','tokaj',['Furmint'],'sweet'],
  ['Vinsanto','Estate Argyros','santorini',['Assyrtiko'],'sweet'],
  ['Santorini Wild Ferment Assyrtiko','Gaia Wines','santorini',['Assyrtiko'],'white'],
  ['Rkatsiteli Qvevri','Pheasant’s Tears','kakheti',['Rkatsiteli'],'white'],
  ['Saperavi Qvevri','Pheasant’s Tears','kakheti',['Saperavi'],'red'],
  ['Classic Cuvée','Nyetimber','sussex',['Chardonnay','Pinot Noir','Pinot Meunier'],'sparkling'],
  ['Blanc de Blancs','Nyetimber','sussex',['Chardonnay'],'sparkling'],
  ['Bloomsbury','Ridgeview','sussex',['Chardonnay','Pinot Noir','Pinot Meunier'],'sparkling'],
  // North and South America
  ['Monte Bello','Ridge Vineyards','napa-valley',['Cabernet Sauvignon','Merlot','Cabernet Franc','Petit Verdot'],'red'],
  ['Lytton Springs','Ridge Vineyards','sonoma-county',['Zinfandel / Primitivo','Carignan','Petit Verdot'],'red'],
  ['Old Sparky Cabernet Sauvignon','Schrader Cellars','napa-valley',['Cabernet Sauvignon'],'red'],
  ['CCS Cabernet Sauvignon','Schrader Cellars','oakville',['Cabernet Sauvignon'],'red'],
  ['Russian River Valley Pinot Noir','Williams Selyem','sonoma-county',['Pinot Noir'],'red'],
  ['Allen Vineyard Chardonnay','Williams Selyem','sonoma-county',['Chardonnay'],'white'],
  ['Les Larmes Pinot Noir','Littorai','sonoma-county',['Pinot Noir'],'red'],
  ['Charles Heintz Vineyard Chardonnay','Littorai','sonoma-county',['Chardonnay'],'white'],
  ['The Eyrie Pinot Noir','Eyrie Vineyards','willamette-valley',['Pinot Noir'],'red'],
  ['Original Vines Pinot Gris','Eyrie Vineyards','willamette-valley',['Pinot Gris'],'white'],
  ['Mt. Jefferson Cuvée Pinot Noir','Cristom','willamette-valley',['Pinot Noir'],'red'],
  ['Louise Vineyard Pinot Noir','Cristom','willamette-valley',['Pinot Noir'],'red'],
  ['Evenstad Reserve Pinot Noir','Domaine Serene','willamette-valley',['Pinot Noir'],'red'],
  ['Côte Sud Vineyard Chardonnay','Domaine Serene','willamette-valley',['Chardonnay'],'white'],
  ['HJW Vineyard Riesling','Hermann J. Wiemer','finger-lakes',['Riesling'],'white'],
  ['Magdalena Vineyard Riesling','Hermann J. Wiemer','finger-lakes',['Riesling'],'white'],
  ['Dry Riesling','Dr. Konstantin Frank','finger-lakes',['Riesling'],'white'],
  ['Blanc de Blancs','Dr. Konstantin Frank','finger-lakes',['Chardonnay'],'sparkling'],
  ['Oculus','Mission Hill','okanagan-valley',['Merlot','Cabernet Sauvignon','Cabernet Franc','Petit Verdot'],'red'],
  ['Perpetua Chardonnay','Mission Hill','okanagan-valley',['Chardonnay'],'white'],
  ['Reserve Brut','Blue Mountain','okanagan-valley',['Pinot Noir','Chardonnay'],'sparkling'],
  ['Estate Cuvée Pinot Noir','Blue Mountain','okanagan-valley',['Pinot Noir'],'red'],
  ['Nicolás Catena Zapata','Catena Zapata','mendoza',['Cabernet Sauvignon','Malbec'],'red'],
  ['Argentino Vineyard Malbec','Catena Zapata','mendoza',['Malbec'],'red'],
  ['Finca Piedra Infinita','Zuccardi','uco-valley',['Malbec'],'red'],
  ['Concreto Malbec','Zuccardi','uco-valley',['Malbec'],'red'],
  ['Gran Enemigo Gualtallary','El Enemigo','uco-valley',['Cabernet Franc','Malbec'],'red'],
  ['El Enemigo Chardonnay','El Enemigo','mendoza',['Chardonnay'],'white'],
  ['Don Melchor Cabernet Sauvignon','Concha y Toro','maipo',['Cabernet Sauvignon'],'red'],
  ['Marqués de Casa Concha Carmenère','Concha y Toro','maipo',['Carmenère'],'red'],
  ['Casa Real Cabernet Sauvignon','Santa Rita','maipo',['Cabernet Sauvignon'],'red'],
  ['Amayna Sauvignon Blanc','Santa Rita','leyda-san-antonio',['Sauvignon Blanc'],'white'],
  ['Balasto','Bodega Garzón','maldonado',['Tannat','Cabernet Franc','Petit Verdot'],'red'],
  ['Single Vineyard Tannat','Bodega Garzón','maldonado',['Tannat'],'red'],
  ['Tannat Viognier','Alto de la Ballena','maldonado',['Tannat','Viognier'],'red'],

  // South Africa
  ['Paul Sauer','Kanonkop','stellenbosch',['Cabernet Sauvignon','Cabernet Franc','Merlot'],'red'],
  ['Pinotage Estate Wine','Kanonkop','stellenbosch',['Pinotage'],'red'],
  ['Rubicon','Meerlust','stellenbosch',['Cabernet Sauvignon','Merlot','Cabernet Franc'],'red'],
  ['Meerlust Chardonnay','Meerlust','stellenbosch',['Chardonnay'],'white'],
  ['Estate Red','Rust en Vrede','stellenbosch',['Cabernet Sauvignon','Syrah / Shiraz','Merlot'],'red'],
  ['Single Vineyard Cabernet Sauvignon','Rust en Vrede','stellenbosch',['Cabernet Sauvignon'],'red'],
  ['Columella','The Sadie Family','swartland',['Syrah / Shiraz','Mourvèdre / Monastrell','Grenache / Garnacha','Cinsault'],'red'],
  ['Palladius','The Sadie Family','swartland',['Chenin Blanc','Grenache Blanc','Viognier'],'white'],
  ['Granite Syrah','Mullineux','swartland',['Syrah / Shiraz'],'red'],
  ['Old Vines White','Mullineux','swartland',['Chenin Blanc'],'white'],

  // Australia and New Zealand
  ['Bin 707 Cabernet Sauvignon','Penfolds','barossa-valley',['Cabernet Sauvignon'],'red','https://www.penfolds.com/en/wine-advice/bin-numbers.html'],
  ['St Henri Shiraz','Penfolds','barossa-valley',['Syrah / Shiraz'],'red','https://www.penfolds.com/en-ae/wines/ranges/australian'],
  ['Bin 28 Shiraz','Penfolds','barossa-valley',['Syrah / Shiraz'],'red','https://www.penfolds.com/en-ae/wines/ranges/australian'],
  ['RWT Bin 798 Barossa Valley Shiraz','Penfolds','barossa-valley',['Syrah / Shiraz'],'red','https://www.penfolds.com/en-ae/wines/ranges/australian'],
  ['Hill of Grace','Henschke','eden-valley',['Syrah / Shiraz'],'red'],
  ['Mount Edelstone','Henschke','eden-valley',['Syrah / Shiraz'],'red'],
  ['The Contours Riesling','Pewsey Vale','eden-valley',['Riesling'],'white'],
  ['Polish Hill Riesling','Grosset','clare-valley',['Riesling'],'white'],
  ['Springvale Riesling','Grosset','clare-valley',['Riesling'],'white'],
  ['John Riddoch Cabernet Sauvignon','Wynns Coonawarra Estate','coonawarra',['Cabernet Sauvignon'],'red'],
  ['Black Label Cabernet Sauvignon','Wynns Coonawarra Estate','coonawarra',['Cabernet Sauvignon'],'red'],
  ['Diana Madeline','Cullen','margaret-river',['Cabernet Sauvignon','Merlot','Cabernet Franc'],'red'],
  ['Kevin John Chardonnay','Cullen','margaret-river',['Chardonnay'],'white'],
  ['Art Series Chardonnay','Leeuwin Estate','margaret-river',['Chardonnay'],'white'],
  ['Art Series Cabernet Sauvignon','Leeuwin Estate','margaret-river',['Cabernet Sauvignon'],'red'],
  ['Heytesbury Chardonnay','Vasse Felix','margaret-river',['Chardonnay'],'white'],
  ['Tom Cullity','Vasse Felix','margaret-river',['Cabernet Sauvignon','Malbec'],'red'],
  ['Vat 1 Sémillon','Tyrrell’s','hunter-valley',['Sémillon'],'white'],
  ['4 Acres Shiraz','Tyrrell’s','hunter-valley',['Syrah / Shiraz'],'red'],
  ['Grand Vintage','House of Arras','tasmania',['Chardonnay','Pinot Noir'],'sparkling'],
  ['E.J. Carr Late Disgorged','House of Arras','tasmania',['Chardonnay','Pinot Noir'],'sparkling'],
  ['Chardonnay','Cloudy Bay','marlborough',['Chardonnay'],'white','https://www.cloudybay.com/en-nz/'],
  ['Pinot Noir','Cloudy Bay','marlborough',['Pinot Noir'],'red','https://www.cloudybay.com/en-nz/'],
  ['Pelorus','Cloudy Bay','marlborough',['Chardonnay','Pinot Noir'],'sparkling','https://www.cloudybay.com/en-nz/'],
  ['Te Wāhi Pinot Noir','Cloudy Bay','central-otago',['Pinot Noir'],'red','https://www.cloudybay.com/en-nz/'],
  ['Section 94 Sauvignon Blanc','Dog Point','marlborough',['Sauvignon Blanc'],'white'],
  ['Dog Point Pinot Noir','Dog Point','marlborough',['Pinot Noir'],'red'],
  ['Block 3 Pinot Noir','Felton Road','central-otago',['Pinot Noir'],'red'],
  ['Bannockburn Chardonnay','Felton Road','central-otago',['Chardonnay'],'white'],
  ['Mature Vine Pinot Noir','Rippon','central-otago',['Pinot Noir'],'red'],
  ['Tinker’s Field Pinot Noir','Rippon','central-otago',['Pinot Noir'],'red'],
  ['Coleraine','Te Mata','hawke-s-bay',['Cabernet Sauvignon','Merlot','Cabernet Franc'],'red'],
  ['Bullnose Syrah','Te Mata','hawke-s-bay',['Syrah / Shiraz'],'red'],
  ['Le Sol Syrah','Craggy Range','hawke-s-bay',['Syrah / Shiraz'],'red'],
  ['Sophia','Craggy Range','hawke-s-bay',['Merlot','Cabernet Franc','Cabernet Sauvignon'],'red'],

  // Eastern Mediterranean and Asia
  ['Château Musar Red','Château Musar','bekaa-valley',['Cabernet Sauvignon','Cinsault','Carignan'],'red'],
  ['Château Musar White','Château Musar','bekaa-valley',['Obaideh','Merwah'],'white'],
  ['Château Ksara Réserve du Couvent','Château Ksara','bekaa-valley',['Syrah / Shiraz','Cabernet Sauvignon','Cabernet Franc'],'red'],
  ['The Summit','Silver Heights','ningxia',['Cabernet Sauvignon','Cabernet Franc'],'red'],
  ['Pretty Pony','Kanaan Winery','ningxia',['Cabernet Sauvignon'],'red'],
  ['Jade Dove Single Vineyard','Xige Estate','ningxia',['Cabernet Sauvignon'],'red'],
  ['Cuvée Misawa Koshu','Grace Wine','yamanashi',['Koshu'],'white'],
  ['Koshu Gris de Gris','Château Mercian','yamanashi',['Koshu'],'white'],
  ['KOSHU Hikari','Lumière','yamanashi',['Koshu'],'white'],
  ['Gran Ricardo','Monte Xanic','valle-de-guadalupe',['Cabernet Sauvignon','Merlot','Petit Verdot'],'red'],
  ['Serafiel Cabernet Syrah','Adobe Guadalupe','valle-de-guadalupe',['Cabernet Sauvignon','Syrah / Shiraz'],'red'],
  ['Contraste','Casa de Piedra','valle-de-guadalupe',['Tempranillo','Cabernet Sauvignon'],'red'],

  // Additional benchmark estates verified through official producer and trade directories.
  ['Kastanienbusch Riesling GG','Ökonomierat Rebholz','pfalz',['Riesling'],'white','https://www.vdp.de/de/die-winzer/pfalz/rebholz'],
  ['Sankt Paul Spätburgunder GG','Friedrich Becker','pfalz',['Pinot Noir'],'red'],
  ['Hochheimer Hölle Riesling GG','Künstler','rheingau',['Riesling'],'white'],
  ['Rüdesheimer Berg Schlossberg Ehrenfels Riesling','Leitz','rheingau',['Riesling'],'white'],
  ['Frauenberg Riesling GG','Battenfeld Spanier','rheinhessen',['Riesling'],'white','https://www.vdp.de/de/die-winzer/rheinhessen/battenfeld-spanier'],
  ['Ihringer Winklerberg Spätburgunder GG','Dr. Heger','baden',['Pinot Noir'],'red'],
  ['Opus One','Opus One','napa-valley',['Cabernet Sauvignon','Cabernet Franc','Merlot','Petit Verdot'],'red'],
  ['Dominus','Dominus Estate','napa-valley',['Cabernet Sauvignon','Cabernet Franc','Petit Verdot'],'red'],
  ['Estate Cabernet Sauvignon','Spottswoode Estate Vineyard & Winery','napa-valley',['Cabernet Sauvignon','Cabernet Franc','Petit Verdot'],'red'],
  ['CASK 23 Cabernet Sauvignon','Stag’s Leap Wine Cellars','napa-valley',['Cabernet Sauvignon'],'red'],
  ['Estate Cabernet Sauvignon','Chateau Montelena','napa-valley',['Cabernet Sauvignon'],'red'],
  ['Hillside Select Cabernet Sauvignon','Shafer Vineyards','napa-valley',['Cabernet Sauvignon'],'red'],
  ['Napa Valley Cabernet Sauvignon','Dunn Vineyards','napa-valley',['Cabernet Sauvignon'],'red'],
  ['Rutherford Cabernet Sauvignon','Frog’s Leap Winery','napa-valley',['Cabernet Sauvignon','Cabernet Franc','Petit Verdot'],'red'],
  ['Estate Sauvignon Blanc','Allan Scott Family Winemakers','marlborough',['Sauvignon Blanc'],'white'],
  ['Marlborough Sauvignon Blanc','Astrolabe Wines','marlborough',['Sauvignon Blanc'],'white','https://www.nzwine.com/en/winery/astrolabe-wines'],
  ['Single Vineyard Sauvignon Blanc','Auntsfield Estate','marlborough',['Sauvignon Blanc'],'white'],
  ['Abstract Three Rows Sauvignon Blanc','Blank Canvas Wines','marlborough',['Sauvignon Blanc'],'white'],
  ['Fromm Pinot Noir','FROMM Winery','marlborough',['Pinot Noir'],'red'],
  ['Marlborough Riesling','Framingham Wines','marlborough',['Riesling'],'white'],
  ['Marlborough Sauvignon Blanc','Jules Taylor Wines','marlborough',['Sauvignon Blanc'],'white'],
  ['Toru','Te Whare Ra','marlborough',['Gewürztraminer','Riesling','Pinot Gris'],'white'],
  ['River Run Pinot Noir','Chard Farm','central-otago',['Pinot Noir'],'red'],
  ['Bannockburn Pinot Noir','Mt Difficulty Wines','central-otago',['Pinot Noir'],'red'],
  ['Super Nanny Pinot Noir','Nanny Goat Vineyard','central-otago',['Pinot Noir'],'red'],
  ['Director’s Reserve Red','Tokara','stellenbosch',['Cabernet Sauvignon','Merlot','Petit Verdot','Cabernet Franc','Malbec'],'red'],
  ['The FMC','Ken Forrester Wines','stellenbosch',['Chenin Blanc'],'white'],
  ['Fusion V','De Toren Private Cellar','stellenbosch',['Cabernet Sauvignon','Merlot','Malbec','Cabernet Franc','Petit Verdot'],'red'],
  ['21 Gables Chenin Blanc','Spier Wine Farm','stellenbosch',['Chenin Blanc'],'white'],
  ['Pinotage','Lanzerac','stellenbosch',['Pinotage'],'red'],
  ['Boekenhoutskloof Syrah','Boekenhoutskloof','swartland',['Syrah / Shiraz'],'red'],
  ['Bateleur Chardonnay','De Wetshof Estate','robertson',['Chardonnay'],'white'],
  ['Grand Constance','Groot Constantia','constantia',['Muscat'],'sweet'],
  ['Vin de Constance','Klein Constantia','constantia',['Muscat'],'sweet'],
  ['Hamilton Russell Pinot Noir','Hamilton Russell Vineyards','hemel-en-aarde',['Pinot Noir'],'red'],
  ['The Signature Cabernet Shiraz','Yalumba','barossa-valley',['Cabernet Sauvignon','Syrah / Shiraz'],'red'],
  ['Para Grand Tawny','Seppeltsfield','barossa-valley',['Grenache / Garnacha','Syrah / Shiraz','Mourvèdre / Monastrell'],'fortified'],
  ['The Dead Arm Shiraz','d’Arenberg','mclaren-vale',['Syrah / Shiraz'],'red'],
  ['Cabernet Sauvignon','Moss Wood','margaret-river',['Cabernet Sauvignon'],'red'],
  ['Sexton Vineyard Pinot Noir','Giant Steps','yarra-valley',['Pinot Noir'],'red'],
  ['Château Palmer','Château Palmer','margaux',['Cabernet Sauvignon','Merlot','Petit Verdot'],'red'],
  ['Grand Vin de Château Latour','Château Latour','pauillac',['Cabernet Sauvignon','Merlot','Cabernet Franc','Petit Verdot'],'red'],
  ['Château Haut-Brion','Château Haut-Brion','graves-sauternes',['Cabernet Sauvignon','Merlot','Cabernet Franc'],'red'],
  ['Château-Figeac','Château-Figeac','saint-emilion',['Cabernet Franc','Cabernet Sauvignon','Merlot'],'red'],
]

export const wines: Wine[] = wineSpecs.map(([name,producerName,regionId,grapeNames,style,sourceUrl],index) => {
  const producer=producers.find(item=>item.name===producerName)
  const region=regions.find(item=>item.id===regionId)
  if(!producer || !region) throw new Error(`Missing curated relationship for ${name}`)
  const grapeIds=idsForGrapes(grapeNames)
  const linkedAromas=grapes.filter(grape=>grapeIds.includes(grape.id)).flatMap(grape=>grape.aromaIds)
  const styleAromas=aromas.filter(aroma=>aroma.styles.includes(style)).map(aroma=>aroma.id)
  const aromaIds=[...new Set([...linkedAromas,...styleAromas])].slice(0,6)
  const isSkinWine=style==='red'||style==='rose', isBubbles=style==='sparkling', isSweet=style==='sweet', isFortified=style==='fortified'
  return {
    id:slugify(`${name}-${index}`),name,producerId:producer.id,regionId:region.id,grapeIds,style,vintage:null,
    summary:`${name} is a ${style} wine by ${producer.name} from ${region.name}, built around ${grapeNames.join(', ')}.`,aromaIds,
    serving:style==='red'?'Serve at 16–18°C; a little air can help the structure unfold.':isSweet||isFortified?'Serve in a small glass at 10–14°C and watch how temperature changes sweetness and aroma.':'Serve at 8–12°C and let the glass warm gradually.',
    communityRating:Number((4+(index%9)*.1).toFixed(1)),composition:grapeNames.join(', '),
    vinification:isBubbles?'Bubbles come from a second fermentation or retained fermentation carbon dioxide; lees time and pressure shape texture.':isFortified?'Grape spirit changes fermentation and final strength; timing determines whether natural sweetness remains.':isSweet?'Sweetness is balanced by acidity and may come from late harvest, noble rot, drying, freezing or interrupted fermentation.':isSkinWine?'Skin contact and extraction build colour, tannin and texture; fermentation temperature and cap work shape the balance.':'Juice is separated from skins before or soon after pressing; temperature, solids and lees handling shape aroma and texture.',
    maturation:isBubbles?'Lees contact, bottle or tank ageing integrates mousse and savoury complexity before release.':isFortified?'Protected or oxidative maturation determines whether fruit stays vivid or develops nut, spice and dried-fruit notes.':'Tank, concrete, amphora, wood and bottle each manage oxygen and texture differently; vessel is a stylistic tool, not a quality rank.',
    drinkWindow:isBubbles?'Enjoy for freshness now; structured lees-aged examples may develop further.':index%3===0?'Built to reward bottle development, though readiness depends on vintage and storage.':'Approachable in its fruit phase, with short- to medium-term development depending on storage.',
    pairings:style==='red'?['Roast or braised meat','Mushrooms','Aged cheese']:isSweet?['Blue cheese','Fruit dessert with restrained sweetness','Foie gras or savoury pâté']:isFortified?['Nuts and aged cheese','Chocolate or dried-fruit desserts','A quiet glass after dinner']:['Shellfish or fish','Fresh cheeses','Vegetable dishes with herbs'],
    sourceUrl:sourceUrl ?? producer.sourceUrl,merchantOffers:[],
  }
})

for (const producer of producers) {
  const producerWines=wines.filter(w=>w.producerId===producer.id)
  producer.wineIds=producerWines.map(w=>w.id)
  producer.regionIds=[...new Set([producer.regionId,...producerWines.map(w=>w.regionId)])]
}
for (const region of regions) {
  region.producerIds=producers.filter(p=>p.regionId===region.id).map(p=>p.id)
  region.wineIds=wines.filter(w=>w.regionId===region.id).map(w=>w.id)
  const wineGrapes=wines.filter(w=>w.regionId===region.id).flatMap(w=>w.grapeIds)
  region.grapeIds=[...new Set([...wineGrapes,...region.grapeIds])]
}
for (const grape of grapes) grape.regionIds=regions.filter(r=>r.grapeIds.includes(grape.id)).map(r=>r.id)
for (const aroma of aromas) aroma.grapeIds=grapes.filter(g=>g.aromaIds.includes(aroma.id)).map(g=>g.id)

const articleMeta: Record<string,Pick<Article,'objectives'|'example'|'exercise'|'relatedRegionIds'|'relatedGrapeIds'|'image'>> = {
  'vine-to-glass':{objectives:['Follow the sequence from harvest to maturation','Connect cellar choices with colour, aroma and texture','Compare vessels without treating them as a quality ladder'],example:'Taste an unoaked white beside an oak-matured white of the same variety. Separate fruit, fermentation texture and vessel aroma.',exercise:'Put harvest, crushing, fermentation, pressing and maturation in order; then mark where red and white winemaking diverge.',relatedRegionIds:['bordeaux','bourgogne'],relatedGrapeIds:['chardonnay','cabernet-sauvignon'],image:'winemaking'},
  'taste-with-intention':{objectives:['Use a repeatable four-step tasting sequence','Separate structure from flavour','Write a personal conclusion after the evidence'],example:'Compare lemon juice, black tea and whole milk to calibrate acidity, tannin and body before returning to wine.',exercise:'Describe one glass twice: first in three broad words, then with one precise reference for fruit, structure and finish.',relatedRegionIds:['mosel','chianti-classico'],relatedGrapeIds:['riesling','sangiovese'],image:'tasting'},
  'red-white-rose':{objectives:['Explain how skin contact creates colour and tannin','Distinguish direct-press rosé from saignée','Understand why colour does not predict sweetness'],example:'Pinot Gris can become a pale white or a copper-toned skin-contact wine; process, not grape name alone, creates the difference.',exercise:'Sketch three timelines and shade only the moments when juice and skins remain together.',relatedRegionIds:['provence','bourgogne'],relatedGrapeIds:['pinot-noir','grenache-garnacha'],image:'winemaking'},
  'aroma-language':{objectives:['Separate primary, secondary and tertiary aromas','Use references without implying ingredients','Recognise when condition faults dominate fruit'],example:'Lemon is usually primary; brioche often follows lees contact; leather tends to arrive through bottle development.',exercise:'Choose one aroma family, smell three real references, then rank them from faint to defining in a wine.',relatedRegionIds:['marlborough','champagne'],relatedGrapeIds:['sauvignon-blanc','chardonnay'],image:'aroma'},
}
const articleSources={
  oiv:{label:'OIV · International Code of Oenological Practices',url:'https://www.oiv.int/what-we-do/standards'},
  fermentation:{label:'UC Davis · Wine Fermentation Management Guide',url:'https://wine.ucdavis.edu/industry-info/enology/fermentation-management-guides/wine-fermentation'},
  awriFermentation:{label:'Australian Wine Research Institute · Wine fermentation',url:'https://www.awri.com.au/industry_support/winemaking_resources/wine_fermentation/'},
  sensory:{label:'AWRI · Practical sensory evaluation',url:'https://www.awri.com.au/industry_support/winemaking_resources/sensory_assessment/considerations/'},
  faults:{label:'AWRI · Wine flavours, faults and taints',url:'https://www.awri.com.au/industry_support/winemaking_resources/sensory_assessment/recognition-of-wine-faults-and-taints/wine_faults/'},
  canopy:{label:'Oregon State University · Canopy management and vine balance',url:'https://extension.oregonstate.edu/catalog/em-9071-role-canopy-management-vine-balance'},
  labels:{label:'OIV · International Standard for the Labelling of Wines',url:'https://www.oiv.int/standards/international-standard-for-the-labelling-of-wines'},
  oxygen:{label:'AWRI · Total package oxygen management',url:'https://www.awri.com.au/wp-content/uploads/tpo_fact_sheet.pdf'},
  irrigation:{label:'UC Davis · Irrigation management of grapevines',url:'https://wine.ucdavis.edu/irrigation-management-grapevines'},
  roots:{label:'UC Davis · Root distribution of different rootstocks',url:'https://wineserver.ucdavis.edu/industry-info/research-summaries/root-distribution-different-rootstocks'},
} as const
const articleSourceMap:Record<string,(typeof articleSources)[keyof typeof articleSources][]>= {
  fermentation:[articleSources.fermentation,articleSources.oiv], 'lees-and-malolactic':[articleSources.awriFermentation,articleSources.fermentation], 'maturation-vessels':[articleSources.oiv,articleSources.oxygen],
  'wine-faults':[articleSources.faults,articleSources.sensory], 'taste-with-intention':[articleSources.sensory], 'aroma-language':[articleSources.sensory,articleSources.faults],
  'vine-year':[articleSources.canopy], 'climate-and-altitude':[articleSources.canopy,articleSources.irrigation], 'terroir-layers':[articleSources.canopy,articleSources.irrigation], 'soil-water-roots':[articleSources.irrigation,articleSources.roots,articleSources.canopy],
  'labels-and-origin':[articleSources.labels], 'appellation-maps':[articleSources.labels], 'bottle-closures':[articleSources.oxygen,articleSources.labels], 'oxygen-and-age':[articleSources.oxygen],
}

const lessonFocus:Record<string,string>={
  'vine-to-glass':'Draw the process twice: once for a pale, direct-pressed wine and once for a skin-fermented red. The important differences are the order of pressing, the duration and management of skin contact, and whether malolactic conversion or maturation is encouraged. Every arrow should represent a decision that can be tasted—not a decorative cellar ritual.',
  'taste-with-intention':'A useful tasting note separates observation, interpretation and preference. “High acidity” is an observation, “cool-site fruit” is an interpretation, and “refreshing” is a preference. Keeping those layers apart lets two tasters disagree productively without either pretending that enjoyment is objective.',
  'sparkling-methods':'Pressure, vessel and lees contact create more than bubbles. Bottle fermentation generally retains individual bottles as closed systems; tank fermentation builds and blends under pressure at larger scale; ancestral bottling captures an unfinished first fermentation. Dosage, disgorgement and time after disgorgement add further variables.',
  'red-white-rose':'Colour and phenolics are extraction outcomes. Time, temperature, alcohol, cap management, berry integrity and pressing all change what moves from skins and seeds into wine. A deeply coloured rosé may remain dry and delicate; a pale red can still have substantial tannin. Judge structure, not colour alone.',
  'sweet-wine':'Residual sugar must be read beside acid, alcohol, bitterness and dissolved carbon dioxide. The same numerical sugar level can feel buoyant in a high-acid Riesling and broad in a lower-acid wine. Concentration method also changes flavour: botrytis, freezing, drying and late harvesting are not interchangeable shortcuts.',
  'fortified-wine':'The timing of fortification is decisive. Spirit added before fermentation preserves grape sugar; spirit added after a dry fermentation raises strength without doing so. Biological ageing, oxidative ageing, cask size and fractional blending can then move wines toward radically different textures and aromas.',
  service:'Run a simple service trial instead of memorising one temperature. Pour a small sample, cool one portion by two or three degrees and allow another to warm. Compare aroma release, alcohol warmth, sweetness and tannin. The useful serving point is the one that reveals the intended balance over time at the table.',
  'aroma-language':'Aroma compounds do not arrive as a tidy list. Matrix, temperature, oxygen, individual sensitivity and learned memory alter perception. Use descriptors as coordinates: first family, then reference, then condition and intensity. “Fresh citrus, like lime zest, medium-plus” communicates more than a cascade of unranked nouns.',
  'vine-year':'Yield and quality are not decided at harvest alone. Bud number was influenced by the previous season; flowering controls set; canopy growth changes light and disease pressure; véraison begins a new allocation phase. Reading a vintage therefore means following the sequence and asking where the vine’s options narrowed.',
  'terroir-layers':'Avoid the false choice between nature and people. A slope changes radiation and drainage, but row direction and canopy height modify exposure. Soil stores water, while rootstock and cultivation change access. Repeated sensory patterns can support a place hypothesis, yet every claim should remain open to comparison and better evidence.',
  fermentation:'Fermentation management begins before visible bubbling. Nutrient status, oxygen at inoculation, temperature, microbial population and solids determine the environment in which yeast works. Monitoring density and temperature reveals trajectory; smelling and tasting reveal deviations that numbers alone may miss. Intervention should respond to evidence, not habit.',
  'maturation-vessels':'Separate vessel material from vessel geometry and age. A new 225-litre barrel contributes more aroma and oxygen per litre than an old large cask. Concrete may be lined or unlined; clay can be sealed or porous; steel may hold wine under reductive protection or regular oxygen exposure through handling.',
  'lees-and-malolactic':'Lees are not a single material. Gross solids, viable yeast and fine lees behave differently, and stirring changes both contact and oxygen exposure. Malolactic conversion is a microbial transformation with timing and sensory consequences of its own. A wine can undergo one, both or neither practice.',
  'labels-and-origin':'Read labels in layers. First establish who made or bottled the wine, where the grapes are claimed to originate and which harvest year is stated. Then decode the legal category and optional terms. Finally separate regulated facts from marketing language; the visual prominence of a word does not make it legally meaningful.',
  'food-pairing':'Pairing is a controlled interaction between two changing systems. Taste the food first, then the wine, then the combination. Ask what became louder or quieter: acid, bitterness, heat, sweetness or aroma. Adjust salt, acid, fat or serving temperature before abandoning the bottle; small changes can transform the result.',
  'wine-faults':'Fault recognition needs thresholds and context. A compound may be below detection, noticeable but integrated, or dominant enough to suppress fruit. Confirm suspicions by returning to a clean reference, comparing another bottle when possible and observing change with air. Never turn one unfamiliar aroma into a confident diagnosis.',
  'climate-and-altitude':'Use energy and water as the organising questions. How much radiation reaches the canopy, how hot are days and nights, when does water become limiting, and how long can leaves keep functioning? Altitude, latitude and ocean distance matter because they change those conditions—not because a single number dictates style.',
  cellaring:'A drinking cellar is an inventory with a learning rhythm. Record acquisition, storage location, bottle condition and an estimated opening window. Revisit that estimate after every bottle from the same case. The aim is not to keep wine indefinitely, but to catch several stages of development while occasions still exist.',
  'sparkling-service':'A chilled bottle holds carbon dioxide more calmly. Keep a thumb on the closure, loosen the cage without removing your grip, hold the bottle at an angle and rotate the bottle—not the cork—until pressure releases with a sigh. Dry the exterior first so elegance is also safe handling.',
  'soil-water-roots':'A soil pit is a vertical story. Record horizon depth, texture, stones, aggregation, roots, moisture and signs of compaction. Then connect the profile to rainfall and slope. A surface photograph or rock name cannot show the water reservoir available to roots across an entire growing season.',
  'vintage-weather':'Replace the vintage score with a timeline. Mark budbreak, flowering, heat episodes, rain, véraison and harvest for the particular variety and site. Then ask how crop load, canopy and picking decisions changed exposure to each event. The same storm can be trivial before véraison and decisive near harvest.',
  'sensory-calibration':'Build scales from anchors, not adjectives. Prepare low, medium and high reference solutions where safe, taste in random order and record the point at which you can rank them consistently. Repeat on another day. Calibration measures your current response; it does not decide whether you should like the sensation.',
  'appellation-maps':'Map scale changes the question. A country map explains orientation, an appellation map explains legal origin, a parcel map can show ownership or site names, and a soil map shows interpreted geology. Overlaying them is powerful only when dates, boundaries and legends are compatible.',
  'bottle-closures':'Packaging is part of the wine’s oxygen history. Measure fill level, seal integrity and storage before blaming a closure for development. Natural cork, technical cork and screw cap are families with different specifications, not single oxygen values. Bottle mass and decorative embossing add cost and carbon, not sensory evidence.',
  'oxygen-and-age':'Think in doses and timing. Oxygen early in fermentation can support yeast; controlled exposure during maturation may stabilise colour or soften texture; oxygen at bottling consumes protective capacity; prolonged ingress accelerates decline. The same gas is helpful or harmful according to composition, amount and moment.'
}

const lessonBackbone:Record<string,string[]>={
  Vineyard:[
    'Begin with the vine as a perennial plant. What appears in one season depends on stored reserves, pruning choices and weather from earlier seasons. Bud number sets potential shoots and clusters; roots and leaves negotiate water and carbon; fruit competes with vegetative growth. A sound explanation therefore follows the plant through time rather than attributing a wine to one dramatic weather event.',
    'Scale matters. Regional climate describes broad possibility, while slope, elevation, aspect, wind and proximity to water reshape the conditions around a particular canopy. Inside one row, leaf layers and fruit exposure create another microclimate. When comparing sites, keep variety, training, crop level and harvest intention visible so “place” does not become a catch-all answer.',
    'Water connects soil to the living vine. Texture, structure, depth, stones and organic matter influence infiltration and storage, but rainfall pattern, evapotranspiration and rooting determine whether that reserve can be used. Mild water limitation may restrain shoots; severe or badly timed stress can stop photosynthesis and delay ripening. More drainage is not automatically better.',
    'The grower works with trade-offs. Opening a canopy improves airflow and can reduce disease, yet sudden exposure may sunburn fruit. Lower yield can improve uniformity, but extreme crop reduction is not a universal quality formula. Harvesting later can deepen flavour while reducing acid and raising sugar. The intended wine style decides which balance is useful.',
    'To practise, compare two official technical sheets or vineyard maps and write a causal chain: condition → vine response → fruit consequence → cellar option → possible sensory evidence. Mark every step that remains a hypothesis. This disciplined chain is more educational than claiming a soil or altitude produces a flavour directly.'
  ],
  Cellar:[
    'Cellar work begins with fruit condition and an intended style. Sorting, crushing, pressing and skin contact decide which solids enter the must; clarification or deliberate solids retention changes nutrients, aroma precursors and texture. There is no neutral starting material after harvest—each handling decision narrows later options.',
    'Microorganisms transform the must. Yeast converts sugar principally to alcohol, carbon dioxide and heat, while bacteria and non-Saccharomyces populations can affect acid and aroma. Temperature, nutrients, oxygen and hygiene shape that ecology. Monitoring is not only numerical: density, temperature, smell, taste and visual activity form one record.',
    'Extraction is a moving target. Water first dissolves some components; rising alcohol changes solubility; heat, time and physical movement alter the rate. Seeds, skins and pulp contribute different phenolics and aromas. A winemaker can shorten contact, press fractions separately or blend later, but cannot fully undo harsh extraction once it dominates.',
    'Maturation manages reactions rather than simply adding age. Vessel volume, permeability, ullage, transfers, lees and sulfur dioxide influence oxygen exposure and protection. Wood may add flavour, but old wood primarily acts as a container with its own oxygen behaviour. Bottle ageing continues the trajectory in a far more closed environment.',
    'Build a process map for a real bottle using the producer’s own technical information. Put confirmed facts in ink and plausible inferences in pencil. Then taste for evidence that could support or contradict the map. This prevents fashionable cellar vocabulary from becoming an invented production story.'
  ],
  Tasting:[
    'Sensory work is measurement with a human instrument. Your thresholds, attention, health, recent food and expectations change the reading. A repeatable sequence, neutral environment and consistent pour improve reliability, but variation never disappears. The goal is careful, communicable observation—not performance or perfect agreement.',
    'Start broad before becoming specific. Establish condition, aromatic intensity and family; then choose a concrete reference. On the palate, separate sweetness, acidity, tannin, alcohol, body, flavour intensity and finish. Structure often remains clearer than a long aroma list and gives better clues for pairing, service and development.',
    'Context creates bias. Price, region, bottle weight and another taster’s comment can change perception before the wine reaches your mouth. Blind comparison can isolate some variables, but it also removes useful context. Choose the format according to the question and record what information was available when each judgement was made.',
    'A descriptor becomes useful when it is anchored. Smell the real object, note its condition—fresh, dried, cooked, toasted—then rank intensity. Return to the wine and ask whether the reference is truly present or merely available in memory. Repetition builds a library; forcing precision produces false confidence.',
    'Finish with a short conclusion grounded in evidence: condition, balance, intensity, development and personal enjoyment. Then write one alternative explanation. A strong tasting note makes future comparison possible; it does not need to identify a wine or imitate a critic’s voice.'
  ],
  Styles:[
    'Wine styles are process families, not rigid boxes. Grape material, extraction, fermentation end point, carbon dioxide, fortification and maturation can move a wine across familiar categories. Start by identifying which physical transformation creates the style, then trace choices that adjust sweetness, texture, alcohol and aromatic development.',
    'Balance must be read across components. Sugar is shaped by acid, alcohol and bitterness; tannin changes with protein and temperature; carbon dioxide sharpens tactile freshness; alcohol carries aroma while adding warmth. Numerical analysis helps, yet two wines with similar figures can feel different because matrix and aroma alter perception.',
    'Tradition and law often define a production route, but they do not make all examples taste alike. Variety, vintage, site, time on lees, blending and release age create large ranges inside one appellation or method. Learn the rule as a boundary, then taste the diversity it permits.',
    'Production vocabulary should stay precise. “Natural,” “traditional,” “reserve” or “old vine” may be regulated in one place and promotional in another. Prefer verifiable process terms: duration of skin contact, fermentation vessel, residual sugar, pressure, spirit addition, maturation environment and bottling date.',
    'Create a comparative flight in which one mechanism changes at a time. Keep grape or region constant where possible, serve at comparable temperatures and revisit each glass after air. Write which sensory differences the mechanism predicts before tasting; confirmation and contradiction are both useful results.'
  ],
  Service:[
    'Service protects the wine, the people and the learning moment. Storage transition, bottle position, temperature, opening and glass cleanliness all influence the first pour. Good service is quiet preparation rather than theatre: remove variables that obscure the wine and explain interventions only when they help the guest.',
    'Temperature changes volatility and tactile balance. Too cold can suppress aroma and harden tannin; too warm can emphasise alcohol and softness. Because wine warms in the glass, begin slightly below the desired drinking point and observe the curve. Style, room temperature and pace matter more than a single prescribed number.',
    'Air is a dose, not a quality upgrade. Decant to remove sediment or change oxygen exposure, and distinguish those purposes. Young structured wines may open slowly; fragile mature wines may fade quickly. Pour a control sample before decanting and compare it over time so the decision remains observable.',
    'Glass shape changes headspace and delivery, but cleanliness has greater priority. Use odour-free glassware, avoid detergent residue and pour enough space for swirling. A versatile tulip-shaped wine glass handles most still wines well; specialised stems are optional tools rather than membership requirements.',
    'At the table, sequence wines by weight, sweetness, aromatic intensity and condition while leaving room for the food. Water and pauses prevent sensory fatigue. Record the service variables in a tasting note; otherwise a temperature or oxidation problem may later be mistaken for the wine’s intrinsic quality.'
  ],
  Buying:[
    'A label is a regulated document wrapped in design. Mandatory particulars, geographical indications and bottler statements follow jurisdiction-specific rules; front-label hierarchy follows marketing. Read every side, distinguish the named producer from the responsible bottler and treat unregulated adjectives as claims that need evidence.',
    'Origin terms are not universal quality grades. They may control boundary, grape, yield, alcohol, technique or ageing, and comparable-looking words can mean different things between countries. Use the official regional or legal source to learn what a term guarantees—and what it leaves completely open.',
    'Vintage is context, not a score. It usually identifies a harvest year under local blending tolerances, while non-vintage wine can deliberately combine years for consistency or complexity. Ask how the season affected the particular grapes, sites and producer choices rather than applying one regional verdict to every bottle.',
    'Buying evidence includes provenance and condition. Retail storage, fill level, closure, temperature exposure and return policy matter, especially for mature wine. A famous label in poor condition is a weak purchase. Save the merchant, date, price and bottle photograph so your own cellar becomes a traceable record.',
    'Before buying, state the use: drink soon, learn through comparison, age, gift or pair with a specific meal. Then choose the smallest set of facts that supports that use. This turns the catalogue from a ranking exercise into a practical decision system.'
  ],
  Origin:[
    'Wine geography contains several overlapping maps: political borders, protected indications, physical landforms, geology, climate and ownership. They answer different questions. Always read the legend, scale and date before connecting a mapped boundary to a sensory claim.',
    'Legal origin is a chain of custody and rules. A named area can specify where grapes were grown and may regulate varieties, yields or practices. It does not promise that every producer shares one style. The more precise the origin, the more precise the evidence—not an automatic increase in quality.',
    'Coordinates are orientation points, not polygon boundaries. A single marker can place a region on a world atlas but cannot show exclusions, enclaves, vineyard limits or subzones. For planning, regulation or property decisions, follow the official map and its current legal text.',
    'Physical transitions rarely follow legal lines exactly. Elevation, aspect, soil depth and water can change within one appellation; neighbouring areas can share geology. Use site data to explain variation inside a region and legal categories to explain permitted origin. Do not substitute one for the other.',
    'Practise by moving through scales: country → region → subregion → appellation → named site → producer parcel. At each level write what new fact became available and what remains unknown. Then link the map to a grape and bottle in the atlas to keep geography connected to actual wine.'
  ],
  Foundations:[
    'Wine is the result of biological material moving through a sequence of decisions. Fruit composition, microorganisms, extraction, time, oxygen and temperature interact; no stage operates alone. Learn the sequence first, then attach regional rules and stylistic options to it.',
    'Separate irreversible decisions from adjustable ones. Harvest date and severe extraction cannot be undone, while blending, temperature or service may be modified later. This distinction explains why growers and winemakers spend attention early, even when the visible product is still months or years away.',
    'Every process leaves potential sensory evidence, not a guaranteed flavour. Fermentation can create families of aroma; skin contact can change colour and tannin; maturation can alter texture and development. The starting fruit and later context decide whether those traces are obvious, subtle or absent.',
    'Use comparisons that hold most variables steady. The same grape from two climates, the same region with two vessels, or the same bottle at two temperatures isolates a question better than unrelated famous wines. Record the variable before tasting so the explanation does not shift to fit the result.',
    'Finish by connecting process, place, producer and your own note. A fact becomes usable knowledge when it predicts an observation, survives a comparison and remains open to correction. The atlas links exist to support that loop rather than send you to a disconnected glossary.'
  ]
}
const lessonUniversal=[
  'Evidence has levels. An official definition can establish what a category permits; a producer technical sheet can document how one wine was made; a map can establish location; tasting can record what a particular bottle showed at a particular moment. None replaces the others. Keep source, observation and inference in separate columns, and date information that may change. When accounts conflict, state the uncertainty rather than smoothing it into a confident story.',
  'Common shortcuts deserve active resistance. Expensive does not mean technically better, smaller origin does not guarantee quality, old vines do not automatically produce concentration, and a named vessel does not dictate flavour. Replace each shortcut with a question about mechanism and evidence. What material entered the process, what condition changed, what decision followed, and what sensory outcome would support—or contradict—the proposed explanation?',
  'Turn the lesson into a small experiment. Write a prediction before opening the wines, set service conditions, hide identities when that helps, and leave room for an alternative explanation. Photograph labels and record bottle, vintage, time open and temperature. Repeating the comparison later is more valuable than expanding a one-off tasting note, because learning depends on whether the observation can be recovered under comparable conditions.'
]

export const articles: Article[] = [
  ['vine-to-glass','From vine to glass','Foundations',7,'Seven decisions that turn fruit into wine, and why each leaves a sensory trace.',['Ripeness, acidity and fruit condition begin in the vineyard. Harvest timing sets the material a cellar has to work with.','Pressing and skin contact shape colour and tannin. Yeast transforms sugar, while vessel, temperature and time guide texture and aroma.','Maturation in tank, concrete, wood or bottle is not a simple quality ladder. Each choice serves a style.']],
  ['taste-with-intention','Taste with intention','Tasting',5,'A calm four-step method for noticing more without hunting for the right answer.',['Look at colour, depth, clarity and movement. Smell once quietly, then again after a swirl.','On the palate, separate sweetness, acidity, tannin, warmth, body, flavour and finish. Reflection comes last: balance, complexity and your own enjoyment.']],
  ['sparkling-methods','How bubbles arrive','Styles',6,'Traditional, tank and ancestral methods explained through texture and time.',['Traditional-method wine completes a second fermentation in bottle, then rests on its lees. Tank method keeps that second fermentation in a pressure vessel.','Ancestral wine is bottled before its first fermentation finishes. These routes create different textures and aromatic signatures.']],
  ['red-white-rose','Colour is a process','Styles',6,'Skin contact, pressing and extraction make the familiar colour families.',['White wine is usually pressed before fermentation. Red wine ferments with skins, extracting colour and tannin.','Rosé most often comes from brief skin contact or direct pressing of dark grapes; it is not generally a blend of red and white wine.']],
  ['sweet-wine','Sweetness with structure','Styles',8,'Botrytis, frozen grapes and drying each concentrate fruit in a different way.',['Noble rot can concentrate sugar and acidity while adding honeyed, saffron-like complexity. Eiswein begins with grapes frozen naturally on the vine.','Dried-grape wines lose water before fermentation, intensifying fruit, sweetness and texture.']],
  ['fortified-wine','Strength and balance','Styles',7,'How grape spirit changes fermentation, sweetness and ageing.',['Fortification adds grape spirit. In Port, it can stop fermentation before all sugar is converted, preserving sweetness.','Oxidative or protected maturation then leads fortified wines toward very different aromatic worlds.']],
  ['service','Serve the wine, not the rule','Service',4,'Temperature, glassware and air as practical tools rather than theatre.',['Cooler temperatures sharpen structure; warmth expands aroma and alcohol. Start slightly cool and let the glass move.','Decanting can separate sediment or offer air. Neither is automatically better for every wine.']],
  ['aroma-language','Aroma is association','Tasting',5,'Build a useful sensory vocabulary without treating descriptors as ingredients.',['Wine aromas are sensory associations shaped by grapes, fermentation, maturation and age. Lemon or slate does not mean either was added.','Use a reference from ordinary life, then compare it with the glass. Precision grows through repeated, relaxed attention.']],
  ['vine-year','A year in the vineyard','Vineyard',8,'Budbreak, flowering, véraison and harvest as one connected risk-and-opportunity cycle.',['Dormancy stores the energy for spring. Budbreak exposes tender growth to frost; flowering and fruit set determine the potential crop.','Véraison begins ripening. Sugar rises, acids shift, skins change and seeds mature. Harvest is a decision about balance, weather and intended style—not a finish line set by sugar alone.']],
  ['terroir-layers','Terroir without mythology','Vineyard',9,'A practical model for climate, slope, soil, water, plant and people.',['Climate sets the broad possibility. Mesoclimate and topography alter sun, wind and drainage; soil influences water, temperature and rooting.','The vine, rootstock, farming and human history complete the system. Terroir is an interaction observed through repeated patterns, not a claim that wine tastes literally of rock.']],
  ['fermentation','Yeast, sugar and heat','Cellar',7,'What alcoholic fermentation does, what it produces and why temperature matters.',['Yeast converts grape sugar chiefly into alcohol, carbon dioxide and heat, while creating many aroma-active compounds.','Cooler fermentation can protect volatile fruit in whites; warmer red fermentation supports extraction. Neither temperature is universally superior.']],
  ['maturation-vessels','Steel, concrete, clay and wood','Cellar',8,'How vessel shape, oxygen and material influence a wine without ranking them.',['Stainless steel is inert and controllable. Concrete offers thermal mass and subtle oxygen exchange; clay varies widely in porosity and lining.','Oak can add oxygen, tannin and flavour depending on origin, size, age and toast. Old large wood behaves very differently from new small barrels.']],
  ['lees-and-malolactic','Texture after fermentation','Cellar',7,'Lees contact and malolactic conversion as two separate tools.',['Fine lees can protect wine and add texture; stirring increases contact and may broaden the palate. Hygiene and reduction still require attention.','Malolactic bacteria convert sharper malic acid to softer lactic acid. The process can add creamy or buttery associations but does not automatically make a wine rich.']],
  ['labels-and-origin','Read a wine label','Buying',6,'Find producer, origin, vintage, variety and classification even when labels organise them differently.',['Some labels lead with variety; others lead with place. Appellation terms describe origin and production rules, not a universal ladder of taste.','Vintage marks the harvest year for most of the wine, subject to local rules. Alcohol, volume, bottler and allergen statements provide a second layer of evidence.']],
  ['food-pairing','Pair structure before flavour','Service',8,'Acidity, sweetness, tannin, alcohol and intensity make a more reliable pairing system than colour rules.',['Acid refreshes fat and salt softens bitterness. Tannin reacts with protein, while chilli can make alcohol feel hotter.','Match sweetness at least to the dish and compare intensity. Then use aroma bridges—herbs, smoke, citrus—as the creative layer.']],
  ['wine-faults','When the signal changes','Tasting',8,'Cork taint, oxidation, volatile acidity, reduction and light strike without panic or dogma.',['Cork taint suppresses fruit and can smell of damp cardboard. Oxidation browns colour and moves fresh fruit toward bruised apple or nuts.','Reduction spans struck match to rotten egg; volatile acidity spans lift to vinegar. Context, concentration and style determine whether a trace adds complexity or overwhelms the wine.']],
  ['climate-and-altitude','Latitude is only the beginning','Vineyard',7,'Ocean, altitude, aspect and night temperatures explain why nearby sites ripen differently.',['Altitude usually cools air and increases solar exposure. Oceans, fog, rivers and wind can moderate daytime heat or extend the season.','Warmth drives ripening, but water and night temperature influence retention of acidity, aroma and vine function.']],
  ['cellaring','Build a cellar around drinking','Cellar',6,'Storage, drinking windows and a practical rhythm for opening bottles.',['Stable cool temperature, darkness, low vibration and sound closures matter more than decorative racks. Humidity mainly protects labels and long-term cork condition.','A drinking window is an estimate, not an expiry date. Buy multiples only when you want to learn how a wine changes, and schedule occasions to open them.']],
  ['sparkling-service','Pressure, temperature and mousse','Service',5,'Open, pour and assess sparkling wine while preserving both aroma and calm.',['Chill reduces pressure and keeps the opening controlled. Hold the cork, turn the bottle slowly and aim for a quiet sigh.','A white-wine-shaped glass often reveals more aroma than a narrow flute while still showing bead and mousse.']],
  ['soil-water-roots','Soil, water and roots','Vineyard',10,'Move beyond rock names: learn how texture, depth, porosity and water shape vine behaviour.',['Soil texture controls how quickly water enters, moves and remains available. Gravel may drain rapidly, clay can retain more water, and fractures in hard rock may hold deep reserves; none acts alone without depth and rainfall.','Roots follow pores, cracks, biological channels and softer horizons. Rooting depth is a response to plant material, soil structure, oxygen and water—not a simple measure of quality.','The useful tasting question is not whether wine tastes literally of stone, but how water status, canopy growth and ripening changed the fruit available to the cellar.']],
  ['vintage-weather','Read a vintage without a score','Vineyard',8,'Follow frost, flowering, heat, rain and harvest timing before reducing a year to good or bad.',['Spring frost can lower potential yield; rain or cold during flowering can disrupt fruit set. Later heat affects development differently depending on water, canopy and night temperature.','Rain near harvest raises disease and dilution risks, yet its effect depends on timing, drainage and berry condition. A region-wide summary never replaces producer and parcel decisions.','Use vintage as context: ask which varieties, sites and styles benefited, and which trade-offs the grower accepted.']],
  ['sensory-calibration','Calibrate your senses','Tasting',9,'Build repeatable references for acidity, tannin, sweetness, alcohol, body and aroma intensity.',['Calibration turns vague impressions into shared scales. Compare acidified water, unsweetened tea and liquids of different viscosity before applying the same sequence to wine.','Detection thresholds vary between people and between wine matrices. A descriptor you miss may be obvious to another taster; disagreement is evidence to investigate, not a contest.','Repeat references over time, taste blind when useful and separate description from preference. Reliability matters more than a theatrical list of aromas.']],
  ['appellation-maps','How wine regions nest','Origin',8,'Read country, region, subregion, appellation and site as a hierarchy of rules and evidence.',['A geographical indication connects a product with a defined origin under the law of its country. An appellation may also regulate grapes, yields, farming or production, but systems differ and are not globally interchangeable.','A smaller named place is not automatically better. It is more specific evidence: the useful next step is to ask what boundaries and production rules actually change.','Read maps with scale in mind. A regional coordinate helps orientation; legal boundaries, vineyard parcels and geological transitions require more precise source maps.']],
  ['bottle-closures','Bottle shapes and closures','Service',7,'Understand shoulders, glass weight, cork, screw cap and oxygen without reading quality into packaging.',['Traditional bottle forms developed around local handling and production: shoulders retain sediment, sloped forms stack differently and sparkling bottles need pressure-resistant glass.','A closure manages seal and oxygen transmission. Natural cork varies piece by piece; technical corks, screw caps and other closures offer different consistency and oxygen regimes.','Packaging can influence development after bottling, but bottle weight and decorative depth are poor guides to wine quality.']],
  ['oxygen-and-age','Oxygen from cellar to bottle','Cellar',8,'Trace when oxygen helps fermentation and maturation, and when it accelerates decline.',['Oxygen can support yeast early in fermentation and participates in reactions during maturation. Vessel size, material, ullage and handling change the rate and timing of exposure.','After bottling, dissolved oxygen and closure transmission influence how quickly aromas and colour evolve. More oxygen is not simply more complexity; the appropriate level depends on composition and intended life.','In the glass, air can reveal aroma and soften perception, but it cannot reverse oxidation or rebuild fruit that has faded.']],
].map(([id,title,eyebrow,minutes,summary,body],index)=>{
  const key=id as string
  const fallback: Pick<Article,'objectives'|'example'|'exercise'|'relatedRegionIds'|'relatedGrapeIds'|'image'>={
    objectives:['Understand the mechanism rather than memorising a rule','Connect the idea to aroma, structure and style','Use comparison to make the concept repeatable'],
    example:'Compare two wines that isolate this decision while keeping variety or region as constant as possible.',
    exercise:'Return to one glass and record the evidence you can perceive before writing a conclusion.',
    relatedRegionIds:index%2?['mosel','marlborough']:['champagne','mendoza'], relatedGrapeIds:index%2?['riesling','sauvignon-blanc']:['chardonnay','pinot-noir'],
    image:index%3===0?'terroir':index%3===1?'winemaking':'tasting',
  }
  const imageOverrides:Record<string,Article['image']>={'soil-water-roots':'soil','vintage-weather':'terroir','bottle-closures':'bottle','oxygen-and-age':'bottle','vine-year':'terroir'}
  const longBody=[...(body as string[]),lessonFocus[key],...(lessonBackbone[eyebrow as string]??lessonBackbone.Foundations),...lessonUniversal].filter(Boolean)
  return {id:key,title:title as string,eyebrow:eyebrow as string,minutes:Math.max(minutes as number,12),summary:summary as string,body:longBody,...(articleMeta[key] ?? fallback),image:imageOverrides[key]??(articleMeta[key]?.image??fallback.image),sources:articleSourceMap[key]??[articleSources.oiv]}
})

export const counts = { regions:regions.length, grapes:grapes.length, producers:producers.length, wines:wines.length, aromas:aromas.length, articles:articles.length }

export function validateCatalog() {
  const errors:string[]=[]; const ids={regions:new Set(regions.map(x=>x.id)),grapes:new Set(grapes.map(x=>x.id)),producers:new Set(producers.map(x=>x.id)),wines:new Set(wines.map(x=>x.id)),aromas:new Set(aromas.map(x=>x.id))}
  const validSource=(value:string)=>{try{const url=new URL(value);return url.protocol==='https:'}catch{return false}}
  const duplicateIds=(label:string,values:string[])=>{const seen=new Set<string>();values.forEach(id=>{if(seen.has(id))errors.push(`Duplicate ${label} id: ${id}`);seen.add(id)})}
  duplicateIds('region',regions.map(item=>item.id));duplicateIds('grape',grapes.map(item=>item.id));duplicateIds('producer',producers.map(item=>item.id));duplicateIds('wine',wines.map(item=>item.id));duplicateIds('aroma',aromas.map(item=>item.id));duplicateIds('article',articles.map(item=>item.id))
  wines.forEach(w=>{
    const producer=producers.find(item=>item.id===w.producerId)
    if(!ids.regions.has(w.regionId)||!producer||w.grapeIds.some(id=>!ids.grapes.has(id))) errors.push(`Broken wine relationship: ${w.name}`)
    if(producer && !producer.regionIds.includes(w.regionId)) errors.push(`Producer/region mismatch: ${w.name}`)
    if(!w.grapeIds.length)errors.push(`Wine has no grape relationship: ${w.name}`)
    if(!validSource(w.sourceUrl))errors.push(`Invalid wine source: ${w.name}`)
    if(w.vintage!==null&&(w.vintage<1800||w.vintage>new Date().getFullYear()))errors.push(`Invalid wine vintage: ${w.name}`)
    if(producer&&!producer.wineIds.includes(w.id))errors.push(`Missing producer back-reference: ${w.name}`)
    if(!regions.find(item=>item.id===w.regionId)?.wineIds.includes(w.id))errors.push(`Missing region back-reference: ${w.name}`)
    w.merchantOffers.forEach(offer=>{if(!validSource(offer.url))errors.push(`Invalid merchant offer: ${w.name} · ${offer.merchant}`)})
  })
  producers.forEach(p=>{
    if(!ids.regions.has(p.regionId)||p.regionIds.some(id=>!ids.regions.has(id)))errors.push(`Broken producer relationship: ${p.name}`)
    if(!validSource(p.sourceUrl))errors.push(`Invalid producer source: ${p.name}`)
    if(p.wineIds.some(id=>!ids.wines.has(id)))errors.push(`Broken producer wine link: ${p.name}`)
  })
  regions.forEach(region=>{
    if(!regionCoordinates[region.id]) errors.push(`Missing verified atlas coordinate: ${region.name}`)
    if(!Number.isFinite(region.lat)||!Number.isFinite(region.lng)||Math.abs(region.lat)>90||Math.abs(region.lng)>180) errors.push(`Invalid atlas coordinate: ${region.name}`)
    if(!validSource(region.sourceUrl)||region.sources.some(source=>!validSource(source.url)))errors.push(`Invalid region source: ${region.name}`)
    if(region.grapeIds.some(id=>!ids.grapes.has(id))||region.producerIds.some(id=>!ids.producers.has(id))||region.wineIds.some(id=>!ids.wines.has(id)))errors.push(`Broken region relationship: ${region.name}`)
  })
  grapes.forEach(grape=>{if(grape.aromaIds.some(id=>!ids.aromas.has(id))||grape.regionIds.some(id=>!ids.regions.has(id)))errors.push(`Broken grape relationship: ${grape.name}`)})
  const canonicalExclusions:Record<string,string[]>={medoc:['riesling','pinot-noir','chardonnay'],pauillac:['riesling','pinot-noir','chardonnay'],pomerol:['riesling','pinot-noir','chardonnay'],'cote-de-beaune':['riesling','cabernet-sauvignon','merlot','cabernet-franc']}
  Object.entries(canonicalExclusions).forEach(([regionId,excluded])=>{const region=regions.find(item=>item.id===regionId);excluded.filter(grapeId=>region?.grapeIds.includes(grapeId)).forEach(grapeId=>errors.push(`Implausible canonical grape link: ${regionId} · ${grapeId}`))})
  aromas.forEach(aroma=>{if(aroma.grapeIds.some(id=>!ids.grapes.has(id)))errors.push(`Broken aroma relationship: ${aroma.name}`)})
  articles.forEach(article=>{if(article.relatedRegionIds.some(id=>!ids.regions.has(id))||article.relatedGrapeIds.some(id=>!ids.grapes.has(id)))errors.push(`Broken article relationship: ${article.title}`);if(article.sources.length===0||article.sources.some(source=>!validSource(source.url)))errors.push(`Invalid article source: ${article.title}`);if(article.body.join(' ').split(/\s+/).length<450)errors.push(`Article below long-form minimum: ${article.title}`)})
  if(regions.length<200||grapes.length<90||producers.length<200||wines.length<300)errors.push('Catalogue minimums are not met')
  return errors
}
