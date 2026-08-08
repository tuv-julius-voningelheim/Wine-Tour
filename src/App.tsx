import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Link,
  Navigate,
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
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleUserRound,
  Compass,
  Filter,
  Grape,
  GripVertical,
  Heart,
  Library,
  Languages,
  ImagePlus,
  Layers3,
  ListFilter,
  LockKeyhole,
  Map as MapIcon,
  Menu,
  Minus,
  NotebookPen,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
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
import { prepareBottlePhoto } from "./lib/image";
import { localeRegistry, useLocale, usePageCopy, type Locale } from "./i18n";
import { aromaContent, articleContent, countryLabel, grapeContent, producerContent, regionContent, styleLabel, wineContent } from "./localizedContent";
import { useUiCopy } from "./uiCopy";
import { useAuth } from "./auth";
import type { Aroma, CellarItem, TastingChapter, TastingChapterType, TastingJourney, TastingNote, WineStyle } from "./types";
import vineyardHero from "./assets/vineyard-terraces.jpg";
import tastingStill from "./assets/tasting-still-life.jpg";
import terroirIllustration from "./assets/terroir-cross-section.jpg";
import aromaReference from "./assets/aroma-reference-table.jpg";
import winemakingJourney from "./assets/winemaking-journey.jpg";
import soilAtlas from "./assets/vineyard-soil-atlas.jpg";
import bottleForms from "./assets/wine-bottle-forms.jpg";
import vineSeasonStudy from "./assets/vine-season-study.jpg";
import mediterraneanVines from "./assets/region-mediterranean-vines.jpg";
import andesVineyard from "./assets/region-andes-vineyard.jpg";
import maritimeVineyard from "./assets/region-maritime-vineyard.jpg";
import volcanicVineyard from "./assets/region-volcanic-vineyard.jpg";
import { AtlasCommercialPlacements, BusinessAdminPanel, EventDetail, EventsMarketplace, FeaturedBusinessHome, HostProfile, PartnerProfilePage, ProducerBusinessLayer, StudioEvents, StudioHome, StudioOffers, StudioPlacements, StudioSite, WineMerchantOffers } from "./BusinessPlatform";
import { CellarExperience } from "./CellarExperience";
import { AcademyMasterclass, GrapeAmpelography, GrapeDeepDive, ProducerDecisionMap, RegionFieldGuide, WineEvolutionLesson } from "./LearningDepth";
import { InlineLearningChapter, LearningHub, LearningLesson, learningUi } from "./LearningSystem";
import { learningBlockById, learningModuleById, learningModules } from "./learningCurriculum";
import { DatabaseStatus } from "./DatabaseStatus";

function regionHeroFor(region:{country:string;climate:string;soil:string;lat:number}){
  const signal=`${region.country} ${region.climate} ${region.soil}`.toLowerCase()
  if(/volcan|basalt|lava|etna|santorini|canary|azores|madeira/.test(signal)) return volcanicVineyard
  if(/argentina|mendoza|uco|salta|chile|ande|high-altitude|altitude/.test(signal)) return andesVineyard
  if(/atlantic|maritime|ocean|coast|fog|mist|rias baixas|casablanca|marlborough/.test(signal)) return maritimeVineyard
  if(/mediterranean|provence|sicil|sard|greece|lebanon|israel|cyprus|languedoc|priorat/.test(signal)||Math.abs(region.lat)<36) return mediterraneanVines
  return vineyardHero
}

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
        <Route path="/learn" element={<LearningHub />} />
        <Route path="/learn/:slug" element={<LearningLesson />} />
        <Route path="/tastings" element={<TastingsPage />} />
        <Route path="/tastings/build" element={<TastingBuilder />} />
        <Route path="/tastings/:id" element={<TastingRoom />} />
        <Route path="/events" element={<EventsMarketplace />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/hosts/:id" element={<HostProfile />} />
        <Route path="/partners/:id" element={<PartnerProfilePage />} />
        <Route path="/studio" element={<StudioGuard><StudioHome /></StudioGuard>} />
        <Route path="/studio/events" element={<StudioGuard><StudioEvents /></StudioGuard>} />
        <Route path="/studio/site" element={<StudioGuard><StudioSite /></StudioGuard>} />
        <Route path="/studio/offers" element={<StudioGuard><StudioOffers /></StudioGuard>} />
        <Route path="/studio/placements" element={<StudioGuard><StudioPlacements /></StudioGuard>} />
        <Route path="/cellar" element={<CellarExperience />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </AppShell>
  );
}

function StudioGuard({children}:{children:ReactNode}){
  const {user}=useAuth()
  return user?.role==='admin'?children:<Navigate to="/profile" replace/>
}

