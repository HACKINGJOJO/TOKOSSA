import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'gold',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-xl font-montserrat font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      gold: 'bg-gradient-to-r from-gold to-gold-light text-white shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5',
      outline:
        'border-2 border-gold text-gold-dark bg-transparent hover:bg-gold hover:text-white',
      success:
        'bg-gradient-to-r from-green-500 to-green-400 text-white hover:shadow-lg hover:-translate-y-0.5',
      danger:
        'bg-gradient-to-r from-red-500 to-red-400 text-white hover:shadow-lg hover:-translate-y-0.5',
      ghost: 'text-gold-dark hover:bg-gold/10',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
