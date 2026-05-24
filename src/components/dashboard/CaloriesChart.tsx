'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Session } from '@/types'
import { startOfWeek, addDays, format } from 'date-fns'

const DISC_COLOR: Record<string, string> = {
  Natation:    '#5DCAA5',
  Musculation: '#7F77DD',
  Cardio:      '#EF9F27',
  Boxe:        '#D85A30',
}

interface CaloriesChartProps {
  sessionsByDay: (Session | null)[]
}

export function CaloriesChart({ sessionsByDay }: CaloriesChartProps) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const labels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

  const data = sessionsByDay.map((s, i) => ({
    day: labels[i],
    calories: Math.round(s?.calories_burned ?? 0),
    discipline: s?.discipline?.name ?? '',
  }))

  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart data={data} barSize={24} margin={{ top: 4, right: 0, left: -32, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #e4e4e7', boxShadow: 'none' }}
          formatter={(v: number) => [`${v} kcal`, '']}
          labelFormatter={(l) => `${l}`}
        />
        <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.calories > 0 ? (DISC_COLOR[entry.discipline] ?? '#a1a1aa') : '#f4f4f5'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
