# Vine Atlas

Vine Atlas is a mobile-first wine knowledge graph and tasting companion. It connects places, grapes, producers, wines, aromas, learning notes and personal memories in one routeable React application.

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
- `src/auth.tsx` — session context and Web Crypto password hashing
- `src/i18n.tsx` — locale registry and English, German, French and Spanish UI dictionaries
- `src/App.tsx` — routed product workflows and reusable interface components
- `src/styles.css` — responsive editorial design system
- `src/assets/ATTRIBUTIONS.md` — image provenance

Curated source data is never mutated by personal cellar, rating, tasting or admin records. That separation makes a future hosted repository replacement straightforward.
