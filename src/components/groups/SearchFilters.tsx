"use client";

import { Search, X, ChevronLeft } from "lucide-react";
import { useGroupStore } from "@/store/useGroupStore";
import { filterOptions } from "@/lib/mockData";
import { groupSearchService } from "@/lib/search";
import Select from "@/components/ui/Select";
import { useMemo } from "react";

export default function SearchFilters() {
  const { filters, updateFilters, clearFilters, groups, map } = useGroupStore();

  // Calculate filtered count (including map bounds and FlexSearch)
  const filteredCount = useMemo(() => {
    // Start with search-filtered groups using FlexSearch
    let searchFilteredGroups = groups;
    if (filters.search) {
      searchFilteredGroups = groupSearchService.search(filters.search);
    }

    // Apply other filters to search results
    return searchFilteredGroups.filter((group) => {
      // Location filter
      if (filters.location && !filters.location.includes("All")) {
        if (group.campusLocation !== filters.location) return false;
      }

      // Day filter
      if (filters.day && !filters.day.includes("Any")) {
        if (group.meetingDay !== filters.day) return false;
      }

      // Time filter
      if (filters.time && !filters.time.includes("Any")) {
        if (group.meetingTime !== filters.time) return false;
      }

      // Type filter
      if (filters.type && !filters.type.includes("Mixed")) {
        // Extract the actual type from the dropdown value (e.g., "♂ Men" -> "Men")
        const actualType = filters.type.split(" ").slice(1).join(" ");
        if (group.groupType !== actualType) return false;
      }

      // Map bounds filter - only count groups visible on the map
      if (map.bounds && group.latitude && group.longitude) {
        const groupPosition = new google.maps.LatLng(
          group.latitude,
          group.longitude
        );
        if (!map.bounds.contains(groupPosition)) {
          return false;
        }
      }

      return true;
    }).length;
  }, [groups, filters, map.bounds]);

  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (key === "search") return value.length > 0;
    return !value.includes("All") && !value.includes("Any");
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value });
  };

  const removeFilter = (key: string) => {
    const defaultValues: Record<string, string> = {
      location: "All Locations",
      day: "Any Day",
      time: "Any Time",
      type: "⚥ Mixed",
    };
    updateFilters({ [key]: defaultValues[key] || "" });
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Search and Filter Row */}
      <div className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for groups..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              <Select
                value={filters.location}
                onValueChange={(value) => updateFilters({ location: value })}
                options={filterOptions.locations}
                placeholder="Location"
              />

              <Select
                value={filters.day}
                onValueChange={(value) => updateFilters({ day: value })}
                options={filterOptions.days}
                placeholder="Day"
              />

              <Select
                value={filters.time}
                onValueChange={(value) => updateFilters({ time: value })}
                options={filterOptions.times}
                placeholder="Time"
              />

              <Select
                value={filters.type}
                onValueChange={(value) => updateFilters({ type: value })}
                options={filterOptions.types}
                placeholder="Type"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Row */}
      {activeFilters.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-gray-600">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Active Filters</span>
              </div>

              {activeFilters.map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  <span>{value}</span>
                  <button
                    onClick={() => removeFilter(key)}
                    className="hover:bg-gray-200 rounded-full p-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {activeFilters.length > 1 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Clear all
                </button>
              )}

              <div className="ml-auto text-sm font-bold text-gray-900">
                {filteredCount} Group{filteredCount !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
