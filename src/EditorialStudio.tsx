import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileClock,
  Filter,
  Link2,
  MapPin,
  PencilLine,
  Plus,
  Save,
  Search,
  Trash2,
  Wine,
} from "lucide-react";
import {
  aromas,
  grapes,
  producers,
  regions,
  slugify,
  wines,
} from "./data/catalog";
import { repository } from "./data/repository";
import { useLocale, type Locale } from "./i18n";

type RecordType = "region" | "grape" | "producer" | "wine" | "tasting";
type EditorialDraft = {
  id: string;
  recordType: RecordType;
  baseId?: string;
  name: string;
  slug: string;
  status: "draft" | "review";
  locale: Locale;
  summary: string;
  description: string;
  sourceUrls: string[];
  fields: Record<string, string | string[]>;
  createdAt: string;
  updatedAt: string;
};
type CatalogRow = {
  id: string;
  type: Exclude<RecordType, "tasting">;
  name: string;
  meta: string;
};

const copy = {
  en: {
    workspace: "Editorial records",
    title: "Shape every public fact before it reaches the atlas",
    body: "Search the full catalogue, open a record and prepare a sourced change set. Drafts remain local until server authentication and protected write APIs are connected.",
    catalog: "Catalogue",
    drafts: "Drafts",
    newRecord: "New record",
    search: "Search names, regions, producers or wines",
    allTypes: "All record types",
    region: "Region",
    grape: "Grape",
    producer: "Producer",
    wine: "Wine",
    tasting: "Tasting",
    edit: "Prepare change",
    create: "Create record",
    results: "records",
    previous: "Previous",
    next: "Next",
    page: "Page",
    editor: "Structured editor",
    editing: "Editing catalogue record",
    identity: "Identity & publication",
    name: "Published name",
    slug: "Slug",
    language: "Content language",
    status: "Workflow",
    draft: "Draft",
    review: "Ready for review",
    summary: "Card summary",
    description: "Long-form editorial narrative",
    relationships: "Relationships",
    country: "Country",
    parentRegion: "Parent region",
    coordinates: "Coordinates",
    latitude: "Latitude",
    longitude: "Longitude",
    climate: "Climate & season",
    soil: "Geology & soils",
    colour: "Berry colour",
    origin: "Origin",
    leaf: "Leaf description",
    cluster: "Bunch description",
    berry: "Berry description",
    viticulture: "Viticulture & hazards",
    aromaLinks: "Linked aromas",
    regionLinks: "Linked regions",
    website: "Primary website",
    founded: "Founded / historical note",
    philosophy: "Estate point of view",
    cellar: "Cellar approach",
    producerLink: "Producer",
    style: "Style",
    vintage: "Vintage (leave blank if not documented)",
    grapeLinks: "Linked varieties",
    vinification: "Vinification",
    maturation: "Maturation",
    service: "Service & pairing",
    window: "Drinking window",
    access: "Access",
    date: "Date & time",
    storyline: "Learning storyline",
    sources: "Sources & evidence",
    sourceHelp:
      "One authoritative URL per line. A record cannot enter review without a source.",
    save: "Save draft",
    saved: "Draft saved",
    preview: "Editorial preview",
    delete: "Delete draft",
    empty: "No drafts yet.",
    selectMany: "Use Ctrl/Cmd to select several relationships.",
    local: "Local editorial queue",
  },
  de: {
    workspace: "Redaktionelle Einträge",
    title: "Jede öffentliche Aussage formen, bevor sie in den Atlas gelangt",
    body: "Durchsuche den vollständigen Katalog, öffne einen Eintrag und bereite einen belegten Änderungssatz vor. Entwürfe bleiben lokal, bis Server-Authentifizierung und geschützte Schreib-APIs verbunden sind.",
    catalog: "Katalog",
    drafts: "Entwürfe",
    newRecord: "Neuer Eintrag",
    search: "Namen, Regionen, Weingüter oder Weine suchen",
    allTypes: "Alle Eintragstypen",
    region: "Region",
    grape: "Rebsorte",
    producer: "Weingut",
    wine: "Wein",
    tasting: "Verkostung",
    edit: "Änderung vorbereiten",
    create: "Eintrag anlegen",
    results: "Einträge",
    previous: "Zurück",
    next: "Weiter",
    page: "Seite",
    editor: "Strukturierter Editor",
    editing: "Katalogeintrag bearbeiten",
    identity: "Identität & Publikation",
    name: "Veröffentlichter Name",
    slug: "Slug",
    language: "Inhaltssprache",
    status: "Workflow",
    draft: "Entwurf",
    review: "Bereit zur Prüfung",
    summary: "Kurztext für Karten",
    description: "Ausführlicher redaktioneller Text",
    relationships: "Beziehungen",
    country: "Land",
    parentRegion: "Übergeordnete Region",
    coordinates: "Koordinaten",
    latitude: "Breitengrad",
    longitude: "Längengrad",
    climate: "Klima & Saison",
    soil: "Geologie & Böden",
    colour: "Beerenfarbe",
    origin: "Herkunft",
    leaf: "Blattbeschreibung",
    cluster: "Traubenbeschreibung",
    berry: "Beerenbeschreibung",
    viticulture: "Weinbau & Risiken",
    aromaLinks: "Verknüpfte Aromen",
    regionLinks: "Verknüpfte Regionen",
    website: "Primäre Website",
    founded: "Gründung / historischer Hinweis",
    philosophy: "Haltung des Weinguts",
    cellar: "Kelleransatz",
    producerLink: "Weingut",
    style: "Stil",
    vintage: "Jahrgang (leer lassen, wenn nicht belegt)",
    grapeLinks: "Verknüpfte Rebsorten",
    vinification: "Vinifikation",
    maturation: "Ausbau",
    service: "Service & Pairing",
    window: "Trinkfenster",
    access: "Zugang",
    date: "Datum & Uhrzeit",
    storyline: "Lern-Storyline",
    sources: "Quellen & Evidenz",
    sourceHelp:
      "Eine maßgebliche URL pro Zeile. Ohne Quelle kann kein Eintrag in die Prüfung.",
    save: "Entwurf speichern",
    saved: "Entwurf gespeichert",
    preview: "Redaktionelle Vorschau",
    delete: "Entwurf löschen",
    empty: "Noch keine Entwürfe.",
    selectMany: "Mit Strg/Cmd mehrere Beziehungen wählen.",
    local: "Lokale Redaktionswarteschlange",
  },
  fr: {
    workspace: "Fiches éditoriales",
    title: "Façonner chaque fait public avant son entrée dans l’atlas",
    body: "Recherchez tout le catalogue, ouvrez une fiche et préparez une modification sourcée. Les brouillons restent locaux jusqu’à la connexion de l’authentification serveur et des API d’écriture protégées.",
    catalog: "Catalogue",
    drafts: "Brouillons",
    newRecord: "Nouvelle fiche",
    search: "Rechercher noms, régions, domaines ou vins",
    allTypes: "Tous les types",
    region: "Région",
    grape: "Cépage",
    producer: "Domaine",
    wine: "Vin",
    tasting: "Dégustation",
    edit: "Préparer la modification",
    create: "Créer la fiche",
    results: "fiches",
    previous: "Précédent",
    next: "Suivant",
    page: "Page",
    editor: "Éditeur structuré",
    editing: "Modification d’une fiche",
    identity: "Identité et publication",
    name: "Nom publié",
    slug: "Slug",
    language: "Langue du contenu",
    status: "Flux",
    draft: "Brouillon",
    review: "Prêt pour révision",
    summary: "Résumé de carte",
    description: "Récit éditorial long",
    relationships: "Relations",
    country: "Pays",
    parentRegion: "Région parente",
    coordinates: "Coordonnées",
    latitude: "Latitude",
    longitude: "Longitude",
    climate: "Climat et saison",
    soil: "Géologie et sols",
    colour: "Couleur de la baie",
    origin: "Origine",
    leaf: "Description de la feuille",
    cluster: "Description de la grappe",
    berry: "Description de la baie",
    viticulture: "Viticulture et risques",
    aromaLinks: "Arômes liés",
    regionLinks: "Régions liées",
    website: "Site primaire",
    founded: "Fondation / repère historique",
    philosophy: "Point de vue du domaine",
    cellar: "Approche de cave",
    producerLink: "Domaine",
    style: "Style",
    vintage: "Millésime (vide si non documenté)",
    grapeLinks: "Cépages liés",
    vinification: "Vinification",
    maturation: "Élevage",
    service: "Service et accords",
    window: "Fenêtre de dégustation",
    access: "Accès",
    date: "Date et heure",
    storyline: "Parcours pédagogique",
    sources: "Sources et preuves",
    sourceHelp:
      "Une URL faisant autorité par ligne. Une source est requise pour la révision.",
    save: "Enregistrer le brouillon",
    saved: "Brouillon enregistré",
    preview: "Aperçu éditorial",
    delete: "Supprimer",
    empty: "Aucun brouillon.",
    selectMany: "Ctrl/Cmd pour sélectionner plusieurs relations.",
    local: "File éditoriale locale",
  },
  es: {
    workspace: "Registros editoriales",
    title: "Dar forma a cada dato público antes de que llegue al atlas",
    body: "Busca en todo el catálogo, abre un registro y prepara un cambio con fuentes. Los borradores siguen locales hasta conectar autenticación de servidor y API de escritura protegidas.",
    catalog: "Catálogo",
    drafts: "Borradores",
    newRecord: "Nuevo registro",
    search: "Buscar nombres, regiones, bodegas o vinos",
    allTypes: "Todos los tipos",
    region: "Región",
    grape: "Variedad",
    producer: "Bodega",
    wine: "Vino",
    tasting: "Cata",
    edit: "Preparar cambio",
    create: "Crear registro",
    results: "registros",
    previous: "Anterior",
    next: "Siguiente",
    page: "Página",
    editor: "Editor estructurado",
    editing: "Editando registro del catálogo",
    identity: "Identidad y publicación",
    name: "Nombre publicado",
    slug: "Slug",
    language: "Idioma del contenido",
    status: "Flujo",
    draft: "Borrador",
    review: "Listo para revisión",
    summary: "Resumen de tarjeta",
    description: "Narrativa editorial larga",
    relationships: "Relaciones",
    country: "País",
    parentRegion: "Región superior",
    coordinates: "Coordenadas",
    latitude: "Latitud",
    longitude: "Longitud",
    climate: "Clima y temporada",
    soil: "Geología y suelos",
    colour: "Color de baya",
    origin: "Origen",
    leaf: "Descripción de hoja",
    cluster: "Descripción de racimo",
    berry: "Descripción de baya",
    viticulture: "Viticultura y riesgos",
    aromaLinks: "Aromas enlazados",
    regionLinks: "Regiones enlazadas",
    website: "Web primaria",
    founded: "Fundación / nota histórica",
    philosophy: "Punto de vista de la bodega",
    cellar: "Enfoque de bodega",
    producerLink: "Bodega",
    style: "Estilo",
    vintage: "Añada (vacío si no está documentada)",
    grapeLinks: "Variedades enlazadas",
    vinification: "Vinificación",
    maturation: "Crianza",
    service: "Servicio y maridaje",
    window: "Ventana de consumo",
    access: "Acceso",
    date: "Fecha y hora",
    storyline: "Itinerario de aprendizaje",
    sources: "Fuentes y evidencia",
    sourceHelp:
      "Una URL autorizada por línea. Hace falta una fuente para revisión.",
    save: "Guardar borrador",
    saved: "Borrador guardado",
    preview: "Vista editorial",
    delete: "Eliminar borrador",
    empty: "Todavía no hay borradores.",
    selectMany: "Usa Ctrl/Cmd para seleccionar varias relaciones.",
    local: "Cola editorial local",
  },
} as const;

