import fs from 'node:fs/promises'

const source = await fs.readFile(new URL('../src/data/catalog.ts', import.meta.url), 'utf8')
const match = source.match(/const regionLines = `([\s\S]*?)`\.trim\(\)/)
if (!match) throw new Error('regionLines block not found')

const entries = match[1].trim().split('\n').flatMap((line) => {
  const [country, names] = line.split('|')
  return names.split(';').map((name) => ({ country, name }))
})

const start = Number(process.argv[2] ?? 0)
const count = Number(process.argv[3] ?? entries.length)
const selected = entries.slice(start, start + count)
const aliases = {
  'Northern Rhône':'Rhône wine region France', 'Southern Rhône':'Avignon France',
  'Centre-Loire':'Sancerre France', 'Anjou-Saumur':'Saumur France',
  'Priorat & Montsant':'Priorat Spain', 'Jumilla & Yecla':'Jumilla Spain',
  'Basque Country & Txakoli':'Getaria Spain', 'Lisboa & Tejo':'Santarém Portugal',
  'Vaud & Lavaux':'Lavaux Switzerland', 'Three Lakes':'Neuchâtel Switzerland',
  'Kras & Istria':'Kras Slovenia', 'Dalmatia & Pelješac':'Pelješac Croatia',
  'Slavonia & Kutjevo':'Kutjevo Croatia', 'San Juan & Pedernal':'San Juan Argentina',
  'Jujuy & Catamarca':'Cafayate Argentina', 'Leyda & San Antonio':'San Antonio Chile',
  'Galilee & Golan Heights':'Golan Heights Israel', 'Commandaria & Troodos':'Troodos Cyprus',
}

const results = []
for (const entry of selected) {
  const q = aliases[entry.name] ?? `${entry.name} wine region, ${entry.country}`
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', q)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '1')
  url.searchParams.set('addressdetails', '1')
  const response = await fetch(url, { headers: { 'User-Agent': 'VineAtlas-coordinate-audit/1.0 (educational webapp)' } })
  if (!response.ok) throw new Error(`Geocoder ${response.status} for ${entry.name}`)
  const [place] = await response.json()
  results.push({ ...entry, lat: place ? Number(place.lat) : null, lng: place ? Number(place.lon) : null, label: place?.display_name ?? null })
  await new Promise((resolve) => setTimeout(resolve, 1100))
}
process.stdout.write(JSON.stringify(results))
