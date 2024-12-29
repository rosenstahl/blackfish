export const formStyles = {
  label: 'block text-sm font-medium text-gray-700 dark:text-gray-300',
  input: cn(
    'mt-1 block w-full rounded-md',
    'border border-gray-300 dark:border-gray-700',
    'bg-white dark:bg-gray-800',
    'text-gray-900 dark:text-gray-100',
    'shadow-sm',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'focus:border-primary-500 focus:ring-primary-500',
    'sm:text-sm'
  ),
  textarea: cn(
    'mt-1 block w-full rounded-md',
    'border border-gray-300 dark:border-gray-700',
    'bg-white dark:bg-gray-800',
    'text-gray-900 dark:text-gray-100',
    'shadow-sm',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'focus:border-primary-500 focus:ring-primary-500',
    'sm:text-sm'
  ),
  select: cn(
    'mt-1 block w-full rounded-md',
    'border border-gray-300 dark:border-gray-700',
    'bg-white dark:bg-gray-800',
    'text-gray-900 dark:text-gray-100',
    'shadow-sm',
    'focus:border-primary-500 focus:ring-primary-500',
    'sm:text-sm'
  ),
  checkbox: cn(
    'h-4 w-4 rounded',
    'border-gray-300 dark:border-gray-700',
    'text-primary-600',
    'focus:ring-primary-500'
  ),
  radio: cn(
    'h-4 w-4',
    'border-gray-300 dark:border-gray-700',
    'text-primary-600',
    'focus:ring-primary-500'
  ),
  error: 'mt-2 text-sm text-red-600 dark:text-red-500',
  hint: 'mt-2 text-sm text-gray-500 dark:text-gray-400'
}

export const tableStyles = {
  table: 'min-w-full divide-y divide-gray-300 dark:divide-gray-700',
  thead: 'bg-gray-50 dark:bg-gray-800',
  th: cn(
    'px-3 py-3.5 text-left text-sm font-semibold',
    'text-gray-900 dark:text-gray-100'
  ),
  tbody: 'divide-y divide-gray-200 dark:divide-gray-700',
  td: cn(
    'whitespace-nowrap px-3 py-4 text-sm',
    'text-gray-500 dark:text-gray-400'
  )
}

export const listStyles = {
  ul: 'space-y-1',
  li: 'flex items-start',
  icon: 'h-5 w-5 flex-shrink-0 text-primary-500',
  text: 'ml-3 text-gray-500 dark:text-gray-400'
}

export const alertStyles = {
  base: 'rounded-lg p-4',
  variants: {
    info: 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200',
    success: 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-200',
    error: 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200'
  }
}

export const badgeStyles = {
  base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  variants: {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-200',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-200'
  }
}