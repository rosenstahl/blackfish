import { useEffect, memo } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'

interface PageLoadingIndicatorProps {
  message?: string;
  duration?: number;
  onLoadingComplete?: () => void;
}

export default memo(function PageLoadingIndicator({
  message = 'Loading...',
  duration = 2,
  onLoadingComplete
}: PageLoadingIndicatorProps) {
  // Animation controls
  const circleControls = useAnimation()
  const textControls = useAnimation()

  useEffect(() => {
    // Track loading start
    Analytics.event({
      action: 'loading_start',
      category: 'UI',
      value: duration
    })

    // Start animations
    const startAnimations = async () => {
      // Animate circle
      await circleControls.start({
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
        transition: {
          duration,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })
    }

    startAnimations()

    // Track loading time
    const loadingTimeout = setTimeout(() => {
      Analytics.event({
        action: 'loading_timeout',
        category: 'Error',
        value: duration
      })
    }, duration * 1000 * 2) // Double the animation duration

    return () => {
      clearTimeout(loadingTimeout)
      circleControls.stop()
      textControls.stop()
    }
  }, [circleControls, textControls, duration])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-50",
        "flex items-center justify-center",
        "bg-[#1a1f36]/90 backdrop-blur-sm"
      )}
    >
      <div className="relative">
        {/* Logo Animation */}
        <motion.div
          animate={circleControls}
          className={cn(
            "w-16 h-16",
            "border-2 border-blue-500 rounded-full"
          )}
        />
        
        {/* Loading Circle */}
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
          className={cn(
            "absolute inset-0",
            "border-t-2 border-white rounded-full"
          )}
        />

        {/* Loading Text */}
        <motion.p
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={cn(
            "absolute -bottom-8 left-1/2 -translate-x-1/2",
            "text-white font-medium"
          )}
        >
          {message}
        </motion.p>

        {/* Screen Reader Only Text */}
        <span className="sr-only">
          Page is loading. Please wait.
        </span>

        {/* Progress Ring (optional) */}
        <svg
          className="absolute inset-0 w-16 h-16"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle
            className="text-gray-700"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="48"
            cx="50"
            cy="50"
          />
          <motion.circle
            className="text-blue-500"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="48"
            cx="50"
            cy="50"
            style={{
              strokeDasharray: "301.59289474462014",
              strokeDashoffset: "301.59289474462014",
              rotate: "-90deg",
              transformOrigin: "50% 50%"
            }}
            animate={{
              strokeDashoffset: [301.59289474462014, 0]
            }}
            transition={{
              duration: duration,
              ease: "linear",
              repeat: Infinity
            }}
          />
        </svg>
      </div>
    </div>
  )
})

PageLoadingIndicator.displayName = 'PageLoadingIndicator'