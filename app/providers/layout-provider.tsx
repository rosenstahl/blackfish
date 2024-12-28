import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface LayoutContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  scrollY: number;
}

export const LayoutContext = React.createContext<LayoutContextType>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  scrollY: 0,
});

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setIsTablet(width >= 768 && width < 1024);
    setIsDesktop(width >= 1024);
  }, []);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleResize, handleScroll]);

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <LayoutContext.Provider
      value={{
        isMobile,
        isTablet,
        isDesktop,
        scrollY,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};