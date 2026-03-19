import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/helpers'

// Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700',
              'bg-gray-50 dark:bg-dark-secondary text-gray-900 dark:text-gray-100',
              'font-montserrat transition-all duration-200',
              'focus:outline-none focus:border-gold focus:bg-white dark:focus:bg-dark-card',
              'focus:ring-2 focus:ring-gold/20',
              'placeholder:text-gray-400',
              leftIcon ? 'pl-12' : '',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Textarea
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700',
            'bg-gray-50 dark:bg-dark-secondary text-gray-900 dark:text-gray-100',
            'font-montserrat transition-all duration-200 resize-y min-h-32',
            'focus:outline-none focus:border-gold focus:bg-white dark:focus:bg-dark-card',
            'focus:ring-2 focus:ring-gold/20',
            'placeholder:text-gray-400',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

// Select
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700',
            'bg-gray-50 dark:bg-dark-secondary text-gray-900 dark:text-gray-100',
            'font-montserrat transition-all duration-200',
            'focus:outline-none focus:border-gold focus:bg-white dark:focus:bg-dark-card',
            'focus:ring-2 focus:ring-gold/20',
            error && 'border-red-500',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
