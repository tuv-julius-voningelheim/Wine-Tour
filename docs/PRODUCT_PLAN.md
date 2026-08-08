# Vine Atlas — product and implementation plan

## Outcome

Build a polished mobile-first wine discovery and tasting web app that makes the relationships between place, grape, producer, wine and personal memory feel tangible. The first deployment is a broad world atlas rather than a ten-region teaser: it covers every major established wine country, all 13 German quality-wine regions and important emerging origins. The deployable pilot will be fully interactive and persist user-created data in the current browser. Its architecture will isolate persistence behind a repository layer so a hosted database can replace browser storage later without redesigning the UI.

## Audience and jobs

- Curious beginners: learn without jargon and follow visual connections.
- Tasting guests: join by invite/QR/open session, follow the flight and capture notes.
- Enthusiasts: maintain a personal cellar and build a preference profile over time.
- Hosts/admins: create sessions, add/curate regions, producers and wines, and control contributor access.

## Experience architecture

### Primary mobile navigation

1. Home — personalised dashboard, next tasting, continue-learning card, cellar pulse.
2. Atlas — interactive world map plus list/filter mode.
3. Tastings — upcoming/open/past sessions and join flows.
4. Cellar — owned/wishlist/tasted wines and personal additions.
5. Profile — preferences, language, auth and role.

Desktop uses a persistent left rail and a contextual right-side inspector where helpful.

### Core routes

- `/` — dashboard and discovery entry point.
- `/atlas` — zoomable map with region and producer layers.
- `/regions/:slug` — terroir, subregions, grapes, producers and wines.
- `/grapes/:slug` — identity, aliases, structure/aromas, climate and related regions/wines.
- `/wineries/:slug` — story, region, practices, wines and community ratings.
- `/wines/:slug` — facts, grape blend, serving, related knowledge and notes.
- `/learn` and `/learn/:slug` — production, styles, tasting and service articles.
- `/tastings` and `/tastings/:id` — discovery, join and live tasting room.
- `/cellar` — personal collection, filters and add-custom-wine flow.
- `/admin` — role-gated content/tasting management.
- Auth is presented as a focused sheet/modal rather than a dead-end page.

## Memorable product motif

“Follow the thread of terroir”: every entity detail has a fine animated route line and connected chips. Tapping a grape on a region page moves naturally into the grape profile; the profile then shows the same region among its places. A wine detail visualises Place → Producer → Wine → Your memory.

The same principle applies to aromas: Aroma family → Aroma → Grape → Region → Producer → Wine → Tasting memory. Every terminal-looking detail must offer at least two meaningful next paths wherever related data exists.

## Visual direction

- Mood: editorial wine journal meets polished iOS travel product; quiet confidence, not faux-luxury.
- Palette: warm bone background, near-black ink, oxblood/wine red, moss and muted gold accents.
- Typography: high-contrast editorial serif for display moments paired with a clean grotesk for UI/data.
- Surfaces: translucent but warm cards, 18–28px radii, hairline borders, restrained shadows, tactile segmented controls.
- Photography: full-bleed landscape crops for regions, vertical bottle/architecture crops for producers, consistent 16:10 and 4:5 ratios.
- Accessibility: WCAG-aware contrast, 44px minimum touch targets, visible focus, reduced-motion support, never encode wine style by colour alone.

## Functional pilot scope

### Curated knowledge graph

- Seed at least 110 region/appellation records, 50 grapes, 100 producers, 60 representative wines and 8 knowledge modules. “Region” includes parent regions and meaningful subregions/appellations.
- Include all 13 German quality-wine regions and the coverage matrix in `docs/WORLD_ATLAS_SCOPE.md`.
- Bidirectional navigation among related records.
- Search across all entity types.
- Curated/community/personal provenance badges.

### Aroma explorer

- Interactive, touch-friendly radial aroma wheel with style lenses for white, rosé, red, sparkling, sweet and fortified wine.
- Inner ring: broad families such as fruit, floral, herbal, spice, earth/mineral, fermentation, oak and maturation.
- Outer ring: concrete aromas such as lemon, peach, cassis, violet, black pepper, wet stone, brioche, vanilla and leather.
- Selecting an aroma opens a learning sheet with sensory reference, common causes and linked grapes, regions, wine styles and seed wines.
- Grapes and wines store structured aroma links with intensity (`subtle`, `present`, `pronounced`) and development origin (`primary`, `fermentation`, `maturation`, `age`).
- The tasting note composer uses exactly the same aroma IDs, enabling later preference insights without fragile free-text parsing.
- Region pages show “signature aroma paths” derived from their typical grapes and styles, always framed as common expressions rather than guarantees.

