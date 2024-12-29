import { forwardRef } from 'react'
import { cn } from '@/app/lib/utils'
import { formStyles } from '@/app/styles/components'

export interface RadioOption {
  value: string
  label: string
}

export interface RadioGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string
  hint?: string
  label?: string
  options: RadioOption[]
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ className, error, hint, label, id, options, name, ...props }, ref) => {
    const groupId = id || name

    return (
      <div className="space-y-2">
        {label && (
          <label
            id={`${groupId}-group-label`}
            className={formStyles.label}
          >
            {label}
          </label>
        )}
        <div
          role="radiogroup"
          aria-labelledby={label ? `${groupId}-group-label` : undefined}
          aria-describedby={
            error ? `${groupId}-error` : hint ? `${groupId}-hint` : undefined
          }
          className="space-y-2"
        >
          {options.map((option) => (
            <div key={option.value} className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  ref={ref}
                  type="radio"
                  id={`${groupId}-${option.value}`}
                  name={name}
                  value={option.value}
                  className={cn(
                    formStyles.radio,
                    error && 'border-red-300 dark:border-red-700',
                    className
                  )}
                  {...props}
                />
              </div>
              <div className="ml-3">
                <label
                  htmlFor={`${groupId}-${option.value}`}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>
        {error && (
          <p 
            id={`${groupId}-error`}
            className={formStyles.error}
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p 
            id={`${groupId}-hint`}
            className={formStyles.hint}
          >
            {hint}
          </p>
        )}
      </div>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'