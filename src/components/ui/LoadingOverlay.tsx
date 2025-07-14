'use client';

import { ReactNode } from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  spinnerClassName?: string;
  messageClassName?: string;
}

export default function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  children,
  className = '',
  overlayClassName = '',
  spinnerClassName = '',
  messageClassName = ''
}: LoadingOverlayProps) {
  return (
    <div className={`w-full h-full relative ${className}`}>
      {children}
      {isLoading && (
        <div className={`absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center ${overlayClassName}`}>
          <div
            className={`text-center bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-6 shadow-lg ${messageClassName}`}
            style={{ color: 'var(--c3-text-secondary)' }}
          >
            <div
              className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2 ${spinnerClassName}`}
              style={{ borderColor: 'var(--c3-primary-blue)' }}
            ></div>
            <div>{message}</div>
          </div>
        </div>
      )}
    </div>
  );
}