### Atlas

- Leaflet/React Leaflet world map with zoom and pan.
- At world zoom show region clusters/cards; at closer zoom reveal producers.
- Layer filters for regions, producers, saved wines and tasting stops.
- Mobile bottom sheet and desktop side inspector.
- OpenStreetMap attribution.

### Auth and roles

- Username + password registration/login.
- Password is hashed in-browser; no plaintext storage.
- Seeded demo admin plus self-registered member role.
- Route/operation checks for `admin`, `host`, `contributor`, `member`.
- Explicit in-app note that this is local pilot authentication, not production security.

### Tastings

- Create private, invite-only or open tastings.
- Join by code/URL; render a QR code for the share URL.
- Ordered wine flight with contextual links to region, grape and producer.
- Host can grant contributor permission; contributors may add flight wines.
- Guided tasting note composer and private/public note switch.
- Persist participants and notes locally.

### Cellar and ratings

- Add database wine or custom wine.
- Custom entry may reference an existing region/producer or create a personal one.
- States: owned, wishlist, tasted, finished.
- Quantity, vintage, storage location, purchase metadata and personal rating.
- Ratings on wines, producers and regions; distinguish personal from demo community aggregate.

### Admin

- CRUD forms for regions, grapes, producers and wines.
- Relationship selectors and coordinates.
- Create/manage tastings and contributor permissions.
- Dashboard shows counts, pending community records and data provenance.

### Internationalisation

- Default English.
- English, German, French and Spanish UI dictionaries.
- One flat typed dictionary per language and a single locale registry so more languages are easy to add.
- Seed editorial content may fall back to English with a visible fallback label; core navigation and actions must be translated.

### Finished-copy rule

- Every visible string must be real product copy appropriate to its entity and context.
- Never render prompts, implementation notes, internal instructions, placeholders, “AI” language, seed/tier labels, Lorem ipsum or design annotations.
- Empty states must be helpful in-world product copy (for example, cellar or tasting guidance), not implementation commentary.
- Internal provenance metadata may say `Curated`, `Community` or `Personal`; it must never expose how copy was drafted.

## Data model

```text
User ──< Membership >── Tasting ──< TastingWine >── Wine
  │                         │                           │
  ├──< TastingNote >────────┘                           ├──< WineGrape >── Grape
  ├──< CellarItem >────────────────────────────────────┤
  └──< Rating >── (Wine | Winery | Region)             └── Winery ── Region

Region ──< Subregion (self/parent hierarchy)
Region ──< RegionGrape >── Grape
KnowledgeArticle ──< ArticleLink >── any curated entity
```

All mutable records include `id`, `createdAt`, `updatedAt`, `createdBy`, `provenance`, and optional `sourceUrl`/`reviewedAt`.

Additional aroma entities:

```text
AromaFamily ──< Aroma
Aroma ──< GrapeAroma >── Grape
Aroma ──< WineAroma >── Wine
Aroma ──< StyleAroma >── WineStyle
Aroma ──< TastingNoteAroma >── TastingNote
```

## Technical architecture

- Vite + React + TypeScript for a fast static Vercel deployment.
- React Router for routeable entity details and share/join URLs.
- Tailwind or a compact custom token system for consistent responsive UI.
- Repository/data-service boundary backed by localStorage for the pilot.
- React Leaflet + Leaflet for the interactive atlas.
- QR generation client-side.
- Seed data in typed modules, separate from UI copy and locale dictionaries.
- Vercel SPA rewrite to `index.html`.

## Verification gates

1. Typecheck and production build pass.
2. Key routes load directly and after refresh.
3. Register/login/logout and admin gating work.
4. Map zoom, filters and entity navigation work with touch and mouse.
5. Join tasting, add note, add cellar item and add custom wine persist after reload.
6. Locale switching updates all primary navigation and action copy.
7. Mobile 390×844 and desktop 1440×1000 visual review; no horizontal overflow.
8. Vercel deployment returns 200 for root and nested SPA routes.

## Production follow-up (not hidden by the pilot)

A true multi-user release requires a hosted relational database, server-side password hashing/session cookies, rate limiting, email/username recovery, durable invites, moderation and media storage. The pilot keeps these concerns replaceable but does not pretend browser-local data is collaborative across devices.
