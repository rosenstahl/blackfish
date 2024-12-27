type EventType = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

class AnalyticsService {
  private static instance: AnalyticsService;
  private initialized: boolean = false;
  private queue: EventType[] = [];

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public init() {
    if (this.initialized) return;

    // Initialize analytics
    try {
      this.processQueue();
      this.initialized = true;
    } catch (error) {
      console.error('Analytics initialization failed:', error);
    }
  }

  private processQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (event) this.trackEvent(event.action, event.category, event.label, event.value);
    }
  }

  public trackEvent(action: string, category: string, label?: string, value?: number) {
    if (!this.initialized) {
      this.queue.push({ action, category, label, value });
      return;
    }

    // Track event implementation
    try {
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value
        });
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  public event(params: EventType) {
    this.trackEvent(params.action, params.category, params.label, params.value);
  }
}

export const Analytics = AnalyticsService.getInstance();