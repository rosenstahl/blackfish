import { getCookie, setCookie } from 'cookies-next';

type EventType = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

class Analytics {
  private static instance: Analytics;
  private initialized: boolean = false;
  private consentGiven: boolean = false;
  private queue: EventType[] = [];
  private scrollDepthMarkers = [25, 50, 75, 90];
  private sessionStart: number;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.checkConsent();
      this.bindEvents();
      this.sessionStart = Date.now();
    }
  }

  private checkConsent() {
    const consent = getCookie('analytics-consent');
    this.consentGiven = consent === 'true';
    if (this.consentGiven && !this.initialized) {
      this.initializeAnalytics();
    }
  }

  private bindEvents() {
    if (typeof window === 'undefined') return;

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      if (!this.consentGiven) return;

      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.scrollDepthMarkers.forEach(marker => {
          if (scrollPercent >= marker) {
            this.trackEvent('scroll_depth', 'Engagement', `${marker}%`);
            this.scrollDepthMarkers = this.scrollDepthMarkers.filter(m => m !== marker);
          }
        });
      }
    }, { passive: true });

    // Track time on page
    const trackTimeOnPage = () => {
      if (!this.consentGiven) return;
      
      const timeSpent = Math.round((Date.now() - this.sessionStart) / 1000);
      const minutes = Math.floor(timeSpent / 60);
      
      if (minutes > 0) {
        this.trackEvent('time_on_page', 'Engagement', `${minutes} minutes`, minutes);
      }
    };

    window.addEventListener('beforeunload', trackTimeOnPage);

    // Track form interactions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      if (form.id) {
        this.trackEvent('form_submit', 'Forms', form.id);
      }
    });

    // Track file downloads
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A') {
        const href = target.href;
        const fileExtensions = ['.pdf', '.zip', '.doc', '.docx', '.xls', '.xlsx'];
        
        if (fileExtensions.some(ext => href.toLowerCase().endsWith(ext))) {
          this.trackEvent('file_download', 'Downloads', href.split('/').pop());
        }
      }
    });

    // Track video interactions
    document.addEventListener('play', (e) => {
      const video = e.target as HTMLVideoElement;
      if (video.tagName === 'VIDEO') {
        this.trackEvent('video_play', 'Video', video.currentSrc.split('/').pop());
      }
    }, true);

    // Track 404 errors
    if (document.title.includes('404')) {
      this.trackEvent('error_404', 'Error', window.location.pathname);
    }
  }

  public startUserSession() {
    if (this.consentGiven) {
      const sessionId = Math.random().toString(36).substring(2);
      setCookie('session-id', sessionId, {
        maxAge: 30 * 60, // 30 minutes
        path: '/',
        secure: true,
        sameSite: 'strict'
      });

      this.trackEvent('session_start', 'Session', sessionId);
    }
  }

  public trackUserAction(action: string, details: Record<string, any> = {}) {
    if (!this.consentGiven) return;

    this.trackEvent(
      action,
      'User Action',
      Object.entries(details)
        .map(([key, value]) => `${key}:${value}`)
        .join(',')
    );
  }

  public getSessionDuration(): number {
    return Math.round((Date.now() - this.sessionStart) / 1000);
  }
}

export const analytics = Analytics.getInstance();