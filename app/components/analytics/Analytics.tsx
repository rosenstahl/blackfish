'use client'

import { useEffect } from 'react'
import { Analytics as AnalyticsService } from '@/app/lib/analytics'

export function Analytics() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      AnalyticsService.pageView(window.location.pathname)
    }
  }, [])

  return null
}