import { memo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Rocket, 
  Mail, 
  Phone, 
  MapPin,
  Instagram
} from 'lucide-react'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'
import { useTranslation } from 'react-i18next'

const socialLinks = [
  { 
    name: 'Instagram',
    icon: Instagram, 
    url: 'https://instagram.com/blackfish.digital',
    ariaLabel: 'Besuchen Sie uns auf Instagram'
  }
]

const quickLinks = [
  { name: 'Leistungen', href: '/#services' },
  { name: 'Referenzen', href: '/#trusted' },
  { name: 'Pakete', href: '/#pricing' },
  { name: 'Kontakt', href: '/contact' }
]

const legalLinks = [
  { name: 'Impressum', href: '/impressum' },
  { name: 'Datenschutz', href: '/datenschutz' },
  { name: 'AGB', href: '/agb' }
]

const Footer = memo(function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const trackClick = (linkName: string) => {
    Analytics.event({
      action: 'footer_click',
      category: 'Navigation',
      label: linkName
    })
  }

  return (
    <footer 
      className="relative bg-[#1a1f36] overflow-hidden"
      role="contentinfo"
      aria-label="Seitenfußzeile"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1f36] to-[#1a1f36]" />

      <div className="container relative mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Description */}
          <div>
            <Link 
              href="/"
              onClick={() => trackClick('logo')}
              className="flex items-center space-x-2 mb-6 group"
              aria-label="Zur Startseite"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="h-6 w-6 text-blue-500 transition-transform group-hover:scale-110" />
              </motion.div>
              <span className="font-bold text-lg text-white">
                BLACKFISH.DIGITAL
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ihre Lösung für digitalen Erfolg und nachhaltiges Wachstum. 
              Professionell, transparent und messbar.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Schnellzugriff">
            <h3 className="text-white font-semibold mb-6">Navigation</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                    onClick={() => trackClick(link.name)}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {t(`footer.nav.${link.name.toLowerCase()}`, link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Kontakt</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="tel:+491738528482"
                  className="flex items-center text-gray-400 hover:text-white transition-colors group"
                  onClick={() => trackClick('phone')}
                >
                  <Phone className="h-5 w-5 mr-2 text-blue-500 transition-transform group-hover:scale-110" />
                  +49 (0) 173 8528482
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@blackfish.digital"
                  className="flex items-center text-gray-400 hover:text-white transition-colors group"
                  onClick={() => trackClick('email')}
                >
                  <Mail className="h-5 w-5 mr-2 text-blue-500 transition-transform group-hover:scale-110" />
                  info@blackfish.digital
                </a>
              </li>
              <li className="flex items-start text-gray-400 group">
                <MapPin className="h-5 w-5 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                <address className="not-italic">
                  Rheinische Straße 220<br />
                  44147 Dortmund
                </address>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <nav aria-label="Rechtliche Informationen">
              <h3 className="text-white font-semibold mb-6">Rechtliches</h3>
              <ul className="space-y-4 mb-8">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                      onClick={() => trackClick(link.name)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors group"
                  aria-label={social.ariaLabel}
                  onClick={() => trackClick(social.name)}
                >
                  <social.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} BLACKFISH.DIGITAL - Alle Rechte vorbehalten
            </p>
            <p className="text-gray-400 text-sm">
              Made with ♥ in Dortmund
            </p>
          </div>
        </div>

        {/* Schema.org Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "Organization",
            "name": "BLACKFISH.DIGITAL",
            "url": "https://blackfish.digital",
            "logo": "https://blackfish.digital/logo.png",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Rheinische Straße 220",
              "addressLocality": "Dortmund",
              "postalCode": "44147",
              "addressCountry": "DE"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+49-173-8528482",
              "contactType": "customer service"
            },
            "sameAs": [
              "https://instagram.com/blackfish.digital"
            ]
          })}
        </script>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer