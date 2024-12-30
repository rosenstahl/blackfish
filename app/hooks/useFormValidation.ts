import { useState } from 'react'
import { useDebounce } from './useDebounce'

type ValidationRules = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
}

type ValidationRuleSet<T> = {
  [K in keyof T]: ValidationRules
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<ValidationRuleSet<T>>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})  
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})  

  const validateField = (name: keyof T, value: any): string | undefined => {
    const rules = validationRules[name]
    if (!rules) return undefined

    if (rules.required && (!value || value.length === 0)) {
      return 'Dieses Feld ist erforderlich'
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Mindestens ${rules.minLength} Zeichen erforderlich`
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximal ${rules.maxLength} Zeichen erlaubt`
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Ungültiges Format'
    }

    return undefined
  }

  return {
    values,
    errors,
    touched,
    setValues,
    setTouched,
    validateField
  }
}
