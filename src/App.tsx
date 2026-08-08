import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleUserRound,
  Compass,
  Filter,
  Grape,
  Heart,
  Library,
  Languages,
  ListFilter,
  LockKeyhole,
  Map as MapIcon,
  Menu,
  Minus,
  NotebookPen,
  Plus,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wine,
  X,
} from "lucide-react";
import {
  aromas,
  articles,
  counts,
  grapes,
  producers,
  regions,
  slugify,
  wines,
} from "./data/catalog";
import { repository } from "./data/repository";
import { localeRegistry, useLocale, usePageCopy } from "./i18n";
import { useAuth } from "./auth";
import type { Aroma, CellarItem, TastingNote, WineStyle } from "./types";
import vineyardHero from "./assets/vineyard-terraces.png";
import tastingStill from "./assets/tasting-still-life.png";

const navItems = [
  { to: "/", key: "home" as const, icon: Compass, end: true },
  { to: "/atlas", key: "atlas" as const, icon: MapIcon },
  { to: "/tastings", key: "tastings" as const, icon: Users },
  { to: "/cellar", key: "cellar" as const, icon: Wine },
  { to: "/profile", key: "profile" as const, icon: CircleUserRound },
];

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <AppShell onSearch={() => setSearchOpen(true)}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/atlas" element={<AtlasPage />} />
        <Route path="/regions/:slug" element={<RegionPage />} />
        <Route path="/grapes/:slug" element={<GrapePage />} />
        <Route path="/wineries/:slug" element={<ProducerPage />} />
        <Route path="/wines/:slug" element={<WinePage />} />
        <Route path="/aromas" element={<AromaPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:slug" element={<ArticlePage />} />
        <Route path="/tastings" element={<TastingsPage />} />
        <Route path="/tastings/:id" element={<TastingRoom />} />
        <Route path="/cellar" element={<CellarPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </AppShell>
  );
}

