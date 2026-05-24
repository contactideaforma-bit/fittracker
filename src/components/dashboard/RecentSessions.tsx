import type { Session } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { minutesToHuman } from '@/lib/utils'
import Link from 'next/link'

const DISC_DOT: Record<string, string> = {
  Natation:    'bg-swim',
  Musculation: 'bg-gym',
  Cardio:      'bg-cardio',
  Boxe:        'bg-boxing',
}

export function RecentSessions({ sessions }: { sessions: Session[] }) {
  if (!sessions.length) {
    return <p className="text-sm text-zinc-400 py-2">Aucune séance enregistrée.</p>
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {sessions.map((s) => {
        const discName = s.discipline?.name ?? ''
        return (
          <li key={s.id} className="flex items-center gap-3 py-2.5">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${DISC_DOT[discName] ?? 'bg-zinc-300'}`} />
            <span className="text-xs text-zinc-400 w-14 flex-shrink-0">
              {format(new Date(s.session_date), 'EEE d', { locale: fr })}
            </span>
            <span className="text-sm text-zinc-700 flex-1 truncate">{discName}</span>
            <span className="text-xs text-zinc-400">{Math.round(s.calories_burned ?? 0)} kcal</span>
            <span className="text-xs text-zinc-400 w-12 text-right">{minutesToHuman(s.duration_min)}</span>
          </li>
        )
      })}
    </ul>
  )
}
