import { render, screen, act, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from '../../layout';
import { Analytics } from '../../lib/analytics';
import { Performance } from '../../lib/performance-monitoring';

// Mock next/font
vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mock-font',
    style: { fontFamily: 'Inter' },
  }),
}));

// Mock components
vi.mock('@/app/components/layout/Header', () => ({
  default: () => <div data-testid="mock-header">Header</div>,
}));

vi.mock('@/app/components/layout/Footer', () => ({
  default: () => <div data-testid="mock-footer">Footer</div>,
}));

vi.mock('@/app/components/common/CookieBanner', () => ({
  default: () => <div data-testid="mock-cookie-banner">Cookie Banner</div>,
}));

vi.mock('@/app/components/common/SkipLink', () => ({
  default: () => <div data-testid="mock-skip-link">Skip Link</div>,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/test-path',
}));

describe('RootLayout', () => {
  const mockChildren = <div data-testid="mock-content">Test Content</div>;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock performance monitoring
    vi.spyOn(Performance, 'mark');
    vi.spyOn(Analytics, 'event');

    // Mock window.matchMedia
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('renders all main components', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-cookie-banner')).toBeInTheDocument();
    expect(screen.getByTestId('mock-skip-link')).toBeInTheDocument();
    expect(screen.getByTestId('mock-content')).toBeInTheDocument();
  });

  it('sets correct HTML attributes', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const html = document.documentElement;
    expect(html).toHaveAttribute('lang', 'de');
    expect(html).toHaveClass('scroll-smooth');
  });

  it('includes required meta tags', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).toHaveAttribute(
      'content',
      'width=device-width, initial-scale=1, viewport-fit=cover'
    );
  });

  it('applies font class to body', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const body = screen.getByRole('document');
    expect(body).toHaveClass('mock-font');
    expect(body).toHaveClass('bg-gray-900');
    expect(body).toHaveClass('text-white');
  });

  it('marks performance on initial render', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    expect(Performance.mark).toHaveBeenCalledWith('layout_mounted');
  });

  it('tracks analytics events', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    expect(Analytics.event).toHaveBeenCalledWith({
      action: 'layout_render',
      category: 'Performance',
      label: '/test-path'
    });
  });

  it('maintains correct layout structure', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
    expect(main).toHaveClass('flex-grow');

    const layout = main.parentElement;
    expect(layout).toHaveClass('relative', 'flex', 'min-h-screen', 'flex-col');
  });

  it('handles window resize events', async () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    await act(async () => {
      window.innerWidth = 768; // Mobile breakpoint
      fireEvent(window, new Event('resize'));
    });

    // Wait for debounced resize handler
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(Analytics.event).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'viewport_change',
        category: 'Layout'
      })
    );
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('catches and handles render errors', () => {
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <RootLayout>
          <ErrorComponent />
        </RootLayout>
      );

      expect(screen.getByText(/ein fehler ist aufgetreten/i)).toBeInTheDocument();
    });

    it('tracks error events', () => {
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <RootLayout>
          <ErrorComponent />
        </RootLayout>
      );

      expect(Analytics.event).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'error',
          category: 'Error',
          label: 'Test error'
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA landmarks', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
    });

    it('maintains focus management', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const skipLink = screen.getByText('Skip Link');
      fireEvent.keyDown(document, { key: 'Tab' });
      
      expect(skipLink).toHaveFocus();
    });
  });
});
