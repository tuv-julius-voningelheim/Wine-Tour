# Vine Atlas

Vine Atlas is a mobile-first wine knowledge graph and tasting companion. It connects places, grapes, producers, wines, aromas, learning notes and personal memories in one routeable React application.

The current editorial catalogue contains 222 wine regions, 107 grape varieties, 203 producers, 409 wines, 77 aroma references and 25 long-form Academy lessons. Every lesson is at least 500 words in English, German, French and Spanish, carries technical sources and links back into the atlas.

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

The Vite development server prints the local URL, normally `http://localhost:5173`. Nested routes work on Vercel through the SPA rewrite in `vercel.json`.

## Local curator access

The application provisions its browser-local administrator from a deterministic SHA-256 digest constant. The administrator password is distributed separately and is never stored in source, documentation, UI copy, fixtures or build artifacts.

The pilot hashes entered passwords with Web Crypto before comparison and stores only hashes, salts, sessions, cellar data, ratings and notes in localStorage. It does not provide production-grade authentication or sync data between browsers. A hosted release needs server-side password hashing, secure sessions, recovery, rate limiting and a relational database.

## Architecture

- `src/data/catalog.ts` — typed curated catalogue and startup validation
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

Curated source data is never mutated by personal cellar, rating, tasting or admin records. That separation makes a future hosted repository replacement straightforward.
