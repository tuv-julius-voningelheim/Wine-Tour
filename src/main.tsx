import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './styles.css'
import App from './App'
import { LocaleProvider } from './i18n'
import { AuthProvider } from './auth'
import { validateCatalog } from './data/catalog'

const errors=validateCatalog()
if(errors.length) console.error('Catalogue validation failed',errors)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LocaleProvider><AuthProvider><App /></AuthProvider></LocaleProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
