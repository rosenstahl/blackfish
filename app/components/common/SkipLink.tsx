import { useCallback, memo } from 'react'
import { cn } from '@/app/lib/utils'
import { Analytics } from '@/app/lib/analytics'
import { useKeyPress } from '@/hooks/useKeyPress'
import { useVisibilityState } from '@/hooks/useVisibilityState'

interface SkipLinkProps {
  mainId?: string;
  className?: string;
  label?: string;
}

function SkipLink({
  mainId = 'main-content',
  className,
  label = 'Zum Hauptinhalt springen'
}: SkipLinkProps) {
  const { isVisible, show, hide } = useVisibilityState(false)

  // Track Tab key press
  useKeyPress('Tab', () => show())

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const mainElement = document.getElementById(mainId)
    if (mainElement) {
      // First set focus
      mainElement.focus()

      // Then smooth scroll
      mainElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })

      // Track usage
      Analytics.event({
        action: 'skip_link_used',
        category: 'Accessibility',
        label: mainId,
        value: window.scrollY // Track scroll position when used
      })

      // Add URL hash for better bookmarking
      if (window.history.pushState) {
        window.history.pushState(null, '', `#${mainId}`)
      } else {
        window.location.hash = mainId
      }
    } else {
      // Log error if target element not found
      console.error(`Skip link target #${mainId} not found`)
      Analytics.trackError(new Error(`Skip link target #${mainId} not found`), {
        component: 'SkipLink',
        action: 'target_not_found'
      })
    }
  }, [mainId])

  return (
    <a
      href={`#${mainId}`}
      onClick={handleClick}
      onFocus={show}
      onBlur={hide}
      className={cn(
        "fixed top-4 left-4 z-[100]", // Higher z-index to ensure visibility
        "transform transition-transform duration-200",
        isVisible ? "translate-y-0" : "-translate-y-full",
        "bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "hover:bg-blue-600 active:bg-blue-700",
        "text-base font-medium", // Ensure readable text size
        className
      )}
      style={{
        // Improved accessibility hiding
        position: isVisible ? 'fixed' : 'absolute',
        width: isVisible ? 'auto' : '1px',
        height: isVisible ? 'auto' : '1px',
        padding: isVisible ? undefined : 0,
        margin: isVisible ? undefined : '-1px',
        overflow: 'hidden',
        clip: isVisible ? 'auto' : 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0
      }}
      role="link"
      aria-label={label}
      tabIndex={0}
      data-testid="skip-link"
    >
      {label}
    </a>
  )
}

SkipLink.displayName = 'SkipLink'

// Performance optimization through memoization
export default memo(SkipLink)
