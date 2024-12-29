type EventType = 'page_view' | 'click' | 'error' | 'custom';

interface AnalyticsEvent {
  type: EventType;
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export const Analytics = {
  trackEvent: (event: AnalyticsEvent) => {
    try {
      const enrichedEvent = {
        ...event,
        timestamp: event.timestamp || Date.now(),
        session_id: getSessionId(),
        user_id: getUserId(),
        page_url: window.location.href,
        referrer: document.referrer,
      };

      // Send to your analytics endpoint
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichedEvent),
        keepalive: true,
      }).catch(console.error);
    } catch (err) {
      console.error('Error tracking event:', err);
    }
  },

  pageView: (name: string, properties?: Record<string, any>) => {
    Analytics.trackEvent({
      type: 'page_view',
      name,
      properties,
    });
  },

  trackError: (error: Error, context?: Record<string, any>) => {
    Analytics.trackEvent({
      type: 'error',
      name: error.name,
      properties: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
    });
  },
};

// Helper functions
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2);
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

const getUserId = () => {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = Math.random().toString(36).substring(2);
    localStorage.setItem('user_id', userId);
  }
  return userId;
};
