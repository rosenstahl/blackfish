import i18n from 'i18next'
import type { InitOptions } from 'i18next'
import { initReactI18next } from 'react-i18next'

const i18nConfig: InitOptions = {
  fallbackLng: 'de',
  lng: 'de',
  resources: {
    de: {
      translation: {
        'nav.services': 'Leistungen',
        'nav.pricing': 'Pakete',
        'nav.about': 'Über uns',
        'cta.contact': 'Kontakt',
        'aria.mainNavigation': 'Hauptnavigation',
        'aria.openMenu': 'Menü öffnen',
        'aria.closeMenu': 'Menü schließen'
      }
    },
    en: {
      translation: {
        'nav.services': 'Services',
        'nav.pricing': 'Pricing',
        'nav.about': 'About',
        'cta.contact': 'Contact',
        'aria.mainNavigation': 'Main navigation',
        'aria.openMenu': 'Open menu',
        'aria.closeMenu': 'Close menu'
      }
    }
  },
  interpolation: {
    escapeValue: false
  }
}

i18n.use(initReactI18next).init(i18nConfig)

i18n.on('missingKey', (_, key) => {
  console.warn(`Missing translation key: ${key}`)
})

export default i18n