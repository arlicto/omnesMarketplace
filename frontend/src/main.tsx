import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import './index.css'
import App from './App.tsx'

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {clerkKey ? (
      <ClerkProvider publishableKey={clerkKey} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <div className="text-center p-8">
          <span className="material-symbols-outlined text-5xl text-primary mb-4">construction</span>
          <h1 className="text-headline-lg font-headline-lg text-primary mb-2">Configuration Required</h1>
          <p className="text-body-md text-on-surface-variant">Set <code className="bg-surface-container-high px-2 py-0.5 rounded text-sm font-mono">VITE_CLERK_PUBLISHABLE_KEY</code> in your environment.</p>
        </div>
      </div>
    )}
  </StrictMode>,
)

# 1785176284632245518
