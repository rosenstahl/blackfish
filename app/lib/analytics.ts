import { trackEvent } from "./monitoring";

// app/lib/analytics.ts
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: Array<IArguments | any[]>;
  }
}

// Google Analytics ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX' // Hier deine Google Analytics ID einsetzen

// Events-Typen
export interface EventType {
  action: string;
  category: string;
  label?: string;
  value?: number;
  metric_rating?: 'good' | 'needs-improvement' | 'poor';
}

export const Analytics = {
  init: () => {
    if (typeof window === 'undefined') return;

    try {
      if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) return;

      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      script.async = true
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      window.gtag = function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      window.gtag('js', new Date())
      window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false // Wir tracken Page Views manuell
      })
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error)
    }
  },

  // Seitenaufrufe tracken
  pageview: (url: string) => {
    try {
      if (typeof window === 'undefined' || !window.gtag) return;
      
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url
      })
    } catch (error) {
      console.error('Failed to track pageview:', error)
    }
  },

  // Events tracken
  event: ({ action, category, label, value }: EventType) => {
    try {
      if (typeof window === 'undefined' || !window.gtag) return;

      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      })
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }
}

// Performance Monitoring
export const Performance = {
  // Lade-Performance messen
  measurePageLoad: () => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (!entries.length) return;

        entries.forEach((entry) => {
          // Performance-Daten an Analytics senden
          Analytics.event({
            action: 'web_vital',
            category: 'Performance',
            label: entry.name,
            value: Math.round(entry.startTime)
          })
        })
      })
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })

      return () => observer.disconnect(); // Clean up function
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error)
    }
  },

  // Resourcen-Nutzung tracken
  trackResources: () => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (!entries.length) return;

        entries.forEach((entry) => {
          if ((entry as PerformanceResourceTiming).initiatorType === 'fetch' || 
              (entry as PerformanceResourceTiming).initiatorType === 'xmlhttprequest') {
            Analytics.event({
              action: 'resource_timing',
              category: 'Performance',
              label: entry.name,
              value: Math.round(entry.duration)
            })
          }
        })
      })

      resourceObserver.observe({ entryTypes: ['resource'] })
      return () => resourceObserver.disconnect(); // Clean up function
    } catch (error) {
      console.warn('Resource tracking not supported:', error)
    }
  },

  // JavaScript Fehler tracken
  trackErrors: () => {
    if (typeof window === 'undefined') return;

    try {
      const errorHandler = (event: ErrorEvent) => {
        Analytics.event({
          action: 'error',
          category: 'Error',
          label: `${event.message} at ${event.filename}:${event.lineno}`,
        })
      };

      window.addEventListener('error', errorHandler)
      return () => window.removeEventListener('error', errorHandler); // Clean up function
    } catch (error) {
      console.warn('Error tracking not supported:', error)
    }
  }
}
