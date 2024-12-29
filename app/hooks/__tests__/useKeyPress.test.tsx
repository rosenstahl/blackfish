import { renderHook } from '@testing-library/react-hooks';
import { fireEvent } from '@testing-library/react';
import { useKeyPress } from '../useKeyPress';

describe('useKeyPress', () => {
  const mockHandler = jest.fn();

  beforeEach(() => {
    mockHandler.mockClear();
  });

  it('calls handler when specified key is pressed', () => {
    renderHook(() => useKeyPress('Escape', mockHandler));

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockHandler).toHaveBeenCalled();
  });

  it('handles multiple keys', () => {
    renderHook(() => useKeyPress(['ArrowUp', 'ArrowDown'], mockHandler));

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    expect(mockHandler).toHaveBeenCalled();

    mockHandler.mockClear();

    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(mockHandler).toHaveBeenCalled();
  });

  it('respects modifier keys', () => {
    renderHook(() =>
      useKeyPress('a', mockHandler, {
        modifiers: { ctrl: true, shift: true }
      })
    );

    // Without modifiers
    fireEvent.keyDown(window, { key: 'a' });
    expect(mockHandler).not.toHaveBeenCalled();

    // With only Ctrl
    fireEvent.keyDown(window, { key: 'a', ctrlKey: true });
    expect(mockHandler).not.toHaveBeenCalled();

    // With both modifiers
    fireEvent.keyDown(window, { key: 'a', ctrlKey: true, shiftKey: true });
    expect(mockHandler).toHaveBeenCalled();
  });

  it('prevents default behavior when specified', () => {
    renderHook(() =>
      useKeyPress('Tab', mockHandler, { preventDefault: true })
    );

    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    jest.spyOn(event, 'preventDefault');

    fireEvent(window, event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('stops propagation when specified', () => {
    renderHook(() =>
      useKeyPress('Enter', mockHandler, { stopPropagation: true })
    );

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    jest.spyOn(event, 'stopPropagation');

    fireEvent(window, event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('doesnt call handler when disabled', () => {
    renderHook(() =>
      useKeyPress('a', mockHandler, { disabled: true })
    );

    fireEvent.keyDown(window, { key: 'a' });
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('cleans up event listeners', () => {
    const removeEventListener = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useKeyPress('a', mockHandler));

    unmount();
    expect(removeEventListener).toHaveBeenCalled();
  });

  it('works with custom target element', () => {
    const element = document.createElement('div');
    const { unmount } = renderHook(() =>
      useKeyPress('a', mockHandler, { target: element })
    );

    fireEvent.keyDown(element, { key: 'a' });
    expect(mockHandler).toHaveBeenCalled();

    unmount();
  });

  it('supports different event types', () => {
    renderHook(() =>
      useKeyPress('a', mockHandler, { event: 'keyup' })
    );

    fireEvent.keyUp(window, { key: 'a' });
    expect(mockHandler).toHaveBeenCalled();
  });
});
