export type DisciplineSlug = 'natation' | 'musculation' | 'cardio' | 'boxe'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  weight_kg: number | null
  height_cm: number | null
  birth_date: string | null
  goal: string | null
  created_at: string
}

export interface Discipline {
  id: string
  name: string
  icon: string
  met_default: number
}

export interface Exercise {
  id: string
  discipline_id: string
  name: string
  description: string | null
  illustration_url: string | null
  met_value: number | null
  difficulty: 'débutant' | 'intermédiaire' | 'avancé' | null
}

export interface Session {
  id: string
  user_id: string
  discipline_id: string
  session_date: string
  duration_min: number
  calories_burned: number | null
  notes: string | null
  created_at: string
  discipline?: Discipline
}

export interface SessionExercise {
  id: string
  session_id: string
  exercise_id: string | null
  exercise_name: string
  sets: number | null
  reps: number | null
  duration_sec: number | null
  weight_kg: number | null
}

export interface WeekStats {
  totalSessions: number
  totalCalories: number
  totalMinutes: number
  streak: number
  sessionsByDay: (Session | null)[]
}
