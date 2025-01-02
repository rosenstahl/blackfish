import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Menu, X } from 'lucide-react'
import { navigation, handleNavClick } from '@/app/utils/navigation'
import { useTranslation } from 'react-i18next'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'
import { useDebounce } from '@/app/hooks/useDebounce'
import LanguageSwitcher from '../common/LanguageSwitcher'
import { buttonStyles, transitionStyles } from '@/app/styles/shared'
import { menuAnimation } from '@/app/styles/animations'

interface Props {
  className?: string;
}

export default function Header({ className }: Props) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const lastScrollY = useRef(0)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    setScrolled(currentScrollY > 20)

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target?.closest('.mobile-menu') && !target?.closest('.menu-button')) {
        setIsOpen(false)
      }
    }
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscKey)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleMobileNavClick = (href: string) => {
    setIsOpen(false)
    handleNavClick(href, () => {
      Analytics.event({
        action: 'mobile_nav_click',
        category: 'Navigation',
        label: href
      })
    })
  }

  return (
    <header 
      ref={headerRef}
      className={cn(
        transitionStyles.base,
        "fixed top-0 w-full z-50",
        scrolled ? "bg-[#1a1f36]/95 backdrop-blur-lg shadow-lg" : "bg-transparent",
        className
      )}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <nav 
          className="flex items-center justify-between h-20"
          role="navigation"
          aria-label={t('aria.mainNavigation')}
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
                className={cn(
                  transitionStyles.base,
                  "text-gray-300 hover:text-white"
                )}
              >
                {t(`nav.${item.name}`)}
              </motion.button>
            ))}

            <LanguageSwitcher />

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/contact"
                className={cn(
                  buttonStyles.base,
                  buttonStyles.variants.primary,
                  buttonStyles.sizes.md
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
            aria-label={isOpen ? t('aria.closeMenu') : t('aria.openMenu')}
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
            {...menuAnimation}
            className={cn(
              "fixed inset-0 z-40 md:hidden mobile-menu",
              "bg-[#1a1f36]/98 backdrop-blur-lg"
            )}
          >
            <div className="flex flex-col items-center justify-center min-h-screen space-y-8 p-4">
              {navigation.map((item) => (
                <motion.button
                  key={item.name}
                  {...menuAnimation}
                  onClick={() => handleMobileNavClick(item.href)}
                  className={cn(
                    transitionStyles.base,
                    "text-2xl text-white hover:text-blue-400"
                  )}
                >
                  {t(`nav.${item.name}`)}
                </motion.button>
              ))}

              <motion.div
                {...menuAnimation}
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
                    buttonStyles.base,
                    buttonStyles.variants.primary,
                    buttonStyles.sizes.lg
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