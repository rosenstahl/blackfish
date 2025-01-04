'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'

interface PageLoadingIndicatorProps {
  className?: string
}

const PageLoadingIndicator: FC<PageLoadingIndicatorProps> = ({ className }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur">
      <motion.div
        className={className}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </motion.div>
    </div>
  )
}

export default PageLoadingIndicator