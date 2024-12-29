import { cn } from '@/app/lib/utils'
import { motion } from 'framer-motion'
import { cardStyles } from '@/app/styles/shared'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark'
  isHoverable?: boolean
  isInteractive?: boolean
}

export function Card({
  className,
  variant = 'light',
  isHoverable = false,
  isInteractive = false,
  children,
  ...props
}: CardProps) {
  const Component = isInteractive ? motion.div : 'div'

  return (
    <Component
      className={cn(
        cardStyles.base,
        cardStyles[variant],
        isHoverable && cardStyles.hover,
        isInteractive && cardStyles.active,
        className
      )}
      {...(isInteractive && {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 }
      })}
      {...props}
    >
      {children}
    </Component>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

Card.Header = function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200/10', className)} {...props}>
      {children}
    </div>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

Card.Content = function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

Card.Footer = function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div 
      className={cn('px-6 py-4 bg-gray-50/5 border-t border-gray-200/10', className)} 
      {...props}
    >
      {children}
    </div>
  )
}