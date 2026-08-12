import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './hooks/useAuth.tsx'

// HashRouter (not BrowserRouter): GitHub Pages serves static files with no server-side
// rewrite rules, so a direct link or refresh on "/personas-fisicas" would 404. Hash-based
// routes ("/#/personas-fisicas") always resolve to index.html first.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
