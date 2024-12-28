'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function PageLoadingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="flex items-center gap-3 px-6 py-4 bg-gray-800 rounded-lg shadow-xl"
      >
        <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
        <span className="text-sm font-medium text-white">Wird geladen...</span>
      </motion.div>
    </motion.div>
  );
}