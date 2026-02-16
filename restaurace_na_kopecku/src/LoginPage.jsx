import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message ?? 'Nepodařilo se přihlásit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="noise-overlay" />
      <form
        onSubmit={handleSubmit}
        className="relative glass-panel p-8 md:p-10 w-full max-w-sm space-y-5 z-10"
      >
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">
            Admin
          </p>
          <h1 className="text-2xl md:text-3xl font-serif">Přihlášení</h1>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 px-3 py-2 rounded">
            {error}
          </p>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full bg-black border border-white/20 focus:border-accent outline-none px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-gray-400 mb-1">
              Heslo
            </label>
            <input
              type="password"
              required
              className="w-full bg-black border border-white/20 focus:border-accent outline-none px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-orange-600 transition-colors text-white py-2.5 text-xs uppercase tracking-[0.3em] disabled:opacity-60"
        >
          {loading ? 'Přihlašuji…' : 'Přihlásit se'}
        </button>
      </form>
    </div>
  )
}

