import { useState, useEffect, useCallback } from 'react';

interface UseMediaQueryOptions {
  defaultValue?: boolean;
  ssrValue?: boolean;
  debounceTime?: number;
}

/**
 * Hook to handle media queries with performance optimization and SSR support
 */
export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    ssrValue = false,
    debounceTime = 100
  }: UseMediaQueryOptions = {}
) {
  // Use SSR value on server, default value on client before hydration
  const getInitialValue = () => {
    if (typeof window === 'undefined') return ssrValue;
    if (typeof window.matchMedia === 'undefined') return defaultValue;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getInitialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize the handler to prevent unnecessary re-renders
  const handleChange = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      setMatches(e.matches);
    },
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof window.matchMedia === 'undefined') return;

    // Create media query list
    const mediaQueryList = window.matchMedia(query);
    let timeoutId: NodeJS.Timeout;

    // Create debounced handler
    const debouncedHandler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleChange(e);
      }, debounceTime);
    };

    // Add listener (with backwards compatibility)
    if (mediaQueryList.addListener) {
      mediaQueryList.addListener(debouncedHandler);
    } else {
      mediaQueryList.addEventListener('change', debouncedHandler);
    }

    // Set initial value after hydration
    if (!isInitialized) {
      handleChange(mediaQueryList);
      setIsInitialized(true);
    }

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (mediaQueryList.removeListener) {
        mediaQueryList.removeListener(debouncedHandler);
      } else {
        mediaQueryList.removeEventListener('change', debouncedHandler);
      }
    };
  }, [query, handleChange, debounceTime, isInitialized]);

  return matches;
}

// Preset media queries
export const useIsMobile = (options?: UseMediaQueryOptions) =>
  useMediaQuery('(max-width: 768px)', options);

export const useIsTablet = (options?: UseMediaQueryOptions) =>
  useMediaQuery('(min-width: 769px) and (max-width: 1024px)', options);

export const useIsDesktop = (options?: UseMediaQueryOptions) =>
  useMediaQuery('(min-width: 1025px)', options);

export const usePrefersDarkMode = (options?: UseMediaQueryOptions) =>
  useMediaQuery('(prefers-color-scheme: dark)', options);

export const usePrefersReducedMotion = (options?: UseMediaQueryOptions) =>
  useMediaQuery('(prefers-reduced-motion: reduce)', options);

export const useIsRetina = (options?: UseMediaQueryOptions) =>
  useMediaQuery('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)', options);
