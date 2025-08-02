"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header
      className="bg-white shadow-sm border-b h-16 flex items-center px-6"
      style={{ borderColor: "var(--c3-border)" }}
    >
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
        {/* C3 Toronto Logo - Dark rounded button */}
        <div className="flex items-center">
          <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide">
            C3 TORONTO
          </div>
        </div>

        {/* Join on Sunday CTA - Blue button */}
        <Link
          href="#"
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide hover:bg-blue-700 transition-colors"
        >
          JOIN ON SUNDAY
        </Link>
      </div>
    </header>
  );
}
