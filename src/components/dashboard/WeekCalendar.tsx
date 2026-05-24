'use client'

import { cn } from '@/lib/utils'
import type { Session } from '@/types'
import { format, startOfWeek, addDays, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'

const DISC_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  Natation:    { bg: 'bg-swim-light border-swim/50',     text: 'text-swim-dark',   label: 'N' },
  Musculation: { bg: 'bg-gym-light border-gym/50',       text: 'text-gym-dark',    label: 'M' },
  Cardio:      { bg: 'bg-cardio-light border-cardio/50', text: 'text-cardio-dark', label: 'C' },
  Boxe:        { bg: 'bg-boxing-light border-boxing/50', text: 'text-boxing-dark', label: 'B' },
}

interface WeekCalendarProps {
  sessionsByDay: (Session | null)[]
}

export function WeekCalendar({ sessionsByDay }: WeekCalendarProps) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const dayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

  return (
    <div className="flex gap-2 justify-between">
      {days.map((day, i) => {
        const session = sessionsByDay[i]
        const discName = session?.discipline?.name ?? ''
        const style = DISC_STYLE[discName]
        const today = isToday(day)

        return (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-xs text-zinc-400">{dayLabels[i]}</span>
            <div
              className={cn(
                'w-9 h-9 rounded-full border flex items-center justify-center text-xs font-medium transition-all',
                session && style
                  ? `${style.bg} ${style.text}`
                  : 'bg-zinc-100 border-zinc-200 text-zinc-400',
                today && 'ring-2 ring-violet-500 ring-offset-1'
              )}
              title={session ? `${discName} — ${session.duration_min} min` : format(day, 'd MMM', { locale: fr })}
            >
              {session ? style?.label : <span className="text-zinc-300">·</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
