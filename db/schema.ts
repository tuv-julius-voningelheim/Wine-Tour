import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

export const membershipRole = pgEnum('membership_role', ['member', 'host', 'winery', 'merchant', 'admin'])
export const publishState = pgEnum('publish_state', ['draft', 'published', 'paused'])
export const verificationState = pgEnum('verification_state', ['unverified', 'pending', 'verified', 'rejected'])
export const wineStyle = pgEnum('wine_style', ['red', 'white', 'rose', 'sparkling', 'sweet', 'fortified'])
export const cellarState = pgEnum('cellar_state', ['owned', 'wishlist', 'tasted', 'finished'])
export const eventVisibility = pgEnum('event_visibility', ['private', 'unlisted', 'public'])
export const eventModality = pgEnum('event_modality', ['online', 'in-person', 'hybrid'])
export const mediaProvider = pgEnum('media_provider', ['local', 'vercel-blob', 'neon-object-storage', 'external'])
export const mediaAccess = pgEnum('media_access', ['public', 'private'])

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}

export const appMeta = pgTable('app_meta', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const catalogSnapshots = pgTable('catalog_snapshots', {
  id: text('id').primaryKey(),
  version: text('version').notNull(),
  counts: jsonb('counts').$type<Record<string, number>>().notNull(),
  payload: jsonb('payload').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow().notNull(),
})

export const businessSnapshots = pgTable('business_snapshots', {
  id: text('id').primaryKey(),
  version: text('version').notNull(),
  counts: jsonb('counts').$type<Record<string, number>>().notNull(),
  payload: jsonb('payload').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow().notNull(),
})

export const regions = pgTable('regions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  country: text('country').notNull(),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  summary: text('summary').notNull(),
  content: jsonb('content').notNull(),
  sourceUrl: text('source_url').notNull(),
  ...timestamps,
}, table => [index('regions_country_idx').on(table.country), index('regions_name_idx').on(table.name)])

export const grapes = pgTable('grapes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  summary: text('summary').notNull(),
  content: jsonb('content').notNull(),
  ...timestamps,
}, table => [index('grapes_name_idx').on(table.name)])

export const producers = pgTable('producers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  primaryRegionId: text('primary_region_id').notNull().references(() => regions.id),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  summary: text('summary').notNull(),
  content: jsonb('content').notNull(),
  sourceUrl: text('source_url').notNull(),
  ...timestamps,
}, table => [index('producers_region_idx').on(table.primaryRegionId), index('producers_name_idx').on(table.name)])

export const wines = pgTable('wines', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  producerId: text('producer_id').notNull().references(() => producers.id),
  regionId: text('region_id').notNull().references(() => regions.id),
  style: wineStyle('style').notNull(),
  vintage: integer('vintage'),
  summary: text('summary').notNull(),
  content: jsonb('content').notNull(),
  sourceUrl: text('source_url').notNull(),
  ...timestamps,
}, table => [index('wines_region_idx').on(table.regionId), index('wines_producer_idx').on(table.producerId), index('wines_name_idx').on(table.name)])

export const aromas = pgTable('aromas', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  family: text('family').notNull(),
  subfamily: text('subfamily').notNull(),
  tier: text('tier').notNull(),
  content: jsonb('content').notNull(),
  ...timestamps,
}, table => [index('aromas_family_idx').on(table.family), index('aromas_name_idx').on(table.name)])

export const academyLessons = pgTable('academy_lessons', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  eyebrow: text('eyebrow').notNull(),
  minutes: integer('minutes').notNull(),
  summary: text('summary').notNull(),
  content: jsonb('content').notNull(),
  ...timestamps,
}, table => [index('academy_lessons_title_idx').on(table.title)])

export const regionGrapes = pgTable('region_grapes', {
  regionId: text('region_id').notNull().references(() => regions.id, { onDelete: 'cascade' }),
  grapeId: text('grape_id').notNull().references(() => grapes.id, { onDelete: 'cascade' }),
}, table => [primaryKey({ columns: [table.regionId, table.grapeId] })])

export const producerRegions = pgTable('producer_regions', {
  producerId: text('producer_id').notNull().references(() => producers.id, { onDelete: 'cascade' }),
  regionId: text('region_id').notNull().references(() => regions.id, { onDelete: 'cascade' }),
}, table => [primaryKey({ columns: [table.producerId, table.regionId] })])

export const wineGrapes = pgTable('wine_grapes', {
  wineId: text('wine_id').notNull().references(() => wines.id, { onDelete: 'cascade' }),
  grapeId: text('grape_id').notNull().references(() => grapes.id, { onDelete: 'cascade' }),
}, table => [primaryKey({ columns: [table.wineId, table.grapeId] })])

