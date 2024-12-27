import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { Analytics } from '@/app/lib/analytics'
import { useEffect } from 'react'

interface ErrorBoundaryProps {
  error: Error & { 
    digest?: string;
    statusCode?: number;
    title?: string;
  };
  reset: () => void;
}

const ERROR_MESSAGES: Record<number, string> = {
  404: 'Die angeforderte Seite wurde nicht gefunden.',
  500: 'Ein interner Serverfehler ist aufgetreten.',
  503: 'Der Service ist momentan nicht verfügbar.',
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const statusCode = error.statusCode || 500
  const errorMessage = error.message || ERROR_MESSAGES[statusCode] || 'Ein unerwarteter Fehler ist aufgetreten.'

  useEffect(() => {
    // Track error occurrence
    Analytics.event({
      action: 'error_boundary',
      category: 'Error',
      label: `${statusCode}: ${errorMessage}`,
      value: statusCode
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught:', {
        error,
        stack: error.stack,
        digest: error.digest
      })
    }
  }, [error, statusCode, errorMessage])

  const handleReset = () => {
    Analytics.event({
      action: 'error_reset',
      category: 'Error',
      label: error.digest
    })
    reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1f36] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="rounded-full bg-red-500/20 p-3"
          >
            <AlertCircle className="h-8 w-8 text-red-500" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-white text-center mb-4">
            {error.title || 'Oops, etwas ist schiefgelaufen!'}
          </h1>

          <p className="text-gray-400 text-center mb-6">
            {errorMessage}
            {process.env.NODE_ENV === 'development' && (
              <code className="block mt-2 text-xs bg-gray-900/50 p-2 rounded">
                {error.stack}
              </code>
            )}
          </p>
        </motion.div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Seite neu laden
          </motion.button>

          <Link 
            href="/"
            onClick={() => {
              Analytics.event({
                action: 'error_home_return',
                category: 'Error',
                label: error.digest
              })
            }}
            className="w-full flex items-center justify-center gap-2 border border-gray-700 text-white rounded-lg px-6 py-3 hover:bg-gray-700/50 transition-colors"
          >
            <Home className="h-5 w-5" />
            Zur Startseite
          </Link>

          {error.digest && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-500 text-center"
            >
              <span className="font-mono">Error-ID: {error.digest}</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}