const editorOptions: Record<Locale, Record<string, string>> = {
  en: {
    white: "White",
    red: "Red",
    rose: "Rosé",
    sparkling: "Sparkling",
    sweet: "Sweet",
    fortified: "Fortified",
    private: "Private",
    invite: "Invite only",
    open: "Open",
  },
  de: {
    white: "Weiß",
    red: "Rot",
    rose: "Rosé",
    sparkling: "Schaumwein",
    sweet: "Süßwein",
    fortified: "Verstärkt",
    private: "Privat",
    invite: "Nur mit Einladung",
    open: "Offen",
  },
  fr: {
    white: "Blanc",
    red: "Rouge",
    rose: "Rosé",
    sparkling: "Effervescent",
    sweet: "Moelleux",
    fortified: "Muté",
    private: "Privé",
    invite: "Sur invitation",
    open: "Ouvert",
  },
  es: {
    white: "Blanco",
    red: "Tinto",
    rose: "Rosado",
    sparkling: "Espumoso",
    sweet: "Dulce",
    fortified: "Fortificado",
    private: "Privado",
    invite: "Solo con invitación",
    open: "Abierto",
  },
};

const blankFields = () => ({
  country: "",
  parentRegionId: "",
  lat: "",
  lng: "",
  climate: "",
  soil: "",
  colour: "",
  origin: "",
  leaf: "",
  cluster: "",
  berry: "",
  viticulture: "",
  aromaIds: [] as string[],
  regionIds: [] as string[],
  regionId: "",
  website: "https://",
  founded: "",
  philosophy: "",
  cellar: "",
  producerId: "",
  style: "red",
  vintage: "",
  grapeIds: [] as string[],
  vinification: "",
  maturation: "",
  service: "",
  window: "",
  access: "private",
  startsAt: "",
  storyline: "",
});

