'use client'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

type EventType = {
  action: string
  category: string
  label?: string
  value?: number
}

export class Analytics {
  static event(data: EventType): void {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('event', data.action, {
      event_category: data.category,
      event_label: data.label,
      value: data.value
    })
  }

  static error(action: string, data: Record<string, unknown>): void {
    this.event({
      action,
      category: 'Error',
      label: JSON.stringify(data)
    })
  }

  static pageView(url: string): void {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url
    })
  }
}
