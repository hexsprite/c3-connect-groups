"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export default function Select({
  value,
  onValueChange,
  options,
  placeholder,
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full min-w-[180px] px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto min-w-[200px]">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onValueChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm text-gray-700 cursor-pointer"
                style={{
                  fontWeight: value === option ? "600" : "400",
                  color: value === option ? "#2563eb" : "#374151",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
