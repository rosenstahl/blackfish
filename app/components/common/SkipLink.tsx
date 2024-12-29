import { useCallback, useEffect, useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'
import { useKeyPress } from '@/hooks/useKeyPress'

interface SkipLinkProps {
  mainId?: string;
  className?: string;
  label?: string;
  showOnTab?: boolean;
}

function SkipLink({
  mainId = 'main-content',
  className,
  label = 'Zum Hauptinhalt springen',
  showOnTab = true
}: SkipLinkProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Use custom hook for Tab key detection
  useKeyPress('Tab', () => {
    if (showOnTab) {
      setIsVisible(true)
    }
  })

  // Handle Escape key to hide
  useKeyPress('Escape', () => {
    setIsVisible(false)
  })

  // Handle click with focus management
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const mainElement = document.getElementById(mainId)
    if (mainElement) {
      // Save current scroll position
      const currentScroll = window.scrollY

      // Focus and scroll
      mainElement.focus({
        preventScroll: true // Prevent automatic scrolling
      })

      // Smooth scroll to element
      mainElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

      // Track usage
      Analytics.event({
        action: 'skip_link_used',
        category: 'Accessibility',
        label: mainId,
        value: currentScroll // Track where the user was when they used the skip link
      })

      // Hide skip link after use
      setIsVisible(false)
    }
  }, [mainId])

  // Animation variants
  const variants = {
    hidden: { 
      y: -100,
      opacity: 0
    },
    visible: { 
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 25
      }
    },
    exit: { 
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href={`#${mainId}`}
          onClick={handleClick}
          onFocus={() => setIsVisible(true)}
          onBlur={() => setIsVisible(false)}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          className={cn(
            "fixed top-4 left-4 z-50",
            "bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "hover:bg-blue-600 active:bg-blue-700",
            "transition-colors duration-200",
            className
          )}
          style={{
            // Ensure WCAG compliance for keyboard accessibility
            isolation: 'isolate',
            // High contrast support
            '@media (forced-colors: active)': {
              forcedColorAdjust: 'none'
            }
          }}
          role="link"
          aria-label={label}
          tabIndex={0}
        >
          {label}
        </motion.a>
      )}
    </AnimatePresence>
  )
}

// Performance optimization
SkipLink.displayName = 'SkipLink'
export default memo(SkipLink)