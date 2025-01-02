import React from 'react'

export class Analytics {
  static event(data: { action: string; category: string; label?: string; value?: number }) {
    if (typeof window === 'undefined' || !window.gtag) return

    try {
      window.gtag('event', data.action, {
        event_category: data.category,
        event_label: data.label,
        value: data.value
      })
    } catch (error) {
      console.error('Analytics error:', error)
    }
  }

  static pageView(url: string): void {
    if (typeof window === 'undefined' || !window.gtag) return

    try {
      window.gtag('config', process.env['NEXT_PUBLIC_GA_ID'], {
        page_path: url
      })
    } catch (error) {
      console.error('Analytics error:', error)
    }
  }
}