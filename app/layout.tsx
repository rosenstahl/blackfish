import { type Metadata, type Viewport } from 'next'
import { fontVariables } from '@/app/fonts/fonts'
import { cn } from '@/app/lib/utils'
import Providers from '@/app/providers/Providers'
import { Analytics } from '@/app/lib/analytics'

export const metadata: Metadata = {
  title: 'BLACKFISH.DIGITAL',
  description: 'Digitalagentur für moderne Webentwicklung und Online Marketing',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'BLACKFISH.DIGITAL',
    description: 'Digitalagentur für moderne Webentwicklung und Online Marketing',
    url: 'https://blackfish.digital',
    siteName: 'BLACKFISH.DIGITAL',
    locale: 'de_DE',
    type: 'website'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  colorScheme: 'dark'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={cn(
      fontVariables,
      'scroll-smooth antialiased',
      'bg-[#1a1f36] text-white'
    )}>
      <body>
        <Analytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}