function AppShell({
  children,
  onSearch,
}: {
  children: ReactNode;
  onSearch: () => void;
}) {
  const { t, locale, setLocale } = useLocale();
  const {user}=useAuth()
  const ui=useUiCopy()
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return (
    <div className="app-shell">
      <aside className="rail">
        <Link to="/" className="brand" aria-label={`Vine Atlas · ${ui.homeLabel}`}>
          <span className="brand-mark">
            <Grape size={22} />
          </span>
          <span>
            <b>Vine</b>
            <em>Atlas</em>
          </span>
        </Link>
        <nav aria-label={ui.primaryNavigation}>
          {navItems.map(({ to, key, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={20} />
              <span>{t(key)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="rail-lower">
          <NavLink to="/events">
            <Users size={20} />
            <span>{ui.eventsNav}</span>
          </NavLink>
          {user?.role==='admin'&&<NavLink to="/studio">
            <Settings size={20} />
            <span>{ui.studioNav}</span>
          </NavLink>}
          {user?.role==='admin'&&<NavLink to="/admin" className="admin-nav-entry">
            <ShieldCheck size={20} />
            <span>{t('admin')} · {ui.studioNav}</span>
          </NavLink>}
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
        <p className="rail-signature">{ui.followTerroir}</p>
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
      <nav className="bottom-nav" aria-label={ui.primaryNavigation}>
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
  const { t,locale } = useLocale();
  const ui=useUiCopy()
  const copy = usePageCopy();
  const cellar = repository.cellar.all();
  const featured = regions.filter((r) => r.featured).slice(0, 4);
  return (
    <div className="page home-page">
      <section className="hero">
        <img
          src={vineyardHero}
          alt={ui.vineyardHeroAlt}
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
      <FeaturedBusinessHome />
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
                <img src={regionHeroFor(region)} alt={ui.vineyardLandscapeAlt} />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div>
                <small>{countryLabel(region.country,locale)}</small>
                <h3>{region.name}</h3>
                <p>{regionContent(region,locale).climate}</p>
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
  const { t,locale } = useLocale();
  const ui=useUiCopy()
  const copy = usePageCopy();
  const [selected, setSelected] = useState(
    regions.find((r) => r.id === "mosel") ?? regions[0],
  );
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState<"regions" | "producers">("regions");
  const [country,setCountry]=useState('all')
  const [grapeId,setGrapeId]=useState('all')
  const [linkedOnly,setLinkedOnly]=useState(false)
  const [sort,setSort]=useState<'name'|'country'|'links'>('name')
  const [page,setPage]=useState(1)
  const [pageSize,setPageSize]=useState(12)
  const [zoom, setZoom] = useState(3);
  const countries=[...new Set(regions.map(region=>region.country))].sort()
  const q=query.trim().toLowerCase()
  const matchesRegion=(region:(typeof regions)[number])=>{
    const grapeNames=grapes.filter(grape=>region.grapeIds.includes(grape.id)).map(grape=>grape.name).join(' ')
    const producerNames=producers.filter(producer=>producer.regionId===region.id).map(producer=>producer.name).join(' ')
    return (!q||`${region.name} ${region.country} ${grapeNames} ${producerNames}`.toLowerCase().includes(q))&&(country==='all'||region.country===country)&&(grapeId==='all'||region.grapeIds.includes(grapeId))&&(!linkedOnly||(region.wineIds.length+region.producerIds.length)>0)
  }
  const filteredRegions=regions.filter(matchesRegion).sort((a,b)=>sort==='country'?`${a.country}${a.name}`.localeCompare(`${b.country}${b.name}`):sort==='links'?(b.producerIds.length+b.wineIds.length)-(a.producerIds.length+a.wineIds.length):a.name.localeCompare(b.name))
  const filteredProducers=producers.filter(producer=>{
    const region=regions.find(item=>item.id===producer.regionId)!
    const grapeNames=grapes.filter(grape=>region.grapeIds.includes(grape.id)).map(grape=>grape.name).join(' ')
    return (!q||`${producer.name} ${region.name} ${region.country} ${grapeNames}`.toLowerCase().includes(q))&&(country==='all'||region.country===country)&&(grapeId==='all'||region.grapeIds.includes(grapeId))&&(!linkedOnly||producer.wineIds.length>0)
  }).sort((a,b)=>{const ar=regions.find(item=>item.id===a.regionId)!,br=regions.find(item=>item.id===b.regionId)!;return sort==='country'?`${ar.country}${a.name}`.localeCompare(`${br.country}${b.name}`):sort==='links'?b.wineIds.length-a.wineIds.length:a.name.localeCompare(b.name)})
  const producerGroups=filteredRegions.map(region=>({region,items:filteredProducers.filter(producer=>producer.regionId===region.id)})).filter(group=>group.items.length)
  const resultCount=layer==='regions'?filteredRegions.length:filteredProducers.length
  const pageCount=Math.max(1,Math.ceil(resultCount/pageSize))
  const currentPage=Math.min(page,pageCount)
  const pageStart=(currentPage-1)*pageSize
  const pagedRegions=filteredRegions.slice(pageStart,pageStart+pageSize)
  const pagedProducers=filteredProducers.slice(pageStart,pageStart+pageSize)
  const directoryCopy={en:{page:'Page',of:'of',perPage:'per page',previous:'Previous',next:'Next',refine:'Refine this directory'},de:{page:'Seite',of:'von',perPage:'pro Seite',previous:'Zurück',next:'Weiter',refine:'Dieses Verzeichnis filtern'},fr:{page:'Page',of:'sur',perPage:'par page',previous:'Précédent',next:'Suivant',refine:'Affiner cet annuaire'},es:{page:'Página',of:'de',perPage:'por página',previous:'Anterior',next:'Siguiente',refine:'Filtrar este directorio'}}[locale]
  const changeDirectoryPage=(next:number)=>{setPage(Math.min(pageCount,Math.max(1,next)));window.setTimeout(()=>document.querySelector('.atlas-index')?.scrollIntoView({behavior:'smooth',block:'start'}),0)}
  useEffect(()=>setPage(1),[query,country,grapeId,linkedOnly,sort,layer,pageSize])
  const selectedContent=regionContent(selected,locale)
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
            placeholder={ui.searchAll}
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
      <div className="atlas-filters">
        <label><span>{ui.country}</span><select value={country} onChange={event=>setCountry(event.target.value)}><option value="all">{ui.allCountries}</option>{countries.map(item=><option value={item} key={item}>{countryLabel(item,locale)}</option>)}</select></label>
        <label><span>{ui.variety}</span><select value={grapeId} onChange={event=>setGrapeId(event.target.value)}><option value="all">{ui.allVarieties}</option>{grapes.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(grape=><option value={grape.id} key={grape.id}>{grape.name}</option>)}</select></label>
        <label><span>{ui.sort}</span><select value={sort} onChange={event=>setSort(event.target.value as typeof sort)}><option value="name">{ui.sortName}</option><option value="country">{ui.sortCountry}</option><option value="links">{ui.sortLinks}</option></select></label>
        <button className={linkedOnly?'active':''} aria-pressed={linkedOnly} onClick={()=>setLinkedOnly(value=>!value)}>{linkedOnly?<Check size={15}/>:<ListFilter size={15}/>} {ui.linkedOnly}</button>
        {(q||country!=='all'||grapeId!=='all'||linkedOnly)&&<button className="clear-filters" onClick={()=>{setQuery('');setCountry('all');setGrapeId('all');setLinkedOnly(false)}}><X size={15}/>{ui.clearFilters}</button>}
      </div>
      <section className="map-shell">
        <AtlasCommercialPlacements />
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
              filteredRegions.map((region) => (
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
                    {countryLabel(region.country,locale)}
                  </Popup>
                </CircleMarker>
              ))}
            {layer === "producers" &&
              producerGroups.map(({region,items}) => (
                <CircleMarker
                  key={region.id}
                  center={[region.lat, region.lng]}
                  radius={Math.min(11,5+items.length)}
                  pathOptions={{
                    color: "#f4efe6",
                    fillColor: "#3f5239",
                    fillOpacity: 0.95,
                    weight: 2,
                  }}
                  eventHandlers={{click:()=>setSelected(region)}}
                >
                  <Popup>
                    <strong>{region.name} · {items.length} {ui.wineries}</strong><br/>
                    <small>{ui.regionalLocation}</small>
                    <div className="popup-links">{items.slice(0,8).map(producer=><Link key={producer.id} to={`/wineries/${producer.id}`}>{producer.name}</Link>)}</div>
                  </Popup>
                </CircleMarker>
              ))}
          </MapContainer>
        </div>
        <aside className="map-inspector">
          <span className="eyebrow">{copy.selectedPlace}</span>
          <h2>{selected.name}</h2>
          <p>{selectedContent.summary}</p>
          <dl>
            <div>
              <dt>{ui.country}</dt>
              <dd>{countryLabel(selected.country,locale)}</dd>
            </div>
            <div>
              <dt>{ui.climate}</dt>
              <dd>{selectedContent.climate}</dd>
            </div>
            <div>
              <dt>{ui.ground}</dt>
              <dd>{selectedContent.soil}</dd>
            </div>
          </dl>
          <ThreadLink to={`/regions/${selected.id}`}>
            {copy.enterRegion}: {selected.name}
          </ThreadLink>
        </aside>
        <div className="mobile-map-sheet">
          <i />
          <span>{countryLabel(selected.country,locale)}</span>
          <h2>{selected.name}</h2>
          <p>{selectedContent.climate}</p>
          <ThreadLink to={`/regions/${selected.id}`}>
            {copy.enterRegion}
          </ThreadLink>
        </div>
      </section>
      <section className="atlas-index">
        <div className="section-heading">
          <div><span className="eyebrow">{ui.completeDirectory}</span><h2 aria-live="polite">{resultCount} {layer==='regions'?ui.wineRegions:ui.wineries}</h2></div>
          <span>Map · {zoom} · {ui.mapShowing}</span>
        </div>
        <div className="atlas-directory-tools" aria-label={directoryCopy.refine}>
          <label className="search-field"><Search size={17}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={ui.searchAll}/></label>
          <label><span>{ui.country}</span><select value={country} onChange={event=>setCountry(event.target.value)}><option value="all">{ui.allCountries}</option>{countries.map(item=><option value={item} key={item}>{countryLabel(item,locale)}</option>)}</select></label>
          <label><span>{ui.variety}</span><select value={grapeId} onChange={event=>setGrapeId(event.target.value)}><option value="all">{ui.allVarieties}</option>{grapes.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(grape=><option value={grape.id} key={grape.id}>{grape.name}</option>)}</select></label>
          <label><span>{ui.sort}</span><select value={sort} onChange={event=>setSort(event.target.value as typeof sort)}><option value="name">{ui.sortName}</option><option value="country">{ui.sortCountry}</option><option value="links">{ui.sortLinks}</option></select></label>
          <label><span>{directoryCopy.perPage}</span><select value={pageSize} onChange={event=>setPageSize(Number(event.target.value))}><option value="8">8</option><option value="12">12</option><option value="24">24</option></select></label>
        </div>
        {resultCount===0?<div className="directory-empty"><Search/><h3>{ui.noPath}</h3><p>{ui.noPathHelp}</p></div>:<div className="atlas-directory">
          {layer==='regions'?pagedRegions.map(region=><Link to={`/regions/${region.id}`} key={region.id}>
            <div className="directory-index">{String(regions.indexOf(region)+1).padStart(3,'0')}</div><div><small>{countryLabel(region.country,locale)}</small><h3>{region.name}</h3><p>{regionContent(region,locale).climate}</p></div><dl><span>{region.grapeIds.length} {ui.linkedVarieties}</span><span>{region.producerIds.length} {ui.linkedWineries}</span></dl><ChevronRight/>
          </Link>):pagedProducers.map(producer=>{const region=regions.find(item=>item.id===producer.regionId)!,pc=producerContent(producer,region,locale);return <Link to={`/wineries/${producer.id}`} key={producer.id}>
            <div className="directory-monogram">{producer.name.charAt(0)}</div><div><small>{countryLabel(region.country,locale)} · {region.name}</small><h3>{producer.name}</h3><p>{pc.speciality}</p></div><dl><span>{producer.wineIds.length} {ui.linkedWines}</span><span>{producer.communityRating.toFixed(1)} {ui.communityShort}</span></dl><ChevronRight/>
          </Link>})}
        </div>}
        {resultCount>pageSize&&<nav className="directory-pagination" aria-label={`${directoryCopy.page} ${currentPage} ${directoryCopy.of} ${pageCount}`}><button disabled={currentPage===1} onClick={()=>changeDirectoryPage(currentPage-1)}><ArrowLeft/>{directoryCopy.previous}</button><span><strong>{directoryCopy.page} {currentPage}</strong> {directoryCopy.of} {pageCount}<small>{pageStart+1}–{Math.min(pageStart+pageSize,resultCount)} / {resultCount}</small></span><button disabled={currentPage===pageCount} onClick={()=>changeDirectoryPage(currentPage+1)}>{directoryCopy.next}<ArrowRight/></button></nav>}
      </section>
    </div>
  );
}
function ZoomWatcher({ onZoom }: { onZoom: (zoom: number) => void }) {
  useMapEvents({ zoomend: (e) => onZoom(e.target.getZoom()) });
  return null;
}

function RegionPage() {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const { slug } = useParams();
  const region = regions.find((r) => r.id === slug);
  const [rating, setRating] = useRating(`region:${slug}`);
  if (!region) return <NotFound />;
  const relatedGrapes = grapes.filter((g) => region.grapeIds.includes(g.id));
  const relatedProducers = producers.filter((p) => p.regionId === region.id);
  const relatedWines = wines.filter((w) => w.regionId === region.id);
  const content=regionContent(region,locale)
  return (
    <article className="page detail-page">
      <BackLink to="/atlas" label={ui.worldAtlas} />
      <section className="detail-hero">
        <img
          src={regionHeroFor(region)}
          alt={`${region.name} · ${countryLabel(region.country,locale)}`}
        />
        <div className="detail-hero-copy">
          <span>{countryLabel(region.country,locale)}</span>
          <h1>{region.name}</h1>
          <p>{content.summary}</p>
        </div>
        <div className="place-index">
          <span>{ui.placeIndex}</span>
          <strong>
            {String(regions.indexOf(region) + 1).padStart(3, "0")}
          </strong>
        </div>
      </section>
      <div className="thread-path">
        <span>{ui.place}</span>
        <i />
        <span>{ui.grape}</span>
        <i />
        <span>{ui.producer}</span>
        <i />
        <span>{ui.wine}</span>
        <i />
        <span>{ui.memory}</span>
      </div>
      <section className="detail-layout">
        <div>
          <span className="eyebrow">{ui.shapePlace}</span>
          <h2>{ui.climateMeets}</h2>
          <p className="lead">
            {content.climate}. Beneath the vines, {content.soil.toLowerCase()}{" "}
            helps frame the region’s physical story.
          </p>
          <p>
            {ui.regionDiversity}
          </p>
        </div>
        <dl className="facts">
          <div>
            <dt>{ui.latitude}</dt>
            <dd>
              {Math.abs(region.lat).toFixed(1)}°{region.lat >= 0 ? "N" : "S"}
            </dd>
          </div>
          <div>
            <dt>{ui.typicalGround}</dt>
            <dd>{content.soil}</dd>
          </div>
          <div>
            <dt>{ui.producersLinked}</dt>
            <dd>{relatedProducers.length}</dd>
          </div>
          <div>
            <dt>{ui.community}</dt>
            <dd>
              <Stars value={4} />
              <small>{ui.communitySnapshot} · 268</small>
            </dd>
          </div>
          <div>
            <dt>{ui.yourRating}</dt>
            <dd>
              <Stars value={rating} onChange={setRating} />
            </dd>
          </div>
        </dl>
      </section>
      <section className="terroir-story">
        <div className="story-visual">
          <img src={terroirIllustration} alt={`Illustrated vineyard slope, roots and soil layers for understanding ${region.name}`} />
          <span className="image-caption">{ui.readSkyRoot}</span>
        </div>
        <div className="story-copy">
          <span className="eyebrow">{ui.historySeason}</span>
          <h2>{ui.livingSystem}</h2>
          <div className="story-chapters">
            <article><span>01</span><div><h3>{ui.placeEvolved}</h3><p>{content.history}</p></div></article>
            <article><span>02</span><div><h3>{ui.throughSeason}</h3><p>{content.growingSeason}</p></div></article>
            <article><span>03</span><div><h3>{ui.vineDecisions}</h3><p>{content.viticulture}</p></div></article>
          </div>
        </div>
      </section>
      <RegionFieldGuide region={region} locale={locale}/>
      <section className="knowledge-panels">
        <article>
          <span className="eyebrow">{ui.stylesCompare}</span>
          <h3>{ui.regionBecome}</h3>
          <ul>{content.styles.map((style) => <li key={style}>{style}</li>)}</ul>
        </article>
        <article>
          <span className="eyebrow">{ui.localGeography}</span>
          <h3>{region.subregions.length ? ui.namedZones : ui.readLandscape}</h3>
          <ul>{(region.subregions.length ? region.subregions : content.keyFacts).map((zone) => <li key={zone}>{zone}</li>)}</ul>
        </article>
        <article>
          <span className="eyebrow">{ui.atTable}</span>
          <h3>{ui.pairPlace}</h3>
          <ul>{content.pairings.map((pairing) => <li key={pairing}>{pairing}</li>)}</ul>
        </article>
      </section>
      <section className="related-section">
        <span className="eyebrow">{ui.signatureThreads}</span>
        <h2>{ui.startVarieties}</h2>
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
              <span className="eyebrow">{ui.peoplePlace}</span>
              <h2>{ui.producersKnow}</h2>
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
          <span className="eyebrow">{ui.continueGlass}</span>
          <h2>{ui.representativeWines}</h2>
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
          <strong>{ui.editorialProvenance}</strong>
          <br />
          {ui.provenanceBody}
        </p>
        <a href={region.sourceUrl} target="_blank" rel="noreferrer">
          {ui.viewSource}
        </a>
        <div className="source-links">{region.sources.slice(1).map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</div>
      </section>
    </article>
  );
}

function GrapePage() {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const { slug } = useParams();
  const grape = grapes.find((g) => g.id === slug);
  if (!grape) return <NotFound />;
  const relatedRegions = regions
    .filter((r) => r.grapeIds.includes(grape.id)&&wines.some(wine=>wine.regionId===r.id&&wine.grapeIds.includes(grape.id)))
    .sort((a,b)=>b.wineIds.filter(id=>wines.find(wine=>wine.id===id)?.grapeIds.includes(grape.id)).length-a.wineIds.filter(id=>wines.find(wine=>wine.id===id)?.grapeIds.includes(grape.id)).length)
    .slice(0, 8);
  const grapeAromas = aromas.filter((a) => grape.aromaIds.includes(a.id));
  const relatedWines = wines
    .filter((w) => w.grapeIds.includes(grape.id))
    .slice(0, 4);
  const content=grapeContent(grape,locale)
  return (
    <article className="page detail-page grape-page">
      <BackLink to="/atlas" label="Atlas" />
      <PageIntro
        eyebrow={
          grape.color === "red"
            ? ui.darkVariety
            : ui.lightVariety
        }
        title={grape.name}
      >
        {grape.aliases.length > 0 && (
          <p>{ui.alsoKnown} {grape.aliases.join(` ${ui.and} `)}</p>
        )}
      </PageIntro>
      <section className="grape-intro">
        <div className="grape-orbit">
          <span>{grape.name.charAt(0)}</span>
          {grapeAromas.slice(0, 6).map((a, i) => (
            <i key={a.id} style={{ "--i": i } as React.CSSProperties}>
              {aromaContent(a,locale).name}
            </i>
          ))}
        </div>
        <div>
          <p className="lead">{content.summary}</p>
          <StructureScale label={ui.acidity} value={grape.acidity} />
          <StructureScale label={ui.tannin} value={grape.tannin} />
          <StructureScale label={ui.body} value={grape.body} />
        </div>
      </section>
      <section className="entity-deep-dive">
        <div className="deep-dive-lead">
          <span className="eyebrow">{ui.nurseryCellar}</span>
          <h2>{ui.grapeBehaves}: {grape.name}</h2>
          <p>{ui.originStart}</p>
        </div>
        <div className="deep-dive-grid">
          <article><span>{ui.origin}</span><h3>{content.origin}</h3><p>{content.ripening}</p></article>
          <article><span>{ui.climateFit}</span><h3>{ui.balancePossible}</h3><p>{content.climateFit}</p></article>
          <article><span>{ui.inVineyard}</span><h3>{ui.growerDecisions}</h3><p>{content.viticulture}</p></article>
          <article><span>{ui.inCellar}</span><h3>{ui.textureExpression}</h3><p>{content.winemaking}</p></article>
        </div>
      </section>
      <GrapeDeepDive grape={grape} locale={locale}/>
      <GrapeAmpelography grape={grape} locale={locale}/>
      <section className="knowledge-panels">
        <article><span className="eyebrow">{ui.styleRange}</span><h3>{ui.lookExpressions}</h3><ul>{content.styles.map(item=><li key={item}>{item}</li>)}</ul></article>
        <article><span className="eyebrow">{ui.atTable}</span><h3>{ui.pairStructure}</h3><ul>{content.pairings.map(item=><li key={item}>{item}</li>)}</ul></article>
      </section>
      <section className="related-section">
        <span className="eyebrow">{ui.aromaConstellation}</span>
        <h2>{ui.commonReferences}</h2>
        <p>{ui.aromaPrompts}</p>
        <div className="aroma-tiles">
          {grapeAromas.map((a) => (
            <Link to={`/aromas?selected=${a.id}`} key={a.id}>
              <small>{aromaContent(a,locale).family}</small>
              <strong>{aromaContent(a,locale).name}</strong>
              <span>{aromaContent(a,locale).reference}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="related-section">
        <span className="eyebrow">{ui.classicPlaces}</span>
        <h2>{ui.grapeGeography}</h2>
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
          <h2>{ui.continueBottle}</h2>
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
  const ui=useUiCopy()
  return (
    <div className="structure-scale">
      <span>{label}</span>
      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <i className={n <= value ? "on" : ""} key={n} />
        ))}
      </div>
      <b>{["", ui.levelLight, ui.levelGentle, ui.levelBalanced, ui.levelFirm, ui.levelPronounced][value]}</b>
    </div>
  );
}

function ProducerPage() {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const { slug } = useParams();
  const producer = producers.find((p) => p.id === slug);
  if (!producer) return <NotFound />;
  const region = regions.find((r) => r.id === producer.regionId)!;
  const producerWines = wines.filter((w) => w.producerId === producer.id);
  const [rating, setRating] = useRating(`producer:${slug}`);
  const content=producerContent(producer,region,locale)
  return (
    <article className="page detail-page">
      <BackLink to={`/regions/${region.id}`} label={region.name} />
      <section className="producer-hero">
        <div>
          <span className="eyebrow">{ui.producer} · {countryLabel(region.country,locale)}</span>
          <h1>{producer.name}</h1>
          <p>{content.summary}</p>
          <ThreadLink to={`/regions/${region.id}`} tone="moss">
            {region.name}
          </ThreadLink>
        </div>
        <img
          src={tastingStill}
          alt={ui.producerHeroAlt}
        />
      </section>
      <ProducerBusinessLayer producerId={producer.id} />
      <section className="detail-layout">
        <div>
          <span className="eyebrow">{ui.pointView}</span>
          <h2>{ui.traditionPresent}</h2>
          <p className="lead">{ui.producerContext}</p>
        </div>
        <dl className="facts">
          <div>
            <dt>{ui.homeLabel}</dt>
            <dd>
              {region.name}, {region.country}
            </dd>
          </div>
          <div>
            <dt>{ui.community}</dt>
            <dd>
              <Stars value={Math.round(producer.communityRating)} />
              <small>{ui.communitySnapshot} · {producer.communityRating}</small>
            </dd>
          </div>
          <div>
            <dt>{ui.yourRating}</dt>
            <dd>
              <Stars value={rating} onChange={setRating} />
            </dd>
          </div>
        </dl>
      </section>
      <section className="producer-method">
        <header><span className="eyebrow">{ui.estateLens}</span><h2>{ui.vineyardCellarSignature}</h2><p>{content.philosophy}</p></header>
        <div>
          <article><span>01</span><h3>{ui.vineyard}</h3><p>{content.vineyard}</p></article>
          <article><span>02</span><h3>{ui.cellarLabel}</h3><p>{content.cellar}</p></article>
          <article><span>03</span><h3>{ui.signature}</h3><p>{content.speciality}</p></article>
        </div>
        <a href={producer.sourceUrl} target="_blank" rel="noreferrer" className="text-link">{ui.visitPrimary} <ArrowRight size={15}/></a>
      </section>
      <ProducerDecisionMap producer={producer} region={region} locale={locale}/>
      <section className="related-section">
        <span className="eyebrow">{ui.fromCellar}</span>
        <h2>
          {producerWines.length
            ? ui.winesAtlas
            : ui.regionalThread}
        </h2>
        {producerWines.length ? (
          <div className="wine-shelf">
            {producerWines.map((w) => (
              <WineCard key={w.id} wine={w} />
            ))}
          </div>
        ) : (
          <p className="soft-copy">{ui.producerExpansion}</p>
        )}
      </section>
    </article>
  );
}

function WineCard({ wine }: { wine: (typeof wines)[number] }) {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const producer = producers.find((p) => p.id === wine.producerId);
  return (
    <Link to={`/wines/${wine.id}`} className={`wine-card style-${wine.style}`}>
      <div className="bottle-shape">
        <i />
      </div>
      <small>
        {wine.vintage ?? ui.nonVintage} · {styleLabel(wine.style,locale)}
      </small>
      <h3>{wine.name}</h3>
      <p>{producer?.name}</p>
      <span>
        {ui.openWine} <ArrowRight size={14} />
      </span>
    </Link>
  );
}

function WinePage() {
  const {locale}=useLocale()
  const ui=useUiCopy()
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
  const content=wineContent(wine,producer,region,locale)
  function add() {
    const items = repository.cellar.all();
    if (!items.some((i) => i.wineId === wineId)) {
      items.push({
        id: crypto.randomUUID(),
        wineId,
        state: "owned",
        quantity: 1,
        location: ui.homeCellar,
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
            <small>{wine.vintage ?? ui.nonVintage}</small>
          </div>
        </div>
        <div>
          <span className="eyebrow">
            {styleLabel(wine.style,locale)} {ui.wineType} · {countryLabel(region.country,locale)}
          </span>
          <h1>{wine.name}</h1>
          <p className="producer-name">{producer.name}</p>
          <p className="lead">{content.summary}</p>
          <div className="wine-actions">
            <button className="primary-button" onClick={add}>
              {added ? (
                <>
                  <Check size={17} />
                  {ui.inYourCellar}
                </>
              ) : (
                <>
                  <Plus size={17} />
                  {ui.addToCellar}
                </>
              )}
            </button>
            <button className="secondary-button">
              <Share2 size={17} />
              {ui.share}
            </button>
          </div>
        </div>
      </section>
      <section className="detail-layout">
        <div>
          <span className="eyebrow">{ui.blendCharacter}</span>
          <h2>{ui.structuredView}</h2>
          <div className="thread-cloud">
            {wineGrapes.map((g) => (
              <ThreadLink key={g.id} to={`/grapes/${g.id}`} tone="moss">
                {g.name}
              </ThreadLink>
            ))}
          </div>
          <p className="lead">{content.serving}</p>
        </div>
        <dl className="facts">
          <div>
            <dt>{ui.vintage}</dt>
            <dd>{wine.vintage ?? ui.nonVintage}</dd>
          </div>
          <div>
            <dt>{ui.style}</dt>
            <dd>{styleLabel(wine.style,locale)}</dd>
          </div>
          <div>
            <dt>{ui.community}</dt>
            <dd>
              <Stars value={Math.round(wine.communityRating)} />
              <small>{ui.communitySnapshot} · {wine.communityRating}</small>
            </dd>
          </div>
          <div>
            <dt>{ui.yourRating}</dt>
            <dd>
              <Stars value={rating} onChange={setRating} />
            </dd>
          </div>
        </dl>
      </section>
      <section className="wine-process">
        <div className="process-image"><img src={winemakingJourney} alt={ui.winemakingAlt}/><span>{wine.composition}</span></div>
        <div className="process-copy">
          <span className="eyebrow">{ui.fromFruitBottle}</span>
          <h2>{ui.howStyleBuilt}</h2>
          <ol>
            <li><span>01</span><div><h3>{ui.composition}</h3><p>{wine.composition}</p></div></li>
            <li><span>02</span><div><h3>{ui.vinification}</h3><p>{content.vinification}</p></div></li>
            <li><span>03</span><div><h3>{ui.maturation}</h3><p>{content.maturation}</p></div></li>
            <li><span>04</span><div><h3>{ui.whenOpen}</h3><p>{content.drinkWindow}</p></div></li>
          </ol>
        </div>
      </section>
      <WineEvolutionLesson wine={wine} locale={locale}/>
      <section className="pairing-strip"><span className="eyebrow">{ui.atTable}</span><h2>{ui.pairEcho}</h2><div>{content.pairings.map(item=><span key={item}>{item}</span>)}</div></section>
      <section className="related-section">
        <span className="eyebrow">{ui.aromaProfile}</span>
        <h2>{ui.promptsStyle}</h2>
        <div className="aroma-profile">
          {wineAromas.map((a, index) => (
            <Link to={`/aromas?selected=${a.id}`} key={a.id}>
              <div>
                <span>{aromaContent(a,locale).family}</span>
                <strong>{aromaContent(a,locale).name}</strong>
              </div>
              <i style={{ width: `${55 + (index % 3) * 18}%` }} />
              <small>
                {index % 3 === 0
                  ? ui.subtle
                  : index % 3 === 1
                    ? ui.present
                    : ui.pronounced}{" "}
                · {aromaContent(a,locale).origin.split(".")[0]}
              </small>
            </Link>
          ))}
        </div>
      </section>
      <WineMerchantOffers wineId={wine.id} />
      <section className="note-callout">
        <div>
          <NotebookPen />
          <span>{ui.makeYours}</span>
          <h2>{ui.rememberQuestion}</h2>
          <p>{ui.noteBody}</p>
        </div>
        <Link to="/tastings/open-table" className="primary-button ink">
          {ui.openNotes}
        </Link>
      </section>
    </article>
  );
}

const families = [...new Set(aromas.map((aroma) => aroma.family))];
function AromaPage() {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const copy = usePageCopy();
  const query = new URLSearchParams(useLocation().search);
  const initial = query.get("selected");
  const initialAroma = aromas.find((a) => a.id === initial) ?? aromas[0];
  const initialStyle = initialAroma.styles[0] ?? "white";
  const [style, setStyle] = useState<WineStyle>(initialStyle);
  const [tier, setTier] = useState<Aroma["tier"]>(initialAroma.tier);
  const [intensity, setIntensity] = useState(1);
  const [family, setFamily] = useState(initialAroma.family);
  const [selected, setSelected] = useState<Aroma>(initialAroma);
  const [lensNotice,setLensNotice]=useState('')
  const lensCopy={
    en:{help:'Start with a wine style and origin layer. Choose a family in the middle ring, then a precise aroma on the outer ring. Tab or use arrow keys to move.',reset:'Reset lens',family:'Family',subfamily:'Subfamily',aroma:'Aroma',note:'Add to tasting note',learn:'Add as tasting learning step',noteAdded:'Aroma saved for your next tasting note.',learnAdded:'Aroma calibration added to your tasting storyline.',confuse:'Compare before deciding',calibrate:'Calibration references',compareBody:'Smell these nearby references side by side; shared family cues can otherwise make the first confident word feel more precise than it is.'},
    de:{help:'Beginne mit Weinstil und Herkunftsebene. Wähle eine Familie im mittleren Ring und dann ein präzises Aroma außen. Mit Tab oder Pfeiltasten navigieren.',reset:'Linse zurücksetzen',family:'Familie',subfamily:'Unterfamilie',aroma:'Aroma',note:'Zur Verkostungsnotiz',learn:'Als Lernschritt hinzufügen',noteAdded:'Aroma für deine nächste Verkostungsnotiz gespeichert.',learnAdded:'Aromakalibrierung zur Verkostungsreise hinzugefügt.',confuse:'Vor der Entscheidung vergleichen',calibrate:'Kalibrierungsreferenzen',compareBody:'Rieche diese nahen Referenzen nebeneinander. Gemeinsame Familienmerkmale können das erste sichere Wort präziser wirken lassen, als es ist.'},
    fr:{help:'Commencez par le style et la couche d’origine. Choisissez une famille dans l’anneau central, puis un arôme précis à l’extérieur. Tabulation ou flèches pour naviguer.',reset:'Réinitialiser la lentille',family:'Famille',subfamily:'Sous-famille',aroma:'Arôme',note:'Ajouter à la note',learn:'Ajouter comme étape pédagogique',noteAdded:'Arôme conservé pour votre prochaine note.',learnAdded:'Calibration aromatique ajoutée au parcours de dégustation.',confuse:'Comparer avant de décider',calibrate:'Références de calibration',compareBody:'Sentez ces références proches côte à côte ; les points communs peuvent rendre le premier mot assuré plus précis qu’il ne l’est.'},
    es:{help:'Empieza por estilo y capa de origen. Elige una familia en el anillo central y un aroma preciso en el exterior. Usa Tab o flechas para moverte.',reset:'Reiniciar lente',family:'Familia',subfamily:'Subfamilia',aroma:'Aroma',note:'Añadir a la nota',learn:'Añadir como paso de aprendizaje',noteAdded:'Aroma guardado para tu próxima nota.',learnAdded:'Calibración aromática añadida al recorrido de cata.',confuse:'Comparar antes de decidir',calibrate:'Referencias de calibración',compareBody:'Huele estas referencias cercanas una junto a otra; las señales compartidas pueden hacer que la primera palabra parezca más precisa de lo que es.'},
  }[locale]
  const visibleFamilies = families.filter((f) =>
    aromas.some((a) => a.family === f && a.styles.includes(style) && a.tier === tier),
  );
  const visibleAromas = aromas.filter(
    (a) => a.family === family && a.styles.includes(style) && a.tier === tier,
  );
  const selectedContent=aromaContent(selected,locale)
  const confusionPairs=aromas.filter(item=>item.id!==selected.id&&item.styles.includes(style)&&(item.subfamily===selected.subfamily||item.family===selected.family)).slice(0,3)
  function chooseAroma(item:Aroma){setSelected(item);setIntensity(1);setLensNotice('')}
  function resetLens(){selectStyle(initialStyle);setTier(initialAroma.tier);setFamily(initialAroma.family);chooseAroma(initialAroma)}
  function moveWithArrows(event:React.KeyboardEvent<SVGPathElement>,items:Aroma[],current:Aroma){
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return
    event.preventDefault();const direction=event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:1,index=items.findIndex(item=>item.id===current.id),next=items[(index+direction+items.length)%items.length];if(next){chooseAroma(next);requestAnimationFrame(()=>document.querySelector<SVGPathElement>(`[data-aroma-id="${next.id}"]`)?.focus())}
  }
  function addAromaNote(){localStorage.setItem('vine-atlas-aroma-draft',JSON.stringify({aromaId:selected.id,intensity,updatedAt:new Date().toISOString()}));setLensNotice(lensCopy.noteAdded)}
  function addAromaLearning(){
    const module=learningModules.find(item=>item.id==='aroma-language')!,block=module.blocks.find(item=>item.kind==='sensory-lab')!,journeys=repository.journeys.all(),target=journeys[0]??{id:crypto.randomUUID(),title:learningUi[locale].newJourney,description:module.question[locale],pace:'host' as const,access:'invite' as const,chapters:[],updatedAt:new Date().toISOString()}
    const chapter:TastingChapter={id:crypto.randomUUID(),type:'learning-block',referenceId:block.id,title:`${block.title[locale]} · ${selectedContent.name}`,hostNote:`${selectedContent.family} → ${selectedContent.subfamily} → ${selectedContent.name}: ${selectedContent.reference}`,duration:block.duration}
    const updated={...target,chapters:[...target.chapters,chapter],updatedAt:new Date().toISOString()};repository.journeys.save([updated,...journeys.filter(item=>item.id!==updated.id)]);setLensNotice(lensCopy.learnAdded)
  }
  function selectStyle(nextStyle: WineStyle) {
    const nextTier=aromas.some(a=>a.styles.includes(nextStyle)&&a.tier===tier)?tier:'primary'
    const nextFamily =
      families.find((candidate) =>
        aromas.some((a) => a.family === candidate && a.styles.includes(nextStyle) && a.tier === nextTier),
      ) ?? families[0];
    const nextAroma = aromas.find(
      (a) => a.family === nextFamily && a.styles.includes(nextStyle) && a.tier === nextTier,
    );
    setStyle(nextStyle);
    setTier(nextTier)
    setFamily(nextFamily);
    if (nextAroma) setSelected(nextAroma);
  }
  function selectTier(nextTier: Aroma["tier"]) {
    const nextAroma=aromas.find(a=>a.tier===nextTier&&a.styles.includes(style));if(!nextAroma)return
    setTier(nextTier); setFamily(nextAroma.family); setSelected(nextAroma); setIntensity(1)
  }
  return (
    <div className="page aroma-page">
      <PageIntro eyebrow={copy.aromaEyebrow} title={copy.aromaTitle}>
        <p>{copy.aromaIntro}</p>
      </PageIntro>
      <div className="lens-tabs" aria-label={ui.wineStyleLens}>
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
            {styleLabel(item,locale)}
          </button>
        ))}
      </div>
      <div className="aroma-tier-tabs" aria-label={ui.aromaOriginLayer}>
        {(["primary","secondary","tertiary"] as const).map((item)=><button key={item} disabled={!aromas.some(a=>a.tier===item&&a.styles.includes(style))} className={tier===item?'active':''} onClick={()=>selectTier(item)}><span>{item==='primary'?'01':item==='secondary'?'02':'03'}</span><strong>{ui[item]}</strong><small>{item==='primary'?ui.primaryHelp:item==='secondary'?ui.secondaryHelp:ui.tertiaryHelp}</small></button>)}
      </div>
      <div className="aroma-guidebar"><div className="aroma-breadcrumb"><span>{lensCopy.family}</span><button onClick={()=>setFamily(selected.family)}>{selectedContent.family}</button><ChevronRight/><span>{lensCopy.subfamily}</span><button>{selectedContent.subfamily}</button><ChevronRight/><span>{lensCopy.aroma}</span><strong>{selectedContent.name}</strong></div><p><Compass size={16}/>{lensCopy.help}</p><button className="aroma-reset" onClick={resetLens}><RotateCcw size={15}/>{lensCopy.reset}</button></div>
      <section className="wheel-layout">
        <div className="wheel-wrap">
          <svg
            viewBox="0 0 520 520"
            className="aroma-wheel"
            role="group"
            aria-label={`${styleLabel(style,locale)} · ${ui.aromaFamilyWheel}`}
          >
            {visibleFamilies.map((item, index) => {
              const angle = 360 / visibleFamilies.length;
              return (
                <path
                  key={item}
                  role="button"
                  tabIndex={0}
                  aria-label={aromaContent(aromas.find(a=>a.family===item)!,locale).family}
                  className={family === item ? "selected" : ""}
                  d={donutPath(
                    260,
                    260,
                    104,
                    196,
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
                    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
                      event.preventDefault();const direction=event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:1,next=visibleFamilies[(index+direction+visibleFamilies.length)%visibleFamilies.length];setFamily(next);const first=aromas.find(a=>a.family===next&&a.styles.includes(style)&&a.tier===tier);if(first)chooseAroma(first)
                    }
                  }}
                />
              );
            })}
            {visibleAromas.map((item,index)=>{
              const angle=360/visibleAromas.length
              const itemContent=aromaContent(item,locale)
              return <path key={item.id} data-aroma-id={item.id} role="button" tabIndex={0} aria-current={selected.id===item.id?'true':undefined} aria-label={`${itemContent.subfamily}: ${itemContent.name}`} className={`descriptor-segment ${selected.id===item.id?'selected':''}`} d={donutPath(260,260,204,248,index*angle+1,(index+1)*angle-1)} onClick={()=>chooseAroma(item)} onKeyDown={(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();chooseAroma(item)}moveWithArrows(event,visibleAromas,item)}}/>
            })}
            <circle cx="260" cy="260" r="82" />
            <text x="260" y="248" data-testid="active-aroma-style">
              {style.toUpperCase()}
            </text>
            <text x="260" y="277">
              {ui.aromaLens.toUpperCase()}
            </text>
            {visibleFamilies.map((item, index) => {
              const angle = (index + 0.5) * (360 / visibleFamilies.length) - 90;
              const point = polar(260, 260, 150, angle);
              return (
                <text
                  key={item}
                  x={point.x}
                  y={point.y}
                  className="wheel-label"
                >
                  {aromaContent(aromas.find(a=>a.family===item)!,locale).family.split(" ")[0]}
                </text>
              );
            })}
            {visibleAromas.map((item,index)=>{
              const angle=(index+.5)*(360/visibleAromas.length)-90
              const point=polar(260,260,226,angle)
              const label=aromaContent(item,locale).name
              return <text key={item.id} x={point.x} y={point.y} className="descriptor-label">{label.length>10?label.slice(0,9)+'…':label}</text>
            })}
          </svg>
        </div>
        <aside className="aroma-detail">
          <span className="eyebrow">{selectedContent.family} · {selectedContent.subfamily}</span>
          <h2>{selectedContent.name}</h2>
          <p className="sensory-reference">“{selectedContent.reference}”</p>
          <p>{selectedContent.origin}</p>
          <div className="intensity-scale">
            <div><span>{ui.intensityGlass}</span><strong>{selectedContent.intensity[intensity]}</strong></div>
            <div>{selectedContent.intensity.map((label,index)=><button key={label} className={intensity===index?'active':''} onClick={()=>setIntensity(index)} aria-label={label}><i/></button>)}</div>
          </div>
          <div className="aroma-options">
            {visibleAromas.map((a) => (
              <button
                className={selected.id === a.id ? "active" : ""}
                onClick={() => chooseAroma(a)}
                key={a.id}
              >
                {aromaContent(a,locale).name}
              </button>
            ))}
          </div>
          <div className="aroma-learning-actions"><button className="primary-button ink" onClick={addAromaNote}><NotebookPen size={16}/>{lensCopy.note}</button><button className="secondary-button" onClick={addAromaLearning}><Layers3 size={16}/>{lensCopy.learn}</button></div>
          {lensNotice&&<p className="aroma-notice" role="status"><Check size={15}/>{lensNotice}</p>}
          <section className="aroma-confusion"><span className="eyebrow">{lensCopy.confuse}</span><p>{lensCopy.compareBody}</p><div>{confusionPairs.map(item=><button key={item.id} onClick={()=>chooseAroma(item)}><span>{aromaContent(item,locale).subfamily}</span><strong>{aromaContent(item,locale).name}</strong><small>{aromaContent(item,locale).reference}</small></button>)}</div></section>
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
      <section className="aroma-reference-panel"><img src={aromaReference} alt={ui.aromaReferenceAlt}/><div><span className="eyebrow">{ui.calibrate}</span><h2>{ui.smellBeforeName}</h2><p>{ui.smellBody}</p><Link to="/learn/aroma-language" className="primary-button ink">{ui.openSensory}</Link></div></section>
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
  const {locale}=useLocale()
  const ui=useUiCopy()
  const localizedArticles=articles.map(article=>articleContent(article,locale))
  const tracks=[
    {name:ui.trackTaste,description:ui.trackTasteBody,ids:['taste-with-intention','aroma-language','wine-faults']},
    {name:ui.trackVineyard,description:ui.trackVineyardBody,ids:['vine-year','terroir-layers','climate-and-altitude']},
    {name:ui.trackCellar,description:ui.trackCellarBody,ids:['vine-to-glass','fermentation','maturation-vessels','lees-and-malolactic']},
    {name:ui.trackTable,description:ui.trackTableBody,ids:['labels-and-origin','food-pairing','service','cellaring']},
  ]
  return (
    <div className="page learn-page">
      <PageIntro eyebrow={copy.learnEyebrow} title={copy.learnTitle}>
        <p>{copy.learnIntro}</p>
      </PageIntro>
      <section className="lead-article">
        <img src={winemakingJourney} alt={ui.learningJourneyAlt} />
        <div>
          <span>
            {localizedArticles[0].eyebrow} · {localizedArticles[0].minutes} {ui.minRead}
          </span>
          <h2>{localizedArticles[0].title}</h2>
          <p>{localizedArticles[0].summary}</p>
          <Link to={`/learn/${localizedArticles[0].id}`} className="primary-button ink">
            {copy.readStory}
          </Link>
        </div>
      </section>
      <section className="learning-tracks">
        <div className="section-heading"><div><span className="eyebrow">{ui.structuredPaths}</span><h2>{ui.chooseQuestion}</h2></div><span>{articles.length} {ui.illustratedLessons}</span></div>
        <div>{tracks.map((track,index)=><article key={track.name}><span>0{index+1}</span><h3>{track.name}</h3><p>{track.description}</p><div>{track.ids.map(id=>{const lesson=localizedArticles.find(item=>item.id===id);return lesson?<Link key={id} to={`/learn/${id}`}>{lesson.title}<ChevronRight size={14}/></Link>:null})}</div></article>)}</div>
      </section>
      <section className="academy-visuals">
        <Link to="/learn/terroir-layers"><img src={terroirIllustration} alt={ui.terroirAlt}/><span><small>{ui.interactiveFoundation}</small><strong>{ui.readTerroir}</strong></span></Link>
        <Link to="/learn/aroma-language"><img src={aromaReference} alt={ui.aromaGlassAlt}/><span><small>{ui.sensoryPractice}</small><strong>{ui.buildMemory}</strong></span></Link>
        <Link to="/learn/vine-year"><img src={vineSeasonStudy} alt=""/><span><small>{ui.structuredPaths}</small><strong>{localizedArticles.find(article=>article.id==='vine-year')?.title}</strong></span></Link>
        <Link to="/learn/soil-water-roots"><img src={soilAtlas} alt=""/><span><small>{ui.interactiveFoundation}</small><strong>{localizedArticles.find(article=>article.id==='soil-water-roots')?.title}</strong></span></Link>
      </section>
      <div className="article-index">
        {localizedArticles.slice(1).map((article, index) => (
          <Link to={`/learn/${article.id}`} key={article.id}>
            <span>{String(index + 2).padStart(2, "0")}</span>
            <div>
              <small>
                {article.eyebrow} · {article.minutes} {ui.minRead}
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
  const {locale}=useLocale()
  const ui=useUiCopy()
  const { slug } = useParams();
  const sourceArticle = articles.find((a) => a.id === slug);
  if (!sourceArticle) return <NotFound />;
  const article=articleContent(sourceArticle,locale)
  const nextArticle=articleContent(articles[(articles.indexOf(sourceArticle)+1)%articles.length],locale)
  const illustration=article.image==='terroir'?terroirIllustration:article.image==='winemaking'?winemakingJourney:article.image==='aroma'?aromaReference:article.image==='soil'?soilAtlas:article.image==='bottle'?bottleForms:article.id==='vine-year'||article.id==='vintage-weather'?vineSeasonStudy:tastingStill
  return (
    <article className="page reading-page">
      <BackLink to="/learn" label={copy.learnEyebrow} />
      <header>
        <span className="eyebrow">
          {article.eyebrow} · {article.minutes} {ui.minuteRead}
        </span>
        <h1>{article.title}</h1>
        <p>{article.summary}</p>
      </header>
      <figure className="lesson-hero"><img src={illustration} alt={`${ui.illustrationFor} ${article.title}`}/><figcaption>{ui.lessonCaption}</figcaption></figure>
      <section className="lesson-objectives"><span className="eyebrow">{ui.byEnd}</span><h2>{ui.threeExplain}</h2><ol>{article.objectives.map((objective,index)=><li key={objective}><span>0{index+1}</span>{objective}</li>)}</ol></section>
      <div className="article-body">
        {article.body.map((p, i) => (
          <section key={p}><span>{String(i+1).padStart(2,'0')}</span><p>{p}</p></section>
        ))}
        <div className="lesson-lab"><div><span className="eyebrow">{ui.inTheGlass}</span><h3>{ui.concreteComparison}</h3><p>{article.example}</p></div><div><span className="eyebrow">{ui.tryYourself}</span><h3>{ui.fiveMinuteExercise}</h3><p>{article.exercise}</p></div></div>
        <h2>{copy.takeTable}</h2>
        <p>{ui.lessonPractice}</p>
      </div>
      <AcademyMasterclass article={article} locale={locale}/>
      <section className="lesson-sources"><span className="eyebrow">{locale==='de'?'Fachliche Quellen':locale==='fr'?'Sources techniques':locale==='es'?'Fuentes técnicas':'Technical sources'}</span><h2>{locale==='de'?'Weiterlesen und überprüfen':locale==='fr'?'Approfondir et vérifier':locale==='es'?'Profundizar y verificar':'Read further and verify'}</h2><p>{locale==='de'?'Die Lektion wurde entlang dieser Primär- und Fachquellen aufgebaut. Öffne sie, wenn du Definitionen, Verfahren oder Grenzwerte im Original prüfen möchtest.':locale==='fr'?'La leçon s’appuie sur ces sources primaires et techniques. Consultez-les pour vérifier définitions, pratiques et limites dans le texte original.':locale==='es'?'La lección se apoya en estas fuentes primarias y técnicas. Ábrelas para comprobar definiciones, prácticas y límites en el texto original.':'This lesson is structured around these primary and technical sources. Open them to verify definitions, practices and limits in their original context.'}</p><div>{article.sources.map(source=><a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label}<ArrowRight/></a>)}</div></section>
      <section className="lesson-connections"><span className="eyebrow">{ui.continueAtlas}</span><h2>{ui.seeIdea}</h2><div className="thread-cloud">{regions.filter(region=>article.relatedRegionIds.includes(region.id)).map(region=><ThreadLink key={region.id} to={`/regions/${region.id}`} tone="moss">{region.name}</ThreadLink>)}{grapes.filter(grape=>article.relatedGrapeIds.includes(grape.id)).map(grape=><ThreadLink key={grape.id} to={`/grapes/${grape.id}`}>{grape.name}</ThreadLink>)}</div></section>
      <div className="next-read">
        <span>{copy.continueLearning}</span>
        <Link
          to={`/learn/${nextArticle.id}`}
        >
          {nextArticle.title}
          <ArrowRight />
        </Link>
      </div>
    </article>
  );
}

const tastingFlight = wines.slice(12, 17);
function TastingsPage() {
  const { t } = useLocale();
  const ui=useUiCopy()
  const copy = usePageCopy();
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  return (
    <div className="page tastings-page">
      <PageIntro
        eyebrow={copy.tastingsEyebrow}
        title={copy.tastingsTitle}
        action={<Link to="/tastings/build" className="primary-button"><Layers3 size={17}/> {ui.planJourney}</Link>}
      >
        <p>{copy.tastingsIntro}</p>
      </PageIntro>
      <section className="tasting-feature">
        <img
          src={tastingStill}
          alt={ui.tastingImageAlt}
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
              <dd>19:30 · 75 {ui.minuteShort}</dd>
            </div>
            <div>
              <dt>{copy.host}</dt>
              <dd>Mara Chen</dd>
            </div>
            <div>
              <dt>{copy.seats}</dt>
              <dd>{ui.tastingSeats}</dd>
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
            aria-label={ui.tastingCode}
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
            <span>{ui.sepAbbr}</span>
            <div>
              <h3>{ui.rieslingSession}</h3>
              <p>{ui.inviteOnly} · {ui.hostedBy} Jo Becker</p>
            </div>
            <LockKeyhole />
          </div>
          <div>
            <b>27</b>
            <span>{ui.sepAbbr}</span>
            <div>
              <h3>{ui.mediterraneanReds}</h3>
              <p>{ui.openTable} · 16 {ui.seats}</p>
            </div>
            <Users />
          </div>
        </div>
      </section>
    </div>
  );
}

function chapterTypesFor(ui:ReturnType<typeof useUiCopy>,locale:Locale='en'):Array<{type:TastingChapterType;label:string;help:string}> {return [
  {type:'wine',label:ui.chapterWine,help:ui.chapterWineHelp}, {type:'region',label:ui.chapterRegion,help:ui.chapterRegionHelp},
  {type:'producer',label:ui.chapterProducer,help:ui.chapterProducerHelp}, {type:'grape',label:ui.chapterGrape,help:ui.chapterGrapeHelp},
  {type:'aroma',label:ui.chapterAroma,help:ui.chapterAromaHelp}, {type:'article',label:ui.chapterLesson,help:ui.chapterLessonHelp},
  {type:'learning-block',label:{en:'Learning block',de:'Lernblock',fr:'Bloc pédagogique',es:'Bloque de aprendizaje'}[locale],help:learningUi[locale].tastingBody},
  {type:'host-note',label:ui.chapterHost,help:ui.chapterHostHelp}, {type:'pause',label:ui.chapterPause,help:ui.chapterPauseHelp},
]}
function optionsForChapter(type:TastingChapterType,locale:Locale='en') {
  if(type==='wine') return wines.map(item=>({id:item.id,label:`${item.name} · ${item.vintage ?? 'NV'}`}))
  if(type==='region') return regions.map(item=>({id:item.id,label:`${item.name} · ${countryLabel(item.country,locale)}`}))
  if(type==='producer') return producers.map(item=>({id:item.id,label:item.name}))
  if(type==='grape') return grapes.map(item=>({id:item.id,label:item.name}))
  if(type==='aroma') return aromas.map(item=>{const content=aromaContent(item,locale);return {id:item.id,label:`${content.family} · ${content.name}`}})
  if(type==='article') return [...learningModules.map(item=>({id:item.id,label:`${learningUi[locale].addWhole} · ${item.title[locale]}`})),...articles.map(item=>({id:item.id,label:articleContent(item,locale).title}))]
  if(type==='learning-block') return learningModules.flatMap(module=>module.blocks.filter(block=>!['sources','glossary','entity-connections'].includes(block.kind)).map(block=>({id:block.id,label:`${module.title[locale]} · ${block.title[locale]}`})))
  return []
}
function referenceTitle(type:TastingChapterType,id:string|undefined,locale:Locale,ui:ReturnType<typeof useUiCopy>) {
  if(!id) return type==='pause'?ui.pauseConversation:ui.chapterHost
  if(type==='article'){const module=learningModuleById(id);if(module)return module.title[locale]}
  return optionsForChapter(type,locale).find(item=>item.id===id)?.label.split(' · ')[0] ?? ui.untitledChapter
}
function defaultJourney(locale:Locale,ui:ReturnType<typeof useUiCopy>):TastingJourney {
  const first=wines[12], second=wines[13], region=regions.find(item=>item.id===first.regionId)!, producer=producers.find(item=>item.id===first.producerId)!
  const chapters:Array<Omit<TastingChapter,'id'>>=[
    {type:'host-note',title:ui.welcomeTable,hostNote:ui.welcomeQuestion,duration:4},
    {type:'wine',referenceId:first.id,title:first.name,duration:12}, {type:'region',referenceId:region.id,title:region.name,duration:7},
    {type:'producer',referenceId:producer.id,title:producer.name,duration:6}, {type:'article',referenceId:'red-white-rose',title:articleContent(articles.find(item=>item.id==='red-white-rose')!,locale).title,duration:8},
    {type:'pause',title:ui.waterBreadConversation,hostNote:ui.compareNoticed,duration:5},
    {type:'wine',referenceId:second.id,title:second.name,duration:12},
  ]
  return {id:crypto.randomUUID(),title:ui.defaultJourneyTitle,description:ui.defaultJourneyDescription,pace:'host',access:'invite',chapters:chapters.map(item=>({...item,id:crypto.randomUUID()})),updatedAt:new Date().toISOString()}
}
function TastingBuilder() {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const chapterTypes=chapterTypesFor(ui,locale)
  const navigate=useNavigate()
  const [journey,setJourney]=useState<TastingJourney>(()=>repository.journeys.all()[0]??defaultJourney(locale,ui))
  const [type,setType]=useState<TastingChapterType>('wine')
  const [referenceId,setReferenceId]=useState(()=>optionsForChapter('wine')[0]?.id ?? '')
  const [note,setNote]=useState('')
  const [duration,setDuration]=useState(7)
  const [saved,setSaved]=useState(false)
  const options=optionsForChapter(type,locale)
  const chapterCountLabel=journey.chapters.length===1?{en:'chapter',de:'Kapitel',fr:'chapitre',es:'capítulo'}[locale]:ui.chapters
  function chooseType(next:TastingChapterType){setType(next);setReferenceId(optionsForChapter(next,locale)[0]?.id ?? '');setNote('')}
  function addChapter(){
    const title=referenceTitle(type,referenceId,locale,ui)
    setJourney(current=>({...current,chapters:[...current.chapters,{id:crypto.randomUUID(),type,referenceId:referenceId||undefined,title,hostNote:note||undefined,duration}],updatedAt:new Date().toISOString()}));setSaved(false)
  }
  function move(index:number,direction:-1|1){setJourney(current=>{const chapters=[...current.chapters],target=index+direction;if(target<0||target>=chapters.length)return current;[chapters[index],chapters[target]]=[chapters[target],chapters[index]];return {...current,chapters,updatedAt:new Date().toISOString()}});setSaved(false)}
  function save(){const all=repository.journeys.all();repository.journeys.save([...all.filter(item=>item.id!==journey.id),journey]);setSaved(true)}
  return <div className="page journey-builder">
    <BackLink to="/tastings" label={ui.chapterLesson}/>
    <PageIntro eyebrow={ui.hostStudio} title={ui.composeJourney} action={<button className="primary-button" onClick={save}>{saved?<><Check/>{ui.journeySaved}</>:<>{ui.saveJourney}<Check/></>}</button>}>
      <p>{ui.composeBody}</p>
    </PageIntro>
    <section className="journey-settings">
      <label>{ui.journeyTitle}<input value={journey.title} onChange={event=>setJourney({...journey,title:event.target.value})}/></label>
      <label>{ui.invitationText}<textarea value={journey.description} onChange={event=>setJourney({...journey,description:event.target.value})}/></label>
      <label>{ui.pacing}<select value={journey.pace} onChange={event=>setJourney({...journey,pace:event.target.value as TastingJourney['pace']})}><option value="host">{ui.hostUnlocks}</option><option value="self">{ui.guestPace}</option></select></label>
      <label>{ui.access}<select value={journey.access} onChange={event=>setJourney({...journey,access:event.target.value as TastingJourney['access']})}><option value="invite">{ui.inviteQr}</option><option value="private">{ui.privateDraft}</option><option value="open">{ui.openTable}</option></select></label>
    </section>
    <div className="builder-layout">
      <section className="chapter-palette">
        <span className="eyebrow">{ui.addChapter}</span><h2>{ui.whatNext}</h2>
        <div className="chapter-type-grid">{chapterTypes.map(item=><button key={item.type} className={type===item.type?'active':''} onClick={()=>chooseType(item.type)}><span>{item.label}</span><small>{item.help}</small></button>)}</div>
        {options.length>0&&<label>{ui.atlasContent}<select value={referenceId} onChange={event=>setReferenceId(event.target.value)}>{options.map(item=><option value={item.id} key={item.id}>{item.label}</option>)}</select></label>}
        {(type==='host-note'||type==='pause')&&<label>{ui.yourWords}<textarea value={note} onChange={event=>setNote(event.target.value)} placeholder={ui.hostPlaceholder}/></label>}
        <label>{ui.timeTable}<div className="duration-input"><input type="range" min="2" max="25" value={duration} onChange={event=>setDuration(Number(event.target.value))}/><span>{duration} {ui.minuteShort}</span></div></label>
        <button className="primary-button" onClick={addChapter}><Plus/>{ui.addStoryline}</button>
      </section>
      <section className="storyline-editor">
        <div className="section-heading"><div><span className="eyebrow">{ui.storyline}</span><h2>{journey.chapters.length} {chapterCountLabel} · {journey.chapters.reduce((sum,item)=>sum+item.duration,0)} {ui.minuteShort}</h2></div></div>
        <div className="storyline-list">{journey.chapters.map((chapter,index)=><article key={chapter.id}>
          <GripVertical className="drag-hint"/><span className="chapter-number">{String(index+1).padStart(2,'0')}</span>
          <div><small>{chapterTypes.find(item=>item.type===chapter.type)?.label} · {chapter.duration} {ui.minuteShort}</small><h3>{chapter.title}</h3>{chapter.hostNote&&<p>{chapter.hostNote}</p>}</div>
          <div className="chapter-actions"><button onClick={()=>move(index,-1)} disabled={index===0} aria-label={ui.moveEarlier}><ChevronUp/></button><button onClick={()=>move(index,1)} disabled={index===journey.chapters.length-1} aria-label={ui.moveLater}><ChevronDown/></button><button onClick={()=>setJourney({...journey,chapters:journey.chapters.filter(item=>item.id!==chapter.id)})} aria-label={ui.removeChapter}><Trash2/></button></div>
        </article>)}</div>
        <div className="builder-footer"><div><strong>{journey.pace==='host'?ui.hostPaced:ui.selfPaced}</strong><span>{journey.access==='open'?ui.anyoneJoin:journey.access==='invite'?ui.inviteAccess:ui.privateDraft}</span></div><button className="secondary-button" onClick={()=>{save();navigate(`/tastings/${journey.id}`)}}>{ui.previewJourney} <ArrowRight/></button></div>
      </section>
    </div>
  </div>
}

function JourneyExperience({journey}:{journey:TastingJourney}) {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const chapterTypes=chapterTypesFor(ui,locale)
  const [current,setCurrent]=useState(0);const chapter=journey.chapters[current]
  const wine=chapter?.type==='wine'?wines.find(item=>item.id===chapter.referenceId):undefined
  const region=chapter?.type==='region'?regions.find(item=>item.id===chapter.referenceId):undefined
  const producer=chapter?.type==='producer'?producers.find(item=>item.id===chapter.referenceId):undefined
  const grape=chapter?.type==='grape'?grapes.find(item=>item.id===chapter.referenceId):undefined
  const aroma=chapter?.type==='aroma'?aromas.find(item=>item.id===chapter.referenceId):undefined
  const article=chapter?.type==='article'?articles.find(item=>item.id===chapter.referenceId):undefined
  const lessonModule=chapter?.type==='article'?learningModuleById(chapter.referenceId??''):undefined
  const learning=chapter?.type==='learning-block'?learningBlockById(chapter.referenceId??''):undefined
  const link=wine?`/wines/${wine.id}`:region?`/regions/${region.id}`:producer?`/wineries/${producer.id}`:grape?`/grapes/${grape.id}`:aroma?`/aromas?selected=${aroma.id}`:article?`/learn/${article.id}`:lessonModule?`/learn/${lessonModule.id}`:learning?`/learn/${learning.module.id}`:null
  const body=wine?wineContent(wine,producers.find(item=>item.id===wine.producerId)!,regions.find(item=>item.id===wine.regionId)!,locale).summary:region?regionContent(region,locale).summary:producer?producerContent(producer,regions.find(item=>item.id===producer.regionId)!,locale).summary:grape?grapeContent(grape,locale).summary:aroma?aromaContent(aroma,locale).reference:article?articleContent(article,locale).summary:lessonModule?lessonModule.question[locale]:learning?learning.module.question[locale]:chapter?.hostNote??ui.quietMoment
  return <div className="journey-room">
    <header><Link to="/tastings"><X/></Link><div><small>{journey.pace==='host'?ui.hostLearningJourney:ui.selfLearningJourney}</small><strong>{journey.title}</strong></div><span>{current+1} / {journey.chapters.length}</span></header>
    <aside>{journey.chapters.map((item,index)=><button key={item.id} className={index===current?'active':index<current?'done':''} onClick={()=>setCurrent(index)}><span>{index<current?<Check/>:String(index+1).padStart(2,'0')}</span><div><small>{chapterTypes.find(type=>type.type===item.type)?.label}</small><strong>{item.title}</strong></div><em>{item.duration}m</em></button>)}</aside>
    <main><span className="eyebrow">{ui.chapter} {String(current+1).padStart(2,'0')} · {chapterTypes.find(item=>item.type===chapter?.type)?.label}</span><h1>{chapter?.title}</h1><p className="lead">{body}</p>
      {wine&&<div className="journey-wine"><div className={`room-bottle style-${wine.style}`}/><div><span>{wine.composition}</span><p>{wine.serving}</p></div></div>}
      {region&&<div className="journey-facts"><article><span>{ui.climate}</span><p>{regionContent(region,locale).climate}</p></article><article><span>{ui.ground}</span><p>{regionContent(region,locale).soil}</p></article></div>}
      {producer&&<div className="journey-facts"><article><span>{ui.vineyard}</span><p>{producerContent(producer,regions.find(item=>item.id===producer.regionId)!,locale).vineyard}</p></article><article><span>{ui.cellarLabel}</span><p>{producerContent(producer,regions.find(item=>item.id===producer.regionId)!,locale).cellar}</p></article></div>}
      {grape&&<div className="journey-facts"><article><span>{ui.growing}</span><p>{grapeContent(grape,locale).ripening}</p></article><article><span>{ui.cellarLabel}</span><p>{grapeContent(grape,locale).winemaking}</p></article></div>}
      {aroma&&<div className="journey-aroma"><span>{aromaContent(aroma,locale).family} · {aromaContent(aroma,locale).subfamily}</span><strong>{aromaContent(aroma,locale).name}</strong><p>{aromaContent(aroma,locale).origin}</p></div>}
      {article&&<ol className="journey-objectives">{articleContent(article,locale).objectives.map(item=><li key={item}>{item}</li>)}</ol>}
      {lessonModule&&<InlineLearningChapter referenceId={lessonModule.id}/>}
      {learning&&<InlineLearningChapter referenceId={learning.block.id}/>}
      {link&&<Link to={link} className="text-link">{ui.openComplete} <ArrowRight size={15}/></Link>}
      <div className="journey-navigation"><button className="secondary-button" disabled={current===0} onClick={()=>setCurrent(current-1)}><ArrowLeft/>{ui.previous}</button><div><small>{ui.upNext}</small><strong>{journey.chapters[current+1]?.title??ui.journeyComplete}</strong></div><button className="primary-button" disabled={current===journey.chapters.length-1} onClick={()=>setCurrent(current+1)}>{ui.nextChapter}<ArrowRight/></button></div>
    </main>
  </div>
}

function TastingRoom() {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const cellarAction={en:{add:'Add to my cellar',added:'In my cellar'},de:{add:'In meinen Keller legen',added:'In meinem Keller'},fr:{add:'Ajouter à ma cave',added:'Dans ma cave'},es:{add:'Añadir a mi bodega',added:'En mi bodega'}}[locale]
  const { id = "open-table" } = useParams();
  const journey=repository.journeys.all().find(item=>item.id===id)
  if(journey) return <JourneyExperience journey={journey}/>
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState(0);
  const [selectedAromas, setSelectedAromas] = useState<string[]>([]);
  const [fields, setFields] = useState({
    appearance: ui.defaultAppearance,
    palate: "",
    reflection: "",
  });
  const [saved, setSaved] = useState(false);
  const [,setCellarVersion]=useState(0)
  const wine = tastingFlight[current];
  const inCellar=repository.cellar.all().some(item=>item.wineId===wine.id)
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
    const cellar=repository.cellar.all(),cellarItem=cellar.find(item=>item.wineId===wine.id)
    if(cellarItem){
      cellarItem.notes=[...(cellarItem.notes??[]),{id:next.id,appearance:next.appearance,aromaIds:next.aromaIds,palate:next.palate,finish:'',reflection:next.reflection,acidity:3,tannin:wine.style==='red'?3:1,body:3,rating:next.rating,createdAt:next.createdAt}]
      cellarItem.rating=next.rating
      repository.cellar.save(cellar)
      setCellarVersion(value=>value+1)
    }
    setSaved(true);
  }
  function addCurrentWine(){
    const cellar=repository.cellar.all(),existing=cellar.find(item=>item.wineId===wine.id)
    if(existing){existing.quantity+=1;existing.state='tasted'}else{cellar.push({id:crypto.randomUUID(),wineId:wine.id,state:'tasted',quantity:1,location:ui.homeCellar,vintage:wine.vintage??undefined,bottleSizeMl:750,notes:[]})}
    repository.cellar.save(cellar);setCellarVersion(value=>value+1)
  }
  return (
    <div className="tasting-room">
      <header className="room-header">
        <Link to="/tastings">
          <X />
        </Link>
        <div>
          <small>
            {ui.liveTasting} · {ui.wine} {current + 1} {ui.of} {tastingFlight.length}
          </small>
          <strong>{ui.defaultTastingTitle}</strong>
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
              {wine.vintage ?? ui.nonVintage}
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
            <button className={inCellar?'secondary-button cellar-added':'secondary-button'} onClick={addCurrentWine}>{inCellar?<Check/>:<Plus/>}{inCellar?cellarAction.added:cellarAction.add}</button>
          </div>
        </section>
        <div className="note-steps">
          {[ui.look, ui.smell, ui.taste, ui.reflect].map((name, i) => (
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
              <span className="eyebrow">{ui.stepOne} · {ui.look}</span>
              <h2>{ui.glassShow}</h2>
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
              <span className="eyebrow">{ui.stepTwo} · {ui.smell}</span>
              <h2>{ui.closestReferences}</h2>
              <p>{ui.noCorrectNumber}</p>
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
                      {aromaContent(a,locale).name}
                    </button>
                  ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <span className="eyebrow">{ui.stepThree} · {ui.taste}</span>
              <h2>{ui.wineBuilt}</h2>
              <textarea
                placeholder={ui.palatePlaceholder}
                value={fields.palate}
                onChange={(e) =>
                  setFields({ ...fields, palate: e.target.value })
                }
              />
            </>
          )}
          {step === 3 && (
            <>
              <span className="eyebrow">{ui.stepFour} · {ui.reflect}</span>
              <h2>{ui.remember}</h2>
              <textarea
                placeholder={ui.reflectionPlaceholder}
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
              {ui.privateYou}
            </small>
            {step < 3 ? (
              <button
                className="primary-button"
                onClick={() => setStep(step + 1)}
              >
                {ui.nextStep} <ArrowRight />
              </button>
            ) : (
              <button className="primary-button" onClick={saveNote}>
                {saved ? (
                  <>
                    <Check />
                    {ui.noteSaved}
                  </>
                ) : (
                  <>
                    {ui.saveNote} <NotebookPen />
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
        <h3>{ui.bringTable}</h3>
        <p>{ui.shareQr}</p>
      </aside>
    </div>
  );
}

function CellarPage() {
  const { t } = useLocale();
  const ui=useUiCopy()
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
                <div className={`cellar-bottle-media style-${wine?.style ?? "red"}`}>
                  {item.imageDataUrl?<img src={item.imageDataUrl} alt={`${ui.bottle} · ${wine?.name||item.customName}`}/>:<div className="cellar-bottle"/>}
                </div>
                <div>
                  <small>
                    {(item.state==='wishlist'?ui.wishList:ui[item.state])} · {item.vintage || wine?.vintage || ui.nonVintage}
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
                      {item.quantity} {item.quantity === 1 ? ui.bottle : ui.bottles}
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
  const ui=useUiCopy()
  const [catalogue, setCatalogue] = useState(true);
  const [wineId, setWineId] = useState(wines[0].id);
  const [custom, setCustom] = useState({ name: "", producer: "", region: "" });
  const [state, setState] = useState<CellarItem["state"]>("owned");
  const [imageDataUrl,setImageDataUrl]=useState<string>()
  const [imageError,setImageError]=useState('')
  const [preparingImage,setPreparingImage]=useState(false)
  async function chooseImage(file?:File){
    if(!file)return;setImageError('');setPreparingImage(true)
    try{setImageDataUrl(await prepareBottlePhoto(file))}catch{setImageError(ui.photoError)}finally{setPreparingImage(false)}
  }
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
      location: ui.homeCellar,
      imageDataUrl,
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
        <span className="eyebrow">{ui.personalCollection}</span>
        <h2>{ui.addWine}</h2>
        <div className="bottle-photo-field">
          <div className={imageDataUrl?'photo-preview has-photo':'photo-preview'}>{imageDataUrl?<img src={imageDataUrl} alt={ui.bottlePreview}/>:<ImagePlus/>}</div>
          <div><strong>{ui.bottlePhoto}</strong><p>{ui.photoBody}</p><label className="secondary-button"><ImagePlus size={17}/>{preparingImage?ui.preparingPhoto:imageDataUrl?ui.changePhoto:ui.choosePhoto}<input type="file" accept="image/*" capture="environment" onChange={event=>chooseImage(event.target.files?.[0])}/></label>{imageDataUrl&&<button type="button" className="text-button" onClick={()=>setImageDataUrl(undefined)}>{ui.removePhoto}</button>}{imageError&&<span className="form-error">{imageError}</span>}</div>
        </div>
        <div className="segmented">
          <button
            type="button"
            className={catalogue ? "active" : ""}
            onClick={() => setCatalogue(true)}
          >
            {ui.fromAtlas}
          </button>
          <button
            type="button"
            className={!catalogue ? "active" : ""}
            onClick={() => setCatalogue(false)}
          >
            {ui.personalEntry}
          </button>
        </div>
        {catalogue ? (
          <label>
            {ui.wine}
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
              {ui.wineName}
              <input
                required
                value={custom.name}
                onChange={(e) => setCustom({ ...custom, name: e.target.value })}
              />
            </label>
            <label>
              {ui.producer}
              <input
                value={custom.producer}
                onChange={(e) =>
                  setCustom({ ...custom, producer: e.target.value })
                }
              />
            </label>
            <label>
              {ui.region}
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
          {ui.collection}
          <select
            value={state}
            onChange={(e) => setState(e.target.value as CellarItem["state"])}
          >
            <option value="owned">{ui.owned}</option>
            <option value="wishlist">{ui.wishList}</option>
            <option value="tasted">{ui.tasted}</option>
            <option value="finished">{ui.finished}</option>
          </select>
        </label>
        <button className="primary-button">{ui.saveCellar}</button>
      </form>
    </div>
  );
}

function AdminPage() {
  const { user } = useAuth();
  const { t,locale } = useLocale();
  const ui=useUiCopy()
  const copy = usePageCopy();
  const [type, setType] = useState("Region");
  const [name, setName] = useState("");
  const [items, setItems] = useState(() => repository.additions.all());
  if (user?.role !== "admin")
    return (
      <div className="page guarded">
        <ShieldCheck />
        <h1>{ui.curatorsOnly}</h1>
        <p>{ui.curatorsOnlyBody}</p>
        <Link to="/profile" className="primary-button ink">
          {ui.openProfile}
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
      <DatabaseStatus />
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
            <h2>{ui.recentRecords}</h2>
            <button>
              <Filter />
              {ui.filter}
            </button>
          </div>
          {regions.slice(0, 6).map((region) => (
            <div key={region.id}>
              <span className="record-icon">
                <MapIcon />
              </span>
              <div>
                <strong>{region.name}</strong>
                <small>{countryLabel(region.country,locale)} · {ui.curated} · {ui.reviewed} {new Intl.DateTimeFormat(locale,{dateStyle:'medium'}).format(new Date())}</small>
              </div>
              <button aria-label={ui.settings}>
                <Settings />
              </button>
            </div>
          ))}
        </div>
        <form className="admin-form" onSubmit={add}>
          <span className="eyebrow">{ui.newRecord}</span>
          <h2>{ui.addAtlas}</h2>
          <label>
            {ui.recordType}
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Region">{ui.region}</option>
              <option value="Grape">{ui.grape}</option>
              <option value="Producer">{ui.producer}</option>
              <option value="Wine">{ui.wine}</option>
              <option value="Tasting">{ui.tasting}</option>
            </select>
          </label>
          <label>
            {ui.publishedName}
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={ui.publishedNamePlaceholder}
            />
          </label>
          <label>
            {ui.connectRegion}
            <select>
              <option>{ui.selectRegion}</option>
              {regions.slice(0, 20).map((r) => (
                <option key={r.id}>{r.name}</option>
              ))}
            </select>
          </label>
          <p>{ui.localRecordBody}</p>
          <button className="primary-button">{t("create")}</button>
        </form>
      </section>
      <BusinessAdminPanel />
      {items.length > 0 && (
        <section className="related-section">
          <h2>{ui.personalAdditions}</h2>
          <div className="simple-list">
            {items.map((item: any) => (
              <div key={item.id}>
                <Plus />
                <span>
                  {item.name} · {item.type}
                </span>
                <button aria-label={ui.remove}
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
  const {locale}=useLocale()
  const ui=useUiCopy()
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return [
      ...regions
        .filter((x) => `${x.name} ${x.country}`.toLowerCase().includes(q))
        .slice(0, 4)
        .map((x) => ({
          type: ui.region,
          name: x.name,
          meta: countryLabel(x.country,locale),
          to: `/regions/${x.id}`,
        })),
      ...grapes
        .filter((x) => x.name.toLowerCase().includes(q))
        .slice(0, 3)
        .map((x) => ({
          type: ui.grape,
          name: x.name,
          meta:
            x.color === "red"
              ? ui.darkVariety
              : ui.lightVariety,
          to: `/grapes/${x.id}`,
        })),
      ...producers
        .filter((x) => x.name.toLowerCase().includes(q))
        .slice(0, 3)
        .map((x) => ({
          type: ui.producer,
          name: x.name,
          meta: regions.find((r) => r.id === x.regionId)?.name || "",
          to: `/wineries/${x.id}`,
        })),
      ...wines
        .filter((x) => x.name.toLowerCase().includes(q))
        .slice(0, 4)
        .map((x) => ({
          type: ui.wine,
          name: x.name,
          meta: `${x.vintage ?? ui.nonVintage} · ${styleLabel(x.style,locale)}`,
          to: `/wines/${x.id}`,
        })),
      ...articles
        .filter((x) => {const content=articleContent(x,locale);return `${content.title} ${content.summary}`.toLowerCase().includes(q)})
        .slice(0, 2)
        .map((x) => ({
          type: ui.fieldNote,
          name: articleContent(x,locale).title,
          meta: `${x.minutes} ${ui.minRead}`,
          to: `/learn/${x.id}`,
        })),
    ];
  }, [query,locale,ui]);
  return (
    <div className="search-overlay">
      <header>
        <Search />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ui.searchPlaceholder}
        />
        <button onClick={onClose}>
          <X />
        </button>
      </header>
      <div className="search-body">
        {query.length < 2 ? (
          <div className="search-start">
            <span className="eyebrow">{ui.searchTrace}</span>
            <h2>{ui.whereBegin}</h2>
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
            <h2>{ui.noSearchPath}</h2>
            <p>{ui.noSearchHelp}</p>
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
  const ui=useUiCopy()
  return (
    <div className="page guarded">
      <Compass />
      <h1>{ui.thisPath}</h1>
      <p>{ui.notFoundBody}</p>
      <Link to="/atlas" className="primary-button ink">
        {ui.openAtlas}
      </Link>
    </div>
  );
}
