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
        className="c3-input flex items-center justify-between w-full min-w-[140px] h-12 text-sm font-medium"
        style={{
          backgroundColor: "white",
          borderColor: "var(--c3-border)",
          color: "var(--c3-text-secondary)",
        }}
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
          <div
            className="absolute top-full left-0 right-0 z-20 bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-auto"
            style={{ borderColor: "var(--c3-border)" }}
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onValueChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors c3-text-sm"
                style={{
                  color:
                    value === option
                      ? "var(--c3-primary-blue)"
                      : "var(--c3-text-secondary)",
                  fontWeight: value === option ? "600" : "400",
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
