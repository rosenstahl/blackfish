import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/app/lib/utils'

type Language = {
  code: string
  nativeName: string
  flag: string
}

const languages: Language[] = [
  { code: 'de', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', nativeName: 'English', flag: '🇬🇧' }
]

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { i18n } = useTranslation()
  
  // Sicherstellen, dass currentLang immer definiert ist
  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center justify-between gap-2 rounded-lg',
          'border border-gray-700 bg-gray-800 px-3 py-2',
          'text-sm font-medium text-white',
          'hover:bg-gray-700 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Sprache ändern. Aktuelle Sprache: ${currentLang.nativeName}`}
      >
        <Globe className="h-4 w-4" />
        <span>{currentLang.code.toUpperCase()}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute right-0 z-10 mt-2 w-48',
              'rounded-lg border border-gray-700 bg-gray-800',
              'shadow-lg ring-1 ring-black ring-opacity-5'
            )}
          >
            <ul
              role="listbox"
              aria-label="Verfügbare Sprachen"
              className="py-1"
            >
              {languages.map((lang) => (
                <li key={lang.code}>
                  <button
                    className={cn(
                      'flex w-full items-center gap-2 px-4 py-2 text-sm',
                      'transition-colors',
                      lang.code === currentLang.code
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    )}
                    onClick={() => handleLanguageChange(lang.code)}
                    role="option"
                    aria-selected={lang.code === currentLang.code}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}