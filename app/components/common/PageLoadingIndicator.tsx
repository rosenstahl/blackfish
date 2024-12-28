import { useEffect, useCallback, memo } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'
import { useProgressRing } from '@/hooks/useProgressRing'

interface PageLoadingIndicatorProps {
  message?: string;
  duration?: number;
  onLoadingComplete?: () => void;
  showProgressRing?: boolean;
}

const DEFAULT_DURATION = 2;
const LOADING_TIMEOUT = 10000; // 10 seconds timeout

const LoadingRing = memo(({ progress }: { progress: number }) => (
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
        pathLength: progress,
        rotate: '-90deg',
        transformOrigin: '50% 50%'
      }}
    />
  </svg>
));

LoadingRing.displayName = 'LoadingRing';

function PageLoadingIndicator({
  message = 'Loading...',
  duration = DEFAULT_DURATION,
  onLoadingComplete,
  showProgressRing = true
}: PageLoadingIndicatorProps) {
  const prefersReducedMotion = useReducedMotion()
  const circleControls = useAnimation()
  const textControls = useAnimation()
  
  const { progress, startProgress, stopProgress } = useProgressRing({
    duration: duration * 1000
  })

  const handleLoadingComplete = useCallback(() => {
    Analytics.event({
      action: 'loading_complete',
      category: 'UI',
      value: duration
    })

    if (onLoadingComplete) {
      onLoadingComplete()
    }
  }, [duration, onLoadingComplete])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let animationStartTime = Date.now()

    // Track loading start
    Analytics.event({
      action: 'loading_start',
      category: 'UI',
      value: duration
    })

    // Start animations
    const startAnimations = async () => {
      if (prefersReducedMotion) {
        // Simplified animations for users who prefer reduced motion
        await Promise.all([
          circleControls.start({ opacity: 0.8 }),
          textControls.start({ opacity: 0.8 })
        ])
      } else {
        // Full animations
        await Promise.all([
          circleControls.start({
            scale: [1, 1.1, 1],
            rotate: 360,
            transition: {
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }
          }),
          textControls.start({
            opacity: [0.6, 1, 0.6],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          })
        ])
      }
    }

    // Start animations and progress
    startAnimations()
    if (showProgressRing) {
      startProgress()
    }

    // Set up loading timeout
    timeoutId = setTimeout(() => {
      const loadingTime = Date.now() - animationStartTime
      
      Analytics.event({
        action: 'loading_timeout',
        category: 'Error',
        value: loadingTime,
        label: `Timeout after ${loadingTime}ms`
      })

      handleLoadingComplete()
    }, LOADING_TIMEOUT)

    return () => {
      clearTimeout(timeoutId)
      circleControls.stop()
      textControls.stop()
      stopProgress()
    }
  }, [circleControls, textControls, duration, prefersReducedMotion, handleLoadingComplete, showProgressRing, startProgress, stopProgress])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-50",
        "flex items-center justify-center",
        "bg-gray-900/90 backdrop-blur-sm",
        "transition-opacity duration-200"
      )}
    >
      <div className="relative flex flex-col items-center">
        {/* Loading Animation */}
        <div className="relative w-16 h-16">
          {/* Spinning Circle */}
          <motion.div
            animate={circleControls}
            className={cn(
              "absolute inset-0",
              "border-2 border-blue-500 rounded-full"
            )}
          />

          {/* Progress Ring */}
          {showProgressRing && (
            <LoadingRing progress={progress} />
          )}
        </div>

        {/* Loading Text */}
        <motion.p
          animate={textControls}
          className={cn(
            "mt-4 text-white font-medium",
            "text-sm sm:text-base"
          )}
        >
          {message}
        </motion.p>

        {/* Screen Reader Text */}
        <span className="sr-only">
          Seite wird geladen. Bitte warten.
          {showProgressRing && `Fortschritt: ${Math.round(progress * 100)}%`}
        </span>
      </div>
    </div>
  )
}

// Performance Optimization durch Memoization
export default memo(PageLoadingIndicator);
