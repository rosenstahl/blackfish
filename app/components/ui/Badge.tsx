import { FC, HTMLAttributes } from 'react'
import { cn } from '@/app/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

const variantStyles = {
  default: 'bg-primary border-transparent text-primary-foreground',
  secondary: 'bg-secondary border-transparent text-secondary-foreground',
  destructive: 'bg-destructive border-transparent text-destructive-foreground',
  outline: 'text-foreground border-border'
}

export const Badge: FC<BadgeProps> = ({
  className,
  variant = 'default',
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

Badge.displayName = 'Badge'