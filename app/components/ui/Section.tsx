import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/app/lib/utils'

type BaseSectionProps = {
  as?: 'section' | 'article' | 'aside'
  children?: React.ReactNode
}

type SectionProps = BaseSectionProps & Omit<HTMLMotionProps<"section">, keyof BaseSectionProps>

export function Section({
  className,
  as: Component = 'section',
  children,
  ...props
}: SectionProps) {
  const MotionComponent = motion[Component]

  return (
    <MotionComponent
      className={cn(
        'relative py-12 md:py-16 lg:py-24',
        className
      )}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}