function AppShell({
  children,
  onSearch,
}: {
  children: ReactNode;
  onSearch: () => void;
}) {
  const { t, locale, setLocale } = useLocale();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return (
    <div className="app-shell">
      <aside className="rail">
        <Link to="/" className="brand" aria-label="Vine Atlas home">
          <span className="brand-mark">
            <Grape size={22} />
          </span>
          <span>
            <b>Vine</b>
            <em>Atlas</em>
          </span>
        </Link>
        <nav aria-label="Primary">
          {navItems.map(({ to, key, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={20} />
              <span>{t(key)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="rail-lower">
          <NavLink to="/learn">
            <Library size={20} />
            <span>{t("learn")}</span>
          </NavLink>
          <NavLink to="/aromas">
            <Sparkles size={20} />
            <span>{t("aromas")}</span>
          </NavLink>
          <label className="rail-language">
            <Languages size={19} />
            <select
              aria-label={t("language")}
              value={locale}
              onChange={(event) => setLocale(event.target.value as typeof locale)}
            >
              {localeRegistry.map((item) => <option key={item.id} value={item.id}>{item.id.toUpperCase()}</option>)}
            </select>
          </label>
          <button className="rail-search" onClick={onSearch}>
            <Search size={20} />
            <span>{t("search")}</span>
          </button>
        </div>
        <p className="rail-signature">
          Follow the thread
          <br />
          of terroir
        </p>
      </aside>
      <header className="topbar">
        <Link to="/" className="mobile-brand">
          <Grape size={20} /> Vine Atlas
        </Link>
        <div className="topbar-actions">
          <label className="mobile-language">
            <Languages size={17} />
            <select
              aria-label={t("language")}
              value={locale}
              onChange={(event) => setLocale(event.target.value as typeof locale)}
            >
              {localeRegistry.map((item) => <option key={item.id} value={item.id}>{item.id.toUpperCase()}</option>)}
            </select>
          </label>
          <button className="icon-button search-trigger" onClick={onSearch} aria-label={t("search")}>
            <Search size={20} />
          </button>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <nav className="bottom-nav" aria-label="Primary">
        {navItems.map(({ to, key, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            <Icon size={21} />
            <span>{t(key)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function PageIntro({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="page-intro">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {children}
      </div>
      {action}
    </header>
  );
}
function ThreadLink({
  to,
  children,
  tone = "wine",
}: {
  to: string;
  children: ReactNode;
  tone?: "wine" | "moss" | "straw";
}) {
  return (
    <Link to={to} className={`thread-pill ${tone}`}>
      {children}
      <ChevronRight size={14} />
    </Link>
  );
}
function BackLink({ to, label = "Back" }: { to: string; label?: string }) {
  return (
    <Link className="back-link" to={to}>
      <ArrowLeft size={16} />
      {label}
    </Link>
  );
}
function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (value: number) => void;
}) {
  return (
    <div className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? "filled" : ""}
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          aria-label={`${star} stars`}
        >
          <Star size={17} fill={star <= value ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

function HomePage() {
  const { t } = useLocale();
  const copy = usePageCopy();
  const cellar = repository.cellar.all();
  const featured = regions.filter((r) => r.featured).slice(0, 4);
  return (
    <div className="page home-page">
      <section className="hero">
        <img
          src={vineyardHero}
          alt="Terraced vineyards following a river valley at first light"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="eyebrow light">{copy.homeEyebrow}</span>
          <h1>{copy.homeTitle}</h1>
          <p>{copy.homeDescription}</p>
          <Link to="/atlas" className="primary-button">
            {t("explore")} <ArrowRight size={17} />
          </Link>
        </div>
        <div className="hero-pulse">
          <strong>{counts.regions}</strong>
          <span>
            {copy.regionCount}
          </span>
        </div>
      </section>
      <section className="home-strip">
        <div>
          <span className="live-dot" />
          {copy.openTonight}
        </div>
        <p>
          {copy.guidedTable}
        </p>
        <Link to="/tastings/open-table">
          {copy.joinTime} <ArrowRight size={16} />
        </Link>
      </section>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{copy.beginPlace}</span>
            <h2>{copy.landscapes}</h2>
          </div>
          <Link to="/atlas">
            {copy.seeAll} {counts.regions} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="region-row">
          {featured.map((region, index) => (
            <Link
              to={`/regions/${region.id}`}
              className="region-card"
              key={region.id}
            >
              <div className={`region-image crop-${index}`}>
                <img src={vineyardHero} alt="Vineyard landscape" />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div>
                <small>{region.country}</small>
                <h3>{region.name}</h3>
                <p>{region.climate}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="split-feature">
        <div className="aroma-preview">
          <span className="eyebrow light">{copy.aromaExplorer}</span>
          <h2>{copy.trainMemory}</h2>
          <p>{copy.aromaDescription}</p>
          <MiniWheel />
          <Link to="/aromas" className="text-link light">
            {copy.turnWheel} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="learn-preview">
          <span className="eyebrow">{copy.quietLearn}</span>
          <h2>{copy.noticeMore}</h2>
          <p>{articles[1].summary}</p>
          <div className="learning-line">
            <span>01</span>
            <i />
            <span>04</span>
          </div>
          <Link to={`/learn/${articles[1].id}`} className="primary-button ink">
            {copy.readGuide}
          </Link>
        </div>
      </section>
      <section className="section-block cellar-snapshot">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{copy.collection}</span>
            <h2>
              {cellar.length
                ? `${cellar.reduce((sum, item) => sum + item.quantity, 0)} bottles, each with a story`
                : copy.cellarStart}
            </h2>
          </div>
          <Link to="/cellar">
            {copy.openCellar} <ArrowRight size={16} />
          </Link>
        </div>
        {cellar.length === 0 ? (
          <p className="soft-copy">
            {copy.cellarPrivate}
          </p>
        ) : (
          <div className="simple-list">
            {cellar.slice(0, 3).map((item) => (
              <div key={item.id}>
                <Wine size={18} />
                <span>
                  {wines.find((w) => w.id === item.wineId)?.name ||
                    item.customName}
                </span>
                <b>{item.quantity}</b>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MiniWheel() {
  return (
    <svg className="mini-wheel" viewBox="0 0 220 220" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path
          key={i}
          d={donutPath(110, 110, 38, 94, i * 45 + 2, (i + 1) * 45 - 2)}
          fill={
            [
              "#a7444d",
              "#cf826f",
              "#d7af68",
              "#7d8760",
              "#79948b",
              "#70586a",
              "#9b775d",
              "#d0a28f",
            ][i]
          }
        />
      ))}
      <circle cx="110" cy="110" r="28" fill="#241920" />
      <circle cx="110" cy="110" r="7" fill="#d1aa63" />
    </svg>
  );
}

function AtlasPage() {
  const { t } = useLocale();
  const copy = usePageCopy();
  const [selected, setSelected] = useState(
    regions.find((r) => r.id === "mosel") ?? regions[0],
  );
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState<"regions" | "producers">("regions");
  const [zoom, setZoom] = useState(3);
  const filtered = regions.filter((r) =>
    `${r.name} ${r.country}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="page atlas-page">
      <PageIntro eyebrow={copy.atlasEyebrow} title={copy.atlasTitle}>
        <p>{copy.atlasDescription}</p>
      </PageIntro>
      <div className="atlas-toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.atlasSearch}
          />
        </label>
        <div className="segmented">
          <button
            className={layer === "regions" ? "active" : ""}
            onClick={() => setLayer("regions")}
          >
            <MapIcon size={16} />
            {t("regions")}
          </button>
          <button
            className={layer === "producers" ? "active" : ""}
            onClick={() => setLayer("producers")}
          >
            <Grape size={16} />
            {t("producers")}
          </button>
        </div>
      </div>
      <section className="map-shell">
        <div className="atlas-map">
          <MapContainer
            center={[35, 5]}
            zoom={3}
            minZoom={2}
            scrollWheelZoom
            className="leaflet-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomWatcher onZoom={setZoom} />
            {layer === "regions" &&
              filtered.map((region) => (
                <CircleMarker
                  key={region.id}
                  center={[region.lat, region.lng]}
                  radius={selected.id === region.id ? 10 : 6}
                  pathOptions={{
                    color: selected.id === region.id ? "#5f172a" : "#f4efe6",
                    fillColor:
                      selected.id === region.id ? "#8f2d44" : "#755934",
                    fillOpacity: 0.94,
                    weight: 2,
                  }}
                  eventHandlers={{ click: () => setSelected(region) }}
                >
                  <Popup>
                    <strong>{region.name}</strong>
                    <br />
                    {region.country}
                  </Popup>
                </CircleMarker>
              ))}
            {layer === "producers" &&
              zoom >= 4 &&
              producers.map((producer) => (
                <CircleMarker
                  key={producer.id}
                  center={[producer.lat, producer.lng]}
                  radius={5}
                  pathOptions={{
                    color: "#f4efe6",
                    fillColor: "#3f5239",
                    fillOpacity: 0.95,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <Link to={`/wineries/${producer.id}`}>{producer.name}</Link>
                  </Popup>
                </CircleMarker>
              ))}
          </MapContainer>
        </div>
        <aside className="map-inspector">
          <span className="eyebrow">{copy.selectedPlace}</span>
          <h2>{selected.name}</h2>
          <p>{selected.summary}</p>
          <dl>
            <div>
              <dt>Country</dt>
              <dd>{selected.country}</dd>
            </div>
            <div>
              <dt>Climate</dt>
              <dd>{selected.climate}</dd>
            </div>
            <div>
              <dt>Ground</dt>
              <dd>{selected.soil}</dd>
            </div>
          </dl>
          <ThreadLink to={`/regions/${selected.id}`}>
            {copy.enterRegion}: {selected.name}
          </ThreadLink>
        </aside>
        <div className="mobile-map-sheet">
          <i />
          <span>{selected.country}</span>
          <h2>{selected.name}</h2>
          <p>{selected.climate}</p>
          <ThreadLink to={`/regions/${selected.id}`}>
            {copy.enterRegion}
          </ThreadLink>
        </div>
      </section>
      <section className="atlas-index">
        <div className="section-heading">
          <h2>{filtered.length} {copy.placesInView}</h2>
          <span>Zoom {zoom}</span>
        </div>
        <div className="compact-grid">
          {filtered.slice(0, 18).map((r) => (
            <Link to={`/regions/${r.id}`} key={r.id}>
              <small>{r.country}</small>
              <strong>{r.name}</strong>
              <ChevronRight size={16} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
function ZoomWatcher({ onZoom }: { onZoom: (zoom: number) => void }) {
  useMapEvents({ zoomend: (e) => onZoom(e.target.getZoom()) });
  return null;
}

function RegionPage() {
  const { slug } = useParams();
  const region = regions.find((r) => r.id === slug);
  const [rating, setRating] = useRating(`region:${slug}`);
  if (!region) return <NotFound />;
  const relatedGrapes = grapes.filter((g) => region.grapeIds.includes(g.id));
  const relatedProducers = producers.filter((p) => p.regionId === region.id);
  const relatedWines = wines.filter((w) => w.regionId === region.id);
  return (
    <article className="page detail-page">
      <BackLink to="/atlas" label="World atlas" />
      <section className="detail-hero">
        <img
          src={vineyardHero}
          alt={`Vineyard landscape introducing ${region.name}`}
        />
        <div className="detail-hero-copy">
          <span>{region.country}</span>
          <h1>{region.name}</h1>
          <p>{region.summary}</p>
        </div>
        <div className="place-index">
          <span>Place index</span>
          <strong>
            {String(regions.indexOf(region) + 1).padStart(3, "0")}
          </strong>
        </div>
      </section>
      <div className="thread-path">
        <span>Place</span>
        <i />
        <span>Grape</span>
        <i />
        <span>Producer</span>
        <i />
        <span>Wine</span>
        <i />
        <span>Memory</span>
      </div>
      <section className="detail-layout">
        <div>
          <span className="eyebrow">The shape of the place</span>
          <h2>Climate meets ground</h2>
          <p className="lead">
            {region.climate}. Beneath the vines, {region.soil.toLowerCase()}{" "}
            helps frame the region’s physical story.
          </p>
          <p>
            Wine from {region.name} is never a single fixed taste. Variety,
            aspect, vintage and the hand of the grower all shift the result;
            these links are invitations to compare.
          </p>
        </div>
        <dl className="facts">
          <div>
            <dt>Latitude</dt>
            <dd>
              {Math.abs(region.lat).toFixed(1)}°{region.lat >= 0 ? "N" : "S"}
            </dd>
          </div>
          <div>
            <dt>Typical ground</dt>
            <dd>{region.soil}</dd>
          </div>
          <div>
            <dt>Producers linked</dt>
            <dd>{relatedProducers.length}</dd>
          </div>
          <div>
            <dt>Community</dt>
            <dd>
              <Stars value={4} />
              <small>Community snapshot · 268 ratings</small>
            </dd>
          </div>
          <div>
            <dt>Your rating</dt>
            <dd>
              <Stars value={rating} onChange={setRating} />
            </dd>
          </div>
        </dl>
      </section>
      <section className="related-section">
        <span className="eyebrow">Signature threads</span>
        <h2>Start with the varieties</h2>
        <div className="thread-cloud">
          {relatedGrapes.map((g) => (
            <ThreadLink key={g.id} to={`/grapes/${g.id}`} tone="moss">
              {g.name}
            </ThreadLink>
          ))}
        </div>
      </section>
      {relatedProducers.length > 0 && (
        <section className="related-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">People of the place</span>
              <h2>Producers to know</h2>
            </div>
          </div>
          <div className="editorial-list">
            {relatedProducers.slice(0, 4).map((producer, index) => (
              <Link to={`/wineries/${producer.id}`} key={producer.id}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{producer.name}</h3>
                  <p>{producer.summary}</p>
                </div>
                <ArrowRight />
              </Link>
            ))}
          </div>
        </section>
      )}
      {relatedWines.length > 0 && (
        <section className="related-section">
          <span className="eyebrow">Continue into the glass</span>
          <h2>Representative wines</h2>
          <div className="wine-shelf">
            {relatedWines.slice(0, 4).map((w) => (
              <WineCard key={w.id} wine={w} />
            ))}
          </div>
        </section>
      )}
      <section className="source-note">
        <ShieldCheck size={18} />
        <p>
          <strong>Editorial provenance</strong>
          <br />
          Regional context is reviewed against authoritative trade and
          appellation sources. Coordinates are educational approximations.
        </p>
        <a href={region.sourceUrl} target="_blank" rel="noreferrer">
          View source
        </a>
      </section>
    </article>
  );
}

function GrapePage() {
  const { slug } = useParams();
  const grape = grapes.find((g) => g.id === slug);
  if (!grape) return <NotFound />;
  const relatedRegions = regions
    .filter((r) => r.grapeIds.includes(grape.id))
    .slice(0, 8);
  const grapeAromas = aromas.filter((a) => grape.aromaIds.includes(a.id));
  const relatedWines = wines
    .filter((w) => w.grapeIds.includes(grape.id))
    .slice(0, 4);
  return (
    <article className="page detail-page grape-page">
      <BackLink to="/atlas" label="Atlas" />
      <PageIntro
        eyebrow={
          grape.color === "red"
            ? "Dark-skinned variety"
            : "Light-skinned variety"
        }
        title={grape.name}
      >
        {grape.aliases.length > 0 && (
          <p>Also known as {grape.aliases.join(" and ")}</p>
        )}
      </PageIntro>
      <section className="grape-intro">
        <div className="grape-orbit">
          <span>{grape.name.charAt(0)}</span>
          {grapeAromas.slice(0, 6).map((a, i) => (
            <i key={a.id} style={{ "--i": i } as React.CSSProperties}>
              {a.name}
            </i>
          ))}
        </div>
        <div>
          <p className="lead">{grape.summary}</p>
          <StructureScale label="Acidity" value={grape.acidity} />
          <StructureScale label="Tannin" value={grape.tannin} />
          <StructureScale label="Body" value={grape.body} />
        </div>
      </section>
      <section className="related-section">
        <span className="eyebrow">Aroma constellation</span>
        <h2>Common points of reference</h2>
        <p>
          These are useful prompts, never promises. Climate and making can move
          the glass in another direction.
        </p>
        <div className="aroma-tiles">
          {grapeAromas.map((a) => (
            <Link to={`/aromas?selected=${a.id}`} key={a.id}>
              <small>{a.family}</small>
              <strong>{a.name}</strong>
              <span>{a.reference}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="related-section">
        <span className="eyebrow">Classic places</span>
        <h2>See the grape through geography</h2>
        <div className="thread-cloud">
          {relatedRegions.map((r) => (
              <ThreadLink key={r.id} to={`/regions/${r.id}`} tone="moss">
                {r.name}
              </ThreadLink>
            ))}
        </div>
      </section>
      {relatedWines.length > 0 && (
        <section className="related-section">
          <h2>Continue into a bottle</h2>
          <div className="wine-shelf">
            {relatedWines.map((w) => (
              <WineCard key={w.id} wine={w} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
function StructureScale({ label, value }: { label: string; value: number }) {
  return (
    <div className="structure-scale">
      <span>{label}</span>
      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <i className={n <= value ? "on" : ""} key={n} />
        ))}
      </div>
      <b>{["", "Light", "Gentle", "Balanced", "Firm", "Pronounced"][value]}</b>
    </div>
  );
}

function ProducerPage() {
  const { slug } = useParams();
  const producer = producers.find((p) => p.id === slug);
  if (!producer) return <NotFound />;
  const region = regions.find((r) => r.id === producer.regionId)!;
  const producerWines = wines.filter((w) => w.producerId === producer.id);
  const [rating, setRating] = useRating(`producer:${slug}`);
  return (
    <article className="page detail-page">
      <BackLink to={`/regions/${region.id}`} label={region.name} />
      <section className="producer-hero">
        <div>
          <span className="eyebrow">Producer · {region.country}</span>
          <h1>{producer.name}</h1>
          <p>{producer.summary}</p>
          <ThreadLink to={`/regions/${region.id}`} tone="moss">
            {region.name}
          </ThreadLink>
        </div>
        <img
          src={tastingStill}
          alt="A quiet cellar tasting table with an unlabeled bottle and glasses"
        />
      </section>
      <section className="detail-layout">
        <div>
          <span className="eyebrow">A point of view</span>
          <h2>Tradition, read in the present tense</h2>
          <p className="lead">
            The most useful way to understand {producer.name} is alongside the
            place: weather, soils, varieties and choices in the cellar.
          </p>
          <p>
            This profile is an educational starting point. Follow the wines,
            then return to {region.name} to compare neighbouring voices.
          </p>
        </div>
        <dl className="facts">
          <div>
            <dt>Home</dt>
            <dd>
              {region.name}, {region.country}
            </dd>
          </div>
          <div>
            <dt>Community</dt>
            <dd>
              <Stars value={Math.round(producer.communityRating)} />
              <small>Community snapshot · {producer.communityRating}</small>
            </dd>
          </div>
          <div>
            <dt>Your rating</dt>
            <dd>
              <Stars value={rating} onChange={setRating} />
            </dd>
          </div>
        </dl>
      </section>
      <section className="related-section">
        <span className="eyebrow">From this cellar</span>
        <h2>
          {producerWines.length
            ? "Wines in the atlas"
            : "The regional thread continues"}
        </h2>
        {producerWines.length ? (
          <div className="wine-shelf">
            {producerWines.map((w) => (
              <WineCard key={w.id} wine={w} />
            ))}
          </div>
        ) : (
          <p className="soft-copy">
            This producer’s individual wines are still being expanded. The
            region profile offers the clearest next path.
          </p>
        )}
      </section>
    </article>
  );
}

function WineCard({ wine }: { wine: (typeof wines)[number] }) {
  const producer = producers.find((p) => p.id === wine.producerId);
  return (
    <Link to={`/wines/${wine.id}`} className={`wine-card style-${wine.style}`}>
      <div className="bottle-shape">
        <i />
      </div>
      <small>
        {wine.vintage ?? "NV"} · {wine.style}
      </small>
      <h3>{wine.name}</h3>
      <p>{producer?.name}</p>
      <span>
        Open wine <ArrowRight size={14} />
      </span>
    </Link>
  );
}

function WinePage() {
  const { slug } = useParams();
  const wine = wines.find((w) => w.id === slug);
  if (!wine) return <NotFound />;
  const wineId = wine.id;
  const producer = producers.find((p) => p.id === wine.producerId)!;
  const region = regions.find((r) => r.id === wine.regionId)!;
  const wineGrapes = grapes.filter((g) => wine.grapeIds.includes(g.id));
  const wineAromas = aromas.filter((a) => wine.aromaIds.includes(a.id));
  const [added, setAdded] = useState(() =>
    repository.cellar.all().some((i) => i.wineId === wineId),
  );
  const [rating, setRating] = useRating(`wine:${slug}`);
  function add() {
    const items = repository.cellar.all();
    if (!items.some((i) => i.wineId === wineId)) {
      items.push({
        id: crypto.randomUUID(),
        wineId,
        state: "owned",
        quantity: 1,
        location: "Home cellar",
      });
      repository.cellar.save(items);
    }
    setAdded(true);
  }
  return (
    <article className="page detail-page wine-page">
      <BackLink to={`/wineries/${producer.id}`} label={producer.name} />
      <div className="entity-route">
        <Link to={`/regions/${region.id}`}>{region.name}</Link>
        <i />
        <Link to={`/wineries/${producer.id}`}>{producer.name}</Link>
        <i />
        <span>{wine.name}</span>
      </div>
      <section className="wine-hero">
        <div className={`feature-bottle style-${wine.style}`}>
          <div>
            <span>
              VINE
              <br />
              ATLAS
            </span>
            <b>{wine.name}</b>
            <small>{wine.vintage ?? "Non-vintage"}</small>
          </div>
        </div>
        <div>
          <span className="eyebrow">
            {wine.style} wine · {region.country}
          </span>
          <h1>{wine.name}</h1>
          <p className="producer-name">{producer.name}</p>
          <p className="lead">{wine.summary}</p>
          <div className="wine-actions">
            <button className="primary-button" onClick={add}>
              {added ? (
                <>
                  <Check size={17} />
                  In your cellar
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Add to cellar
                </>
              )}
            </button>
            <button className="secondary-button">
              <Share2 size={17} />
              Share
            </button>
          </div>
        </div>
      </section>
      <section className="detail-layout">
        <div>
          <span className="eyebrow">Blend & character</span>
          <h2>A structured view</h2>
          <div className="thread-cloud">
            {wineGrapes.map((g) => (
              <ThreadLink key={g.id} to={`/grapes/${g.id}`} tone="moss">
                {g.name}
              </ThreadLink>
            ))}
          </div>
          <p className="lead">{wine.serving}</p>
        </div>
        <dl className="facts">
          <div>
            <dt>Vintage</dt>
            <dd>{wine.vintage ?? "Non-vintage blend"}</dd>
          </div>
          <div>
            <dt>Style</dt>
            <dd>{wine.style.charAt(0).toUpperCase() + wine.style.slice(1)}</dd>
          </div>
          <div>
            <dt>Community</dt>
            <dd>
              <Stars value={Math.round(wine.communityRating)} />
              <small>Community snapshot · {wine.communityRating}</small>
            </dd>
          </div>
          <div>
            <dt>Your rating</dt>
            <dd>
              <Stars value={rating} onChange={setRating} />
            </dd>
          </div>
        </dl>
      </section>
      <section className="related-section">
        <span className="eyebrow">Aroma profile</span>
        <h2>Prompts for this style</h2>
        <div className="aroma-profile">
          {wineAromas.map((a, index) => (
            <Link to={`/aromas?selected=${a.id}`} key={a.id}>
              <div>
                <span>{a.family}</span>
                <strong>{a.name}</strong>
              </div>
              <i style={{ width: `${55 + (index % 3) * 18}%` }} />
              <small>
                {index % 3 === 0
                  ? "Subtle"
                  : index % 3 === 1
                    ? "Present"
                    : "Pronounced"}{" "}
                · {a.origin.split(".")[0]}
              </small>
            </Link>
          ))}
        </div>
      </section>
      <section className="note-callout">
        <div>
          <NotebookPen />
          <span>Make it yours</span>
          <h2>What will you remember?</h2>
          <p>
            Use the same aroma language across every tasting, then add the words
            only you would choose.
          </p>
        </div>
        <Link to="/tastings/open-table" className="primary-button ink">
          Open tasting notes
        </Link>
      </section>
    </article>
  );
}

const families = [
  "Citrus",
  "Orchard",
  "Stone fruit",
  "Tropical",
  "Red fruit",
  "Black fruit",
  "Floral",
  "Herbal",
  "Spice",
  "Earth & mineral",
  "Fermentation",
  "Oak",
  "Age",
  "Concentration",
];
function AromaPage() {
  const copy = usePageCopy();
  const query = new URLSearchParams(useLocation().search);
  const initial = query.get("selected");
  const initialAroma = aromas.find((a) => a.id === initial) ?? aromas[0];
  const initialStyle = initialAroma.styles[0] ?? "white";
  const [style, setStyle] = useState<WineStyle>(initialStyle);
  const [family, setFamily] = useState(initialAroma.family);
  const [selected, setSelected] = useState<Aroma>(initialAroma);
  const visibleFamilies = families.filter((f) =>
    aromas.some((a) => a.family === f && a.styles.includes(style)),
  );
  const visibleAromas = aromas.filter(
    (a) => a.family === family && a.styles.includes(style),
  );
  function selectStyle(nextStyle: WineStyle) {
    const nextFamily =
      families.find((candidate) =>
        aromas.some(
          (a) => a.family === candidate && a.styles.includes(nextStyle),
        ),
      ) ?? families[0];
    const nextAroma = aromas.find(
      (a) => a.family === nextFamily && a.styles.includes(nextStyle),
    );
    setStyle(nextStyle);
    setFamily(nextFamily);
    if (nextAroma) setSelected(nextAroma);
  }
  return (
    <div className="page aroma-page">
      <PageIntro eyebrow={copy.aromaEyebrow} title={copy.aromaTitle}>
        <p>{copy.aromaIntro}</p>
      </PageIntro>
      <div className="lens-tabs" aria-label="Wine style lens">
        {(
          [
            "white",
            "rose",
            "red",
            "sparkling",
            "sweet",
            "fortified",
          ] as WineStyle[]
        ).map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={style === item}
            data-style={item}
            className={style === item ? "active" : ""}
            onClick={() => selectStyle(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <section className="wheel-layout">
        <div className="wheel-wrap">
          <svg
            viewBox="0 0 520 520"
            className="aroma-wheel"
            role="group"
            aria-label={`${style} aroma family wheel`}
          >
            {visibleFamilies.map((item, index) => {
              const angle = 360 / visibleFamilies.length;
              return (
                <path
                  key={item}
                  role="button"
                  tabIndex={0}
                  aria-label={item}
                  className={family === item ? "selected" : ""}
                  d={donutPath(
                    260,
                    260,
                    104,
                    224,
                    index * angle + 1,
                    (index + 1) * angle - 1,
                  )}
                  onClick={() => {
                    setFamily(item);
                    const first = aromas.find(
                      (a) => a.family === item && a.styles.includes(style),
                    );
                    if (first) setSelected(first);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setFamily(item);
                      const first = aromas.find(
                        (a) => a.family === item && a.styles.includes(style),
                      );
                      if (first) setSelected(first);
                    }
                  }}
                />
              );
            })}
            <circle cx="260" cy="260" r="82" />
            <text x="260" y="248" data-testid="active-aroma-style">
              {style.toUpperCase()}
            </text>
            <text x="260" y="277">
              AROMA LENS
            </text>
            {visibleFamilies.map((item, index) => {
              const angle = (index + 0.5) * (360 / visibleFamilies.length) - 90;
              const point = polar(260, 260, 165, angle);
              return (
                <text
                  key={item}
                  x={point.x}
                  y={point.y}
                  className="wheel-label"
                >
                  {item.split(" ")[0]}
                </text>
              );
            })}
          </svg>
        </div>
        <aside className="aroma-detail">
          <span className="eyebrow">{selected.family}</span>
          <h2>{selected.name}</h2>
          <p className="sensory-reference">“{selected.reference}”</p>
          <p>{selected.origin}</p>
          <div className="aroma-options">
            {visibleAromas.map((a) => (
              <button
                className={selected.id === a.id ? "active" : ""}
                onClick={() => setSelected(a)}
                key={a.id}
              >
                {a.name}
              </button>
            ))}
          </div>
          <h3>{copy.followNote}</h3>
          <div className="thread-cloud">
            {grapes
              .filter((g) => selected.grapeIds.includes(g.id))
              .slice(0, 4)
              .map((g) => (
                <ThreadLink key={g.id} to={`/grapes/${g.id}`} tone="moss">
                  {g.name}
                </ThreadLink>
              ))}
            {wines
              .filter((w) => w.aromaIds.includes(selected.id))
              .slice(0, 2)
              .map((w) => (
                <ThreadLink key={w.id} to={`/wines/${w.id}`}>
                  {w.name}
                </ThreadLink>
              ))}
          </div>
        </aside>
      </section>
      <section className="source-note">
        <BookOpen />
        <p>
          <strong>{copy.caveat}</strong>
          <br />
          {copy.caveatBody}
        </p>
      </section>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function donutPath(
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  start: number,
  end: number,
) {
  const a = polar(cx, cy, outer, start - 90),
    b = polar(cx, cy, outer, end - 90),
    c = polar(cx, cy, inner, end - 90),
    d = polar(cx, cy, inner, start - 90),
    large = end - start > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${outer} ${outer} 0 ${large} 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${inner} ${inner} 0 ${large} 0 ${d.x} ${d.y} Z`;
}

function LearnPage() {
  const copy = usePageCopy();
  return (
    <div className="page learn-page">
      <PageIntro eyebrow={copy.learnEyebrow} title={copy.learnTitle}>
        <p>{copy.learnIntro}</p>
      </PageIntro>
      <section className="lead-article">
        <img src={tastingStill} alt="Wine tasting table in a quiet cellar" />
        <div>
          <span>
            {articles[0].eyebrow} · {articles[0].minutes} min
          </span>
          <h2>{articles[0].title}</h2>
          <p>{articles[0].summary}</p>
          <Link to={`/learn/${articles[0].id}`} className="primary-button ink">
            {copy.readStory}
          </Link>
        </div>
      </section>
      <div className="article-index">
        {articles.slice(1).map((article, index) => (
          <Link to={`/learn/${article.id}`} key={article.id}>
            <span>{String(index + 2).padStart(2, "0")}</span>
            <div>
              <small>
                {article.eyebrow} · {article.minutes} min
              </small>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
            </div>
            <ArrowRight />
          </Link>
        ))}
      </div>
    </div>
  );
}
function ArticlePage() {
  const copy = usePageCopy();
  const { slug } = useParams();
  const article = articles.find((a) => a.id === slug);
  if (!article) return <NotFound />;
  return (
    <article className="page reading-page">
      <BackLink to="/learn" label={copy.learnEyebrow} />
      <header>
        <span className="eyebrow">
          {article.eyebrow} · {article.minutes} minute read
        </span>
        <h1>{article.title}</h1>
        <p>{article.summary}</p>
      </header>
      <div className="article-body">
        {article.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <div className="pullquote">
          Wine becomes easier to understand when every answer opens the next
          good question.
        </div>
        <h2>{copy.takeTable}</h2>
        <p>
          Return to one wine and notice a single element with intention. Name
          what you perceive, compare it with a familiar reference, and leave
          room for the glass to change.
        </p>
      </div>
      <div className="next-read">
        <span>{copy.continueLearning}</span>
        <Link
          to={`/learn/${articles[(articles.indexOf(article) + 1) % articles.length].id}`}
        >
          {articles[(articles.indexOf(article) + 1) % articles.length].title}
          <ArrowRight />
        </Link>
      </div>
    </article>
  );
}

const tastingFlight = wines.slice(12, 17);
function TastingsPage() {
  const { t } = useLocale();
  const copy = usePageCopy();
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  return (
    <div className="page tastings-page">
      <PageIntro
        eyebrow={copy.tastingsEyebrow}
        title={copy.tastingsTitle}
      >
        <p>{copy.tastingsIntro}</p>
      </PageIntro>
      <section className="tasting-feature">
        <img
          src={tastingStill}
          alt="Glasses and wine ready for a shared tasting"
        />
        <div>
          <span className="status-chip">
            <i />
            {copy.openTasting}
          </span>
          <h2>{copy.tableTitle}</h2>
          <p>{copy.tableIntro}</p>
          <dl>
            <div>
              <dt>{copy.tonight}</dt>
              <dd>19:30 · 75 min</dd>
            </div>
            <div>
              <dt>{copy.host}</dt>
              <dd>Mara Chen</dd>
            </div>
            <div>
              <dt>{copy.seats}</dt>
              <dd>8 of 12 joined</dd>
            </div>
          </dl>
          <Link to="/tastings/open-table" className="primary-button">
            {copy.joinTable}
          </Link>
        </div>
      </section>
      <section className="join-panel">
        <div>
          <span className="eyebrow">{copy.invitation}</span>
          <h2>{copy.joinCode}</h2>
          <p>{copy.codeHelp}</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) navigate(`/tastings/${code.toLowerCase()}`);
          }}
        >
          <input
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="CELLAR"
            aria-label="Tasting code"
          />
          <button className="primary-button" disabled={code.length < 4}>
            {t("join")}
          </button>
        </form>
      </section>
      <section className="related-section">
        <span className="eyebrow">{copy.comingUp}</span>
        <div className="session-list">
          <div>
            <b>14</b>
            <span>SEP</span>
            <div>
              <h3>Riesling: latitude and light</h3>
              <p>Invite only · Hosted by Jo Becker</p>
            </div>
            <LockKeyhole />
          </div>
          <div>
            <b>27</b>
            <span>SEP</span>
            <div>
              <h3>Mediterranean reds</h3>
              <p>Open table · 16 seats</p>
            </div>
            <Users />
          </div>
        </div>
      </section>
    </div>
  );
}

function TastingRoom() {
  const { id = "open-table" } = useParams();
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState(0);
  const [selectedAromas, setSelectedAromas] = useState<string[]>([]);
  const [fields, setFields] = useState({
    appearance: "Clear ruby with a bright rim",
    palate: "",
    reflection: "",
  });
  const [saved, setSaved] = useState(false);
  const wine = tastingFlight[current];
  const shareUrl = `${window.location.origin}/tastings/${id}`;
  function saveNote() {
    const next: TastingNote = {
      id: crypto.randomUUID(),
      tastingId: id,
      wineId: wine.id,
      appearance: fields.appearance,
      aromaIds: selectedAromas,
      palate: fields.palate,
      reflection: fields.reflection,
      rating: 4,
      visibility: "private",
      createdAt: new Date().toISOString(),
    };
    repository.notes.save([...repository.notes.all(), next]);
    setSaved(true);
  }
  return (
    <div className="tasting-room">
      <header className="room-header">
        <Link to="/tastings">
          <X />
        </Link>
        <div>
          <small>
            Live tasting · Wine {current + 1} of {tastingFlight.length}
          </small>
          <strong>New world, old vines</strong>
        </div>
        <button onClick={() => navigator.clipboard?.writeText(shareUrl)}>
          <Share2 />
        </button>
      </header>
      <div className="flight-progress">
        {tastingFlight.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(i);
              setSaved(false);
            }}
            className={i === current ? "active" : i < current ? "done" : ""}
          >
            <span>{i + 1}</span>
          </button>
        ))}
      </div>
      <main>
        <section className="current-wine">
          <div className={`room-bottle style-${wine.style}`} />
          <div>
            <span>{regions.find((r) => r.id === wine.regionId)?.name}</span>
            <h1>{wine.name}</h1>
            <p>
              {producers.find((p) => p.id === wine.producerId)?.name} ·{" "}
              {wine.vintage}
            </p>
            <div className="thread-cloud">
              {grapes
                .filter((g) => wine.grapeIds.includes(g.id))
                .map((g) => (
                  <ThreadLink to={`/grapes/${g.id}`} key={g.id} tone="moss">
                    {g.name}
                  </ThreadLink>
                ))}
            </div>
          </div>
        </section>
        <div className="note-steps">
          {["Look", "Smell", "Taste", "Reflect"].map((name, i) => (
            <button
              onClick={() => setStep(i)}
              className={step === i ? "active" : ""}
              key={name}
            >
              <span>{i + 1}</span>
              {name}
            </button>
          ))}
        </div>
        <section className="note-composer">
          {step === 0 && (
            <>
              <span className="eyebrow">Step one · Look</span>
              <h2>What does the glass show?</h2>
              <textarea
                value={fields.appearance}
                onChange={(e) =>
                  setFields({ ...fields, appearance: e.target.value })
                }
              />
            </>
          )}
          {step === 1 && (
            <>
              <span className="eyebrow">Step two · Smell</span>
              <h2>Choose the closest references</h2>
              <p>
                There is no correct number. Start broad, then become more
                precise.
              </p>
              <div className="note-aromas">
                {aromas
                  .filter((a) => wine.aromaIds.includes(a.id))
                  .map((a) => (
                    <button
                      className={selectedAromas.includes(a.id) ? "active" : ""}
                      onClick={() =>
                        setSelectedAromas((values) =>
                          values.includes(a.id)
                            ? values.filter((id) => id !== a.id)
                            : [...values, a.id],
                        )
                      }
                      key={a.id}
                    >
                      {selectedAromas.includes(a.id) && <Check />}
                      {a.name}
                    </button>
                  ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <span className="eyebrow">Step three · Taste</span>
              <h2>How is the wine built?</h2>
              <textarea
                placeholder="Acidity, tannin, warmth, body, flavour and finish…"
                value={fields.palate}
                onChange={(e) =>
                  setFields({ ...fields, palate: e.target.value })
                }
              />
            </>
          )}
          {step === 3 && (
            <>
              <span className="eyebrow">Step four · Reflect</span>
              <h2>What will you remember?</h2>
              <textarea
                placeholder="Balance, complexity, readiness, food and your own enjoyment…"
                value={fields.reflection}
                onChange={(e) =>
                  setFields({ ...fields, reflection: e.target.value })
                }
              />
            </>
          )}
          <div className="composer-actions">
            <small>
              <LockKeyhole />
              Private to you
            </small>
            {step < 3 ? (
              <button
                className="primary-button"
                onClick={() => setStep(step + 1)}
              >
                Next step <ArrowRight />
              </button>
            ) : (
              <button className="primary-button" onClick={saveNote}>
                {saved ? (
                  <>
                    <Check />
                    Note saved
                  </>
                ) : (
                  <>
                    Save note <NotebookPen />
                  </>
                )}
              </button>
            )}
          </div>
        </section>
      </main>
      <aside className="room-share">
        <QRCodeSVG
          value={shareUrl}
          size={110}
          bgColor="#f4efe6"
          fgColor="#241920"
        />
        <h3>Bring someone to the table</h3>
        <p>
          Share this QR or invite link. Browser-local notes are private by
          default.
        </p>
      </aside>
    </div>
  );
}

function CellarPage() {
  const { t } = useLocale();
  const copy = usePageCopy();
  const [items, setItems] = useState<CellarItem[]>(() =>
    repository.cellar.all(),
  );
  const [filter, setFilter] = useState<"all" | CellarItem["state"]>("all");
  const [open, setOpen] = useState(false);
  const filtered =
    filter === "all" ? items : items.filter((i) => i.state === filter);
  function persist(next: CellarItem[]) {
    setItems(next);
    repository.cellar.save(next);
  }
  return (
    <div className="page cellar-page">
      <PageIntro
        eyebrow={copy.cellarEyebrow}
        title={copy.cellarTitle}
        action={
          <button className="primary-button" onClick={() => setOpen(true)}>
            <Plus />
            {copy.addWine}
          </button>
        }
      >
        <p>{copy.cellarIntro}</p>
      </PageIntro>
      <div className="cellar-summary">
        <div>
          <strong>{items.reduce((sum, item) => sum + item.quantity, 0)}</strong>
          <span>{copy.bottles}</span>
        </div>
        <div>
          <strong>{items.filter((i) => i.state === "wishlist").length}</strong>
          <span>{copy.wishList}</span>
        </div>
        <div>
          <strong>{items.filter((i) => i.rating).length}</strong>
          <span>{copy.personalRatings}</span>
        </div>
      </div>
      <div className="filter-row">
        <ListFilter />
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          {t("all")}
        </button>
        {(["owned", "wishlist", "tasted", "finished"] as const).map((state) => (
          <button
            className={filter === state ? "active" : ""}
            onClick={() => setFilter(state)}
            key={state}
          >
            {t(state)}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="cellar-grid">
          {filtered.map((item) => {
            const wine = wines.find((w) => w.id === item.wineId);
            return (
              <article key={item.id}>
                <div
                  className={`cellar-bottle style-${wine?.style ?? "red"}`}
                />
                <div>
                  <small>
                    {item.state} · {item.vintage || wine?.vintage || "NV"}
                  </small>
                  <h3>{wine?.name || item.customName}</h3>
                  <p>
                    {wine
                      ? producers.find((p) => p.id === wine.producerId)?.name
                      : item.producer}
                  </p>
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        persist(
                          items.map((i) =>
                            i.id === item.id
                              ? { ...i, quantity: Math.max(0, i.quantity - 1) }
                              : i,
                          ),
                        )
                      }
                    >
                      <Minus />
                    </button>
                    <span>
                      {item.quantity} bottle{item.quantity === 1 ? "" : "s"}
                    </span>
                    <button
                      onClick={() =>
                        persist(
                          items.map((i) =>
                            i.id === item.id
                              ? { ...i, quantity: i.quantity + 1 }
                              : i,
                          ),
                        )
                      }
                    >
                      <Plus />
                    </button>
                  </div>
                  <small>{item.location}</small>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Wine />
          <h2>
            {items.length
              ? copy.noFilter
              : copy.firstBottle}
          </h2>
          <p>
            {items.length
              ? copy.chooseFilter
              : copy.emptyCellar}
          </p>
          <button className="primary-button ink" onClick={() => setOpen(true)}>
            {copy.addWine}
          </button>
        </div>
      )}
      {open && (
        <CellarForm
          onClose={() => setOpen(false)}
          onSave={(item) => {
            persist([...items, item]);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
function CellarForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (item: CellarItem) => void;
}) {
  const [catalogue, setCatalogue] = useState(true);
  const [wineId, setWineId] = useState(wines[0].id);
  const [custom, setCustom] = useState({ name: "", producer: "", region: "" });
  const [state, setState] = useState<CellarItem["state"]>("owned");
  function submit(e: FormEvent) {
    e.preventDefault();
    onSave({
      id: crypto.randomUUID(),
      ...(catalogue
        ? { wineId }
        : {
            customName: custom.name,
            producer: custom.producer,
            region: custom.region,
          }),
      state,
      quantity: 1,
      location: "Home cellar",
    });
  }
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <form className="sheet" onSubmit={submit}>
        <button type="button" className="sheet-close" onClick={onClose}>
          <X />
        </button>
        <span className="eyebrow">Personal collection</span>
        <h2>Add a wine</h2>
        <div className="segmented">
          <button
            type="button"
            className={catalogue ? "active" : ""}
            onClick={() => setCatalogue(true)}
          >
            From atlas
          </button>
          <button
            type="button"
            className={!catalogue ? "active" : ""}
            onClick={() => setCatalogue(false)}
          >
            Personal entry
          </button>
        </div>
        {catalogue ? (
          <label>
            Wine
            <select value={wineId} onChange={(e) => setWineId(e.target.value)}>
              {wines.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} · {w.vintage ?? "NV"}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <>
            <label>
              Wine name
              <input
                required
                value={custom.name}
                onChange={(e) => setCustom({ ...custom, name: e.target.value })}
              />
            </label>
            <label>
              Producer
              <input
                value={custom.producer}
                onChange={(e) =>
                  setCustom({ ...custom, producer: e.target.value })
                }
              />
            </label>
            <label>
              Region
              <input
                value={custom.region}
                onChange={(e) =>
                  setCustom({ ...custom, region: e.target.value })
                }
              />
            </label>
          </>
        )}
        <label>
          Collection
          <select
            value={state}
            onChange={(e) => setState(e.target.value as CellarItem["state"])}
          >
            <option value="owned">Owned</option>
            <option value="wishlist">Wish list</option>
            <option value="tasted">Tasted</option>
            <option value="finished">Finished</option>
          </select>
        </label>
        <button className="primary-button">Save to cellar</button>
      </form>
    </div>
  );
}

function AdminPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const copy = usePageCopy();
  const [type, setType] = useState("Region");
  const [name, setName] = useState("");
  const [items, setItems] = useState(() => repository.additions.all());
  if (user?.role !== "admin")
    return (
      <div className="page guarded">
        <ShieldCheck />
        <h1>Curators only</h1>
        <p>
          The management workspace is available to administrators. Sign in with
          your curator account from Profile to continue.
        </p>
        <Link to="/profile" className="primary-button ink">
          Open profile
        </Link>
      </div>
    );
  function add(e: FormEvent) {
    e.preventDefault();
    const next = [
      ...items,
      {
        id: crypto.randomUUID(),
        type,
        name,
        provenance: "Personal",
        createdAt: new Date().toISOString(),
      },
    ];
    repository.additions.save(next);
    setItems(next);
    setName("");
  }
  return (
    <div className="page admin-page">
      <PageIntro eyebrow={copy.curatorWorkspace} title={copy.curatorWorkspace}>
        <p>{copy.curatorBody}</p>
      </PageIntro>
      <section className="admin-counts">
        <div>
          <MapIcon />
          <strong>{counts.regions}</strong>
          <span>{t("regions")}</span>
        </div>
        <div>
          <Grape />
          <strong>{counts.grapes}</strong>
          <span>{t("grapes")}</span>
        </div>
        <div>
          <Users />
          <strong>{counts.producers}</strong>
          <span>{t("producers")}</span>
        </div>
        <div>
          <Wine />
          <strong>{counts.wines}</strong>
          <span>{t("wines")}</span>
        </div>
      </section>
      <section className="admin-layout">
        <div className="management-list">
          <div className="section-heading">
            <h2>Recent catalogue records</h2>
            <button>
              <Filter />
              Filter
            </button>
          </div>
          {regions.slice(0, 6).map((region) => (
            <div key={region.id}>
              <span className="record-icon">
                <MapIcon />
              </span>
              <div>
                <strong>{region.name}</strong>
                <small>{region.country} · Curated · Reviewed 8 Aug 2026</small>
              </div>
              <button>
                <Settings />
              </button>
            </div>
          ))}
        </div>
        <form className="admin-form" onSubmit={add}>
          <span className="eyebrow">New record</span>
          <h2>Add to the atlas</h2>
          <label>
            Record type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>Region</option>
              <option>Grape</option>
              <option>Producer</option>
              <option>Wine</option>
              <option>Tasting</option>
            </select>
          </label>
          <label>
            Published name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="The name readers will see"
            />
          </label>
          <label>
            Connect to region
            <select>
              <option>Select a region</option>
              {regions.slice(0, 20).map((r) => (
                <option key={r.id}>{r.name}</option>
              ))}
            </select>
          </label>
          <p>
            New records remain personal to this browser until reviewed and moved
            to a hosted catalogue.
          </p>
          <button className="primary-button">{t("create")}</button>
        </form>
      </section>
      {items.length > 0 && (
        <section className="related-section">
          <h2>Personal additions</h2>
          <div className="simple-list">
            {items.map((item: any) => (
              <div key={item.id}>
                <Plus />
                <span>
                  {item.name} · {item.type}
                </span>
                <button
                  onClick={() => {
                    const next = items.filter(
                      (entry: any) => entry.id !== item.id,
                    );
                    setItems(next);
                    repository.additions.save(next);
                  }}
                >
                  <X />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProfilePage() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useLocale();
  const copy = usePageCopy();
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <div className="page profile-page">
      <PageIntro
        eyebrow={copy.profileEyebrow}
        title={user ? user.username : copy.profileGuestTitle}
      >
        <p>
          {user
            ? copy.profileUserIntro
            : copy.profileGuestIntro}
        </p>
      </PageIntro>
      <section className="profile-card">
        <div className="profile-avatar">
          {user?.username.charAt(0).toUpperCase() || <CircleUserRound />}
        </div>
        <div>
          <span>{user?.role || copy.guestExplorer}</span>
          <h2>{user?.username || copy.localProfile}</h2>
          <p>
            {user
              ? copy.signedIn
              : copy.atlasReady}
          </p>
        </div>
        {user ? (
          <button className="secondary-button" onClick={logout}>
            {t("signOut")}
          </button>
        ) : (
          <button className="primary-button" onClick={() => setAuthOpen(true)}>
            {t("signIn")}
          </button>
        )}
      </section>
      <section className="settings-list">
        <div>
          <div>
            <span className="settings-icon">
              <Library />
            </span>
            <div>
              <h3>{t("language")}</h3>
              <p>{copy.interfaceTranslated}</p>
            </div>
          </div>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as typeof locale)}
          >
            {localeRegistry.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div>
            <span className="settings-icon">
              <LockKeyhole />
            </span>
            <div>
              <h3>{copy.privacy}</h3>
              <p>{copy.privacyBody}</p>
            </div>
          </div>
          <ChevronRight />
        </div>
        {user?.role === "admin" && (
          <Link to="/admin">
            <div>
              <span className="settings-icon">
                <ShieldCheck />
              </span>
              <div>
                <h3>{copy.curatorWorkspace}</h3>
                <p>{copy.curatorBody}</p>
              </div>
            </div>
            <ChevronRight />
          </Link>
        )}
      </section>
      <section className="local-note">
        <ShieldCheck />
        <div>
          <h3>{copy.localSecurity}</h3>
          <p>{copy.localSecurityBody}</p>
        </div>
      </section>
      {authOpen && <AuthSheet onClose={() => setAuthOpen(false)} />}
    </div>
  );
}

function AuthSheet({ onClose }: { onClose: () => void }) {
  const { login, register } = useAuth();
  const { t } = useLocale();
  const copy = usePageCopy();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const result =
      mode === "login"
        ? await login(username, password)
        : await register(username, password);
    setBusy(false);
    if (result) setError(result);
    else onClose();
  }
  return (
    <div className="modal-backdrop">
      <form className="sheet auth-sheet" onSubmit={submit}>
        <button type="button" className="sheet-close" onClick={onClose}>
          <X />
        </button>
        <span className="eyebrow">{copy.localAccount}</span>
        <h2>{mode === "login" ? copy.welcomeBack : copy.createProfile}</h2>
        <p>{copy.accountLocal}</p>
        <label>
          {t("username")}
          <input
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          {t("password")}
          <input
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" disabled={busy}>
          {busy ? copy.checking : mode === "login" ? t("signIn") : t("register")}
        </button>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login"
            ? copy.newAccount
            : copy.existingAccount}
        </button>
        {mode === "login" && (
          <div className="curator-login-note">
            <ShieldCheck />
            <p>
              <strong>{copy.curatorAccess}</strong>
              <br />
              {copy.curatorAccessBody}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

function GlobalSearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return [
      ...regions
        .filter((x) => `${x.name} ${x.country}`.toLowerCase().includes(q))
        .slice(0, 4)
        .map((x) => ({
          type: "Region",
          name: x.name,
          meta: x.country,
          to: `/regions/${x.id}`,
        })),
      ...grapes
        .filter((x) => x.name.toLowerCase().includes(q))
        .slice(0, 3)
        .map((x) => ({
          type: "Grape",
          name: x.name,
          meta:
            x.color === "red"
              ? "Dark-skinned variety"
              : "Light-skinned variety",
          to: `/grapes/${x.id}`,
        })),
      ...producers
        .filter((x) => x.name.toLowerCase().includes(q))
        .slice(0, 3)
        .map((x) => ({
          type: "Producer",
          name: x.name,
          meta: regions.find((r) => r.id === x.regionId)?.name || "",
          to: `/wineries/${x.id}`,
        })),
      ...wines
        .filter((x) => x.name.toLowerCase().includes(q))
        .slice(0, 4)
        .map((x) => ({
          type: "Wine",
          name: x.name,
          meta: `${x.vintage ?? "NV"} · ${x.style}`,
          to: `/wines/${x.id}`,
        })),
      ...articles
        .filter((x) => `${x.title} ${x.summary}`.toLowerCase().includes(q))
        .slice(0, 2)
        .map((x) => ({
          type: "Field note",
          name: x.title,
          meta: `${x.minutes} min read`,
          to: `/learn/${x.id}`,
        })),
    ];
  }, [query]);
  return (
    <div className="search-overlay">
      <header>
        <Search />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Region, grape, producer, wine or guide"
        />
        <button onClick={onClose}>
          <X />
        </button>
      </header>
      <div className="search-body">
        {query.length < 2 ? (
          <div className="search-start">
            <span className="eyebrow">Trace a connection</span>
            <h2>Where would you like to begin?</h2>
            <div className="search-suggestions">
              {["Mosel", "Pinot Noir", "Mendoza", "Brioche"].map((item) => (
                <button onClick={() => setQuery(item)} key={item}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : results.length ? (
          <div className="search-results">
            {results.map((r, i) => (
              <Link onClick={onClose} to={r.to} key={`${r.to}-${i}`}>
                <span>{r.type}</span>
                <div>
                  <strong>{r.name}</strong>
                  <small>{r.meta}</small>
                </div>
                <ArrowRight />
              </Link>
            ))}
          </div>
        ) : (
          <div className="search-start">
            <h2>No path found yet</h2>
            <p>
              Try a broader place, grape or aroma. “Germany”, “Riesling” and
              “cassis” are good starting points.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function useRating(key: string) {
  const [value, setValue] = useState(() => repository.ratings.all()[key] || 0);
  const update = (next: number) => {
    const ratings = repository.ratings.all();
    ratings[key] = next;
    repository.ratings.save(ratings);
    setValue(next);
  };
  return [value, update] as const;
}
function NotFound() {
  return (
    <div className="page guarded">
      <Compass />
      <h1>This path leaves the map</h1>
      <p>
        The place you were looking for is not in this atlas. Return to the world
        view and begin another thread.
      </p>
      <Link to="/atlas" className="primary-button ink">
        Open the atlas
      </Link>
    </div>
  );
}
