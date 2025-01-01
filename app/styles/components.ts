import { cva } from 'class-variance-authority'
import { cn } from '@/app/lib/utils'

export const formStyles = {
  input: cva([
    'block w-full rounded-lg border border-gray-700 bg-gray-800',
    'px-4 py-2.5 text-white placeholder-gray-400',
    'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ]),

  textarea: cva([
    'block w-full rounded-lg border border-gray-700 bg-gray-800',
    'px-4 py-2.5 text-white placeholder-gray-400',
    'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'resize-y'
  ]),

  select: cva([
    'block w-full rounded-lg border border-gray-700 bg-gray-800',
    'px-4 py-2.5 text-white',
    'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ]),

  checkbox: cva([
    'h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500',
    'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ]),

  radio: cva([
    'h-4 w-4 border-gray-700 bg-gray-800 text-blue-500',
    'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ])
}

export const tableStyles = {
  table: 'min-w-full divide-y divide-gray-700',
  thead: 'bg-gray-800',
  tbody: 'divide-y divide-gray-700 bg-gray-900',
  tr: 'group',

  th: cva([
    'px-4 py-3.5 text-left text-sm font-semibold text-white',
    'first:pl-6 last:pr-6'
  ]),

  td: cva([
    'whitespace-nowrap px-4 py-4 text-sm text-gray-300',
    'first:pl-6 last:pr-6'
  ])
}