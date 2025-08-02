"use client";

import { useGroupStore } from "@/store/useGroupStore";

export default function HeroSection() {
  const scrollToGroups = () => {
    const groupsSection = document.getElementById("groups-section");
    if (groupsSection) {
      groupsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-5xl font-black uppercase tracking-tight mb-6 text-gray-900">
          JOIN A CONNECT GROUP
        </h1>

        {/* Description */}
        <div className="text-lg mb-8 max-w-3xl mx-auto text-gray-700 leading-relaxed">
          <p>
            At C3 Toronto, Connect Groups play a vital role in creating
            community, growing our faith, and connecting people to God. Our
            groups run on a semester basis!
          </p>
        </div>
      </div>
    </section>
  );
}
