import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../common/ErrorBoundary';

describe('ErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test error');
    return null;
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/ein fehler ist aufgetreten/i)).toBeInTheDocument();
    expect(screen.getByText(/test error/i)).toBeInTheDocument();
  });

  it('provides retry functionality', () => {
    const onReset = jest.fn();
    render(
      <ErrorBoundary onReset={onReset}>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText(/erneut versuchen/i));
    expect(onReset).toHaveBeenCalled();
  });

  it('provides back navigation', () => {
    const mockHistoryBack = jest.fn();
    window.history.back = mockHistoryBack;

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText(/zurück/i));
    expect(mockHistoryBack).toHaveBeenCalled();
  });

  it('tracks error in analytics', () => {
    const mockAnalytics = jest.spyOn(Analytics, 'trackError');

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(mockAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Test error'
      }),
      expect.any(Object)
    );
  });

  it('renders custom fallback if provided', () => {
    const fallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={fallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('handles nested errors', () => {
    const NestedError = () => {
      const ThrowNested = () => {
        throw new Error('Nested error');
        return null;
      };
      return <ThrowNested />;
    };

    render(
      <ErrorBoundary>
        <NestedError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/nested error/i)).toBeInTheDocument();
  });
});
