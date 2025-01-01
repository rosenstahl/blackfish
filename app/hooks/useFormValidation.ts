import { useState } from 'react'

type ValidationRule = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
}

type ValidationRules<T> = {
  [K in keyof T]: ValidationRule
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validateField = (name: keyof T, value: any): string | undefined => {
    const rules = validationRules[name]
    
    if (!rules) return undefined

    if (rules.required && (!value || value.trim() === '')) {
      return 'Dieses Feld ist erforderlich'
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      return `Mindestens ${rules.minLength} Zeichen erforderlich`
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      return `Maximal ${rules.maxLength} Zeichen erlaubt`
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return 'Ungültiges Format'
    }

    return undefined
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(validationRules).forEach((key) => {
      const error = validateField(key as keyof T, values[key as keyof T])
      if (error) {
        newErrors[key as keyof T] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  return {
    values,
    errors,
    touched,
    setValues,
    setErrors,
    setTouched,
    validateField,
    validate,
  }
}
