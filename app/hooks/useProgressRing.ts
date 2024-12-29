import { useState, useCallback, useEffect, useRef } from 'react';

interface UseProgressRingProps {
  duration?: number;
  initialProgress?: number;
  onComplete?: () => void;
}

export function useProgressRing({
  duration = 2000,
  initialProgress = 0,
  onComplete
}: UseProgressRingProps = {}) {
  const [progress, setProgress] = useState(initialProgress);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const isRunningRef = useRef(false);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const nextProgress = Math.min(elapsed / duration, 1);

    setProgress(nextProgress);

    if (elapsed < duration && isRunningRef.current) {
      requestRef.current = requestAnimationFrame(animate);
    } else if (elapsed >= duration) {
      isRunningRef.current = false;
      onComplete?.();
    }
  }, [duration, onComplete]);

  const startProgress = useCallback(() => {
    isRunningRef.current = true;
    startTimeRef.current = undefined;
    requestRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stopProgress = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    isRunningRef.current = false;
    setProgress(initialProgress);
    startTimeRef.current = undefined;
  }, [initialProgress]);

  const resetProgress = useCallback(() => {
    stopProgress();
    startProgress();
  }, [stopProgress, startProgress]);

  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return {
    progress,
    startProgress,
    stopProgress,
    resetProgress,
    isRunning: isRunningRef.current
  };
}
