import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './AuthContext.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

// Lazy load admin and login pages to reduce main bundle size
const LoginPage = lazy(() => import('./LoginPage.jsx'))
const AdminPage = lazy(() => import('./AdminPage.jsx'))

// Simple loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
