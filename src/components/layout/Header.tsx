"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header
      className="bg-white shadow-sm border-b h-16 flex items-center px-6"
      style={{ borderColor: "var(--c3-border)" }}
    >
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
        {/* C3 Toronto Logo - Dark rounded button with logo */}
        <div className="flex items-center">
          <Link
            href="https://www.c3toronto.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide flex items-center gap-3">
              <Image
                src="https://cdn.prod.website-files.com/644dc19729bd36f5c52be3e0/644f2bdd5dc704127ada4cd4_c3-logo.svg"
                alt="C3 Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xs">TORONTO</span>
            </div>
          </Link>
        </div>

        {/* Join on Sunday Link */}
        <Link
          href="https://www.c3toronto.com/sundays"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-black transition-colors font-bold tracking-wide text-sm"
        >
          Join on Sunday
        </Link>
      </div>
    </header>
  );
}
