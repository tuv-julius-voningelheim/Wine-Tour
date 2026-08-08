# Vine Atlas — editorial research baseline

Last reviewed: 2026-08-08

This document is the source-backed editorial baseline for the first release. It is not intended to be an exhaustive wine encyclopedia. The product should clearly distinguish curated facts, community-created records and personal tasting notes.

## Editorial principles

- Model origin as a hierarchy: country → region → subregion/appellation → producer → wine.
- Model grapes independently and connect them many-to-many to regions and wines.
- Keep regulated terms precise. “Champagne”, “Rioja” and “Port” are protected origins, not generic styles.
- Treat tasting descriptions as prompts, not objective truth. Perception varies by person, context and serving conditions.
- Store a source URL and review date on every curated region, producer, wine and knowledge article.
- Do not scrape critic scores or copyrighted tasting notes. Seed descriptions are concise original summaries based on primary sources.

## Initial editorial anchors

The ten regions below are the deep editorial exemplars, not the geographic limit of the product. The required broad launch catalogue is maintained in `docs/WORLD_ATLAS_SCOPE.md` and extends to more than 100 region/appellation records.

## Curated launch regions

| Region | Launch subregions | Signature grapes/styles | Editorial anchor |
| --- | --- | --- | --- |
| Bordeaux, France | Médoc, Saint-Émilion, Pomerol, Graves & Sauternes | Cabernet Sauvignon, Merlot, Cabernet Franc, Sauvignon Blanc, Sémillon; blends, dry and sweet wines | Bordeaux’s six main grapes and blend tradition are described by the regional wine council. |
| Bourgogne, France | Chablis, Côte de Nuits, Côte de Beaune, Côte Chalonnaise, Mâconnais | Pinot Noir, Chardonnay, Aligoté; site-specific “Climats” | The BIVB describes Climats as historically delimited vineyard parcels shaped by site and human practice. |
| Champagne, France | Montagne de Reims, Vallée de la Marne, Côte des Blancs, Côte des Bar | Chardonnay, Pinot Noir, Meunier; traditional-method sparkling wine | Comité Champagne lists the four major subregions and the three dominant grapes. |
| Mosel, Germany | Bernkastel/Middle Mosel, Saar, Ruwer, Terrassenmosel, Upper Mosel | Riesling, Elbling, Pinot varieties; dry through noble-sweet | The German Wine Institute and Mosel tourism sources identify Riesling as the defining variety and slate/steep slopes as key context. |
| Rioja, Spain | Rioja Alta, Rioja Alavesa, Rioja Oriental | Tempranillo, Garnacha, Graciano, Mazuelo, Viura; red, white, rosé and sparkling | The DOCa council defines three zones and origin/ageing classifications. |
| Chianti Classico, Italy | Greve, Radda, Gaiole, Castellina and other UGA areas | Sangiovese-led red wines | The Consorzio documents the production zone and the more granular UGA origin model. |
| Napa Valley, USA | Oakville, Rutherford, Stags Leap District, Yountville, Mount Veeder | Cabernet Sauvignon, Chardonnay, Merlot, Sauvignon Blanc | Napa Valley Vintners documents nested AVAs, microclimates and more than three dozen varieties. |
| Mendoza, Argentina | Luján de Cuyo, Uco Valley, Maipú | Malbec, Cabernet Franc, Cabernet Sauvignon, Chardonnay | Wines of Argentina emphasizes altitude as a major driver of Mendoza’s regional expression. |
| Barossa Valley, Australia | Northern Grounds, Central Grounds, Southern Grounds; nearby Eden Valley context | Shiraz, Grenache, Cabernet Sauvignon, Riesling | Wine Australia notes a warm Mediterranean valley floor, cooler elevated sites and very old Shiraz vines. |
| Marlborough, New Zealand | Wairau Valley, Southern Valleys, Awatere Valley | Sauvignon Blanc, Pinot Noir, Chardonnay, aromatics | New Zealand Wine distinguishes the three subregions by soil, wind, rainfall and mesoclimate. |

## Launch grape set

The seed set is deliberately cross-regional so relationships are visible immediately.

