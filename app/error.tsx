'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'
import { Analytics } from '@/app/lib/analytics'

interface ErrorProps {
  error: Error & { 
    digest?: string;
    statusCode?: number;
    title?: string;
  };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  // Error Tracking mit zusätzlichen Informationen
  useEffect(() => {
    Analytics.event({
      action: 'error',
      category: 'Error',
      label: error.message,
      value: error.statusCode || 500 // Tracking mit Statuscode
    });

    // Cleanup bei Unmount
    return () => {
      // Optional: Cleanup Code
    };
  }, [error]);

  // Custom Fehlermeldung basierend auf Statuscode
  const getErrorMessage = () => {
    if (error.statusCode === 404) {
      return 'Die angeforderte Seite wurde nicht gefunden.';
    }
    return 'Ein unerwarteter Fehler ist aufgetreten. Unser Team wurde benachrichtigt und arbeitet an einer Lösung.';
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-xl"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="rounded-full bg-red-500/20 p-3"
          >
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-4">
          Oops, etwas ist schiefgelaufen!
        </h1>

        <p className="text-gray-400 text-center mb-6">
          {getErrorMessage()}
        </p>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              Analytics.event({
                action: 'error_retry',
                category: 'Error',
                label: 'User clicked retry'
              });
              reset();
            }}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <RefreshCw className="h-5 w-5" />
            Seite neu laden
          </motion.button>

          {error.digest && (
            <div className="text-sm text-gray-500 text-center">
              <span className="font-mono">Fehler-ID: {error.digest}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}