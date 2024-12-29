export const measureWebVitals = () => {
  try {
    if (typeof window !== 'undefined') {
      // Core Web Vitals
      webVitals.getTTFB(sendToAnalytics);
      webVitals.getFID(sendToAnalytics);
      webVitals.getLCP(sendToAnalytics);
      webVitals.getCLS(sendToAnalytics);
      webVitals.getFCP(sendToAnalytics);

      // Custom Performance Marks
      if (performance && performance.mark) {
        performance.mark('app_started');
        
        window.addEventListener('load', () => {
          performance.mark('app_loaded');
          performance.measure('app_startup', 'app_started', 'app_loaded');
        });
      }
    }
  } catch (err) {
    console.error('Error measuring performance:', err);
  }
};

const sendToAnalytics = (metric: any) => {
  const body = JSON.stringify(metric);
  
  // Send to your analytics service
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body);
  } else {
    fetch('/api/vitals', {
      body,
      method: 'POST',
      keepalive: true
    });
  }
};
