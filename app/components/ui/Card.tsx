import { cn } from '@/app/lib/utils'
import { motion, type HTMLMotionProps } from 'framer-motion'

type BaseCardProps = {
  variant?: 'primary' | 'secondary'
  isHoverable?: boolean
  isInteractive?: boolean
  children?: React.ReactNode
}

type CardProps = BaseCardProps & Omit<HTMLMotionProps<"div">, keyof BaseCardProps>

const variants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
}

const styles = {
  base: 'relative rounded-2xl bg-gray-800/50 backdrop-blur-sm p-6 border border-gray-700/50',
  variants: {
    primary: 'bg-gradient-to-br from-blue-500/5 to-purple-500/5',
    secondary: 'hover:border-gray-600'
  },
  hover: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200',
  active: 'cursor-pointer'
}

export function Card({
  className,
  variant = 'primary',
  isHoverable = false,
  isInteractive = false,
  children,
  whileHover = variants.hover,
  whileTap = variants.tap,
  ...props
}: CardProps) {
  const Component = isInteractive ? motion.div : 'div'
  const motionProps = isInteractive ? { whileHover, whileTap } : {}

  return (
    <Component
      className={cn(
        styles.base,
        styles.variants[variant],
        isHoverable && styles.hover,
        isInteractive && styles.active,
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}

type CardSectionProps = React.HTMLAttributes<HTMLDivElement>

Card.Header = function CardHeader({ className, children, ...props }: CardSectionProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200/10', className)} {...props}>
      {children}
    </div>
  )
}

Card.Content = function CardContent({ className, children, ...props }: CardSectionProps) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ className, children, ...props }: CardSectionProps) {
  return (
    <div 
      className={cn('px-6 py-4 bg-gray-50/5 border-t border-gray-200/10', className)} 
      {...props}
    >
      {children}
    </div>
  )
}