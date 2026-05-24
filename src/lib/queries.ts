import { createClient } from '@/lib/supabase/server'
import { startOfWeek, endOfWeek, subDays, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Session, WeekStats } from '@/types'

export async function getProfile() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

export async function getWeekSessions(): Promise<Session[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const today = new Date()
  const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const weekEnd   = format(endOfWeek(today,   { weekStartsOn: 1 }), 'yyyy-MM-dd')

  const { data, error } = await supabase
    .from('sessions')
    .select('*, discipline:disciplines(*)')
    .eq('user_id', user.id)
    .gte('session_date', weekStart)
    .lte('session_date', weekEnd)
    .order('session_date', { ascending: true })

  console.log('Sessions récupérées:', data?.length, 'Erreur:', error)
  return data ?? []
}

export async function getRecentSessions(limit = 5): Promise<Session[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('sessions')
    .select('*, discipline:disciplines(*)')
    .eq('user_id', user.id)
    .order('session_date', { ascending: false })
    .limit(limit)

  return data ?? []
}

export async function getMonthDisciplineStats() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const monthStart = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')

  const { data } = await supabase
    .from('sessions')
    .select('discipline_id, calories_burned, duration_min, discipline:disciplines(name, icon)')
    .eq('user_id', user.id)
    .gte('session_date', monthStart)

  if (!data) return []

  // Grouper par discipline
  const map = new Map<string, { name: string; icon: string; sessions: number; calories: number; minutes: number }>()
  for (const s of data) {
    const disc = s.discipline as any
    if (!map.has(s.discipline_id)) {
      map.set(s.discipline_id, { name: disc.name, icon: disc.icon, sessions: 0, calories: 0, minutes: 0 })
    }
    const entry = map.get(s.discipline_id)!
    entry.sessions++
    entry.calories  += s.calories_burned ?? 0
    entry.minutes   += s.duration_min ?? 0
  }

  return Array.from(map.values()).sort((a, b) => b.calories - a.calories)
}

export async function computeWeekStats(sessions: Session[]): Promise<WeekStats> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Streak : compter les jours consécutifs depuis aujourd'hui vers le passé
  let streak = 0
  if (user) {
    let day = new Date()
    while (true) {
      const dateStr = format(day, 'yyyy-MM-dd')
      const { count } = await supabase
        .from('sessions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('session_date', dateStr)

      if ((count ?? 0) > 0) { streak++; day = subDays(day, 1) }
      else break
    }
  }

  // Sessions indexées par jour de la semaine (0=lundi … 6=dimanche)
  const sessionsByDay: (Session | null)[] = Array(7).fill(null)
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  for (const s of sessions) {
    const d = new Date(s.session_date)
    const idx = Math.round((d.getTime() - weekStart.getTime()) / 86400000)
    if (idx >= 0 && idx < 7) sessionsByDay[idx] = s
  }

  return {
    totalSessions: sessions.length,
    totalCalories: Math.round(sessions.reduce((sum, s) => sum + (s.calories_burned ?? 0), 0)),
    totalMinutes:  sessions.reduce((sum, s) => sum + s.duration_min, 0),
    streak,
    sessionsByDay,
  }
}
