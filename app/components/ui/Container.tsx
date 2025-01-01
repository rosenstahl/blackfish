import { cva } from 'class-variance-authority'
import { cn } from '@/app/lib/utils'

const containerStyles = cva(
  'mx-auto px-4 sm:px-6 lg:px-8',
  {
    variants: {
      size: {
        sm: 'max-w-3xl',
        md: 'max-w-5xl',
        lg: 'max-w-7xl',
      }
    },
    defaultVariants: {
      size: 'lg'
    }
  }
)

type ContainerProps = {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Container({
  children,
  className,
  size = 'lg'
}: ContainerProps) {
  return (
    <div className={cn(containerStyles({ size }), className)}>
      {children}
    </div>
  )
}