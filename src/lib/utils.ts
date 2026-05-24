import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DISCIPLINE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Natation:    { bg: 'bg-swim-light',   text: 'text-swim-dark',   dot: 'bg-swim' },
  Musculation: { bg: 'bg-gym-light',    text: 'text-gym-dark',    dot: 'bg-gym' },
  Cardio:      { bg: 'bg-cardio-light', text: 'text-cardio-dark', dot: 'bg-cardio' },
  Boxe:        { bg: 'bg-boxing-light', text: 'text-boxing-dark', dot: 'bg-boxing' },
}

export function minutesToHuman(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h${m > 0 ? ` ${m}min` : ''}` : `${m} min`
}
