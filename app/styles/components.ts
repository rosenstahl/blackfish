import type { ClassProp } from 'class-variance-authority'

export const formStyles = {
  input: (props?: ClassProp) => `w-full rounded-lg border bg-white/5 px-4 py-2 text-white ${props || ''}`,
  textarea: (props?: ClassProp) => `w-full rounded-lg border bg-white/5 px-4 py-2 text-white ${props || ''}`,
  select: (props?: ClassProp) => `w-full rounded-lg border bg-white/5 px-4 py-2 text-white ${props || ''}`,
  checkbox: (props?: ClassProp) => `h-4 w-4 rounded border-gray-600 bg-gray-700 ${props || ''}`,
  radio: (props?: ClassProp) => `h-4 w-4 rounded-full border-gray-600 bg-gray-700 ${props || ''}`,
  label: (props?: ClassProp) => `block text-sm font-medium text-white mb-1 ${props || ''}`,
  error: (props?: ClassProp) => `mt-1 text-sm text-red-500 ${props || ''}`,
  hint: (props?: ClassProp) => `mt-1 text-sm text-gray-400 ${props || ''}`
}
