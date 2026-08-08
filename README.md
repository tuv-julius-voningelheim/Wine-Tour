# Vine Atlas

Vine Atlas is a mobile-first wine knowledge graph and tasting companion. It connects places, grapes, producers, wines, aromas, learning notes and personal memories in one routeable React application.

The current editorial catalogue contains 222 wine regions, 107 grape varieties, 203 producers, 409 wines, 77 aroma references and 11 fully authored interactive masterclasses. The public curriculum exposes only modules that pass the four-language depth, source and similarity audit; unfinished curriculum drafts are not counted as published lessons.

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run typecheck
npm run build
```

The build includes `validate:learning`. It fails when a visible masterclass misses the minimum depth in any locale, repeats another module too closely, lacks directly relevant sources or breaks curriculum relationships.

The Vite development server prints the local URL, normally `http://localhost:5173`. Nested routes work on Vercel through the SPA rewrite in `vercel.json`.

## Local curator access

The application provisions its browser-local administrator from a deterministic SHA-256 digest constant. The administrator password is distributed separately and is never stored in source, documentation, UI copy, fixtures or build artifacts.

The pilot hashes entered passwords with Web Crypto before comparison and stores only hashes, salts, sessions, cellar data, ratings and notes in localStorage. It does not provide production-grade authentication or sync data between browsers. A hosted release needs server-side password hashing, secure sessions, recovery, rate limiting and a relational database.

## Hosted data foundation

The Vercel project is connected to a Neon Postgres resource in Frankfurt for development, preview and production. Drizzle owns the versioned schema in `db/schema.ts`; the first migration creates the editorial graph plus future-ready workspace, event, cellar, note, rating and media tables.

Database commands require Vercel-injected environment variables and do not need a checked-in `.env` file:

```bash
npm run db:generate
vercel env run -e production -- npm run db:migrate
vercel env run -e production -- npm run db:seed
```

The seed validates catalogue, business graph and curriculum before synchronising curated entities, relations and a versioned snapshot. `/api/health` reports database and catalogue status; `/api/catalog` provides a paginated read-only catalogue boundary. There is deliberately no public database write API until server authentication, sessions and row-level authorization exist.

Media metadata is provider-neutral (`local`, `vercel-blob`, `neon-object-storage` or `external`). Vercel Blob provisioning is currently blocked by the Hobby account's storage usage threshold, so personal bottle images remain browser-local until a secure object store is available.

## Architecture

- `src/data/catalog.ts` — typed curated catalogue and startup validation
- `src/learningCurriculum.ts` — authored interactive curriculum and hard validation
- `src/LearningSystem.tsx` — learning hub, portable blocks and lesson runtime
- `src/data/repository.ts` — local persistence boundary
- `src/data/business.ts` — future-ready workspaces, events, offers, placements and approval fixtures
- `src/auth.tsx` — session context and Web Crypto password hashing
- `src/i18n.tsx` — locale registry and English, German, French and Spanish UI dictionaries
- `src/App.tsx` — routed product workflows and reusable interface components
- `src/BusinessPlatform.tsx` — host, winery, merchant, marketplace and studio experiences
- `src/CellarExperience.tsx` — bottle records, photo preparation, metadata and structured tasting notes
- `src/LearningDepth.tsx` — regional field guides, ampelography and lesson extensions
- `src/styles.css` — responsive editorial design system
- `src/enhancements.css` — focused late-stage component refinements
- `src/assets/ATTRIBUTIONS.md` — image provenance
- `db/schema.ts` / `db/migrations/` — Drizzle schema and reviewed SQL migrations
- `server/db.ts` / `api/` — pooled server database boundary and read-only functions
- `scripts/seed-database.ts` — validated Neon catalogue synchronisation

Curated source data is never mutated by personal cellar, rating, tasting or admin records. That separation makes a future hosted repository replacement straightforward.
