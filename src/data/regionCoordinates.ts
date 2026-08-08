/** Representative geographic centres for the wine areas rendered in the atlas. */
export const regionCoordinates: Record<string, readonly [number, number]> = {
  // France
  bordeaux:[44.84,-0.58], medoc:[45.25,-0.90], margaux:[45.04,-0.68], pauillac:[45.20,-0.75],
  'graves-sauternes':[44.55,-0.34], 'saint-emilion':[44.89,-0.16], pomerol:[44.93,-0.20], bourgogne:[47.05,4.83],
  chablis:[47.82,3.80], 'cote-de-nuits':[47.19,4.97], 'cote-de-beaune':[46.98,4.78], 'cote-chalonnaise':[46.75,4.68],
  maconnais:[46.31,4.83], champagne:[49.05,4.00], 'montagne-de-reims':[49.15,4.08], 'vallee-de-la-marne':[49.05,3.75],
  'cote-des-blancs':[48.98,4.00], 'cote-des-bar':[48.08,4.42], 'northern-rhone':[45.30,4.80], 'southern-rhone':[44.10,4.85],
  muscadet:[47.15,-1.45], 'anjou-saumur':[47.30,-0.30], touraine:[47.40,0.70], vouvray:[47.41,0.80],
  'centre-loire':[47.30,2.80], alsace:[48.18,7.32], provence:[43.50,6.20], 'languedoc-roussillon':[43.30,3.10],
  beaujolais:[46.12,4.70], jura:[46.73,5.70], savoie:[45.55,5.98], cahors:[44.45,1.44],
  madiran:[43.52,-0.06], jurancon:[43.30,-0.40], bergerac:[44.85,0.48], corsica:[42.00,9.05],

  // Italy
  piemonte:[45.05,7.70], barolo:[44.61,7.94], barbaresco:[44.72,8.08], 'asti-monferrato':[44.90,8.20],
  toscana:[43.32,11.33], 'chianti-classico':[43.47,11.28], montalcino:[43.06,11.49], montepulciano:[43.10,11.79],
  bolgheri:[43.23,10.62], veneto:[45.55,11.55], valpolicella:[45.52,10.91], soave:[45.42,11.25],
  'conegliano-valdobbiadene':[45.91,12.01], collio:[45.98,13.50], 'colli-orientali':[46.04,13.42], 'trentino-alto-adige':[46.20,11.12],
  franciacorta:[45.60,10.00], valtellina:[46.17,9.87], 'emilia-romagna':[44.50,11.00], marche:[43.35,13.05],
  abruzzo:[42.25,13.90], campania:[40.82,14.75], puglia:[40.85,17.25], etna:[37.73,15.00],
  vittoria:[36.95,14.53], marsala:[37.80,12.44], sardegna:[40.05,9.05],

  // Spain
  rioja:[42.46,-2.45], 'rioja-alta':[42.46,-2.67], 'rioja-alavesa':[42.56,-2.62], 'rioja-oriental':[42.32,-1.98],
  'ribera-del-duero':[41.63,-3.70], 'priorat-montsant':[41.16,0.82], 'rias-baixas':[42.35,-8.65], rueda:[41.41,-4.96],
  jerez:[36.69,-6.14], penedes:[41.35,1.70], bierzo:[42.55,-6.59], toro:[41.52,-5.40],
  'jumilla-yecla':[38.60,-1.20], navarra:[42.55,-1.65], 'basque-country-txakoli':[43.29,-2.20],

  // Portugal
  douro:[41.17,-7.55], 'vinho-verde':[41.60,-8.35], dao:[40.55,-7.90], bairrada:[40.43,-8.48],
  alentejo:[38.57,-7.90], madeira:[32.75,-17.02], setubal:[38.52,-8.89], 'lisboa-tejo':[39.05,-8.75],

  // Germany
  ahr:[50.54,7.05], baden:[48.05,7.75], franken:[49.80,10.05], 'hessische-bergstra-e':[49.65,8.63],
  mittelrhein:[50.17,7.68], mosel:[49.95,7.05], nahe:[49.85,7.75], pfalz:[49.33,8.10],
  rheingau:[50.02,8.00], rheinhessen:[49.84,8.25], 'saale-unstrut':[51.20,11.77], sachsen:[51.02,13.68],
  wurttemberg:[48.90,9.20],

  // Austria
  wachau:[48.36,15.43], kamptal:[48.52,15.68], kremstal:[48.40,15.62], weinviertel:[48.65,16.40],
  wagram:[48.35,15.98], vienna:[48.22,16.37], burgenland:[47.75,16.72], styria:[46.85,15.50],

  // Switzerland, Hungary, Greece
  valais:[46.20,7.60], 'vaud-lavaux':[46.49,6.74], graubunden:[46.70,9.55], geneva:[46.20,6.14],
  ticino:[46.15,8.90], 'three-lakes':[46.98,7.05], tokaj:[48.12,21.41], eger:[47.90,20.37],
  villany:[45.87,18.45], somlo:[47.15,17.37], santorini:[36.40,25.43], nemea:[37.82,22.66],
  naoussa:[40.63,22.07], mantinia:[37.58,22.38], crete:[35.15,25.00],

  // Caucasus and Adriatic
  kakheti:[41.72,45.65], kartli:[41.97,44.15], imereti:[42.17,42.98], 'racha-lechkhumi':[42.60,43.05],
  brda:[46.01,13.54], vipava:[45.84,13.96], 'kras-istria':[45.70,13.75], podravje:[46.42,15.85], posavje:[45.88,15.45],
  istria:[45.25,13.90], 'dalmatia-peljesac':[42.97,17.35], 'slavonia-kutjevo':[45.43,17.88], plesivica:[45.73,15.65],
  sussex:[50.92,-0.30], kent:[51.15,0.65],

  // United States
  'napa-valley':[38.45,-122.35], oakville:[38.43,-122.40], 'sonoma-county':[38.45,-122.75], 'paso-robles':[35.64,-120.65],
  'santa-barbara-county':[34.65,-120.05], lodi:[38.13,-121.27], 'sierra-foothills':[38.60,-120.70], 'willamette-valley':[45.08,-123.10],
  'umpqua-valley':[43.22,-123.40], 'rogue-valley':[42.35,-122.90], 'columbia-valley':[46.20,-119.40], 'yakima-valley':[46.45,-120.45],
  'red-mountain':[46.27,-119.45], 'walla-walla-valley':[46.05,-118.45], 'finger-lakes':[42.65,-76.90], monticello:[38.03,-78.50],
  'texas-hill-country':[30.30,-98.70],

  // Canada
  'okanagan-valley':[49.50,-119.60], 'niagara-peninsula':[43.15,-79.35], 'prince-edward-county':[44.00,-77.25], 'annapolis-valley':[45.05,-64.65],

  // Argentina, Chile, Uruguay, Brazil
  mendoza:[-33.00,-68.85], 'uco-valley':[-33.60,-69.17], 'lujan-de-cuyo':[-33.04,-68.88], maipu:[-32.98,-68.78],
  'calchaqui-valleys':[-25.90,-65.85], 'san-juan-pedernal':[-31.70,-68.60], patagonia:[-39.10,-68.20], 'jujuy-catamarca':[-25.50,-66.50],
  maipo:[-33.65,-70.65], colchagua:[-34.63,-71.15], casablanca:[-33.32,-71.41], aconcagua:[-32.85,-70.70],
  maule:[-35.40,-71.55], itata:[-36.55,-72.20], 'leyda-san-antonio':[-33.58,-71.45], canelones:[-34.55,-56.30],
  maldonado:[-34.68,-54.95], rivera:[-30.90,-55.55], 'vale-dos-vinhedos':[-29.18,-51.58], 'campanha-gaucha':[-30.80,-54.70],

  // South Africa
  stellenbosch:[-33.94,18.86], swartland:[-33.35,18.65], constantia:[-34.03,18.42], paarl:[-33.73,18.96],
  franschhoek:[-33.91,19.12], 'hemel-en-aarde':[-34.38,19.25], robertson:[-33.80,19.88],

  // Australia
  'barossa-valley':[-34.53,138.96], 'eden-valley':[-34.63,139.08], 'clare-valley':[-33.85,138.62], 'mclaren-vale':[-35.22,138.54],
  coonawarra:[-37.29,140.83], 'margaret-river':[-33.95,115.07], 'yarra-valley':[-37.68,145.45], 'mornington-peninsula':[-38.35,145.05],
  'hunter-valley':[-32.75,151.30], tasmania:[-42.05,147.20],

  // New Zealand
  marlborough:[-41.52,173.88], 'wairau-valley':[-41.48,173.82], 'awatere-valley':[-41.70,173.88], 'central-otago':[-45.15,169.25],
  'hawke-s-bay':[-39.55,176.80], 'north-canterbury':[-43.05,172.70], martinborough:[-41.22,175.46], gisborne:[-38.60,177.95], nelson:[-41.30,173.10],

  // Eastern Mediterranean and Asia
  'bekaa-valley':[33.85,35.90], batroun:[34.25,35.72], 'judean-hills':[31.75,35.05], 'galilee-golan-heights':[33.00,35.55],
  'vayots-dzor':[39.75,45.45], aragatsotn:[40.35,44.20], ningxia:[37.25,105.95], shandong:[36.85,120.50],
  yamanashi:[35.66,138.57], nagano:[36.20,138.05], hokkaido:[43.35,142.00], 'valle-de-guadalupe':[32.10,-116.57],
  thrace:[41.15,27.35], aegean:[38.55,27.00], cappadocia:[38.65,34.85], 'commandaria-troodos':[34.90,32.90],
  nashik:[20.00,73.78], 'nandi-hills':[13.37,77.68],
}
