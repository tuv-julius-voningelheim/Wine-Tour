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
}

export interface Producer {
  id: string
  name: string
  regionId: string
  summary: string
  lat: number
  lng: number
  wineIds: string[]
  communityRating: number
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
}

export interface Aroma {
  id: string
  name: string
  family: string
  reference: string
  origin: string
  styles: WineStyle[]
  grapeIds: string[]
}

export interface Article {
  id: string
  title: string
  eyebrow: string
  minutes: number
  summary: string
  body: string[]
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
