import { cn } from '@/app/lib/utils'
import { containerStyles } from '@/app/styles/shared'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

export function Container({
  className,
  size = 'md',
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        containerStyles.base,
        containerStyles.sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}