- Cabernet Sauvignon — blackcurrant/cassis, cedar and graphite are common prompts; typically higher tannin and acidity; Bordeaux, Napa, Coonawarra, Maipo.
- Merlot — plum and dark cherry, often rounder texture; Right Bank Bordeaux and many international regions.
- Pinot Noir — red cherry, raspberry, earth and spice; generally lighter colour and tannin; Bourgogne, Champagne, Central Otago.
- Syrah/Shiraz — blackberry, violet, pepper and savoury notes; Northern Rhône to richer Barossa expressions.
- Tempranillo — red/black cherry, leather, tobacco and dill/coconut where American oak is used; Rioja and Ribera del Duero.
- Sangiovese — sour cherry, dried herbs and firm acidity/tannin; Tuscany.
- Malbec — plum, blackberry and violet, often vivid colour; Cahors and especially high-altitude Mendoza.
- Grenache/Garnacha — strawberry, raspberry, white pepper and warmth; Spain, Southern Rhône and Barossa.
- Chardonnay — a non-aromatic, highly adaptable grape; citrus/apple in cool sites through stone fruit in warmer sites; oak and lees can add toast/cream.
- Sauvignon Blanc — citrus, gooseberry, herbs and tropical fruit depending on climate; Loire/Bordeaux and Marlborough.
- Riesling — high acidity, citrus, orchard fruit, flowers and age-derived petrol notes; dry to intensely sweet; Germany, Alsace, Austria and Australia.
- Sémillon — citrus, wax and lanolin with age; dry or botrytised sweet styles, central to Sauternes blends.
- Meunier — supple fruit and roundness in Champagne blends.
- Chenin Blanc — high acidity, apple/quince and styles from dry to sweet and sparkling; Loire and South Africa.

## Wine knowledge modules

### From grape to wine

1. Vineyard decisions shape ripeness, acidity, yield and fruit condition.
2. Harvest and sorting select sound grapes at the intended maturity.
3. Crushing/pressing releases juice; skin contact is the main colour and tannin lever.
4. Yeast converts grape sugar into alcohol, carbon dioxide and flavour compounds.
5. Malolactic conversion may soften acidity and add creamy notes.
6. Maturation in tank, concrete, wood or bottle develops texture and aroma.
7. Clarification, stabilisation, blending and bottling prepare the finished wine.

### Style distinctions

- White: usually pressed before fermentation so juice has little skin contact. White wine can also be made from dark grapes when colour extraction is avoided.
- Red: fermentation with skins extracts colour, tannin and flavour; cap management changes extraction.
- Rosé: usually brief skin contact or direct pressing of dark grapes. It is generally not a white/red blend; regulated exceptions exist for some sparkling wine.
- Orange/amber: white grapes fermented with extended skin contact, yielding deeper colour, tannin and savoury texture. OIV defines “white wine with maceration” as prolonged pomace contact.
- Sparkling: carbon dioxide is retained or introduced. Traditional method creates the second fermentation in bottle; tank method does so in a pressure tank; ancestral/pét-nat bottles before the first fermentation is complete.
- Fortified: grape spirit is added. For Port, adding spirit stops fermentation and preserves varying sweetness; typical alcohol is 19–22% abv according to the IVDP.
- Noble-sweet/botrytised: beneficial Botrytis can concentrate sugar, acidity and complex honey/saffron/dried-fruit aromas.
- Ice wine/Eiswein: OIV requires grapes naturally frozen in the vineyard and pressed while frozen; recommended harvest/press temperature is at or below −7°C.
- Dried-grape/passito: grapes are dried before fermentation, concentrating sugar, acidity and flavour.

### Tasting note model

The app uses an original beginner-friendly framework inspired by common professional practice:

1. Look — colour family, depth, clarity, bubbles/deposit.
2. Smell — intensity; fruit, floral, herbal, spice, earth/mineral, fermentation and maturation families.
3. Taste — sweetness, acidity, tannin, alcohol/warmth, body, flavour intensity and finish.
4. Reflect — balance, complexity, personal enjoyment, readiness and food context.

WSET’s public guidance confirms the usefulness of a consistent appearance/nose/palate/conclusion sequence. The app must not reproduce the copyrighted WSET SAT lexicon or imply accreditation.

## Aroma knowledge model

The aroma explorer uses an original taxonomy designed for learning and cross-linking. Aromas are not ingredients added to wine; most are sensory associations created by grape compounds, fermentation, maturation and ageing.

### Primary and grape/fermentation-adjacent families

