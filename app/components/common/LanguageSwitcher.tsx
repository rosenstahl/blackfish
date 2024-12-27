import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { 
    code: 'de', 
    name: 'German', 
    nativeName: 'Deutsch',
    flag: '🇩🇪'
  },
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English',
    flag: '🇬🇧'
  },
  { 
    code: 'tr', 
    name: 'Turkish', 
    nativeName: 'Türkçe',
    flag: '🇹🇷'
  }
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close menu on ESC key
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [])

  // Optimize language change
  const changeLanguage = useCallback(async (lng: string) => {
    try {
      await i18n.changeLanguage(lng)
      localStorage.setItem('preferredLanguage', lng)
      
      Analytics.event({
        action: 'change_language',
        category: 'Language',
        label: lng
      })
      
      setIsOpen(false)
    } catch (error) {
      console.error('Language change failed:', error)
    }
  }, [i18n])

  // Get current language details
  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0]

  return (
    <div className="relative" ref={menuRef}>
      {/* Language Selector Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-gray-800/50 hover:bg-gray-700/50",
          "text-gray-300 hover:text-white transition-all"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Sprache ändern. Aktuelle Sprache: ${currentLang.nativeName}`}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm font-medium uppercase">
          {currentLang.code}
        </span>
      </motion.button>

      {/* Language Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "absolute right-0 mt-2 w-48 rounded-lg",
              "bg-gray-800/90 shadow-lg ring-1 ring-gray-700",
              "backdrop-blur-sm divide-y divide-gray-700"
            )}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={cn(
                  "w-full px-4 py-3 text-left transition-colors",
                  "flex items-center justify-between gap-2",
                  i18n.language === lang.code
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                )}
                whileHover={{ x: 4 }}
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <span>{lang.nativeName}</span>
                </div>
                {i18n.language === lang.code && (
                  <motion.div
                    className="h-2 w-2 rounded-full bg-blue-400"
                    layoutId="activeLanguage"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}