export const wineAromas = pgTable('wine_aromas', {
  wineId: text('wine_id').notNull().references(() => wines.id, { onDelete: 'cascade' }),
  aromaId: text('aroma_id').notNull().references(() => aromas.id, { onDelete: 'cascade' }),
}, table => [primaryKey({ columns: [table.wineId, table.aromaId] })])

export const grapeAromas = pgTable('grape_aromas', {
  grapeId: text('grape_id').notNull().references(() => grapes.id, { onDelete: 'cascade' }),
  aromaId: text('aroma_id').notNull().references(() => aromas.id, { onDelete: 'cascade' }),
}, table => [primaryKey({ columns: [table.grapeId, table.aromaId] })])

export const lessonRegions = pgTable('lesson_regions', {
  lessonId: text('lesson_id').notNull().references(() => academyLessons.id, { onDelete: 'cascade' }),
  regionId: text('region_id').notNull().references(() => regions.id, { onDelete: 'cascade' }),
}, table => [primaryKey({ columns: [table.lessonId, table.regionId] })])

export const lessonGrapes = pgTable('lesson_grapes', {
  lessonId: text('lesson_id').notNull().references(() => academyLessons.id, { onDelete: 'cascade' }),
  grapeId: text('grape_id').notNull().references(() => grapes.id, { onDelete: 'cascade' }),
}, table => [primaryKey({ columns: [table.lessonId, table.grapeId] })])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').notNull(),
  displayName: text('display_name'),
  email: text('email'),
  role: membershipRole('role').default('member').notNull(),
  ...timestamps,
}, table => [uniqueIndex('users_username_unique').on(table.username), uniqueIndex('users_email_unique').on(table.email)])

export const workspaces = pgTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: membershipRole('role').notNull(),
  verification: verificationState('verification').notNull(),
  state: publishState('state').notNull(),
  content: jsonb('content').notNull(),
  ...timestamps,
})

export const workspaceMembers = pgTable('workspace_members', {
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: membershipRole('role').notNull(),
  permissions: jsonb('permissions').$type<string[]>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, table => [primaryKey({ columns: [table.workspaceId, table.userId] })])

export const tastingEvents = pgTable('tasting_events', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  modality: eventModality('modality').notNull(),
  visibility: eventVisibility('visibility').notNull(),
  state: publishState('state').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  content: jsonb('content').notNull(),
  ...timestamps,
}, table => [index('tasting_events_start_idx').on(table.startsAt), index('tasting_events_workspace_idx').on(table.workspaceId)])

export const cellarItems = pgTable('cellar_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  wineId: text('wine_id').references(() => wines.id, { onDelete: 'set null' }),
  customName: text('custom_name'),
  producerName: text('producer_name'),
  regionName: text('region_name'),
  vintage: integer('vintage'),
  state: cellarState('state').default('owned').notNull(),
  quantity: integer('quantity').default(1).notNull(),
  location: text('location').default('').notNull(),
  details: jsonb('details').notNull(),
  ...timestamps,
}, table => [index('cellar_items_user_idx').on(table.userId), index('cellar_items_wine_idx').on(table.wineId)])

export const tastingNotes = pgTable('tasting_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  wineId: text('wine_id').references(() => wines.id, { onDelete: 'set null' }),
  cellarItemId: uuid('cellar_item_id').references(() => cellarItems.id, { onDelete: 'cascade' }),
  eventId: text('event_id').references(() => tastingEvents.id, { onDelete: 'set null' }),
  rating: integer('rating'),
  content: jsonb('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, table => [index('tasting_notes_user_idx').on(table.userId), index('tasting_notes_wine_idx').on(table.wineId)])

export const ratings = pgTable('ratings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  score: integer('score').notNull(),
  review: text('review'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, table => [uniqueIndex('ratings_user_entity_unique').on(table.userId, table.entityType, table.entityId), index('ratings_entity_idx').on(table.entityType, table.entityId)])

export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  provider: mediaProvider('provider').notNull(),
  access: mediaAccess('access').default('public').notNull(),
  storageKey: text('storage_key').notNull(),
  url: text('url'),
  mimeType: text('mime_type').notNull(),
  width: integer('width'),
  height: integer('height'),
  altText: text('alt_text').notNull(),
  ownerUserId: uuid('owner_user_id').references(() => users.id, { onDelete: 'cascade' }),
  ownerWorkspaceId: text('owner_workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  metadata: jsonb('metadata').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, table => [index('media_assets_entity_idx').on(table.entityType, table.entityId), index('media_assets_owner_idx').on(table.ownerUserId, table.ownerWorkspaceId)])

export const featureFlags = pgTable('feature_flags', {
  key: text('key').primaryKey(),
  enabled: boolean('enabled').default(false).notNull(),
  configuration: jsonb('configuration').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
