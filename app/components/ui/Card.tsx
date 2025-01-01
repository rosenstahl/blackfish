import { cn } from '@/app/lib/utils'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cardStyles } from '@/app/styles/shared'

type BaseCardProps = {
  variant?: 'light' | 'dark'
  isHoverable?: boolean
  isInteractive?: boolean
  children?: React.ReactNode
}

type CardProps = BaseCardProps & Omit<HTMLMotionProps<"div">, keyof BaseCardProps>

const cardVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
}

export function Card({
  className,
  variant = 'light',
  isHoverable = false,
  isInteractive = false,
  children,
  whileHover = cardVariants.hover,
  whileTap = cardVariants.tap,
  ...props
}: CardProps) {
  const Component = isInteractive ? motion.div : 'div'
  const motionProps = isInteractive ? { whileHover, whileTap } : {}

  return (
    <Component
      className={cn(
        cardStyles.base,
        cardStyles.variants[variant],
        isHoverable && 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>

Card.Header = function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200/10', className)} {...props}>
      {children}
    </div>
  )
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement>

Card.Content = function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>

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