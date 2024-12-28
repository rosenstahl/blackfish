import { useState, useCallback, useEffect, useRef, memo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Globe, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { useKeyPress } from '@/hooks/useKeyPress'

// Types
interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface LanguageButtonProps {
  lang: Language;
  isActive: boolean;
  onClick: () => void;
  prefersReducedMotion: boolean;
}

// Available languages
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

// Memoized Language Button Component
const LanguageButton = memo(({ lang, isActive, onClick, prefersReducedMotion }: LanguageButtonProps) => (
  <motion.button
    onClick={onClick}
    className={cn(
      "w-full px-4 py-3 text-left transition-colors duration-200",
      "flex items-center justify-between gap-2",
      isActive
        ? "bg-blue-500/20 text-blue-400"
        : "text-gray-300 hover:bg-gray-700/50 hover:text-white",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
      "focus:ring-offset-gray-800 rounded-sm"
    )}
    whileHover={prefersReducedMotion ? {} : { x: 4 }}
    role="menuitem"
    aria-current={isActive ? 'true' : 'false'}
  >
    <div className="flex items-center gap-2">
      <span className="text-lg" aria-hidden="true">
        {lang.flag}
      </span>
      <span>{lang.nativeName}</span>
    </div>
    {isActive && (
      <motion.div
        layoutId="activeLanguage"
        className="flex items-center"
        aria-hidden="true"
      >
        <Check className="h-4 w-4" />
      </motion.div>
    )}
  </motion.button>
));

LanguageButton.displayName = 'LanguageButton';

// Main Component
function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Custom hooks for better interaction handling
  useOnClickOutside(menuRef, () => setIsOpen(false))
  useKeyPress('Escape', () => setIsOpen(false))

  // Keyboard navigation within menu
  useEffect(() => {
    if (!isOpen) return;

    const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]');
    if (!menuItems?.length) return;

    let currentFocus = 0;

    function handleKeyDown(e: KeyboardEvent) {
      if (!menuItems) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        
        if (e.key === 'ArrowDown') {
          currentFocus = (currentFocus + 1) % menuItems.length;
        } else {
          currentFocus = (currentFocus - 1 + menuItems.length) % menuItems.length;
        }

        (menuItems[currentFocus] as HTMLElement).focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        (menuItems[currentFocus] as HTMLElement).click();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Optimized language change with loading state
  const [isChanging, setIsChanging] = useState(false);
  
  const changeLanguage = useCallback(async (lng: string) => {
    if (isChanging) return;
    
    setIsChanging(true);
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem('preferredLanguage', lng);
      document.documentElement.lang = lng;
      
      Analytics.event({
        action: 'change_language',
        category: 'Language',
        label: lng,
        value: Date.now()
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Language change failed:', error);
    } finally {
      setIsChanging(false);
    }
  }, [i18n, isChanging]);

  // Get current language
  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Language Selector Button */}
      <motion.button
        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-gray-800/50 hover:bg-gray-700/50",
          "text-gray-300 hover:text-white transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "focus:ring-offset-gray-900 disabled:opacity-50"
        )}
        disabled={isChanging}
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
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            variants={prefersReducedMotion ? {} : menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "absolute right-0 mt-2 w-48 rounded-lg",
              "bg-gray-800/90 shadow-lg ring-1 ring-gray-700",
              "backdrop-blur-sm divide-y divide-gray-700",
              "z-50 overflow-hidden"
            )}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu"
          >
            {languages.map((lang) => (
              <LanguageButton
                key={lang.code}
                lang={lang}
                isActive={i18n.language === lang.code}
                onClick={() => changeLanguage(lang.code)}
                prefersReducedMotion={!!prefersReducedMotion}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Performance Optimization durch Memoization
export default memo(LanguageSwitcher);