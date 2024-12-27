// app/not-found.tsx
'use client'

import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <motion.h1 
          className="text-8xl font-bold text-blue-500 mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          404
        </motion.h1>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Seite nicht gefunden
        </h2>
        
        <p className="text-gray-400 mb-8">
          Die gesuchte Seite existiert leider nicht oder wurde verschoben.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition-colors"
          >
            <Home className="h-5 w-5" />
            Zur Startseite
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-gray-700 text-white rounded-lg px-6 py-3 hover:bg-gray-800/50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Zurück
          </button>
        </div>
      </motion.div>
    </div>
  )
}