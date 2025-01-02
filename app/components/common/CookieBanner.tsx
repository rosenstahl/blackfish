import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Shield, BarChart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCookieConsent, type ConsentType } from '@/app/context/CookieConsentContext'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'

type CookieGroup = {
  id: keyof ConsentType
  icon: LucideIcon
  title: string
  description: string
  color: string
  bgColor: string
  isRequired: boolean
}

const cookieGroups: CookieGroup[] = [
  {
    id: 'necessary',
    icon: Shield,
    title: 'Notwendig',
    description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    isRequired: true
  },
  // Rest der Gruppen...
]