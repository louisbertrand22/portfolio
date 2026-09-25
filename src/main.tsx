import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Honour the OS "reduce motion" setting: movement is dropped, fades are kept */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: 'var(--text)',
          color: 'var(--bg)',
          border: 'none',
          borderRadius: '100px',
          fontSize: '0.85rem',
          fontWeight: '600',
          padding: '0.625rem 1.25rem',
        },
      }}
    />
  </StrictMode>,
)
