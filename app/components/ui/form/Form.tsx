import { cn } from '@/app/lib/utils'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export function Form({ className, ...props }: FormProps) {
  return (
    <form
      className={cn('space-y-6', className)}
      {...props}
    />
  )
}

interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

Form.Section = function FormSection({ className, ...props }: FormSectionProps) {
  return (
    <div
      className={cn('space-y-4', className)}
      {...props}
    />
  )
}

interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

Form.Group = function FormGroup({ className, ...props }: FormGroupProps) {
  return (
    <div
      className={cn('space-y-2', className)}
      {...props}
    />
  )
}

interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

Form.Actions = function FormActions({ className, ...props }: FormActionsProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end space-x-4 pt-4',
        'border-t border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    />
  )
}