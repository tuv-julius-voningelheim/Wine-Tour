import { useEffect, useState } from 'react'
import { CheckCircle2, Database, RefreshCw, TriangleAlert } from 'lucide-react'
import { useLocale, type Locale } from './i18n'

type HealthPayload = {
  ok: boolean
  database: 'connected' | 'unavailable'
  schemaVersion?: { version?: string; catalogVersion?: string } | null
  catalog?: { version: string; counts: Record<string, number>; publishedAt: string } | null
}

const copy: Record<Locale, {
  eyebrow: string
  title: string
  connected: string
  unavailable: string
  checking: string
  synced: string
  fallback: string
  retry: string
  schema: string
}> = {
  en: { eyebrow:'Infrastructure', title:'Editorial database', connected:'Neon is connected', unavailable:'Database check unavailable', checking:'Checking the database…', synced:'Curated catalogue synced', fallback:'The bundled catalogue remains available if the database sleeps or cannot be reached.', retry:'Check again', schema:'Schema' },
  de: { eyebrow:'Infrastruktur', title:'Redaktionsdatenbank', connected:'Neon ist verbunden', unavailable:'Datenbankprüfung nicht verfügbar', checking:'Datenbank wird geprüft…', synced:'Kuratierter Katalog synchronisiert', fallback:'Wenn die Datenbank schläft oder nicht erreichbar ist, bleibt der gebündelte Katalog verfügbar.', retry:'Erneut prüfen', schema:'Schema' },
  fr: { eyebrow:'Infrastructure', title:'Base éditoriale', connected:'Neon est connecté', unavailable:'Vérification indisponible', checking:'Vérification de la base…', synced:'Catalogue éditorial synchronisé', fallback:'Le catalogue intégré reste disponible si la base est en veille ou inaccessible.', retry:'Réessayer', schema:'Schéma' },
  es: { eyebrow:'Infraestructura', title:'Base editorial', connected:'Neon está conectado', unavailable:'Comprobación no disponible', checking:'Comprobando la base…', synced:'Catálogo editorial sincronizado', fallback:'El catálogo integrado sigue disponible si la base está suspendida o no responde.', retry:'Comprobar de nuevo', schema:'Esquema' },
}

export function DatabaseStatus() {
  const { locale } = useLocale()
  const labels = copy[locale]
  const [health, setHealth] = useState<HealthPayload | null>(null)
  const [loading, setLoading] = useState(true)

  const check = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/health', { headers: { Accept: 'application/json' } })
      const payload = await response.json() as HealthPayload
      setHealth(response.ok ? payload : { ok:false, database:'unavailable' })
    } catch {
      setHealth({ ok:false, database:'unavailable' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void check() }, [])

  const connected = health?.ok && health.database === 'connected'
  const counts = health?.catalog?.counts

  return (
    <section className={`database-status ${connected ? 'is-connected' : ''}`} aria-live="polite">
      <header>
        <span className="database-status-icon"><Database /></span>
        <div>
          <span className="eyebrow">{labels.eyebrow}</span>
          <h2>{labels.title}</h2>
        </div>
        <span className="database-status-state">
          {loading ? <RefreshCw className="is-spinning" /> : connected ? <CheckCircle2 /> : <TriangleAlert />}
          {loading ? labels.checking : connected ? labels.connected : labels.unavailable}
        </span>
      </header>
      {connected && counts ? (
        <div className="database-status-counts">
          <strong>{labels.synced}</strong>
          <span>{counts.regions ?? 0} R · {counts.grapes ?? 0} G · {counts.producers ?? 0} P · {counts.wines ?? 0} W · {counts.articles ?? 0} L</span>
          <small>{labels.schema} {health?.schemaVersion?.version ?? '1'} · {health.catalog?.version}</small>
        </div>
      ) : <p>{labels.fallback}</p>}
      {!loading && !connected && <button type="button" onClick={() => void check()}><RefreshCw />{labels.retry}</button>}
    </section>
  )
}
