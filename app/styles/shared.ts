import { cn } from '@/app/lib/utils'

export const buttonStyles = {
  base: cn(
    'relative inline-flex items-center justify-center',
    'rounded-lg transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
    'disabled:cursor-not-allowed disabled:opacity-60'
  ),
  variants: {
    primary: cn(
      'bg-blue-500 text-white',
      'hover:bg-blue-600',
      'focus:ring-blue-500'
    ),
    secondary: cn(
      'bg-gray-700 text-white',
      'hover:bg-gray-600',
      'focus:ring-gray-500'
    ),
    outline: cn(
      'border border-gray-700 text-white',
      'hover:bg-gray-800',
      'focus:ring-gray-500'
    )
  },
  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3'
  }
}

export const cardStyles = {
  base: cn(
    'overflow-hidden rounded-lg',
    'bg-gray-800 shadow-xl',
    'ring-1 ring-white/5'
  ),
  variants: {
    primary: cn(
      'border border-blue-500/20',
      'bg-blue-500/10'
    ),
    secondary: cn(
      'border border-gray-700',
      'bg-gray-800/50'
    )
  }
}

export const containerStyles = cn(
  'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
)

export const transitionStyles = {
  base: 'transition-all duration-200'
}