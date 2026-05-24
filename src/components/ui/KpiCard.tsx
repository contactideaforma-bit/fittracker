import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: string
  sub?: string
  icon: LucideIcon
  className?: string
}

export function KpiCard({ label, value, sub, icon: Icon, className }: KpiCardProps) {
  return (
    <div className={cn('kpi-card', className)}>
      <div className="flex items-center gap-1.5 text-zinc-500">
        <Icon size={14} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-zinc-900 leading-none mt-1">{value}</p>
      {sub && <p className="text-xs text-zinc-400">{sub}</p>}
    </div>
  )
}
