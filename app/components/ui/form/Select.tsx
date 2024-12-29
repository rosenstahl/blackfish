import { forwardRef } from 'react'
import { cn } from '@/app/lib/utils'
import { formStyles } from '@/app/styles/components'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  hint?: string
  label?: string
  options: Array<{ value: string; label: string }>
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, hint, label, id, options, ...props }, ref) => {
    const selectId = id || props.name

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={selectId}
            className={formStyles.label}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            formStyles.select,
            error && 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
          }
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p 
            id={`${selectId}-error`}
            className={formStyles.error}
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p 
            id={`${selectId}-hint`}
            className={formStyles.hint}
          >
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'