import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 Importá esto
import './index.css'
import App from './App.tsx'
import 'bootstrap-icons/font/bootstrap-icons.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* 👈 Envolvemos acá */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
