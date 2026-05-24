'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { startOfWeek, endOfWeek, format, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarDays, Flame, Clock, TrendingUp, Plus, Bot } from 'lucide-react'
import { KpiCard } from '@/components/ui/KpiCard'
import { WeekCalendar } from '@/components/dashboard/WeekCalendar'
import { CaloriesChart } from '@/components/dashboard/CaloriesChart'
import { RecentSessions } from '@/components/dashboard/RecentSessions'
import Link from 'next/link'

function minutesToHuman(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h${m > 0 ? m + 'min' : ''}` : `${m} min`
}

export default function DashboardPage() {
  const [profile, setProfile]               = useState<any>(null)
  const [weekSessions, setWeekSessions]     = useState<any[]>([])
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [disciplineStats, setDisciplineStats] = useState<any[]>([])
  const [streak, setStreak]                 = useState(0)
  const [loading, setLoading]               = useState(true)

  const supabase = createClient()

  async function loadData() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today     = new Date()
    const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
    const weekEnd   = format(endOfWeek(today,   { weekStartsOn: 1 }), 'yyyy-MM-dd')
    const monthStart = format(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd')

    const [
      { data: prof },
      { data: weekData },
      { data: recentData },
      { data: monthData },
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('sessions').select('*, discipline:disciplines(*)').eq('user_id', user.id).gte('session_date', weekStart).lte('session_date', weekEnd).order('session_date'),
      supabase.from('sessions').select('*, discipline:disciplines(*)').eq('user_id', user.id).order('session_date', { ascending: false }).limit(5),
      supabase.from('sessions').select('*, discipline:disciplines(*)').eq('user_id', user.id).gte('session_date', monthStart),
    ])

    setProfile(prof)
    setWeekSessions(weekData ?? [])
    setRecentSessions(recentData ?? [])

    // Stats par discipline ce mois
    const map = new Map<string, any>()
    for (const s of monthData ?? []) {
      const name = s.discipline?.name ?? ''
      if (!map.has(name)) map.set(name, { name, sessions: 0, calories: 0 })
      const e = map.get(name)!
      e.sessions++
      e.calories += s.calories_burned ?? 0
    }
    setDisciplineStats(Array.from(map.values()).sort((a, b) => b.calories - a.calories))

    // Streak
    let s = 0
    let day = new Date()
    while (true) {
      const dateStr = format(day, 'yyyy-MM-dd')
      const { count } = await supabase.from('sessions').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('session_date', dateStr)
      if ((count ?? 0) > 0) { s++; day = subDays(day, 1) }
      else break
    }
    setStreak(s)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  // Sessions par jour de la semaine
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const sessionsByDay = Array(7).fill(null).map((_, i) => {
    const dateStr = format(new Date(weekStart.getTime() + i * 86400000), 'yyyy-MM-dd')
    return weekSessions.find(s => s.session_date === dateStr) ?? null
  })

  const totalCalories = Math.round(weekSessions.reduce((sum, s) => sum + (s.calories_burned ?? 0), 0))
  const totalMinutes  = weekSessions.reduce((sum, s) => sum + s.duration_min, 0)
  const firstName     = profile?.full_name?.split(' ')[0] ?? 'Athlète'
  const todayFr       = format(new Date(), "EEEE d MMMM yyyy", { locale: fr })

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">Bonjour, {firstName}</h1>
        <p className="text-sm text-zinc-500 capitalize">{todayFr}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Séances" value={`${weekSessions.length}`} sub="/ 5 objectif" icon={CalendarDays} />
        <KpiCard label="Calories" value={totalCalories.toLocaleString('fr')} sub="kcal brûlées" icon={Flame} />
        <KpiCard label="Temps total" value={minutesToHuman(totalMinutes)} sub="cette semaine" icon={Clock} />
        <KpiCard label="Série" value={`${streak} j`} sub="consécutifs" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-sm font-medium mb-4">Cette semaine</h2>
          <WeekCalendar sessionsByDay={sessionsByDay} />
          <div className="flex gap-3 mt-4 flex-wrap">
            {[
              { label: 'Natation',    color: 'bg-swim' },
              { label: 'Musculation', color: 'bg-gym' },
              { label: 'Cardio',      color: 'bg-cardio' },
              { label: 'Boxe',        color: 'bg-boxing' },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-sm font-medium mb-2">Calories / jour</h2>
          <CaloriesChart sessionsByDay={sessionsByDay} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-sm font-medium mb-4">Ce mois — par discipline</h2>
          {disciplineStats.length === 0 ? (
            <p className="text-sm text-zinc-400">Aucune séance ce mois.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {disciplineStats.map((d) => {
                const maxCal = disciplineStats[0].calories
                const pct = maxCal > 0 ? Math.round((d.calories / maxCal) * 100) : 0
                const barColor: Record<string, string> = { Natation: 'bg-swim', Musculation: 'bg-gym', Cardio: 'bg-cardio', Boxe: 'bg-boxing' }
                return (
                  <li key={d.name} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-24 flex-shrink-0">{d.name}</span>
                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor[d.name] ?? 'bg-zinc-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-zinc-400 w-20 text-right">{d.sessions} séance{d.sessions > 1 ? 's' : ''} · {Math.round(d.calories)} kcal</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="text-sm font-medium mb-2">Dernières séances</h2>
          <RecentSessions sessions={recentSessions} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/session" className="btn-primary justify-center py-3 text-base sm:col-span-2">
          <Plus size={18} />
          Démarrer une séance
        </Link>
        <div className="card flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-violet-600">
            <Bot size={13} />
            Coach IA
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed flex-1">
            {streak > 0 ? `Belle série de ${streak} jours ! Continuez sur cette lancée.` : "Démarrez votre première séance pour recevoir des conseils personnalisés."}
          </p>
          <Link href="/session" className="text-xs text-violet-600 font-medium hover:underline">
            Voir le programme du jour →
          </Link>
        </div>
      </div>
    </div>
  )
}