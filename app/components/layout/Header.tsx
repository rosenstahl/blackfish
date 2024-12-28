import { useState, useEffect, useCallback, useRef, memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Menu, X } from 'lucide-react'
import { navigation, handleNavClick } from '@/app/utils/navigation'
import { useTranslation } from 'react-i18next'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

// Optimierte Komponenten
const MobileMenuButton = memo(({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="md:hidden relative z-50 text-white menu-button"
    aria-expanded={isOpen}
    aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
  >
    <AnimatePresence mode="wait">
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </AnimatePresence>
  </motion.button>
))

const NavigationItem = memo(({ item, onClick }: { item: typeof navigation[0]; onClick: (href: string) => void }) => {
  const { t } = useTranslation()
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(item.href)}
      className="text-gray-300 hover:text-white transition-colors duration-200"
    >
      {t(`nav.${item.name}`)}
    </motion.button>
  )
})

// Header Component
function Header({ className }: { className?: string }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const lastScrollY = useRef(0)
  const intersectionRef = useRef<HTMLDivElement>(null)

  // Intersection Observer für bessere Performance
  const isIntersecting = useIntersectionObserver(intersectionRef, {
    threshold: 0,
    rootMargin: '-80px'
  })

  // Optimierter Scroll Handler
  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > 20 !== scrolled) {
        setScrolled(currentScrollY > 20)
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        headerRef.current?.classList.add('-translate-y-full')
      } else {
        headerRef.current?.classList.remove('-translate-y-full')
      }
      
      lastScrollY.current = currentScrollY
    })
  }, [scrolled])

  // Scroll Event Listener mit Passive Option
  useEffect(() => {
    let scrollTimer: number
    const onScroll = () => {
      if (scrollTimer) cancelAnimationFrame(scrollTimer)
      scrollTimer = requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (scrollTimer) cancelAnimationFrame(scrollTimer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [handleScroll])

  // Click Outside Handler mit Event Delegation
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !((e.target as HTMLElement).closest('.mobile-menu') || (e.target as HTMLElement).closest('.menu-button'))) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Navigation Handlers
  const handleMobileNavClick = useCallback((href: string) => {
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
  }, [])

  const handleLogoClick = useCallback(() => {
    Analytics.event({
      action: 'logo_click',
      category: 'Navigation'
    })
  }, [])

  return (
    <>
      {/* Intersection Observer Target */}
      <div ref={intersectionRef} className="absolute top-0 h-1 w-full" />

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
              onClick={handleLogoClick}
              prefetch={false}
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
                <NavigationItem key={item.name} item={item} onClick={handleNavClick} />
              ))}

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
                  prefetch={false}
                >
                  {t('cta.contact')}
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <MobileMenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </nav>
        </div>

        {/* Mobile Navigation with Performance Optimizations */}
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
              onAnimationComplete={() => {
                if (!isOpen) {
                  document.body.style.overflow = ''
                }
              }}
            >
              <div 
                className="flex flex-col items-center justify-center min-h-screen space-y-8 p-4"
                role="menu"
                aria-orientation="vertical"
                aria-label="Mobile Navigation"
              >
                {navigation.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleMobileNavClick(item.href)}
                    className="text-2xl text-white hover:text-blue-400 transition-colors"
                    role="menuitem"
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
                    prefetch={false}
                  >
                    {t('cta.contact')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

// Performance Optimierung durch Memo
export default memo(Header)