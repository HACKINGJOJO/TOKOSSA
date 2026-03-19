import { HTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number
  label: string
  icon?: ReactNode
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, value, label, icon, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'relative overflow-hidden rounded-2xl p-6',
          'bg-gradient-to-br from-gold to-gold-light text-white',
          onClick && 'cursor-pointer hover:scale-[1.02] transition-transform',
          className
        )}
        {...props}
      >
        {/* Decorative circle */}
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/10 rounded-full" />

        <div className="relative z-10">
          {icon && <div className="mb-2">{icon}</div>}
          <div className="text-4xl font-black font-playfair mb-1">{value}</div>
          <div className="text-sm opacity-90 uppercase tracking-wider">{label}</div>
        </div>
      </div>
    )
  }
)

StatCard.displayName = 'StatCard'
