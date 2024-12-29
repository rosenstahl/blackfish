import { forwardRef } from 'react'
import { cn } from '@/app/lib/utils'
import { formStyles } from '@/app/styles/components'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  hint?: string
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, hint, label, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className={formStyles.label}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            formStyles.input,
            error && 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p 
            id={`${inputId}-error`}
            className={formStyles.error}
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p 
            id={`${inputId}-hint`}
            className={formStyles.hint}
          >
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'