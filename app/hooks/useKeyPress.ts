import { useEffect, useCallback, useRef } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface UseKeyPressOptions {
  target?: Window | HTMLElement;
  event?: 'keydown' | 'keyup' | 'keypress';
  preventDefault?: boolean;
  stopPropagation?: boolean;
  disabled?: boolean;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
}

export function useKeyPress(
  key: string | string[],
  handler: KeyHandler,
  {
    target = typeof window !== 'undefined' ? window : undefined,
    event = 'keydown',
    preventDefault = true,
    stopPropagation = true,
    disabled = false,
    modifiers = {}
  }: UseKeyPressOptions = {}
) {
  // Keep handler reference stable between re-renders
  const handlerRef = useRef<KeyHandler>(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // Convert single key to array
  const keys = Array.isArray(key) ? key : [key];

  const handleKeyEvent = useCallback(
    (event: KeyboardEvent) => {
      // Skip if disabled
      if (disabled) return;

      // Check if pressed key is in target keys
      if (!keys.includes(event.key)) return;

      // Check modifiers
      if (modifiers.ctrl && !event.ctrlKey) return;
      if (modifiers.alt && !event.altKey) return;
      if (modifiers.shift && !event.shiftKey) return;
      if (modifiers.meta && !event.metaKey) return;

      // Prevent default behavior if needed
      if (preventDefault) {
        event.preventDefault();
      }

      // Stop propagation if needed
      if (stopPropagation) {
        event.stopPropagation();
      }

      // Call handler with event
      handlerRef.current(event);
    },
    [keys, disabled, preventDefault, stopPropagation, modifiers]
  );

  useEffect(() => {
    // Skip if no target or disabled
    if (!target || disabled) return;

    // Attach event listener
    target.addEventListener(event, handleKeyEvent as EventListener);

    // Cleanup
    return () => {
      target.removeEventListener(event, handleKeyEvent as EventListener);
    };
  }, [target, event, handleKeyEvent, disabled]);

  // Return function to manually trigger handler
  return handleKeyEvent;
}

// Preset key combinations
export const useEscapeKey = (handler: KeyHandler, options?: Omit<UseKeyPressOptions, 'key'>) => 
  useKeyPress('Escape', handler, options);

export const useEnterKey = (handler: KeyHandler, options?: Omit<UseKeyPressOptions, 'key'>) => 
  useKeyPress('Enter', handler, options);

export const useSpaceKey = (handler: KeyHandler, options?: Omit<UseKeyPressOptions, 'key'>) => 
  useKeyPress(' ', handler, options);

export const useArrowKeys = (handler: KeyHandler, options?: Omit<UseKeyPressOptions, 'key'>) => 
  useKeyPress(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], handler, options);
