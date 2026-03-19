import { Link } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface ToolCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  className?: string
}

export function ToolCard({ title, description, icon: Icon, href, className }: ToolCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        'block bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-gray-800',
        'rounded-2xl p-8 text-center transition-all duration-300',
        'relative overflow-hidden group',
        'hover:border-gold hover:-translate-y-1 hover:shadow-card-hover',
        className
      )}
    >
      {/* Top accent bar */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1',
          'bg-gradient-to-r from-gold to-gold-light',
          'transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300'
        )}
      />

      {/* Icon */}
      <div
        className={cn(
          'w-16 h-16 mx-auto mb-5 rounded-2xl',
          'bg-gradient-to-br from-gold to-gold-light',
          'flex items-center justify-center text-white',
          'group-hover:scale-110 transition-transform duration-300'
        )}
      >
        <Icon className="w-8 h-8" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-gold-dark mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </Link>
  )
}
