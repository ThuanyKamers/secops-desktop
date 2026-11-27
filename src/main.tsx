import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './styles/base.css'
import './styles/os.css'
import './styles/apps.css'
import './styles/intro.css'
import App from './App.tsx'
import { startCloud } from './core/cloud'

startCloud()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
