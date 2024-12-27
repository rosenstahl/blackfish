import { Analytics } from './analytics'

export function reportWebVitals(metric: any) {
  Analytics.event({
    action: metric.name,
    category: 'Web Vitals',
    label: metric.id,
    value: Math.round(metric.value),
  })
}