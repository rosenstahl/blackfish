import { Fragment, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Transition } from '@headlessui/react'
import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'

type Language = {
  code: string
  nativeName: string
}

const languages: Language[] = [
  { code: 'de', nativeName: 'Deutsch' },
  { code: 'en', nativeName: 'English' }
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState<Language>(languages[0])

  useEffect(() => {
    const lang = languages.find(l => l.code === i18n.language) || languages[0]
    setCurrentLang(lang)
  }, [i18n.language])

  const handleLanguageChange = (lang: Language) => {
    i18n.changeLanguage(lang.code)
    setCurrentLang(lang)
    Analytics.event({
      action: 'language_change',
      category: 'Language',
      label: lang.code
    })
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className={cn(
          'flex items-center space-x-2 rounded-full',
          'p-1.5 text-sm font-medium text-gray-300',
          'hover:text-white transition-colors'
        )}
        aria-label={`Sprache ändern. Aktuelle Sprache: ${currentLang.nativeName}`}
      >
        <Globe className="h-5 w-5" />
        <span>{currentLang.code.toUpperCase()}</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute right-0 mt-2 w-48 origin-top-right rounded-lg',
            'bg-gray-800 shadow-lg ring-1 ring-gray-700',
            'focus:outline-none divide-y divide-gray-700'
          )}
        >
          <div className="p-1">
            {languages.map((lang) => (
              <Menu.Item key={lang.code}>
                {({ active }) => (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLanguageChange(lang)}
                    className={cn(
                      'flex w-full items-center rounded-md px-3 py-2',
                      'text-sm font-medium text-gray-300',
                      'hover:bg-gray-700/50 hover:text-white transition-colors',
                      active && 'bg-gray-700/50 text-white'
                    )}
                    aria-selected={lang.code === currentLang.code}
                  >
                    {lang.nativeName}
                  </motion.button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}