- Citrus: lemon, lime, grapefruit, orange peel.
- Orchard fruit: green apple, red apple, pear, quince.
- Stone fruit: peach, apricot, nectarine.
- Tropical fruit: pineapple, mango, passion fruit, banana, lychee.
- Red fruit: strawberry, raspberry, red cherry, cranberry, redcurrant.
- Black fruit: blackberry, black cherry, blackcurrant/cassis, blueberry, plum.
- Dried/cooked fruit: raisin, prune, fig, fruit compote, marmalade.
- Floral: blossom, honeysuckle, rose, violet, jasmine.
- Herbal/vegetal: grass, tomato leaf, capsicum, mint, eucalyptus, dill, tea leaf.
- Spice: black pepper, white pepper, liquorice, anise.
- Earth/mineral associations: wet stone, chalk, slate, saline, mushroom, forest floor. The copy must explain that “mineral” is a sensory descriptor, not literal rock dissolved into wine.

### Winemaking and maturation families

- Yeast/autolysis: bread dough, brioche, biscuit.
- Malolactic and lees: butter, cream, yoghurt, cheese rind.
- Oak: vanilla, toast, cedar, coconut, clove, smoke, coffee, chocolate.
- Oxidative and biological ageing: bruised apple, walnut, almond, chamomile, saline/yeasty flor notes.

### Bottle-age and concentration families

- Red-wine development: leather, tobacco, dried leaves, game, truffle.
- White-wine development: honey, wax, toast, nuts, petrol/kerosene in some aged Riesling expressions.
- Noble rot and sweet-wine concentration: honey, saffron, ginger, marmalade, dried apricot.

Each grape and wine connects to 4–10 typical aroma IDs. Each connection stores intensity and whether it normally arises from grape/fermentation, maturation or age. The UI always uses language such as “often”, “can show” and “common in this style” rather than presenting aromas as deterministic.

## Deeply curated launch producers and representative wines

| Producer | Region | Representative seed wines | Primary-source basis |
| --- | --- | --- | --- |
| Château Margaux | Bordeaux / Margaux | Grand Vin, Pavillon Rouge, Pavillon Blanc | Estate lists these wines; Pavillon Rouge is Cabernet-dominant and the historic second wine. |
| Domaine de la Romanée-Conti | Bourgogne / Vosne-Romanée | Romanée-Conti, La Tâche, Richebourg | Estate presents nine Grands Crus and its long history. |
| Champagne Bollinger | Champagne / Aÿ | Special Cuvée, La Grande Année | House materials identify the cuvées and reserve-wine tradition. |
| Dr. Loosen | Mosel / Bernkastel | Erdener Prälat Riesling GG, Ürziger Würzgarten Riesling Kabinett | Estate documents old ungrafted vines, classified sites and its Riesling range. |
| Bodegas Muga | Rioja Alta / Haro | Prado Enea Gran Reserva, Muga Reserva | Estate was founded in 1932 in Haro; Prado Enea is sourced from cooler north-west Rioja Alta parcels and receives long oak/bottle ageing. |
| Marchesi Antinori / Tenuta Tignanello | Chianti Classico | Tignanello, Solaia | Estate describes both as signature wines from Tenuta Tignanello. |
| Robert Mondavi Winery | Napa Valley / Oakville | To Kalon Reserve Cabernet Sauvignon, Fumé Blanc | Estate documents its To Kalon Reserve; Napa sources provide AVA context. |
| Catena Zapata | Mendoza / Uco Valley | Adrianna Vineyard Malbec, White Bones Chardonnay | Estate and Catena Institute document the high-altitude Adrianna Vineyard and its parcel wines. |
| Penfolds | Barossa / South Australia | Grange, Bin 389 Cabernet Shiraz | Producer is included as a globally recognisable Australian reference; descriptions must remain original and sourced before publication. |
| Cloudy Bay | Marlborough | Sauvignon Blanc, Te Koko | Estate describes Te Koko as a barrel-fermented, lees-aged expression of Marlborough Sauvignon Blanc. |

## Primary sources

