'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Settings, X, Shield, ChartBar, Target } from 'lucide-react';
import { useCookieConsent } from '@/app/context/CookieConsentContext';
import { Analytics } from '@/app/lib/analytics';

export default function CookieBanner() {
  const { consent, updateConsent } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (consent === null) {
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [consent]);

  const handleAccept = () => {
    updateConsent(true);
    setIsVisible(false);
    Analytics.trackEvent('cookie_consent', 'accepted');
  };

  const handleDecline = () => {
    updateConsent(false);
    setIsVisible(false);
    Analytics.trackEvent('cookie_consent', 'declined');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div className="text-sm">
                <h2 className="font-semibold mb-1">Ihre Privatsphäre ist uns wichtig</h2>
                <p className="text-gray-300">
                  Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und unsere Dienste zu optimieren.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Ablehnen
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Akzeptieren
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}