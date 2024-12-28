import { useEffect, memo, useCallback } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'
import { useLoadingProgress } from '@/hooks/useLoadingProgress'

interface LoadingCircleProps {
  prefersReducedMotion: boolean;
  progress: number;
  size?: number;
}

// Memoized Loading Circle Component
const LoadingCircle = memo(({ prefersReducedMotion, progress, size = 48 }: LoadingCircleProps) => (
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
      r={size}
      cx="50"
      cy="50"
    />
    <motion.circle
      className="text-blue-500"
      strokeWidth="4"
      stroke="currentColor"
      fill="transparent"
      r={size}
      cx="50"
      cy="50"
      style={{
        strokeDasharray: 2 * Math.PI * size,
        strokeDashoffset: 2 * Math.PI * size * (1 - progress / 100),
        rotate: "-90deg",
        transformOrigin: "50% 50%"
      }}
      animate={!prefersReducedMotion ? {
        strokeDashoffset: [2 * Math.PI * size, 0]
      } : {}}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity
      }}
    />
  </svg>
));

LoadingCircle.displayName = 'LoadingCircle';

// Loading Message Component
const LoadingMessage = memo(({ message, prefersReducedMotion }: { message: string; prefersReducedMotion: boolean }) => (
  <motion.p
    animate={!prefersReducedMotion ? {
      opacity: [0.5, 1, 0.5]
    } : {}}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={cn(
      "absolute -bottom-8 left-1/2 -translate-x-1/2",
      "text-white font-medium"
    )}
    aria-live="polite"
  >
    {message}
  </motion.p>
));

LoadingMessage.displayName = 'LoadingMessage';

// Main Component Props
interface PageLoadingIndicatorProps {
  message?: string;
  duration?: number;
  onLoadingComplete?: () => void;
  initialProgress?: number;
}

function PageLoadingIndicator({
  message = 'Loading...',
  duration = 2,
  onLoadingComplete,
  initialProgress = 0
}: PageLoadingIndicatorProps) {
  const prefersReducedMotion = useReducedMotion()
  const { progress, setProgress } = useLoadingProgress(initialProgress)
  const circleControls = useAnimation()

  // Track loading events
  const trackLoadingEvent = useCallback((eventType: string, value?: number) => {
    Analytics.event({
      action: `loading_${eventType}`,
      category: 'UI',
      label: message,
      value: value || duration
    })
  }, [duration, message])

  useEffect(() => {
    let mounted = true
    let progressInterval: NodeJS.Timeout

    const simulateProgress = () => {
      progressInterval = setInterval(() => {
        if (mounted) {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(progressInterval)
              trackLoadingEvent('complete', prev)
              onLoadingComplete?.()
              return 100
            }
            return Math.min(prev + Math.random() * 10, 100)
          })
        }
      }, duration * 100)
    }

    // Start animations and progress
    const startLoading = async () => {
      trackLoadingEvent('start')
      
      if (!prefersReducedMotion) {
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
    }

    startLoading()
    simulateProgress()

    // Timeout for long loading
    const loadingTimeout = setTimeout(() => {
      if (mounted && progress < 100) {
        trackLoadingEvent('timeout')
      }
    }, duration * 1000 * 3)

    return () => {
      mounted = false
      clearInterval(progressInterval)
      clearTimeout(loadingTimeout)
      circleControls.stop()
    }
  }, [circleControls, duration, onLoadingComplete, prefersReducedMotion, progress, setProgress, trackLoadingEvent])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-50",
        "flex items-center justify-center",
        "bg-[#1a1f36]/90 backdrop-blur-sm",
        "transition-opacity duration-300"
      )}
      data-testid="page-loading-indicator"
    >
      <div className="relative">
        {/* Loading Animation */}
        <motion.div
          animate={circleControls}
          className={cn(
            "w-16 h-16",
            "border-2 border-blue-500 rounded-full",
            "transition-all duration-300"
          )}
        />
        
        {/* Progress Circle */}
        <LoadingCircle 
          prefersReducedMotion={!!prefersReducedMotion}
          progress={progress}
        />

        {/* Loading Message */}
        <LoadingMessage 
          message={message} 
          prefersReducedMotion={!!prefersReducedMotion}
        />

        {/* Screen Reader Only Text */}
        <span className="sr-only">
          {message} {progress}% complete
        </span>
      </div>
    </div>
  )
}

// Performance Optimization durch Memoization
export default memo(PageLoadingIndicator);
