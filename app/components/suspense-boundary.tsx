import React, { Suspense } from 'react';
import { LoadingSpinner } from './loading';

interface SuspenseBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SuspenseBoundary: React.FC<SuspenseBoundaryProps> = ({ 
  children, 
  fallback = <LoadingSpinner /> 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export const withSuspense = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  return function WithSuspenseWrapper(props: P) {
    return (
      <SuspenseBoundary fallback={fallback}>
        <Component {...props} />
      </SuspenseBoundary>
    );
  };
};
