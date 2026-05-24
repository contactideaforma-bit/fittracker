'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Zap, LayoutDashboard, Dumbbell, History, User, LogOut, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/session',   label: 'Séance',     icon: Dumbbell },
  { href: '/tabata',    label: 'Tabata',      icon: Timer },
  { href: '/history',   label: 'Historique',  icon: History },
  { href: '/profile',   label: 'Profil',      icon: User },
]

export function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200/80">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sm">FitTracker</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                pathname === href
                  ? 'bg-zinc-100 text-zinc-900 font-medium'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              )}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>

        <button onClick={signOut} className="btn-ghost text-zinc-400 hover:text-zinc-700 px-2">
          <LogOut size={15} />
        </button>
      </div>
    </header>
  )
}