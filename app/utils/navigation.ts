import { Analytics } from '@/app/lib/analytics';

export const navigation = [
  { name: 'services', href: '/#services', label: 'Leistungen' },
  { name: 'referenzen', href: '/#trusted', label: 'Referenzen' },
  { name: 'pakete', href: '/#pricing', label: 'Pakete' }
];

type ScrollCallback = () => void;

export function scrollToSection(sectionId: string, callback?: ScrollCallback): boolean {
  try {
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
    Analytics.event({
      action: 'section_scroll',
      category: 'Navigation',
      label: sectionId,
      value: Math.round(offsetPosition)
    });

    // Call callback after scroll
    if (callback) {
      setTimeout(callback, 1000);
    }

    return true;
  } catch (error) {
    console.error('Scroll error:', error);
    return false;
  }
}

// Utility-Funktion für Navigation-Links
export function handleNavClick(href: string, callback?: ScrollCallback): void {
  if (href.startsWith('/#')) {
    const sectionId = href.replace('/#', '');
    scrollToSection(sectionId, callback);
  } else {
    window.location.href = href;
    if (callback) callback();
  }
}
