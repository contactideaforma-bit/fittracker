'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Zap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function AuthPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode]         = useState<'login' | 'register'>('login')
  const [loading, setLoading]   = useState(false)
  const [message, setMessage]   = useState('')

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        window.location.href = 'http://localhost:3003/dashboard'
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      })
      if (error) setMessage(error.message)
      else setMessage('Vérifiez votre email pour confirmer votre compte.')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-semibold">FitTracker</span>
        </div>

        <div className="card">
          <h1 className="text-lg font-semibold mb-1">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p className="text-sm text-zinc-500 mb-6">
            {mode === 'login' ? 'Content de vous revoir !' : 'Commencez à tracker vos performances'}
          </p>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2 border border-zinc-200 rounded-lg py-2.5 text-sm font-medium hover:bg-zinc-50 transition mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.612 14.01 17.64 11.81 17.64 9.2z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400">ou</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email" required
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 bg-white"
              />
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Mot de passe" required
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 bg-white"
              />
            </div>

            {message && (
              <p className="text-sm text-center text-violet-600">{message}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary justify-center mt-1">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-4">
          {mode === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}{' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-violet-600 font-medium hover:underline"
          >
            {mode === 'login' ? "S'inscrire" : 'Se connecter'}
          </button>
        </p>
      </div>
    </div>
  )
}