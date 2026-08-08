import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './styles.css'
import App from './App'
import { LocaleProvider } from './i18n'
import { AuthProvider } from './auth'
import { validateCatalog } from './data/catalog'
import { uiCopyCompleteness } from './uiCopy'

const errors=[
  ...validateCatalog(),
  ...Object.entries(uiCopyCompleteness).flatMap(([locale,keys])=>keys.map(key=>`Incomplete ${locale} UI copy: ${key}`)),
]
if(errors.length) throw new Error(`Content validation failed:\n${errors.join('\n')}`)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LocaleProvider><AuthProvider><App /></AuthProvider></LocaleProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
