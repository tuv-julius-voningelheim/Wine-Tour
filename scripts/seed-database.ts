import { drizzle } from 'drizzle-orm/node-postgres'
import { sql } from 'drizzle-orm'
import { Pool } from 'pg'
import { createServer } from 'vite'
import {
  academyLessons,
  appMeta,
  aromas as aromaTable,
  businessSnapshots,
  catalogSnapshots,
  featureFlags,
  grapeAromas,
  grapes as grapeTable,
  lessonGrapes,
  lessonRegions,
  producerRegions,
  producers as producerTable,
  regionGrapes,
  regions as regionTable,
  tastingEvents,
  wineAromas,
  wineGrapes,
  wines as wineTable,
  workspaces,
} from '../db/schema'
import { articles, aromas, counts, grapes, producers, regions, validateCatalog, wines } from '../src/data/catalog'
import {
  demoApprovals,
  demoEvents,
  demoFeeConfiguration,
  demoOffers,
  demoPartnerProfiles,
  demoPlacements,
  demoWinerySections,
  demoWorkspaces,
  validateBusinessData,
} from '../src/data/business'

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL_UNPOOLED or DATABASE_URL is required to seed the database.')

const moduleLoader = await createServer({ server:{ middlewareMode:true }, appType:'custom', logLevel:'silent' })
const curriculum = await moduleLoader.ssrLoadModule('/src/learningCurriculum.ts')
const learningModules = curriculum.learningModules as Array<{
  id:string
  title:Record<'en'|'de'|'fr'|'es',string>
  school:string
  minutes:number
  summary:Record<'en'|'de'|'fr'|'es',string>
  entityIds:string[]
  [key:string]:unknown
}>
const learningAudit = curriculum.learningValidation() as { issues:string[] }
const catalogErrors = validateCatalog()
const businessErrors = validateBusinessData()
if (catalogErrors.length || businessErrors.length || learningAudit.issues.length) {
  await moduleLoader.close()
  throw new Error(`Refusing to seed invalid data:\n${[...catalogErrors, ...businessErrors, ...learningAudit.issues].join('\n')}`)
}

const pool = new Pool({ connectionString, max: 1 })
const db = drizzle(pool)
const now = new Date()
const commitSha = process.env.VERCEL_GIT_COMMIT_SHA?.trim()
const version = commitSha ? commitSha.slice(0, 12) : new Date().toISOString().slice(0, 10)

