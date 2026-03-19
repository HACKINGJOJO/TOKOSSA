import { Link } from 'react-router-dom'
import { Progress } from '@/components/ui'
import { cn } from '@/utils/helpers'

interface ModuleCardProps {
  moduleNumber: number
  title: string
  description: string
  href: string
  progress: number
  className?: string
}

export function ModuleCard({
  moduleNumber,
  title,
  description,
  href,
  progress,
  className,
}: ModuleCardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800',
        'rounded-2xl overflow-hidden transition-all duration-300',
        'hover:shadow-card-hover hover:-translate-y-1',
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gold to-gold-light p-6 text-white">
        <span className="text-xs uppercase tracking-widest opacity-80">
          Module {moduleNumber}
        </span>
        <h3 className="text-xl font-bold font-playfair mt-1 text-white">{title}</h3>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400 mb-5">{description}</p>

        <Progress value={progress} showLabel className="mb-5" />

        <Link
          to={href}
          className={cn(
            'block w-full text-center py-3 rounded-xl font-semibold transition-all',
            'border-2 border-gold text-gold-dark',
            'hover:bg-gold hover:text-white'
          )}
        >
          {progress > 0 ? 'Continuer' : 'Commencer'}
        </Link>
      </div>
    </div>
  )
}
