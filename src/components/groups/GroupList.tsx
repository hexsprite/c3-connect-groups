"use client";

import { useEffect, useState, useMemo } from "react";
import { useGroupStore } from "@/store/useGroupStore";
import GroupCard from "./GroupCard";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { loadGroupsData } from "@/lib/groups-data";

export default function GroupList() {
  const { groups, setGroups, filters, updateUIState } = useGroupStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        updateUIState({ loading: true });
        const groupsData = await loadGroupsData();
        setGroups(groupsData.groups);
      } catch (error) {
        console.error("Failed to load groups:", error);
      } finally {
        updateUIState({ loading: false });
        setIsLoading(false);
      }
    };

    loadGroups();
  }, [setGroups, updateUIState]);

  // Filter groups based on search and filters
  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      // Search filter - expanded to include more fields
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();

        // Create a comprehensive search string that includes all searchable fields
        const searchableText = [
          group.name,
          group.description,
          group.location,
          group.groupType,
          group.meetingDay,
          group.meetingTime,
          group.campusLocation,
          // Add capacity info if available
          group.capacity?.toString() || "",
          group.currentMemberCount?.toString() || "",
          // Add planning center URL (might contain useful info)
          group.planningCenterUrl,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch = searchableText.includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location !== "All Locations") {
        if (group.campusLocation !== filters.location) return false;
      }

      // Day filter
      if (filters.day !== "Any Day") {
        if (group.meetingDay !== filters.day) return false;
      }

      // Time filter
      if (filters.time !== "Any Time") {
        const timeMapping: { [key: string]: string } = {
          "Morning (9:00 AM)": "Morning",
          "Afternoon (2:00 PM)": "Afternoon",
          "Evening (7:00 PM)": "Evening",
          Weekends: "Weekends",
        };
        const expectedTime = timeMapping[filters.time];
        if (group.meetingTime !== expectedTime) return false;
      }

      // Type filter (Men/Women/Mixed)
      if (filters.type !== "⚥ Mixed") {
        const typeMapping: { [key: string]: string } = {
          "♂ Men": "Men",
          "♀ Women": "Women",
          "👥 All Types": "Mixed",
        };
        const expectedType = typeMapping[filters.type];
        if (group.groupType !== expectedType) return false;
      }

      // Group type filter
      if (filters.groupType !== "All Types") {
        // For now, we'll use a simple check - you might want to add a groupType field to your Group interface
        // This is a placeholder - you'll need to add actual group type data to your mock data
        return true; // Placeholder - will need to implement based on your data structure
      }

      return true;
    });
  }, [groups, filters]);

  if (isLoading) {
    return <LoadingOverlay message="Loading groups..." isVisible={true} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No groups found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find available groups.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
