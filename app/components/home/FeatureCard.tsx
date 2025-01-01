import { memo } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { Analytics } from '@/app/lib/analytics'

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
  href?: string;
  index?: number;
}

const FeatureCard = memo(function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  className = '',
  onClick,
  href,
  index = 0
}: FeatureCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    Analytics.event({
      action: 'feature_card_click',
      category: 'Engagement',
      label: title
    })
  }

  // Animation variants for the card
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
    },
    hover: {
      scale: 1.02,
      translateY: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98
    }
  }

  // Icon animation variants
  const iconVariants = {
    hover: {
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  }

  const Wrapper = href ? motion.a : motion.div

  const cardProps = {
    ...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {}),
    onClick: handleClick,
    className: cn(
      "group relative rounded-2xl p-6 transition-all duration-300",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      "hover:shadow-lg",
      className
    ),
    variants: cardVariants,
    initial: "hidden",
    animate: "visible",
    whileHover: "hover",
    whileTap: "tap",
    role: href ? 'link' : 'article',
    'aria-label': `Feature: ${title}`
  }

  return (
    <Wrapper {...cardProps}>
      {/* Background Effects */}
      <div 
        className={cn(
          "absolute inset-0 -z-10 rounded-2xl",
          "bg-white/5 blur-xl transition-all duration-300",
          "group-hover:bg-white/10"
        )} 
      />
      
      <div className="relative z-10">
        {/* Animated Icon */}
        <motion.div
          variants={iconVariants}
          whileHover="hover"
          className="mb-3 inline-block"
        >
          <Icon 
            className="h-8 w-8 text-white" 
            aria-hidden="true"
          />
        </motion.div>
        
        {/* Title */}
        <h3 className="mb-2 font-semibold text-white">
          {title}
        </h3>

        {/* Description */}
        <p className={cn(
          "text-sm text-white/80 transition-all duration-300",
          "group-hover:text-white"
        )}>
          {description}
        </p>

        {/* Hover Effects */}
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-0",
          "bg-gradient-to-br from-blue-500/5 to-purple-500/5",
          "transition-opacity duration-300",
          "group-hover:opacity-100"
        )} />
      </div>
    </Wrapper>
  )
})

// Define display name for DevTools
FeatureCard.displayName = 'FeatureCard'

export default FeatureCard