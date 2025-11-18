import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { CaseProvider } from '@/store/CaseContext'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import './index.css'
import App from './App.tsx'
// Force recompile

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <CaseProvider>
          <App />
          <Toaster position="bottom-center" richColors duration={6000} />
        </CaseProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
