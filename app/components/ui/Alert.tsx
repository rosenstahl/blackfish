import { cn } from '@/app/lib/utils'
import { alertStyles } from '@/app/styles/components'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  icon?: boolean
  animate?: boolean
}

export function Alert({
  className,
  variant = 'info',
  title,
  icon = true,
  animate = true,
  children,
  ...props
}: AlertProps) {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle
  }

  const Icon = icons[variant]
  const Component = animate ? motion.div : 'div'

  return (
    <Component
      className={cn(
        alertStyles.base,
        alertStyles.variants[variant],
        className
      )}
      {...(animate && {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
      })}
      role="alert"
      {...props}
    >
      <div className="flex">
        {icon && (
          <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
        )}
        <div className={cn(icon && 'ml-3')}>
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className={cn(
            'text-sm',
            title && 'mt-2'
          )}>
            {children}
          </div>
        </div>
      </div>
    </Component>
  )
}