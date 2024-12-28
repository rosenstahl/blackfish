'use client';

import React, { createContext, useContext, useEffect } from 'react';

type AccessibilityContextType = {
  isHighContrast: boolean;
  fontSize: number;
  toggleHighContrast: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isHighContrast, setIsHighContrast] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(16);

  useEffect(() => {
    // Load preferences from localStorage
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = Number(localStorage.getItem('fontSize')) || 16;

    setIsHighContrast(savedHighContrast);
    setFontSize(savedFontSize);

    // Apply initial settings
    document.documentElement.style.fontSize = `${savedFontSize}px`;
    if (savedHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const toggleHighContrast = () => {
    setIsHighContrast(prev => {
      const newValue = !prev;
      localStorage.setItem('highContrast', String(newValue));
      if (newValue) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      return newValue;
    });
  };

  const increaseFontSize = () => {
    setFontSize(prev => {
      const newSize = Math.min(prev + 2, 24);
      localStorage.setItem('fontSize', String(newSize));
      document.documentElement.style.fontSize = `${newSize}px`;
      return newSize;
    });
  };

  const decreaseFontSize = () => {
    setFontSize(prev => {
      const newSize = Math.max(prev - 2, 12);
      localStorage.setItem('fontSize', String(newSize));
      document.documentElement.style.fontSize = `${newSize}px`;
      return newSize;
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        isHighContrast,
        fontSize,
        toggleHighContrast,
        increaseFontSize,
        decreaseFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}