import { forwardRef } from 'react'
import { cn } from '@/app/lib/utils'
import { formStyles } from '@/app/styles/components'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  hint?: string
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, hint, label, id, ...props }, ref) => {
    const textareaId = id || props.name

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
            className={formStyles.label}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            formStyles.textarea,
            error && 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p 
            id={`${textareaId}-error`}
            className={formStyles.error}
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p 
            id={`${textareaId}-hint`}
            className={formStyles.hint}
          >
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'