import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/app/lib/utils'

type Props = {
  delay?: number
  className?: string
}

export function PageLoadingIndicator({ delay = 300, className }: Props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          'bg-gray-900/75 backdrop-blur',
          className
        )}
      >
        <div className="relative">
          {/* Äußerer Ring */}
          <motion.div
            className="h-12 w-12 rounded-full border-2 border-blue-500"
            animate={{
              rotate: 360,
              transition: {
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
              }
            }}
          />

          {/* Innerer Ring */}
          <motion.div
            className="absolute inset-0 h-12 w-12 rounded-full border-t-2 border-white"
            animate={{
              rotate: -360,
              transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear'
              }
            }}
          />

          {/* Mittelpunkt */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8 }}
            animate={{
              scale: 1,
              transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }
            }}
          >
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

PageLoadingIndicator.displayName = 'PageLoadingIndicator'