import type { PerformanceMonitoring } from './performance-monitoring';

type EventType = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

class AnalyticsService {
  private performanceMonitoring: PerformanceMonitoring | null = null;

  init(): void {
    // Performance-Monitoring initialisieren
    if (typeof window !== 'undefined') {
      import('./performance-monitoring').then(({ PerformanceMonitoring }) => {
        this.performanceMonitoring = new PerformanceMonitoring();
      });
    }
  }

  event(data: EventType): void {
    // Event an Google Analytics senden
    if (typeof window !== 'undefined' && 'gtag' in window) {
      window.gtag('event', data.action, {
        event_category: data.category,
        event_label: data.label,
        value: data.value
      });
    }
  }

  pageView(url: string): void {
    // Seitenaufruf tracken
    if (typeof window !== 'undefined' && 'gtag' in window) {
      window.gtag('config', process.env['NEXT_PUBLIC_GA_ID'], {
        page_path: url
      });
    }
  }

  measurePageLoad(): void {
    if (this.performanceMonitoring) {
      this.performanceMonitoring.measurePageLoad();
    }
  }

  trackResources(): void {
    if (this.performanceMonitoring) {
      this.performanceMonitoring.trackResources();
    }
  }

  trackErrors(): void {
    if (this.performanceMonitoring) {
      this.performanceMonitoring.trackErrors();
    }
  }
}

export const Analytics = new AnalyticsService();
