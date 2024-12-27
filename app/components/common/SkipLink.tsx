import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/app/lib/utils'
import { Analytics } from '@/app/lib/analytics'

interface SkipLinkProps {
  mainId?: string;
  className?: string;
  label?: string;
}

export default function SkipLink({
  mainId = 'main-content',
  className,
  label = 'Zum Hauptinhalt springen'
}: SkipLinkProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsVisible(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const mainElement = document.getElementById(mainId)
    if (mainElement) {
      mainElement.focus()
      mainElement.scrollIntoView()

      Analytics.event({
        action: 'skip_link_used',
        category: 'Navigation',
        label: mainId
      })
    }
  }, [mainId])

  return (
    <a
      href={`#${mainId}`}
      onClick={handleClick}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      className={cn(
        "fixed top-4 left-4 z-50",
        "transform transition-transform",
        isVisible ? "translate-y-0" : "-translate-y-full",
        "bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "hover:bg-blue-600 active:bg-blue-700",
        className
      )}
      style={{
        // Ensure the link is always accessible even if hidden
        clip: isVisible ? 'auto' : 'rect(0 0 0 0)',
        clipPath: isVisible ? 'none' : 'inset(50%)',
        height: isVisible ? 'auto' : '1px',
        width: isVisible ? 'auto' : '1px',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </a>
  )
}
