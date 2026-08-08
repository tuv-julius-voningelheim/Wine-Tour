import { asc, count } from 'drizzle-orm'
import { academyLessons, aromas, grapes, producers, regions, wines } from '../db/schema.js'
import { database } from '../server/db.js'

const cacheHeaders = { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
const allowedKinds = ['regions', 'grapes', 'producers', 'wines', 'aromas', 'lessons'] as const
type Kind = typeof allowedKinds[number]

const clamp = (value: string | null, fallback: number, min: number, max: number) => Math.min(max, Math.max(min, Number.parseInt(value ?? '', 10) || fallback))

async function readPage(kind: Kind, limit: number, offset: number) {
  if (kind === 'regions') return database.select().from(regions).orderBy(asc(regions.name)).limit(limit).offset(offset)
  if (kind === 'grapes') return database.select().from(grapes).orderBy(asc(grapes.name)).limit(limit).offset(offset)
  if (kind === 'producers') return database.select().from(producers).orderBy(asc(producers.name)).limit(limit).offset(offset)
  if (kind === 'wines') return database.select().from(wines).orderBy(asc(wines.name)).limit(limit).offset(offset)
  if (kind === 'aromas') return database.select().from(aromas).orderBy(asc(aromas.name)).limit(limit).offset(offset)
  return database.select().from(academyLessons).orderBy(asc(academyLessons.title)).limit(limit).offset(offset)
}

async function readCount(kind: Kind) {
  if (kind === 'regions') return database.select({ value: count() }).from(regions)
  if (kind === 'grapes') return database.select({ value: count() }).from(grapes)
  if (kind === 'producers') return database.select({ value: count() }).from(producers)
  if (kind === 'wines') return database.select({ value: count() }).from(wines)
  if (kind === 'aromas') return database.select({ value: count() }).from(aromas)
  return database.select({ value: count() }).from(academyLessons)
}

export default async function handler(request: Request) {
  if (request.method !== 'GET') return Response.json({ error: 'Method not allowed' }, { status: 405 })

  const url = new URL(request.url)
  const requestedKind = url.searchParams.get('kind') ?? 'regions'
  if (!allowedKinds.includes(requestedKind as Kind)) {
    return Response.json({ error: 'Unknown catalog kind', allowedKinds }, { status: 400 })
  }

  const kind = requestedKind as Kind
  const page = clamp(url.searchParams.get('page'), 1, 1, 10_000)
  const pageSize = clamp(url.searchParams.get('pageSize'), 24, 1, 100)

  try {
    const [items, totalRows] = await Promise.all([readPage(kind, pageSize, (page - 1) * pageSize), readCount(kind)])
    const total = totalRows[0]?.value ?? 0
    return Response.json({ kind, page, pageSize, total, pages: Math.ceil(total / pageSize), items }, { headers: cacheHeaders })
  } catch (error) {
    console.error('Catalog read failed', error)
    return Response.json({ error: 'Catalog unavailable' }, { status: 503 })
  }
}
