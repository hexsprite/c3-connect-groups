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
          CONNECT GROUPS
        </h1>

        {/* Description */}
        <div className="text-lg mb-8 max-w-3xl mx-auto text-gray-700 leading-relaxed">
          <p className="mb-6">
            At C3 Toronto, Connect Groups play a vital role in creating
            community, growing our faith, and connecting people to God. Our
            groups run on a semester basis!
          </p>

          {/* Semester Information */}
          <div className="text-left max-w-md mx-auto space-y-2">
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">Fall:</span>
              <span className="text-gray-700">September - November</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">Winter:</span>
              <span className="text-gray-700">February - April</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">Summer:</span>
              <span className="text-gray-700">June - July</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={scrollToGroups}
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-500 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
          >
            FALL 2025 CONNECT GROUP SIGN UPS COMING SOON
          </button>
        </div>
      </div>
    </section>
  );
}
