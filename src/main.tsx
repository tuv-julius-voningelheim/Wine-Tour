import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './styles.css'
import './enhancements.css'
import './learning.css'
import App from './App'
import { LocaleProvider } from './i18n'
import { AuthProvider } from './auth'
import { validateCatalog } from './data/catalog'
import { validateBusinessData } from './data/business'
import { businessUiCopyCompleteness, uiCopyCompleteness } from './uiCopy'
import { learningValidation } from './learningCurriculum'

const learningAudit=learningValidation()
const errors=[
  ...validateCatalog(),
  ...validateBusinessData(),
  ...Object.entries(uiCopyCompleteness).flatMap(([locale,keys])=>keys.map(key=>`Incomplete ${locale} UI copy: ${key}`)),
  ...Object.entries(businessUiCopyCompleteness).flatMap(([locale,keys])=>keys.map(key=>`Incomplete ${locale} business UI copy: ${key}`)),
  ...(learningAudit.modules===11?[]:[`Expected 11 fully authored learning modules, found ${learningAudit.modules}`]),
  ...learningAudit.issues,
]
if(errors.length) throw new Error(`Content validation failed:\n${errors.join('\n')}`)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LocaleProvider><AuthProvider><App /></AuthProvider></LocaleProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
