// app/utils/navigation.ts

import { Analytics } from '@/app/lib/analytics';

export const navigation = [
  { name: 'services', href: '/#services', label: 'Leistungen' },
  { name: 'referenzen', href: '/#trusted', label: 'Referenzen' },
  { name: 'pakete', href: '/#pricing', label: 'Pakete' }
];

interface ScrollOptions {
  setLoading?: (state: boolean) => void;
  trackAnalytics?: boolean;
}

export function scrollToSection(sectionId: string, options: ScrollOptions = {}): boolean {
  const { setLoading, trackAnalytics = true } = options;

  try {
    if (setLoading) setLoading(true);

    const element = document.getElementById(sectionId);
    if (!element) {
      console.warn(`Section "${sectionId}" wurde nicht gefunden`);
      return false;
    }

    const headerOffset = 120; // Header-Höhe
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    // Smooth Scroll mit Error Handling
    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth'
    });

    // Analytics Event
    if (trackAnalytics && typeof window.gtag !== 'undefined') {
      Analytics.event({
        action: 'section_scroll',
        category: 'Navigation',
        label: sectionId,
        value: Math.round(offsetPosition)
      });
    }

    // Reset Loading State
    if (setLoading) {
      setTimeout(() => setLoading(false), 1000);
    }

    return true;
  } catch (error) {
    console.error('Scroll error:', error);
    if (setLoading) setLoading(false);
    return false;
  }
}

// Utility-Funktion für Navigation-Links
export function handleNavClick(href: string, options: ScrollOptions = {}): void {
  if (href.startsWith('/#')) {
    const sectionId = href.replace('/#', '');
    scrollToSection(sectionId, options);
  } else {
    window.location.href = href;
  }
}

// Performance optimierte Scroll-Event Listener
export function initScrollListener(): () => void {
  let ticking = false;
  
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollPos = window.pageYOffset;
        // Hier können weitere Scroll-basierte Aktionen hinzugefügt werden
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Cleanup Funktion
  return () => window.removeEventListener('scroll', onScroll);
}