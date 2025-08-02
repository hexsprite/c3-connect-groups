"use client";

import { Search } from "lucide-react";
import { useGroupStore } from "@/store/useGroupStore";

export default function HeroSection() {
  const { filters, updateFilters } = useGroupStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value });
  };

  const scrollToGroups = () => {
    const groupsSection = document.getElementById("groups-section");
    if (groupsSection) {
      groupsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-5xl font-black uppercase tracking-tight mb-6 text-gray-900">
          Find Your Community
        </h1>

        {/* Enhanced Description */}
        <div className="text-lg mb-8 max-w-3xl mx-auto text-gray-700 leading-relaxed">
          <p className="mb-4">
            Join one of our 50+ life groups and connect with people who share
            your interests, faith journey, and life stage. Whether you're new to
            C3 or a long-time member, there's a group waiting for you.
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-blue-600">500+ people</span> are
            already connected in groups this semester
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search groups by name, location, or interest..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={scrollToGroups}
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Browse All Groups
          </button>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Create a Group
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Active Groups</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-sm text-gray-600">People Connected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
            <div className="text-sm text-gray-600">Different Locations</div>
          </div>
        </div>
      </div>
    </section>
  );
}
