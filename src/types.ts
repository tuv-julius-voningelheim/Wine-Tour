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
  image: 'terroir' | 'winemaking' | 'aroma' | 'tasting' | 'soil' | 'bottle'
  sources: { label: string; url: string }[]
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
  bottleSizeMl?: number
  purchaseDate?: string
  purchasePrice?: number
  currency?: 'EUR' | 'USD' | 'GBP' | 'CHF'
  purchaseSource?: string
  drinkFrom?: number
  drinkUntil?: number
  occasion?: string
  notes?: CellarTastingNote[]
}

export interface CellarTastingNote {
  id: string
  appearance: string
  aromaIds: string[]
  palate: string
  finish: string
  reflection: string
  acidity: number
  tannin: number
  body: number
  rating: number
  createdAt: string
}

export type TastingChapterType = 'wine' | 'region' | 'producer' | 'grape' | 'aroma' | 'article' | 'learning-block' | 'host-note' | 'pause'

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

export type MembershipRole = 'member' | 'host' | 'winery' | 'merchant' | 'admin'
export type WorkspacePermission = 'view' | 'edit' | 'publish' | 'commerce' | 'moderate'
export type VerificationState = 'unverified' | 'pending' | 'verified' | 'rejected'
export type PublishState = 'draft' | 'published' | 'paused'

export interface BusinessWorkspace {
  id: string
  name: string
  role: MembershipRole
  verification: VerificationState
  publishState: PublishState
  plan: 'member' | 'studio' | 'partner' | 'custom'
  planStatus: 'active' | 'trial' | 'paused'
  checklist: { id: string; complete: boolean }[]
}

export interface WorkspaceMembership {
  id: string
  workspaceId: string
  userId: string
  role: MembershipRole
  permissions: WorkspacePermission[]
}

export interface PartnerProfile {
  id: string
  workspaceId: string
  kind: 'host' | 'winery' | 'merchant'
  displayName: string
  producerId?: string
  tagline: string
  story: string
  languages: string[]
  markets: string[]
  serviceArea: string
  shopUrl?: string
  contactUrl?: string
  verification: VerificationState
  publishState: PublishState
  expertise: string[]
}

export type EventModality = 'online' | 'in-person' | 'hybrid'
export type EventVisibility = 'private' | 'unlisted' | 'public'

export interface TastingEvent {
  id: string
  workspaceId: string
  hostProfileId: string
  title: string
  summary: string
  modality: EventModality
  visibility: EventVisibility
  publishState: PublishState
  startsAt: string
  durationMinutes: number
  language: 'en' | 'de' | 'fr' | 'es'
  regionId?: string
  venue?: string
  secureJoinLink?: string
  capacity: number
  ticket: { type: 'free' | 'paid'; amountMinor: number; currency: 'EUR' | 'USD' | 'GBP'; platformFeeBps: number }
  cancellationTerms: string
  journeyId?: string
  featuredWineIds: string[]
  inviteCode?: string
}

export interface WineryPageSection {
  id: string
  workspaceId: string
  type: 'hero' | 'story' | 'vineyards' | 'cellar' | 'visits' | 'team' | 'gallery' | 'wines' | 'contact'
  heading: string
  body: string
  translations?: Partial<Record<'en' | 'de' | 'fr' | 'es', { heading: string; body: string }>>
  visible: boolean
  order: number
}

export interface MerchantOffer {
  id: string
  workspaceId: string
  wineId: string
  destinationUrl: string
  priceMinor: number
  currency: 'EUR' | 'USD' | 'GBP'
  market: string
  stock: 'in-stock' | 'low' | 'preorder' | 'out-of-stock'
  disclosure: 'retailer' | 'affiliate'
  publishState: PublishState
}

export type PlacementSurface = 'home' | 'map' | 'region' | 'search'
export interface PromotionalPlacement {
  id: string
  workspaceId: string
  partnerProfileId: string
  surface: PlacementSurface
  startsAt: string
  endsAt: string
  priority: number
  disclosure: 'featured' | 'sponsored'
  enabled: boolean
}

export interface ApprovalRecord {
  id: string
  workspaceId: string
  kind: 'role-application' | 'winery-claim' | 'wine-change' | 'public-event' | 'offer' | 'review'
  subjectId: string
  title: string
  submittedAt: string
  state: 'pending' | 'approved' | 'rejected'
  note?: string
}

export interface PlatformFeeConfiguration {
  recurringPartnerPlans: boolean
  ticketFeeBps: number
  merchantAffiliateLinks: boolean
  paymentsMode: 'disabled-demo' | 'saas-connect' | 'marketplace-connect'
}
