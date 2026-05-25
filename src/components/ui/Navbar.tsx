'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Zap, LayoutDashboard, Dumbbell, History, User, LogOut, Timer, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/session',   label: 'Séance',     icon: Dumbbell },
  { href: '/tabata',    label: 'Tabata',      icon: Timer },
  { href: '/history',   label: 'Historique',  icon: History },
  { href: '/profile',   label: 'Profil',      icon: User },
]

function QuitModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full flex flex-col gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">Séance en cours</p>
            <p className="text-xs text-zinc-500 mt-0.5">Voulez-vous vraiment quitter ?</p>
          </div>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Si vous quittez maintenant, votre séance sera perdue et le chrono s'arrêtera.
        </p>
        <p className="text-xs text-violet-600 bg-violet-50 rounded-lg px-3 py-2">
          💡 Réduisez l'application pour continuer en arrière-plan sans perdre votre séance.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            Continuer la séance
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600">
            Quitter
          </button>
        </div>
      </div>
    </div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [showModal, setShowModal]     = useState(false)
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  function handleNavClick(href: string) {
    if (pathname === '/session' && href !== '/session') {
      const active = typeof window !== 'undefined'
        ? window.sessionStorage.getItem('session_active')
        : null
      if (active === 'true') {
        setPendingHref(href)
        setShowModal(true)
        return
      }
    }
    router.push(href)
  }

  function confirmQuit() {
    window.sessionStorage.removeItem('session_active')
    setShowModal(false)
    if (pendingHref) router.push(pendingHref)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200/80">
      {showModal && (
        <QuitModal
          onConfirm={confirmQuit}
          onCancel={() => setShowModal(false)}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        <button onClick={() => handleNavClick('/dashboard')} className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sm">FitTracker</span>
        </button>

        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <button
              key={href}
              onClick={() => handleNavClick(href)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                pathname === href
                  ? 'bg-zinc-100 text-zinc-900 font-medium'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              )}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        <button onClick={signOut} className="btn-ghost text-zinc-400 hover:text-zinc-700 px-2">
          <LogOut size={15} />
        </button>
      </div>
    </header>
  )
}