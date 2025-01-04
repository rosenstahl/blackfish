import { FC, SelectHTMLAttributes } from 'react'
import { cn } from '@/app/lib/utils'

type SelectProps = {
  label?: string
  error?: string
  hint?: string
  className?: string
} & SelectHTMLAttributes<HTMLSelectElement>

export const Select: FC<SelectProps> = ({
  label,
  error,
  hint,
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      )}

      <select
        {...props}
        className={cn(
          'block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:ring-gray-700',
          error && 'ring-red-300 dark:ring-red-500'
        )}
      >
        {children}
      </select>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {hint && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </div>
  )
}

Select.displayName = 'Select'