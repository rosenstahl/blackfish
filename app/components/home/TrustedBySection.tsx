import { type ReactNode, memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

type Props = {
  children?: ReactNode;
}

export default function TrustedBySection({ children }: Props) {
  const [ref] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section 
      id="trusted" 
      ref={ref}
      className="relative bg-gradient-to-b from-[#1a1f36] via-[#1a1f36] to-transparent py-24 overflow-hidden"
      aria-labelledby="trusted-section-title"
    >
      {/* ... Rest der Komponente ... */}
      {children}
    </section>
  )
}