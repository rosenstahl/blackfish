import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Menu, X } from 'lucide-react'
import { navigation, handleNavClick } from '@/app/utils/navigation'
import { useTranslation } from 'react-i18next'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import LanguageSwitcher from '../common/LanguageSwitcher'

interface Props {
  className?: string;
}

export default function Header({ className }: Props) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const headerRef = useRef<HTMLElement>(null)
  const lastScrollY = useRef(0)

  // Optimierte Scroll-Handler mit Debounce
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    
    setScrolled(currentScrollY > 20)

    // Verstecke Header beim Runterscrollen, zeige beim Hochscrollen
    if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
      headerRef.current?.classList.add('-translate-y-full')
    } else {
      headerRef.current?.classList.remove('-translate-y-full')
    }
    
    lastScrollY.current = currentScrollY
  }, [])

  const debouncedHandleScroll = useDebounce(handleScroll, 100)

  useEffect(() => {
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true })
    return () => window.removeEventListener('scroll', debouncedHandleScroll)
  }, [debouncedHandleScroll])

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Escape Key Handler
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleMobileNavClick = (href: string) => {
    setIsOpen(false)
    handleNavClick(href, {
      onSuccess: () => {
        Analytics.event({
          action: 'mobile_nav_click',
          category: 'Navigation',
          label: href
        })
      }
    })
  }

  return (
    <header 
      ref={headerRef}
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-[#1a1f36]/95 backdrop-blur-lg shadow-lg" : "bg-transparent",
        className
      )}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <nav 
          className="flex items-center justify-between h-20"
          role="navigation"
          aria-label="Hauptnavigation"
        >
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-white z-50 group"
            onClick={() => {
              Analytics.event({
                action: 'logo_click',
                category: 'Navigation'
              })
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Rocket className="h-6 w-6 text-blue-500 transition-transform group-hover:rotate-12" />
            </motion.div>
            <span>BLACKFISH.DIGITAL</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {t(`nav.${item.name}`)}
              </motion.button>
            ))}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Contact Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/contact"
                className={cn(
                  "inline-flex items-center justify-center",
                  "rounded-full bg-blue-500 px-6 py-2",
                  "text-sm font-medium text-white",
                  "transition-colors hover:bg-blue-600",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                )}
                onClick={() => {
                  Analytics.event({
                    action: 'contact_button_click',
                    category: 'Navigation'
                  })
                }}
              >
                {t('cta.contact')}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 text-white menu-button"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </AnimatePresence>
          </motion.button>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed inset-0 z-40 md:hidden mobile-menu",
              "bg-[#1a1f36]/98 backdrop-blur-lg"
            )}
          >
            <div className="flex flex-col items-center justify-center min-h-screen space-y-8 p-4">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleMobileNavClick(item.href)}
                  className="text-2xl text-white hover:text-blue-400 transition-colors"
                >
                  {t(`nav.${item.name}`)}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navigation.length * 0.1 }}
                className="pt-4"
              >
                <Link 
                  href="/contact"
                  onClick={() => {
                    setIsOpen(false)
                    Analytics.event({
                      action: 'mobile_contact_click',
                      category: 'Navigation'
                    })
                  }}
                  className={cn(
                    "inline-flex items-center justify-center",
                    "rounded-full bg-blue-500 px-8 py-3",
                    "text-lg font-medium text-white",
                    "transition-colors hover:bg-blue-600"
                  )}
                >
                  {t('cta.contact')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}