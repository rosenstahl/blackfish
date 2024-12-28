import React from 'react';

export const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
  </div>
);

export const LoadingDots = () => (
  <span className="inline-flex items-center">
    <span className="animate-pulse">.</span>
    <span className="animate-pulse animation-delay-200">.</span>
    <span className="animate-pulse animation-delay-400">.</span>
  </span>
);

export const SkeletonLoader = ({ lines = 3 }: { lines?: number }) => (
  <div className="w-full animate-pulse space-y-4">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 rounded bg-gray-200" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
    ))}
  </div>
);
