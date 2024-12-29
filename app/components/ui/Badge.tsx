import { cn } from '@/app/lib/utils'
import { badgeStyles } from '@/app/styles/components'

type BadgeVariant = 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({
  className,
  variant = 'gray',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        badgeStyles.base,
        badgeStyles.variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}