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
    validate(field, value)
  }, [validate])

  const validateAll = useCallback((): boolean => {
    let isValid = true
    const newErrors: Partial<Record<keyof T, string>> = {}

    Object.keys(rules).forEach((field) => {
      const fieldRules = rules[field as keyof T]
      if (!fieldRules) return

      for (const rule of fieldRules) {
        if (!rule.validator(data[field as keyof T])) {
          newErrors[field as keyof T] = rule.message
          isValid = false
          break
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }, [data, rules])

  return {
    data,
    errors,
    setData,
    handleChange,
    validate,
    validateAll,
  }
}