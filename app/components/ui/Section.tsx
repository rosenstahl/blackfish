import { cn } from '@/app/lib/utils'
import { motion } from 'framer-motion'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  animate?: boolean
}

export function Section({
  className,
  animate = false,
  children,
  ...props
}: SectionProps) {
  const Component = animate ? motion.section : 'section'

  return (
    <Component
      className={cn('py-12 md:py-16 lg:py-20', className)}
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 }
      })}
      {...props}
    >
      {children}
    </Component>
  )
}