"use client";

import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
  isVisible: boolean;
}

export default function LoadingOverlay({
  message = "Loading groups...",
  isVisible,
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm mx-4">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {message}
          </h3>
          <p className="text-gray-600 text-sm">
            Please wait while we load the latest groups...
          </p>
        </div>
      </div>
    </div>
  );
}
