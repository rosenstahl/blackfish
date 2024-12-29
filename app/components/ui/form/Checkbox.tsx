import { forwardRef } from 'react'
import { cn } from '@/app/lib/utils'
import { formStyles } from '@/app/styles/components'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  hint?: string
  label: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, hint, label, id, ...props }, ref) => {
    const checkboxId = id || props.name

    return (
      <div className="space-y-1">
        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={cn(
                formStyles.checkbox,
                error && 'border-red-300 dark:border-red-700',
                className
              )}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={
                error ? `${checkboxId}-error` : hint ? `${checkboxId}-hint` : undefined
              }
              {...props}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor={checkboxId}
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              {label}
            </label>
          </div>
        </div>
        {error && (
          <p 
            id={`${checkboxId}-error`}
            className={formStyles.error}
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p 
            id={`${checkboxId}-hint`}
            className={formStyles.hint}
          >
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'