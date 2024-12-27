'use client'

import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

i18next.init({
    resources: {
      de: {
        translation: {
         "navigation": {
          "services": "Leistungen",
          "referenzen": "Referenzen", 
          "pakete": "Pakete",
          "kontakt": "Kontakt"

          },
          hero: {
            title: "Digitale Lösungen die begeistern",
            subtitle: "Von der Strategie bis zur Umsetzung - Ihr Partner für digitalen Erfolg und messbares Wachstum"
          },
          cta: {
            packages: "Pakete entdecken",
            contact: "Beratungsgespräch vereinbaren",
            start: "Jetzt durchstarten"
          }
        }
      },
      en: {
        translation: {
          "navigation": {
            "services": "Services",
            "referenzen": "References",
            "pakete": "Packages"
          },
          hero: {
            title: "Digital Solutions that inspire",
            subtitle: "From strategy to implementation - Your partner for digital success and measurable growth"
          },
          cta: {
            packages: "Explore Packages",
            contact: "Schedule Consultation",
            start: "Get Started"
          }
        }
      },
      tr: {
        translation: {
          "navigation": {
            "services": "Hizmetler",
            "referenzen": "Referanslar",
            "pakete": "Paketler"
          },
          hero: {
            title: "İlham veren Dijital Çözümler",
            subtitle: "Stratejiden uygulamaya - Dijital başarı ve ölçülebilir büyüme için ortağınız"
          },
          cta: {
            packages: "Paketleri Keşfet",
            contact: "Danışma Görüşmesi",
            start: "Hemen Başla"
          }
        }
      }
    },
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    }
  });

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18next}>
      {children}
    </I18nextProvider>
  )
}