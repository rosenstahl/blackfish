import { useEffect, useRef, useCallback } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

interface UseOnClickOutsideOptions {
  enabled?: boolean;
  excludeRefs?: React.RefObject<HTMLElement>[];
  excludeSelectors?: string[];
}

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: Handler,
  {
    enabled = true,
    excludeRefs = [],
    excludeSelectors = []
  }: UseOnClickOutsideOptions = {}
) {
  // Keep handler reference stable
  const handlerRef = useRef<Handler>(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!enabled) return;

      const target = event.target as Element;
      const el = ref.current;

      // Return if target or ref is not available
      if (!target || !el) return;

      // Check if click was inside excluded elements
      for (const excludeRef of excludeRefs) {
        if (excludeRef.current?.contains(target as Node)) return;
      }

      // Check if click was inside excluded selectors
      for (const selector of excludeSelectors) {
        if (target.closest(selector)) return;
      }

      // Check if click was outside the element
      if (!el.contains(target as Node)) {
        handlerRef.current(event);
      }
    },
    [ref, enabled, excludeRefs, excludeSelectors]
  );

  useEffect(() => {
    if (!enabled) return;

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside, { passive: true });
    document.addEventListener('touchstart', handleClickOutside, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [enabled, handleClickOutside]);
}

// Utility: Create ref and handler in one hook
export function useOnClickOutsideRef<T extends HTMLElement = HTMLElement>(
  handler: Handler,
  options?: UseOnClickOutsideOptions
): React.RefObject<T> {
  const ref = useRef<T>(null);
  useOnClickOutside(ref, handler, options);
  return ref;
}