function fieldValue(fields: Record<string, string | string[]>, key: string) {
  const value = fields[key];
  return Array.isArray(value) ? "" : (value ?? "");
}
function arrayValue(fields: Record<string, string | string[]>, key: string) {
  const value = fields[key];
  return Array.isArray(value) ? value : [];
}

function loadEditorialDrafts(): EditorialDraft[] {
  const allowed: RecordType[] = ["region", "grape", "producer", "wine", "tasting"];
  return repository.additions.all().flatMap((entry) => {
    const candidate = String(entry.recordType ?? entry.type ?? "").toLowerCase() as RecordType;
    if (!allowed.includes(candidate)) return [];
    if (entry.recordType && entry.fields) return [entry as unknown as EditorialDraft];
    const now = String(entry.createdAt ?? new Date().toISOString());
    const name = String(entry.name ?? "");
    return [{
      id: String(entry.id ?? crypto.randomUUID()),
      recordType: candidate,
      name,
      slug: slugify(name),
      status: "draft",
      locale: "en",
      summary: "",
      description: "",
      sourceUrls: [],
      fields: blankFields(),
      createdAt: now,
      updatedAt: now,
    }];
  });
}

export function EditorialStudio() {
  const { locale } = useLocale();
  const c = copy[locale];
  const optionCopy = editorOptions[locale];
  const [drafts, setDrafts] = useState<EditorialDraft[]>(
    loadEditorialDrafts,
  );
  const [view, setView] = useState<"catalog" | "drafts" | "editor">("catalog");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RecordType | "all">("all");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<EditorialDraft>(() => ({
    id: crypto.randomUUID(),
    recordType: "region",
    name: "",
    slug: "",
    status: "draft",
    locale,
    summary: "",
    description: "",
    sourceUrls: [],
    fields: blankFields(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  const catalog = useMemo<CatalogRow[]>(
    () => [
      ...regions.map((item) => ({
        id: item.id,
        type: "region" as const,
        name: item.name,
        meta: item.country,
      })),
      ...grapes.map((item) => ({
        id: item.id,
        type: "grape" as const,
        name: item.name,
        meta: item.origin,
      })),
      ...producers.map((item) => ({
        id: item.id,
        type: "producer" as const,
        name: item.name,
        meta: regions.find((region) => region.id === item.regionId)?.name ?? "",
      })),
      ...wines.map((item) => ({
        id: item.id,
        type: "wine" as const,
        name: item.name,
        meta:
          producers.find((producer) => producer.id === item.producerId)?.name ??
          "",
      })),
    ],
    [],
  );
  const results = useMemo(
    () =>
      catalog.filter(
        (item) =>
          (filter === "all" || item.type === filter) &&
          `${item.name} ${item.meta}`
            .toLocaleLowerCase(locale)
            .includes(query.toLocaleLowerCase(locale)),
      ),
    [catalog, filter, query, locale],
  );
  const pageSize = 12,
    pages = Math.max(1, Math.ceil(results.length / pageSize)),
    visible = results.slice((page - 1) * pageSize, page * pageSize);
  const persist = (next: EditorialDraft[]) => {
    setDrafts(next);
    repository.additions.save(next as unknown as Record<string, unknown>[]);
  };
  const updateField = (key: string, value: string | string[]) =>
    setDraft((current) => ({
      ...current,
      fields: { ...current.fields, [key]: value },
    }));
  const startNew = (type: RecordType = "region") => {
    setDraft({
      id: crypto.randomUUID(),
      recordType: type,
      name: "",
      slug: "",
      status: "draft",
      locale,
      summary: "",
      description: "",
      sourceUrls: [],
      fields: blankFields(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setSaved(false);
    setView("editor");
  };
  const editCatalog = (row: CatalogRow) => {
    const baseFields = blankFields();
    let summary = "";
    let description = "";
    let sourceUrls: string[] = [];
    if (row.type === "region") {
      const item = regions.find((value) => value.id === row.id);
      summary = item?.summary ?? "";
      description = [item?.history, item?.growingSeason, item?.viticulture]
        .filter(Boolean)
        .join("\n\n");
      sourceUrls = item?.sources?.map((source) => source.url) ??
        (item?.sourceUrl ? [item.sourceUrl] : []);
      Object.assign(baseFields, {
        country: item?.country ?? "",
        lat: String(item?.lat ?? ""),
        lng: String(item?.lng ?? ""),
        climate: item?.climate ?? "",
        soil: item?.soil ?? "",
      });
    }
    if (row.type === "grape") {
      const item = grapes.find((value) => value.id === row.id);
      summary = item?.summary ?? "";
      description = [item?.ripening, item?.climateFit, item?.winemaking]
        .filter(Boolean)
        .join("\n\n");
      Object.assign(baseFields, {
        colour: item?.color ?? "",
        origin: item?.origin ?? "",
        viticulture: item?.viticulture ?? "",
        aromaIds: item?.aromaIds ?? [],
        regionIds: item?.regionIds ?? [],
      });
    }
    if (row.type === "producer") {
      const item = producers.find((value) => value.id === row.id);
      summary = item?.summary ?? "";
      description = [item?.philosophy, item?.vineyard, item?.cellar]
        .filter(Boolean)
        .join("\n\n");
      sourceUrls = item?.sourceUrl ? [item.sourceUrl] : [];
      const producerGrapes = [
        ...new Set(
          wines
            .filter((wine) => wine.producerId === row.id)
            .flatMap((wine) => wine.grapeIds),
        ),
      ];
      Object.assign(baseFields, {
        regionId: item?.regionId ?? "",
        website: item?.sourceUrl ?? "https://",
        philosophy: item?.philosophy ?? "",
        viticulture: item?.vineyard ?? "",
        cellar: item?.cellar ?? "",
        grapeIds: producerGrapes,
      });
    }
    if (row.type === "wine") {
      const item = wines.find((value) => value.id === row.id);
      summary = item?.summary ?? "";
      description = item?.composition ?? "";
      sourceUrls = item?.sourceUrl ? [item.sourceUrl] : [];
      Object.assign(baseFields, {
        regionId: item?.regionId ?? "",
        producerId: item?.producerId ?? "",
        style: item?.style ?? "red",
        vintage: String(item?.vintage ?? ""),
        grapeIds: item?.grapeIds ?? [],
        aromaIds: item?.aromaIds ?? [],
        vinification: item?.vinification ?? "",
        maturation: item?.maturation ?? "",
        service: [item?.serving, ...(item?.pairings ?? [])]
          .filter(Boolean)
          .join(" · "),
        window: item?.drinkWindow ?? "",
      });
    }
    setDraft({
      id: crypto.randomUUID(),
      baseId: row.id,
      recordType: row.type,
      name: row.name,
      slug: row.id,
      status: "draft",
      locale,
      summary,
      description,
      sourceUrls,
      fields: baseFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setSaved(false);
    setView("editor");
  };
  const editDraft = (item: EditorialDraft) => {
    setDraft(item);
    setSaved(false);
    setView("editor");
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = {
      ...draft,
      slug: draft.slug || slugify(draft.name),
      updatedAt: new Date().toISOString(),
    };
    persist([...drafts.filter((item) => item.id !== next.id), next]);
    setDraft(next);
    setSaved(true);
  };
  const selectMany = (key: string, event: ChangeEvent<HTMLSelectElement>) =>
    updateField(
      key,
      [...event.target.selectedOptions].map((option) => option.value),
    );
  return (
    <section className="editorial-studio">
      <header className="editorial-studio-header">
        <div>
          <span className="eyebrow">{c.workspace}</span>
          <h2>{c.title}</h2>
          <p>{c.body}</p>
        </div>
        <div className="editorial-tabs">
          <button
            className={view === "catalog" ? "active" : ""}
            onClick={() => setView("catalog")}
          >
            <Search />
            {c.catalog}
          </button>
          <button
            className={view === "drafts" ? "active" : ""}
            onClick={() => setView("drafts")}
          >
            <FileClock />
            {c.drafts}
            <b>{drafts.length}</b>
          </button>
          <button
            className={view === "editor" ? "active" : ""}
            onClick={() => startNew()}
          >
            <Plus />
            {c.newRecord}
          </button>
        </div>
      </header>
      {view === "catalog" && (
        <div className="editorial-catalog">
          <div className="editorial-catalog-tools">
            <label>
              <Search />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder={c.search}
              />
            </label>
            <label>
              <Filter />
              <select
                value={filter}
                onChange={(event) => {
                  setFilter(event.target.value as RecordType | "all");
                  setPage(1);
                }}
              >
                <option value="all">{c.allTypes}</option>
                {(["region", "grape", "producer", "wine"] as const).map(
                  (value) => (
                    <option value={value} key={value}>
                      {c[value]}
                    </option>
                  ),
                )}
              </select>
            </label>
            <span>
              {results.length} {c.results}
            </span>
          </div>
          <div className="editorial-record-table">
            {visible.map((row) => (
              <article key={`${row.type}-${row.id}`}>
                <span className={`record-type type-${row.type}`}>
                  {c[row.type]}
                </span>
                <div>
                  <strong>{row.name}</strong>
                  <small>{row.meta}</small>
                </div>
                <button onClick={() => editCatalog(row)}>
                  <PencilLine />
                  {c.edit}
                </button>
              </article>
            ))}
          </div>
          <nav className="editorial-pagination" aria-label={c.page}>
            <button
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              <ChevronLeft />
              {c.previous}
            </button>
            <span>
              {c.page} {page} / {pages}
            </span>
            <button
              disabled={page === pages}
              onClick={() => setPage((value) => value + 1)}
            >
              {c.next}
              <ChevronRight />
            </button>
          </nav>
        </div>
      )}
      {view === "drafts" && (
        <div className="editorial-drafts">
          {drafts.length ? (
            drafts
              .slice()
              .reverse()
              .map((item) => (
                <article key={item.id}>
                  <span className={`record-type type-${item.recordType}`}>
                    {c[item.recordType]}
                  </span>
                  <div>
                    <strong>{item.name || c.newRecord}</strong>
                    <small>
                      {item.status === "review" ? c.review : c.draft} ·{" "}
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: "medium",
                      }).format(new Date(item.updatedAt))}
                    </small>
                  </div>
                  <button onClick={() => editDraft(item)}>
                    <PencilLine />
                    {c.edit}
                  </button>
                  <button
                    className="delete"
                    aria-label={c.delete}
                    onClick={() =>
                      persist(drafts.filter((value) => value.id !== item.id))
                    }
                  >
                    <Trash2 />
                  </button>
                </article>
              ))
          ) : (
            <div className="editorial-empty">
              <FileClock />
              <h3>{c.empty}</h3>
              <button onClick={() => startNew()}>
                <Plus />
                {c.newRecord}
              </button>
            </div>
          )}
        </div>
      )}
      {view === "editor" && (
        <form className="editorial-form" onSubmit={submit}>
          <div className="editorial-form-main">
            <header>
              <div>
                <span className="eyebrow">
                  {draft.baseId ? c.editing : c.create}
                </span>
                <h3>{draft.name || c.newRecord}</h3>
              </div>
              <select
                value={draft.recordType}
                disabled={Boolean(draft.baseId)}
                onChange={(event) => startNew(event.target.value as RecordType)}
              >
                {(
                  ["region", "grape", "producer", "wine", "tasting"] as const
                ).map((value) => (
                  <option value={value} key={value}>
                    {c[value]}
                  </option>
                ))}
              </select>
            </header>
            <fieldset>
              <legend>{c.identity}</legend>
              <div className="editorial-field-grid">
                <label>
                  {c.name}
                  <input
                    required
                    value={draft.name}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        name: event.target.value,
                        slug: value.baseId
                          ? value.slug
                          : slugify(event.target.value),
                      }))
                    }
                  />
                </label>
                <label>
                  {c.slug}
                  <input
                    required
                    value={draft.slug}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        slug: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  {c.language}
                  <select
                    value={draft.locale}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        locale: event.target.value as Locale,
                      }))
                    }
                  >
                    {(["en", "de", "fr", "es"] as const).map((value) => (
                      <option key={value}>{value.toUpperCase()}</option>
                    ))}
                  </select>
                </label>
                <label>
                  {c.status}
                  <select
                    value={draft.status}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        status: event.target.value as EditorialDraft["status"],
                      }))
                    }
                  >
                    <option value="draft">{c.draft}</option>
                    <option value="review" disabled={!draft.sourceUrls.length}>
                      {c.review}
                    </option>
                  </select>
                </label>
                <label className="wide">
                  {c.summary}
                  <textarea
                    required
                    value={draft.summary}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        summary: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="wide">
                  {c.description}
                  <textarea
                    className="long-copy"
                    required
                    value={draft.description}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        description: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>{c.relationships}</legend>
              <div className="editorial-field-grid">
                {draft.recordType === "region" && (
                  <>
                    <label>
                      {c.country}
                      <input
                        value={fieldValue(draft.fields, "country")}
                        onChange={(event) =>
                          updateField("country", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      {c.parentRegion}
                      <select
                        value={fieldValue(draft.fields, "parentRegionId")}
                        onChange={(event) =>
                          updateField("parentRegionId", event.target.value)
                        }
                      >
                        <option value="">—</option>
                        {regions.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {c.latitude}
                      <input
                        type="number"
                        step="0.0001"
                        value={fieldValue(draft.fields, "lat")}
                        onChange={(event) =>
                          updateField("lat", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      {c.longitude}
                      <input
                        type="number"
                        step="0.0001"
                        value={fieldValue(draft.fields, "lng")}
                        onChange={(event) =>
                          updateField("lng", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.climate}
                      <textarea
                        value={fieldValue(draft.fields, "climate")}
                        onChange={(event) =>
                          updateField("climate", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.soil}
                      <textarea
                        value={fieldValue(draft.fields, "soil")}
                        onChange={(event) =>
                          updateField("soil", event.target.value)
                        }
                      />
                    </label>
                  </>
                )}
                {draft.recordType === "grape" && (
                  <>
                    <label>
                      {c.colour}
                      <select
                        value={fieldValue(draft.fields, "colour")}
                        onChange={(event) =>
                          updateField("colour", event.target.value)
                        }
                      >
                        <option value="white">{optionCopy.white}</option>
                        <option value="red">{optionCopy.red}</option>
                      </select>
                    </label>
                    <label>
                      {c.origin}
                      <input
                        value={fieldValue(draft.fields, "origin")}
                        onChange={(event) =>
                          updateField("origin", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.leaf}
                      <textarea
                        value={fieldValue(draft.fields, "leaf")}
                        onChange={(event) =>
                          updateField("leaf", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.cluster}
                      <textarea
                        value={fieldValue(draft.fields, "cluster")}
                        onChange={(event) =>
                          updateField("cluster", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.berry}
                      <textarea
                        value={fieldValue(draft.fields, "berry")}
                        onChange={(event) =>
                          updateField("berry", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.viticulture}
                      <textarea
                        value={fieldValue(draft.fields, "viticulture")}
                        onChange={(event) =>
                          updateField("viticulture", event.target.value)
                        }
                      />
                    </label>
                    <Multi
                      label={c.aromaLinks}
                      help={c.selectMany}
                      value={arrayValue(draft.fields, "aromaIds")}
                      onChange={(event) => selectMany("aromaIds", event)}
                      options={aromas}
                    />
                    <Multi
                      label={c.regionLinks}
                      help={c.selectMany}
                      value={arrayValue(draft.fields, "regionIds")}
                      onChange={(event) => selectMany("regionIds", event)}
                      options={regions}
                    />
                  </>
                )}
                {draft.recordType === "producer" && (
                  <>
                    <label>
                      {c.region}
                      <select
                        value={fieldValue(draft.fields, "regionId")}
                        onChange={(event) =>
                          updateField("regionId", event.target.value)
                        }
                      >
                        <option value="">—</option>
                        {regions.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {c.website}
                      <input
                        type="url"
                        value={fieldValue(draft.fields, "website")}
                        onChange={(event) =>
                          updateField("website", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      {c.founded}
                      <input
                        value={fieldValue(draft.fields, "founded")}
                        onChange={(event) =>
                          updateField("founded", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.philosophy}
                      <textarea
                        value={fieldValue(draft.fields, "philosophy")}
                        onChange={(event) =>
                          updateField("philosophy", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.viticulture}
                      <textarea
                        value={fieldValue(draft.fields, "viticulture")}
                        onChange={(event) =>
                          updateField("viticulture", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.cellar}
                      <textarea
                        value={fieldValue(draft.fields, "cellar")}
                        onChange={(event) =>
                          updateField("cellar", event.target.value)
                        }
                      />
                    </label>
                    <Multi
                      label={c.grapeLinks}
                      help={c.selectMany}
                      value={arrayValue(draft.fields, "grapeIds")}
                      onChange={(event) => selectMany("grapeIds", event)}
                      options={grapes}
                    />
                  </>
                )}
                {draft.recordType === "wine" && (
                  <>
                    <label>
                      {c.producerLink}
                      <select
                        value={fieldValue(draft.fields, "producerId")}
                        onChange={(event) =>
                          updateField("producerId", event.target.value)
                        }
                      >
                        <option value="">—</option>
                        {producers.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {c.region}
                      <select
                        value={fieldValue(draft.fields, "regionId")}
                        onChange={(event) =>
                          updateField("regionId", event.target.value)
                        }
                      >
                        <option value="">—</option>
                        {regions.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {c.style}
                      <select
                        value={fieldValue(draft.fields, "style")}
                        onChange={(event) =>
                          updateField("style", event.target.value)
                        }
                      >
                        {[
                          "red",
                          "white",
                          "rose",
                          "sparkling",
                          "sweet",
                          "fortified",
                        ].map((item) => (
                          <option value={item} key={item}>
                            {optionCopy[item]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {c.vintage}
                      <input
                        type="number"
                        min="1800"
                        max="2200"
                        value={fieldValue(draft.fields, "vintage")}
                        onChange={(event) =>
                          updateField("vintage", event.target.value)
                        }
                      />
                    </label>
                    <Multi
                      label={c.grapeLinks}
                      help={c.selectMany}
                      value={arrayValue(draft.fields, "grapeIds")}
                      onChange={(event) => selectMany("grapeIds", event)}
                      options={grapes}
                    />
                    <Multi
                      label={c.aromaLinks}
                      help={c.selectMany}
                      value={arrayValue(draft.fields, "aromaIds")}
                      onChange={(event) => selectMany("aromaIds", event)}
                      options={aromas}
                    />
                    <label className="wide">
                      {c.vinification}
                      <textarea
                        value={fieldValue(draft.fields, "vinification")}
                        onChange={(event) =>
                          updateField("vinification", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.maturation}
                      <textarea
                        value={fieldValue(draft.fields, "maturation")}
                        onChange={(event) =>
                          updateField("maturation", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.service}
                      <textarea
                        value={fieldValue(draft.fields, "service")}
                        onChange={(event) =>
                          updateField("service", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.window}
                      <input
                        value={fieldValue(draft.fields, "window")}
                        onChange={(event) =>
                          updateField("window", event.target.value)
                        }
                      />
                    </label>
                  </>
                )}
                {draft.recordType === "tasting" && (
                  <>
                    <label>
                      {c.access}
                      <select
                        value={fieldValue(draft.fields, "access")}
                        onChange={(event) =>
                          updateField("access", event.target.value)
                        }
                      >
                        <option value="private">{optionCopy.private}</option>
                        <option value="invite">{optionCopy.invite}</option>
                        <option value="open">{optionCopy.open}</option>
                      </select>
                    </label>
                    <label>
                      {c.date}
                      <input
                        type="datetime-local"
                        value={fieldValue(draft.fields, "startsAt")}
                        onChange={(event) =>
                          updateField("startsAt", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.storyline}
                      <textarea
                        value={fieldValue(draft.fields, "storyline")}
                        onChange={(event) =>
                          updateField("storyline", event.target.value)
                        }
                      />
                    </label>
                  </>
                )}
              </div>
            </fieldset>
            <fieldset>
              <legend>{c.sources}</legend>
              <label className="editorial-sources">
                <Link2 />
                <textarea
                  required={draft.status === "review"}
                  value={draft.sourceUrls.join("\n")}
                  onChange={(event) =>
                    setDraft((value) => ({
                      ...value,
                      sourceUrls: event.target.value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    }))
                  }
                />
                <small>{c.sourceHelp}</small>
              </label>
            </fieldset>
            <footer>
              <span>
                {saved && (
                  <>
                    <Check />
                    {c.saved}
                  </>
                )}
              </span>
              <button className="primary-button">
                <Save />
                {c.save}
              </button>
            </footer>
          </div>
          <aside className="editorial-preview">
            <span className="eyebrow">{c.preview}</span>
            <div className={`preview-orbit type-${draft.recordType}`}>
              <Wine />
            </div>
            <small>
              {c[draft.recordType]} · {draft.locale.toUpperCase()}
            </small>
            <h3>{draft.name || c.newRecord}</h3>
            <p>{draft.summary || c.summary}</p>
            <dl>
              <div>
                <dt>{c.status}</dt>
                <dd>{draft.status === "review" ? c.review : c.draft}</dd>
              </div>
              <div>
                <dt>{c.sources}</dt>
                <dd>{draft.sourceUrls.length}</dd>
              </div>
              <div>
                <dt>Slug</dt>
                <dd>{draft.slug || "—"}</dd>
              </div>
            </dl>
            <span className="local-badge">
              <MapPin />
              {c.local}
            </span>
          </aside>
        </form>
      )}
    </section>
  );
}

function Multi({
  label,
  help,
  value,
  onChange,
  options,
}: {
  label: string;
  help: string;
  value: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: { id: string; name: string }[];
}) {
  return (
    <label className="wide">
      {label}
      <select multiple value={value} onChange={onChange}>
        {options.map((item) => (
          <option value={item.id} key={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <small>{help}</small>
    </label>
  );
}
