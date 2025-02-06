import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/Error.tsx'
// import { AuthProvider } from './firebase.ts'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
    {/* <AuthProvider> */}
      <App />
      {/* </AuthProvider> */}
    </ErrorBoundary>
  </StrictMode>,
)