- [OIV International Code of Oenological Practices](https://www.oiv.int/standards/international-code-of-oenological-practices)
- [OIV definition of Ice Wine / Eiswein](https://www.oiv.int/node/3680)
- [WSET: how to train your palate](https://www.wsetglobal.com/knowledge-centre/blog/2026/how-to-train-your-palate)
- [IVDP introduction to Port](https://www.ivdp.pt/en/wines/port-wines/introduction/)
- [Bordeaux grape varieties](https://www.bordeaux.com/en/grape-varieties/)
- [Bourgogne climate and Climats](https://www.bourgogne-wines.com/wine-and-terroir/our-natural-assets/climatology/an-ideal-climate-for-producing-great-wines%2C2483%2C9268.html)
- [Champagne grape varieties](https://www.champagne.fr/en/about-champagne/a-great-blended-wine/champagne-and-its-grape-varieties)
- [Champagne region](https://www.champagne.fr/en/about-champagne/a-great-blended-wine/the-champagne-region)
- [German Wine Institute: Mosel](https://symphonia-typo3-prod.deutscheweine.de/en/our-regions/growing-area/72/mosel)
- [German Wine Institute: Riesling](https://symphonia-typo3-prod.deutscheweine.de/en/our-wine/grape-varieties/grape-variety/105/riesling)
- [DOCa Rioja](https://riojawine.com/en-us/)
- [DOCa Rioja production areas](https://riojawine.com/en-gb/production-areas/)
- [Consorzio Vino Chianti Classico](https://www.chianticlassico.com/)
- [Napa Valley Vintners](https://napavintners.com/)
- [Wines of Argentina regional guide](https://api.winesofargentina.org/uploads/2021/07/F6odkpjYXf_WOFA_Argentine_Wine_Regions_2021.pdf)
- [Wine Australia: Barossa](https://www.wineaustralia.com/market-insights/regions-and-varieties/south-australia-wines/barossa)
- [New Zealand Wine: Marlborough](https://www.nzwine.com/en/regions/marlborough/)
- [Château Margaux](https://chateau-margaux.com/en/)
- [Domaine de la Romanée-Conti](https://www.romanee-conti.fr/)
- [Dr. Loosen](https://drloosen.de/en/)
- [Bodegas Muga](https://www.bodegasmuga.com/en/)
- [Marchesi Antinori: Tignanello](https://www.antinori.it/en/vino/tignanello-en)
- [Robert Mondavi To Kalon Reserve](https://robertmondaviwinery.com/collections/online-exclusives/products/2018-robert-mondavi-winery-to-kalon-reserve-cabernet-sauvignon)
- [Catena Zapata wines](https://catenazapata.com/wines/)
- [Cloudy Bay Te Koko](https://www.cloudybay.com/en-us/our-wines/te-koko/te-koko-2019/)
- [German Wine Institute: all 13 regions](https://www.deutscheweine.de/regionen)
- [Austrian Wine region/DAC map](https://www.austrianwine.com/fileadmin/user_upload/PDF/AVZs/VKL_I_see_red_online.pdf)
- [Wines of Portugal regions](https://winesofportugal.com/en/discover/wine-regions/)
- [Swiss Wine regions](https://www.swisswine.com/en/swiss-wine-regions)
- [Wines of Argentina regions](https://api.winesofargentina.org/uploads/2021/07/F6odkpjYXf_WOFA_Argentine_Wine_Regions_2021.pdf)
- [Uruguay Wine regions](https://uruguay.wine/en/regions/)
- [Wines of South Africa winegrowing areas](https://www.wosa.co.za/The-Industry/Winegrowing-Areas/Winelands-of-South-Africa/)
- [Australian Wine regions](https://www.australianwine.com/our-places)
- [New Zealand Wine regions](https://www.nzwine.com/en/regions/)
- [Oregon Wine regions and AVAs](https://www.oregonwine.org/regions/)
- [Washington State Wine AVAs](https://www.washingtonwine.org/regions-and-avas/)
- [Wines of Canada](https://winesofcanada.ca/)
- [Georgia National Wine Agency regions](https://wine.gov.ge/En/WineMakingRegions)
- [Slovenian government wine regions](https://www.gov.si/en/topics/slovenian-wines/)
- [Wines of Greece PDO Nemea](https://winesofgreece.org/pdo/pdo-nemea/)
- [Yamanashi wine](https://www.pref.yamanashi.jp/bishubiken/en/wine.html)
- [Armenian wine tourism regions](https://armenia.travel/things-to-do/armenian-wine/)
- [Ningxia government wine industry overview](https://dofcom.nx.gov.cn/tznx/zdcytj_65995/ptjcy_65999/)


## Image and map policy

- Prefer locally stored, licensed photography from Wikimedia Commons or other sources that explicitly allow reuse. Keep an asset manifest with author, source URL and licence.
- Never hotlink winery marketing photography without permission.
- Use OpenStreetMap-compatible tiles only with visible attribution and lazy-load the interactive map.
- Winery and region coordinates are educational approximations unless verified against a primary/official source.
