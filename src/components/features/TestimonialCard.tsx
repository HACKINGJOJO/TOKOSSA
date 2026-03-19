import { cn } from '@/utils/helpers'

interface TestimonialCardProps {
  quote: string
  author: string
  location?: string
  className?: string
}

export function TestimonialCard({ quote, author, location, className }: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'bg-gray-50 dark:bg-dark-secondary p-6 rounded-xl',
        className
      )}
    >
      <p className="italic text-gray-700 dark:text-gray-300 mb-4">"{quote}"</p>
      <p className="font-semibold text-gold-dark">
        — {author}
        {location && <span className="font-normal text-gray-500">, {location}</span>}
      </p>
    </div>
  )
}
