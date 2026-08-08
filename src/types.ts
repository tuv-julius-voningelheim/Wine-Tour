export type WineStyle = 'red' | 'white' | 'rose' | 'sparkling' | 'sweet' | 'fortified'

export interface Region {
  id: string
  name: string
  country: string
  lat: number
  lng: number
  summary: string
  climate: string
  soil: string
  grapeIds: string[]
  producerIds: string[]
  wineIds: string[]
  sourceUrl: string
  history: string
  growingSeason: string
  viticulture: string
  wineStyles: string[]
  subregions: string[]
  pairings: string[]
  keyFacts: string[]
  sources: { label: string; url: string }[]
  featured?: boolean
}

export interface Grape {
  id: string
  name: string
  aliases: string[]
  color: 'red' | 'white'
  summary: string
  acidity: number
  tannin: number
  body: number
  aromaIds: string[]
  regionIds: string[]
  origin: string
  ripening: string
  climateFit: string
  viticulture: string
  winemaking: string
  styles: string[]
  pairings: string[]
}

export interface Producer {
  id: string
  name: string
  regionId: string
  regionIds: string[]
  summary: string
  lat: number
  lng: number
  wineIds: string[]
  communityRating: number
  philosophy: string
  vineyard: string
  cellar: string
  speciality: string
  sourceUrl: string
}

export interface Wine {
  id: string
  name: string
  producerId: string
  regionId: string
  grapeIds: string[]
  style: WineStyle
  vintage: number | null
  summary: string
  aromaIds: string[]
  serving: string
  communityRating: number
  composition: string
  vinification: string
  maturation: string
  drinkWindow: string
  pairings: string[]
  sourceUrl: string
  merchantOffers: { merchant: string; url: string; market: string }[]
}

export interface Aroma {
  id: string
  name: string
  family: string
  reference: string
  origin: string
  styles: WineStyle[]
  grapeIds: string[]
  subfamily: string
  tier: 'primary' | 'secondary' | 'tertiary'
  intensity: [string, string, string]
}

export interface Article {
  id: string
  title: string
  eyebrow: string
  minutes: number
  summary: string
  body: string[]
  objectives: string[]
  example: string
  exercise: string
  relatedRegionIds: string[]
  relatedGrapeIds: string[]
  image: 'terroir' | 'winemaking' | 'aroma' | 'tasting'
}

export interface CellarItem {
  id: string
  wineId?: string
  customName?: string
  producer?: string
  region?: string
  vintage?: number
  state: 'owned' | 'wishlist' | 'tasted' | 'finished'
  quantity: number
  location: string
  rating?: number
  imageDataUrl?: string
}

export type TastingChapterType = 'wine' | 'region' | 'producer' | 'grape' | 'aroma' | 'article' | 'host-note' | 'pause'

export interface TastingChapter {
  id: string
  type: TastingChapterType
  referenceId?: string
  title: string
  hostNote?: string
  duration: number
}

export interface TastingJourney {
  id: string
  title: string
  description: string
  pace: 'host' | 'self'
  access: 'private' | 'invite' | 'open'
  chapters: TastingChapter[]
  updatedAt: string
}

export interface TastingNote {
  id: string
  tastingId: string
  wineId: string
  appearance: string
  aromaIds: string[]
  palate: string
  reflection: string
  rating: number
  visibility: 'private' | 'table'
  createdAt: string
}

export interface User {
  id: string
  username: string
  passwordHash: string
  salt: string
  role: 'admin' | 'host' | 'contributor' | 'member'
}
