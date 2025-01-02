import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/app/lib/utils'

type BaseSectionProps = {
  as?: 'section' | 'article' | 'aside'
  children?: React.ReactNode
}

type SectionProps = BaseSectionProps & Omit<HTMLMotionProps<"section">, keyof BaseSectionProps>

const styles = {
  base: 'relative',
  spacing: 'py-12 md:py-16 lg:py-24'
}

export function Section({
  className,
  as: Component = 'section',
  children,
  ...props
}: SectionProps) {
  const MotionComponent = motion[Component] as typeof motion.section

  return (
    <MotionComponent
      className={cn(styles.base, styles.spacing, className)}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}