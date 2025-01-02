import { useState, useCallback } from 'react'

type ValidationRule<T> = {
  validator: (value: T) => boolean
  message: string
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[]
}

export function useFormValidation<T extends Record<string, any>>(initialData: T, rules: ValidationRules<T>) {
  const [data, setData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validate = useCallback((field: keyof T, value: T[keyof T]): boolean => {
    const fieldRules = rules[field]
    if (!fieldRules) return true

    for (const rule of fieldRules) {
      if (!rule.validator(value)) {
        setErrors(prev => ({ ...prev, [field]: rule.message }))
        return false
      }
    }

    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
    return true
  }, [rules])

  const handleChange = useCallback((field: keyof T, value: T[keyof T]) => {
    setData(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validate(field, value)
    }
  }, [touched, validate])

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const validateAll = useCallback((): boolean => {
    let isValid = true
    const newErrors: Partial<Record<keyof T, string>> = {}
    const newTouched: Partial<Record<keyof T, boolean>> = {}

    Object.keys(rules).forEach((field) => {
      const key = field as keyof T
      newTouched[key] = true
      const fieldRules = rules[key]
      if (!fieldRules) return

      for (const rule of fieldRules) {
        if (!rule.validator(data[key])) {
          newErrors[key] = rule.message
          isValid = false
          break
        }
      }
    })

    setErrors(newErrors)
    setTouched(newTouched)
    return isValid
  }, [data, rules])

  return {
    values: data,
    errors,
    touched,
    setValues: setData,
    setTouched,
    handleChange,
    handleBlur,
    validate,
    validateAll,
  }
}
