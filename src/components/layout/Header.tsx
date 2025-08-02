"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header
      className="bg-white shadow-sm border-b h-16 flex items-center px-6"
      style={{ borderColor: "var(--c3-border)" }}
    >
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
        {/* C3 Toronto Logo */}
        <div className="flex items-center">
          <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
            C3 TORONTO
          </div>
        </div>

        {/* Join on Sunday CTA */}
        <Link href="#" className="c3-button-primary">
          JOIN ON SUNDAY
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
