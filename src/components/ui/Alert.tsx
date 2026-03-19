import { HTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/utils/helpers'
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info'
  icon?: ReactNode
}

const icons = {
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  danger: <XCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
}

const styles = {
  success: 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400',
  warning: 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400',
  danger: 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400',
  info: 'bg-gold/10 border-gold text-gold-dark',
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-4 p-4 rounded-xl border',
          styles[variant],
          className
        )}
        {...props}
      >
        {icon || icons[variant]}
        <div className="flex-1">{children}</div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'
