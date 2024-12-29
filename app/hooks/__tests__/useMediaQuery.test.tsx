import { renderHook, act } from '@testing-library/react-hooks';
import { useMediaQuery } from '../useMediaQuery';

describe('useMediaQuery', () => {
  // Mock matchMedia
  let mockMatchMedia: jest.Mock;
  let mockAddListener: jest.Mock;
  let mockRemoveListener: jest.Mock;
  let mockAddEventListener: jest.Mock;
  let mockRemoveEventListener: jest.Mock;

  beforeEach(() => {
    mockAddListener = jest.fn();
    mockRemoveListener = jest.fn();
    mockAddEventListener = jest.fn();
    mockRemoveEventListener = jest.fn();

    mockMatchMedia = jest.fn().mockReturnValue({
      matches: false,
      addListener: mockAddListener,
      removeListener: mockRemoveListener,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      media: ''
    });

    window.matchMedia = mockMatchMedia;
  });

  it('uses SSR value when window is undefined', () => {
    // Mock window as undefined
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    const { result } = renderHook(() =>
      useMediaQuery('(min-width: 768px)', { ssrValue: true })
    );

    expect(result.current).toBe(true);

    // Restore window
    global.window = originalWindow;
  });

  it('uses default value when matchMedia is not supported', () => {
    // @ts-ignore
    delete window.matchMedia;

    const { result } = renderHook(() =>
      useMediaQuery('(min-width: 768px)', { defaultValue: true })
    );

    expect(result.current).toBe(true);

    // Restore matchMedia
    window.matchMedia = mockMatchMedia;
  });

  it('returns initial matches value', () => {
    mockMatchMedia.mockReturnValueOnce({
      matches: true,
      addListener: mockAddListener,
      removeListener: mockRemoveListener,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      media: ''
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(true);
  });

  it('handles media query changes', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    // Simulate media query match
    act(() => {
      const handler = mockAddEventListener.mock.calls[0][1];
      handler({ matches: true });
    });

    expect(result.current).toBe(true);

    // Simulate media query unmatch
    act(() => {
      const handler = mockAddEventListener.mock.calls[0][1];
      handler({ matches: false });
    });

    expect(result.current).toBe(false);
  });

  it('applies debounce to media query changes', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() =>
      useMediaQuery('(min-width: 768px)', { debounceTime: 100 })
    );

    // Simulate rapid media query changes
    act(() => {
      const handler = mockAddEventListener.mock.calls[0][1];
      handler({ matches: true });
      handler({ matches: false });
      handler({ matches: true });
    });

    // Before debounce time
    expect(result.current).toBe(false);

    // After debounce time
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe(true);

    jest.useRealTimers();
  });

  it('cleans up event listeners', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalled();
  });

  it('cleans up debounce timer', () => {
    jest.useFakeTimers();

    const { unmount } = renderHook(() =>
      useMediaQuery('(min-width: 768px)', { debounceTime: 100 })
    );

    // Simulate media query change
    act(() => {
      const handler = mockAddEventListener.mock.calls[0][1];
      handler({ matches: true });
    });

    unmount();

    // Timer should be cleared
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockRemoveEventListener).toHaveBeenCalled();

    jest.useRealTimers();
  });

  // Test preset hooks
  describe('Preset hooks', () => {
    it('useIsMobile works correctly', () => {
      const { result } = renderHook(() => useIsMobile());
      expect(typeof result.current).toBe('boolean');
    });

    it('useIsTablet works correctly', () => {
      const { result } = renderHook(() => useIsTablet());
      expect(typeof result.current).toBe('boolean');
    });

    it('useIsDesktop works correctly', () => {
      const { result } = renderHook(() => useIsDesktop());
      expect(typeof result.current).toBe('boolean');
    });

    it('usePrefersDarkMode works correctly', () => {
      const { result } = renderHook(() => usePrefersDarkMode());
      expect(typeof result.current).toBe('boolean');
    });

    it('usePrefersReducedMotion works correctly', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());
      expect(typeof result.current).toBe('boolean');
    });

    it('useIsRetina works correctly', () => {
      const { result } = renderHook(() => useIsRetina());
      expect(typeof result.current).toBe('boolean');
    });
  });
});
