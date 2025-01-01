import { type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { CookieConsentProvider } from '@/app/context/CookieConsentContext'
import { LoadingProvider } from '@/app/context/LoadingContext'
import i18n from '@/app/i18n/config'

type ProvidersProps = {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <LoadingProvider>
        <CookieConsentProvider>
          {children}
        </CookieConsentProvider>
      </LoadingProvider>
    </I18nextProvider>
  )
}