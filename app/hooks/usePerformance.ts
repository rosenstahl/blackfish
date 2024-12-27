import { useEffect, useCallback } from 'react';
import { Analytics } from '@/app/lib/analytics';

export const usePerformance = () => {
  const trackMetric = useCallback((metric: any) => {
    if (metric.name === 'FCP') {
      Analytics.event({
        action: 'performance',
        category: 'Web Vitals',
        label: metric.name,
        value: Math.round(metric.value)
      });
    }
  }, []);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(trackMetric);
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

    return () => observer.disconnect();
  }, [trackMetric]);
};