const uniquePairs = <T extends Record<string, string>>(rows: T[], key: (row: T) => string) => {
  const seen = new Set<string>()
  return rows.filter(row => {
    const value = key(row)
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

try {
  await db.transaction(async tx => {
    await tx.insert(regionTable).values(regions.map(region => ({
      id: region.id,
      name: region.name,
      country: region.country,
      lat: region.lat,
      lng: region.lng,
      summary: region.summary,
      content: region,
      sourceUrl: region.sourceUrl,
      updatedAt: now,
    }))).onConflictDoUpdate({
      target: regionTable.id,
      set: { name: sql`excluded.name`, country: sql`excluded.country`, lat: sql`excluded.lat`, lng: sql`excluded.lng`, summary: sql`excluded.summary`, content: sql`excluded.content`, sourceUrl: sql`excluded.source_url`, updatedAt: now },
    })

    await tx.insert(grapeTable).values(grapes.map(grape => ({
      id: grape.id,
      name: grape.name,
      color: grape.color,
      summary: grape.summary,
      content: grape,
      updatedAt: now,
    }))).onConflictDoUpdate({
      target: grapeTable.id,
      set: { name: sql`excluded.name`, color: sql`excluded.color`, summary: sql`excluded.summary`, content: sql`excluded.content`, updatedAt: now },
    })

    await tx.insert(producerTable).values(producers.map(producer => ({
      id: producer.id,
      name: producer.name,
      primaryRegionId: producer.regionId,
      lat: producer.lat,
      lng: producer.lng,
      summary: producer.summary,
      content: producer,
      sourceUrl: producer.sourceUrl,
      updatedAt: now,
    }))).onConflictDoUpdate({
      target: producerTable.id,
      set: { name: sql`excluded.name`, primaryRegionId: sql`excluded.primary_region_id`, lat: sql`excluded.lat`, lng: sql`excluded.lng`, summary: sql`excluded.summary`, content: sql`excluded.content`, sourceUrl: sql`excluded.source_url`, updatedAt: now },
    })

    await tx.insert(wineTable).values(wines.map(wine => ({
      id: wine.id,
      name: wine.name,
      producerId: wine.producerId,
      regionId: wine.regionId,
      style: wine.style,
      vintage: wine.vintage,
      summary: wine.summary,
      content: wine,
      sourceUrl: wine.sourceUrl,
      updatedAt: now,
    }))).onConflictDoUpdate({
      target: wineTable.id,
      set: { name: sql`excluded.name`, producerId: sql`excluded.producer_id`, regionId: sql`excluded.region_id`, style: sql`excluded.style`, vintage: sql`excluded.vintage`, summary: sql`excluded.summary`, content: sql`excluded.content`, sourceUrl: sql`excluded.source_url`, updatedAt: now },
    })

    await tx.insert(aromaTable).values(aromas.map(aroma => ({
      id: aroma.id,
      name: aroma.name,
      family: aroma.family,
      subfamily: aroma.subfamily,
      tier: aroma.tier,
      content: aroma,
      updatedAt: now,
    }))).onConflictDoUpdate({
      target: aromaTable.id,
      set: { name: sql`excluded.name`, family: sql`excluded.family`, subfamily: sql`excluded.subfamily`, tier: sql`excluded.tier`, content: sql`excluded.content`, updatedAt: now },
    })

    await tx.delete(regionGrapes)
    await tx.delete(producerRegions)
    await tx.delete(wineGrapes)
    await tx.delete(wineAromas)
    await tx.delete(grapeAromas)
    await tx.delete(lessonRegions)
    await tx.delete(lessonGrapes)
    await tx.delete(academyLessons)

    await tx.insert(academyLessons).values(learningModules.map(module => ({
      id: module.id,
      title: module.title.en,
      eyebrow: module.school,
      minutes: module.minutes,
      summary: module.summary.en,
      content: module,
      updatedAt: now,
    })))

    const regionGrapeRows = uniquePairs(regions.flatMap(region => region.grapeIds.map(grapeId => ({ regionId: region.id, grapeId }))), row => `${row.regionId}:${row.grapeId}`)
    const producerRegionRows = uniquePairs(producers.flatMap(producer => producer.regionIds.map(regionId => ({ producerId: producer.id, regionId }))), row => `${row.producerId}:${row.regionId}`)
    const wineGrapeRows = uniquePairs(wines.flatMap(wine => wine.grapeIds.map(grapeId => ({ wineId: wine.id, grapeId }))), row => `${row.wineId}:${row.grapeId}`)
    const wineAromaRows = uniquePairs(wines.flatMap(wine => wine.aromaIds.map(aromaId => ({ wineId: wine.id, aromaId }))), row => `${row.wineId}:${row.aromaId}`)
    const grapeAromaRows = uniquePairs(grapes.flatMap(grape => grape.aromaIds.map(aromaId => ({ grapeId: grape.id, aromaId }))), row => `${row.grapeId}:${row.aromaId}`)
    const knownRegionIds = new Set(regions.map(region => region.id))
    const knownGrapeIds = new Set(grapes.map(grape => grape.id))
    const lessonRegionRows = uniquePairs(learningModules.flatMap(module => module.entityIds.filter(id => knownRegionIds.has(id)).map(regionId => ({ lessonId: module.id, regionId }))), row => `${row.lessonId}:${row.regionId}`)
    const lessonGrapeRows = uniquePairs(learningModules.flatMap(module => module.entityIds.filter(id => knownGrapeIds.has(id)).map(grapeId => ({ lessonId: module.id, grapeId }))), row => `${row.lessonId}:${row.grapeId}`)

    if (regionGrapeRows.length) await tx.insert(regionGrapes).values(regionGrapeRows)
    if (producerRegionRows.length) await tx.insert(producerRegions).values(producerRegionRows)
    if (wineGrapeRows.length) await tx.insert(wineGrapes).values(wineGrapeRows)
    if (wineAromaRows.length) await tx.insert(wineAromas).values(wineAromaRows)
    if (grapeAromaRows.length) await tx.insert(grapeAromas).values(grapeAromaRows)
    if (lessonRegionRows.length) await tx.insert(lessonRegions).values(lessonRegionRows)
    if (lessonGrapeRows.length) await tx.insert(lessonGrapes).values(lessonGrapeRows)

    await tx.insert(workspaces).values(demoWorkspaces.map(workspace => ({
      id: workspace.id,
      name: workspace.name,
      role: workspace.role,
      verification: workspace.verification,
      state: workspace.publishState,
      content: workspace,
      updatedAt: now,
    }))).onConflictDoUpdate({
      target: workspaces.id,
      set: { name: sql`excluded.name`, role: sql`excluded.role`, verification: sql`excluded.verification`, state: sql`excluded.state`, content: sql`excluded.content`, updatedAt: now },
    })

    await tx.insert(tastingEvents).values(demoEvents.map(event => ({
      id: event.id,
      workspaceId: event.workspaceId,
      title: event.title,
      summary: event.summary,
      modality: event.modality,
      visibility: event.visibility,
      state: event.publishState,
      startsAt: new Date(event.startsAt),
      content: event,
      updatedAt: now,
    }))).onConflictDoUpdate({
      target: tastingEvents.id,
      set: { workspaceId: sql`excluded.workspace_id`, title: sql`excluded.title`, summary: sql`excluded.summary`, modality: sql`excluded.modality`, visibility: sql`excluded.visibility`, state: sql`excluded.state`, startsAt: sql`excluded.starts_at`, content: sql`excluded.content`, updatedAt: now },
    })

    const catalogCounts = { ...counts, articles:learningModules.length, legacyArticles:articles.length }
    const catalogPayload = { regions, grapes, producers, wines, aromas, lessons:learningModules, legacyArticles:articles }
    const businessPayload = { workspaces: demoWorkspaces, profiles: demoPartnerProfiles, events: demoEvents, winerySections: demoWinerySections, offers: demoOffers, placements: demoPlacements, approvals: demoApprovals, fees: demoFeeConfiguration }
    const businessCounts = { workspaces: demoWorkspaces.length, profiles: demoPartnerProfiles.length, events: demoEvents.length, offers: demoOffers.length, placements: demoPlacements.length, approvals: demoApprovals.length }

    await tx.insert(catalogSnapshots).values({ id: 'current', version, counts:catalogCounts, payload: catalogPayload, publishedAt: now }).onConflictDoUpdate({
      target: catalogSnapshots.id,
      set: { version, counts:catalogCounts, payload: catalogPayload, publishedAt: now },
    })
    await tx.insert(businessSnapshots).values({ id: 'current', version, counts: businessCounts, payload: businessPayload, publishedAt: now }).onConflictDoUpdate({
      target: businessSnapshots.id,
      set: { version, counts: businessCounts, payload: businessPayload, publishedAt: now },
    })
    await tx.insert(appMeta).values({ key: 'schema_version', value: { version: '1', catalogVersion: version }, updatedAt: now }).onConflictDoUpdate({
      target: appMeta.key,
      set: { value: { version: '1', catalogVersion: version }, updatedAt: now },
    })
    await tx.insert(featureFlags).values({ key: 'remote_catalog_reads', enabled: true, configuration: { fallback: 'bundled-catalog' }, updatedAt: now }).onConflictDoUpdate({
      target: featureFlags.key,
      set: { enabled: true, configuration: { fallback: 'bundled-catalog' }, updatedAt: now },
    })
    await tx.insert(featureFlags).values({ key: 'media_uploads', enabled: false, configuration: { provider: 'local', reason: 'blob-usage-threshold' }, updatedAt: now }).onConflictDoUpdate({
      target: featureFlags.key,
      set: { enabled: false, configuration: { provider: 'local', reason: 'blob-usage-threshold' }, updatedAt: now },
    })
  })

  console.log(JSON.stringify({ ok: true, version, catalog: { ...counts, articles:learningModules.length, legacyArticles:articles.length }, business: { workspaces: demoWorkspaces.length, events: demoEvents.length } }))
} finally {
  await pool.end()
  await moduleLoader.close()
}
