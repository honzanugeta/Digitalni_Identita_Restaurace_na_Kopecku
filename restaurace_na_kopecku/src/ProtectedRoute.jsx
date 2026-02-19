import { Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <span className="text-sm tracking-[0.3em] uppercase text-gray-400">
          Načítání...
        </span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

