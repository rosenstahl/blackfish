import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useFormValidation } from '@/hooks/useFormValidation'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  phone: ''
}

const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZäöüßÄÖÜ\s-]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254
  },
  subject: {
    required: true,
    minLength: 3,
    maxLength: 200
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 5000
  },
  phone: {
    pattern: /^[0-9+\-\s()]*$/,
    maxLength: 20
  }
}

interface ErrorWrapperProps {
  children: React.ReactNode;
  error?: string;
  touched?: boolean;
  id: string;
}

const ErrorWrapper = ({ children, error, touched, id }: ErrorWrapperProps) => (
  <div className="relative">
    {children}
    <AnimatePresence>
      {error && touched && (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 text-sm text-red-400"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
)

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [csrfToken, setCsrfToken] = useState<string>('')

  const {
    values,
    errors,
    touched,
    setValues,
    setTouched,
    validateField
  } = useFormValidation<FormData>(initialFormData, validationRules)

  // Get CSRF token on mount
  useEffect(() => {
    fetch('/api/csrf')
      .then(res => res.text())
      .then(token => setCsrfToken(token))
      .catch(console.error)
  }, [])

  // Track form interactions
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      Analytics.event({
        action: 'form_interaction',
        category: 'Contact',
        label: Object.keys(touched).join(',')
      })
    }
  }, [touched])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      validateField(name as keyof FormData, value)
    }
  }, [setValues, touched, validateField])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name as keyof FormData, value)
  }, [setTouched, validateField])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields on submit
    let hasErrors = false
    Object.keys(values).forEach(key => {
      const error = validateField(key as keyof FormData, values[key as keyof FormData])
      if (error) hasErrors = true
      setTouched(prev => ({ ...prev, [key]: true }))
    })

    if (hasErrors) {
      Analytics.event({
        action: 'form_validation_error',
        category: 'Contact',
        label: Object.keys(errors).join(',')
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Ein Fehler ist aufgetreten')
      }

      setSubmitStatus('success')
      setValues(initialFormData)
      setTouched({})

      Analytics.event({
        action: 'form_submit_success',
        category: 'Contact'
      })

    } catch (error) {
      console.error('Fehler:', error)
      setSubmitStatus('error')

      Analytics.event({
        action: 'form_submit_error',
        category: 'Contact',
        label: error instanceof Error ? error.message : 'Unknown error'
      })

    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-500/20 text-green-400 p-4 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>Ihre Nachricht wurde erfolgreich gesendet!</span>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name & Email Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <ErrorWrapper error={errors.name} touched={touched.name} id="name">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name *"
            required
            aria-required="true"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              "w-full px-4 py-3 rounded-lg",
              "bg-[#232942] border transition-all",
              errors.name && touched.name ? "border-red-500" : "border-gray-700",
              "text-white placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
            disabled={isSubmitting}
          />
        </ErrorWrapper>

        <ErrorWrapper error={errors.email} touched={touched.email} id="email">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email *"
            required
            aria-required="true"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              "w-full px-4 py-3 rounded-lg",
              "bg-[#232942] border transition-all",
              errors.email && touched.email ? "border-red-500" : "border-gray-700",
              "text-white placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
            disabled={isSubmitting}
          />
        </ErrorWrapper>
      </div>

      {/* Subject */}
      <ErrorWrapper error={errors.subject} touched={touched.subject} id="subject">
        <input
          type="text"
          id="subject"
          name="subject"
          placeholder="Betreff *"
          required
          aria-required="true"
          aria-invalid={errors.subject ? "true" : "false"}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          value={values.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "w-full px-4 py-3 rounded-lg",
            "bg-[#232942] border transition-all",
            errors.subject && touched.subject ? "border-red-500" : "border-gray-700",
            "text-white placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500"
          )}
          disabled={isSubmitting}
        />
      </ErrorWrapper>

      {/* Phone (Optional) */}
      <ErrorWrapper error={errors.phone} touched={touched.phone} id="phone">
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Telefon (optional)"
          aria-invalid={errors.phone ? "true" : "false"}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "w-full px-4 py-3 rounded-lg",
            "bg-[#232942] border transition-all",
            errors.phone && touched.phone ? "border-red-500" : "border-gray-700",
            "text-white placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500"
          )}
          disabled={isSubmitting}
        />
      </ErrorWrapper>

      {/* Message */}
      <ErrorWrapper error={errors.message} touched={touched.message} id="message">
        <textarea
          id="message"
          name="message"
          placeholder="Ihre Nachricht *"
          required
          aria-required="true"
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "message-error" : undefined}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          className={cn(
            "w-full px-4 py-3 rounded-lg",
            "bg-[#232942] border transition-all",
            errors.message && touched.message ? "border-red-500" : "border-gray-700",
            "text-white placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            "resize-y"
          )}
          disabled={isSubmitting}
        />
      </ErrorWrapper>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full flex items-center justify-center gap-2",
          "rounded-lg bg-blue-500 px-6 py-3 text-white",
          "hover:bg-blue-600 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        )}
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Send className="h-5 w-5" />
            Nachricht senden
          </>
        )}
      </motion.button>

      {/* Privacy Policy Link */}
      <p className="text-sm text-gray-400 text-center">
        Mit dem Absenden stimmen Sie unserer{' '}
        <Link 
          href="/datenschutz" 
          className="text-blue-400 hover:text-blue-300 transition-colors"
          onClick={() => {
            Analytics.event({
              action: 'privacy_policy_click',
              category: 'Contact'
            })
          }}
        >
          Datenschutzerklärung
        </Link>{' '}
        zu.
      </p>
    </form>
  )
}
