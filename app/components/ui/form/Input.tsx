import { forwardRef } from 'react'
import { formStyles } from '@/app/styles/components'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, Props>((
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

      <input
        ref={ref}
        className={formStyles.input(className)}
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

Input.displayName = 'Input'
