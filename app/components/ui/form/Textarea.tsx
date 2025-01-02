import { forwardRef } from 'react'
import { formStyles } from '@/app/styles/components'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((
  { label, error, hint, className, ...props },
  ref
) => {
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={props.id || props.name}
          className={formStyles.label()}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        className={formStyles.textarea(className)}
        {...props}
      />

      {error && (
        <p className={formStyles.error()}>
          {error}
        </p>
      )}

      {hint && !error && (
        <p className={formStyles.hint()}>
          {hint}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'