import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/app/lib/utils'
import { buttonStyles } from '@/app/styles/shared'

type BaseButtonProps = {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
}

type ButtonProps = BaseButtonProps & Omit<HTMLMotionProps<"button">, keyof BaseButtonProps>

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    children,
    disabled,
    whileHover = buttonVariants.hover,
    whileTap = buttonVariants.tap,
    ...props
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={whileHover}
        whileTap={whileTap}
        className={cn(
          buttonStyles.base,
          buttonStyles.variants[variant],
          buttonStyles.sizes[size],
          isLoading && 'opacity-75 cursor-not-allowed',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center space-x-2">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          <span className="flex items-center space-x-2">
            {leftIcon && <span>{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span>{rightIcon}</span>}
          </span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'