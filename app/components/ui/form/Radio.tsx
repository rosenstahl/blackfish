import { FC, InputHTMLAttributes } from 'react'
import { cn } from '@/app/lib/utils'

type RadioOption = {
  value: string
  label: string
}

type RadioProps = {
  label?: string
  error?: string
  hint?: string
  options: RadioOption[]
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const Radio: FC<RadioProps> = ({
  label,
  error,
  hint,
  options,
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      )}

      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              {...props}
              type="radio"
              id={`${props.name}-${option.value}`}
              value={option.value}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:ring-gray-700"
            />
            <label
              htmlFor={`${props.name}-${option.value}`}
              className="ml-2 block text-sm text-gray-900 dark:text-white"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {hint && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </div>
  )
}

Radio.displayName = 'Radio'