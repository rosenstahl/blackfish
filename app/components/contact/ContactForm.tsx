import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import Link from 'next/link'
import { useFormValidation } from '@/hooks/useFormValidation'
import { Analytics } from '@/app/lib/analytics'
import { Alert } from '@/app/components/ui/Alert'
import { Button } from '@/app/components/ui/Button'
import { Form, Input, Textarea } from '@/app/components/ui/form'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
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

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    values,
    errors,
    touched,
    setValues,
    setTouched,
    validateField
  } = useFormValidation<FormData>(initialFormData, validationRules)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
    
    if (touched[name]) {
      validateField(name as keyof FormData, value)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched({ ...touched, [name]: true })
    validateField(name as keyof FormData, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    let hasErrors = false
    Object.keys(validationRules).forEach(key => {
      const error = validateField(key as keyof FormData, values[key as keyof FormData])
      if (error) hasErrors = true
      setTouched({ ...touched, [key]: true })
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setSubmitStatus('success')
      setValues(initialFormData)
      setTouched({})

      Analytics.event({
        action: 'form_submit_success',
        category: 'Contact'
      })

    } catch (error) {
      console.error('Contact form error:', error)
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
    <Form onSubmit={handleSubmit} noValidate>
      <AnimatePresence>
        {submitStatus === 'success' && (
          <Alert 
            variant="success"
            title="Nachricht gesendet"
          >
            Ihre Nachricht wurde erfolgreich gesendet!
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert 
            variant="error"
            title="Fehler"
          >
            Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.
          </Alert>
        )}
      </AnimatePresence>

      <Form.Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            name="name"
            label="Name"
            required
            error={touched.name ? errors.name : undefined}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />

          <Input
            type="email"
            name="email"
            label="Email"
            required
            error={touched.email ? errors.email : undefined}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
        </div>

        <Input
          name="subject"
          label="Betreff"
          required
          error={touched.subject ? errors.subject : undefined}
          value={values.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />

        <Input
          type="tel"
          name="phone"
          label="Telefon (optional)"
          error={touched.phone ? errors.phone : undefined}
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />

        <Textarea
          name="message"
          label="Ihre Nachricht"
          required
          rows={4}
          error={touched.message ? errors.message : undefined}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
      </Form.Section>

      <Form.Actions>
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          leftIcon={<Send className="h-5 w-5" />}
          className="w-full"
        >
          Nachricht senden
        </Button>

        <p className="mt-4 text-center text-sm text-gray-400">
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
      </Form.Actions>
    </Form>
  )
}