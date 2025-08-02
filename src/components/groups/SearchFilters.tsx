"use client";

import {
  Search,
  X,
  Filter,
  MapPin,
  Clock,
  Users,
  BookOpen,
} from "lucide-react";
import { useGroupStore } from "@/store/useGroupStore";
import Select from "@/components/ui/Select";

export default function SearchFilters() {
  const { filters, updateFilters, clearFilters, ui, updateUIState } =
    useGroupStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value });
  };

  const handleFilterChange = (key: string, value: string) => {
    updateFilters({ [key]: value });
  };

  const removeFilter = (key: string) => {
    updateFilters({
      [key]:
        key === "location"
          ? "All Locations"
          : key === "day"
          ? "Any Day"
          : key === "time"
          ? "Any Time"
          : key === "type"
          ? "⚥ Mixed"
          : "All Types",
    });
  };

  const hasActiveFilters =
    filters.location !== "All Locations" ||
    filters.day !== "Any Day" ||
    filters.time !== "Any Time" ||
    filters.type !== "⚥ Mixed" ||
    filters.groupType !== "All Types";

  const activeFilters = [
    {
      key: "location",
      label: filters.location,
      condition: filters.location !== "All Locations",
    },
    { key: "day", label: filters.day, condition: filters.day !== "Any Day" },
    {
      key: "time",
      label: filters.time,
      condition: filters.time !== "Any Time",
    },
    { key: "type", label: filters.type, condition: filters.type !== "⚥ Mixed" },
    {
      key: "groupType",
      label: filters.groupType,
      condition: filters.groupType !== "All Types",
    },
  ].filter((filter) => filter.condition);

  const toggleView = (view: "list" | "map") => {
    updateUIState({ view });
  };

  return (
    <div
      className="bg-gray-50 border-b border-gray-200 py-8 px-6"
      id="groups-section"
    >
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search groups by name, location, or interest..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
            />
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <Select
              value={filters.location}
              onValueChange={(value) => handleFilterChange("location", value)}
              options={[
                "All Locations",
                "Downtown",
                "Midtown",
                "Hamilton",
                "North York",
                "Scarborough",
                "Etobicoke",
              ]}
              placeholder="Location"
            />
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <Select
              value={filters.day}
              onValueChange={(value) => handleFilterChange("day", value)}
              options={[
                "Any Day",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ]}
              placeholder="Day"
            />
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <Select
              value={filters.time}
              onValueChange={(value) => handleFilterChange("time", value)}
              options={[
                "Any Time",
                "Morning (9:00 AM)",
                "Afternoon (2:00 PM)",
                "Evening (7:00 PM)",
                "Weekends",
              ]}
              placeholder="Time"
            />
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
              options={["⚥ Mixed", "♂ Men", "♀ Women", "👥 All Types"]}
              placeholder="Group Type"
            />
          </div>

          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <Select
              value={filters.groupType || "All Types"}
              onValueChange={(value) => handleFilterChange("groupType", value)}
              options={[
                "All Types",
                "Sermon-based (with sermon discussion)",
                "Activity-based (with sermon discussion)",
                "How To Read The Bible (Curriculum-based)",
                "Love This City (serving with city through our charity partners)",
                "Alpha Pre-Marriage (Curriculum-based)",
                "Alpha Marriage (Curriculum-based)",
                "Alpha (New Christians)",
                "Finding Freedom (Curriculum-based)",
              ]}
              placeholder="Connect Group Type"
            />
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Active Filters:</span>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {activeFilters.map((filter) => (
                <div
                  key={filter.key}
                  className="flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm border border-gray-200"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter.key)}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-bold text-gray-900">24 groups</span>
            {filters.search && ` matching "${filters.search}"`}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => toggleView("list")}
                className={`px-3 py-1 text-xs font-medium rounded-md shadow-sm cursor-pointer transition-colors ${
                  ui.view === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                List
              </button>
              <button
                onClick={() => toggleView("map")}
                className={`px-3 py-1 text-xs font-medium rounded-md shadow-sm cursor-pointer transition-colors ${
                  ui.view === "map"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
