import { useState, useCallback } from 'react'
import { useDebounce } from './useDebounce'

interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | undefined
}

interface FieldRules {
  [key: string]: ValidationRules
}

export function useFormValidation<T extends { [key: string]: string }>(
  initialValues: T,
  rules: FieldRules
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const debouncedValues = useDebounce(values, 300)

  const validateField = useCallback((name: keyof T, value: string) => {
    const fieldRules = rules[name as string]
    if (!fieldRules) return undefined

    if (fieldRules.required && !value.trim()) {
      return `${String(name)} ist erforderlich`
    }

    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      return `Mindestens ${fieldRules.minLength} Zeichen erforderlich`
    }

    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      return `Maximal ${fieldRules.maxLength} Zeichen erlaubt`
    }

    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      return `Ungültiges Format`
    }

    if (fieldRules.custom) {
      return fieldRules.custom(value)
    }

    return undefined
  }, [rules])

  return {
    values,
    errors,
    touched,
    setValues,
    setTouched,
    validateField
  }
}