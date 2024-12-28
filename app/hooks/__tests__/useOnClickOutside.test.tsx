import { renderHook } from '@testing-library/react-hooks';
import { fireEvent } from '@testing-library/react';
import { useOnClickOutside, useOnClickOutsideRef } from '../useOnClickOutside';

describe('useOnClickOutside', () => {
  let container: HTMLDivElement;
  let element: HTMLDivElement;
  const mockHandler = jest.fn();

  beforeEach(() => {
    // Setup DOM elements
    container = document.createElement('div');
    element = document.createElement('div');
    container.appendChild(element);
    document.body.appendChild(container);

    // Clear mock
    mockHandler.mockClear();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('calls handler when clicking outside', () => {
    const ref = { current: element };
    renderHook(() => useOnClickOutside(ref, mockHandler));

    // Click outside
    fireEvent.mouseDown(container);
    expect(mockHandler).toHaveBeenCalled();

    // Click inside
    mockHandler.mockClear();
    fireEvent.mouseDown(element);
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('works with touch events', () => {
    const ref = { current: element };
    renderHook(() => useOnClickOutside(ref, mockHandler));

    // Touch outside
    fireEvent.touchStart(container);
    expect(mockHandler).toHaveBeenCalled();

    // Touch inside
    mockHandler.mockClear();
    fireEvent.touchStart(element);
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('respects enabled option', () => {
    const ref = { current: element };
    renderHook(() => useOnClickOutside(ref, mockHandler, { enabled: false }));

    fireEvent.mouseDown(container);
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('excludes specified refs', () => {
    const excludedElement = document.createElement('div');
    container.appendChild(excludedElement);

    const ref = { current: element };
    const excludeRef = { current: excludedElement };
    renderHook(() => 
      useOnClickOutside(ref, mockHandler, { excludeRefs: [excludeRef] })
    );

    // Click on excluded element
    fireEvent.mouseDown(excludedElement);
    expect(mockHandler).not.toHaveBeenCalled();

    // Click on regular outside element
    fireEvent.mouseDown(container);
    expect(mockHandler).toHaveBeenCalled();
  });

  it('excludes elements matching selectors', () => {
    const excludedElement = document.createElement('div');
    excludedElement.classList.add('excluded');
    container.appendChild(excludedElement);

    const ref = { current: element };
    renderHook(() =>
      useOnClickOutside(ref, mockHandler, { excludeSelectors: ['.excluded'] })
    );

    // Click on excluded element
    fireEvent.mouseDown(excludedElement);
    expect(mockHandler).not.toHaveBeenCalled();

    // Click on regular outside element
    fireEvent.mouseDown(container);
    expect(mockHandler).toHaveBeenCalled();
  });

  it('cleans up event listeners', () => {
    const removeEventListener = jest.spyOn(document, 'removeEventListener');
    const ref = { current: element };
    const { unmount } = renderHook(() => useOnClickOutside(ref, mockHandler));

    unmount();
    expect(removeEventListener).toHaveBeenCalled();
  });

  it('handles null ref', () => {
    const ref = { current: null };
    renderHook(() => useOnClickOutside(ref, mockHandler));

    fireEvent.mouseDown(container);
    expect(mockHandler).not.toHaveBeenCalled();
  });

  describe('useOnClickOutsideRef', () => {
    it('creates and returns a ref', () => {
      const { result } = renderHook(() => useOnClickOutsideRef(mockHandler));

      expect(result.current).toHaveProperty('current');
    });

    it('works as a complete solution', () => {
      const { result } = renderHook(() => useOnClickOutsideRef(mockHandler));
      if (result.current.current) {
        element = result.current.current;
      }

      // Click outside
      fireEvent.mouseDown(container);
      expect(mockHandler).toHaveBeenCalled();

      // Click inside
      mockHandler.mockClear();
      fireEvent.mouseDown(element);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('accepts options', () => {
      const excludedElement = document.createElement('div');
      excludedElement.classList.add('excluded');
      container.appendChild(excludedElement);

      renderHook(() =>
        useOnClickOutsideRef(mockHandler, { excludeSelectors: ['.excluded'] })
      );

      // Click on excluded element
      fireEvent.mouseDown(excludedElement);
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });
});
