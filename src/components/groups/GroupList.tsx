"use client";

import { useEffect, useState } from "react";
import { useGroupStore } from "@/store/useGroupStore";
import GroupCard from "./GroupCard";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { loadGroupsData } from "@/lib/groups-data";

export default function GroupList() {
  const { groups, setGroups, ui, updateUIState } = useGroupStore();
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

  if (isLoading) {
    return <LoadingOverlay message="Loading groups..." isVisible={true} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>

        {groups.length === 0 && (
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
