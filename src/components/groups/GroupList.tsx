'use client';

import { useEffect, useMemo } from 'react';
import { useGroupStore } from '@/store/useGroupStore';
import { mockGroups } from '@/lib/mockData';
import { groupSearchService } from '@/lib/search';
import GroupCard from './GroupCard';

export default function GroupList() {
  const { groups, filters, map, setGroups } = useGroupStore();

  // Load mock data and initialize search index on component mount
  useEffect(() => {
    setGroups(mockGroups);
    // Index groups for FlexSearch
    groupSearchService.indexGroups(mockGroups);
  }, [setGroups]);

  // Filter groups based on current filters and map bounds
  const filteredGroups = useMemo(() => {
    // Start with search-filtered groups using FlexSearch
    let searchFilteredGroups = groups;
    if (filters.search) {
      searchFilteredGroups = groupSearchService.search(filters.search);
    }

    // Apply other filters to search results
    return searchFilteredGroups.filter((group) => {

      // Location filter
      if (filters.location && !filters.location.includes('All')) {
        if (group.campusLocation !== filters.location) return false;
      }

      // Day filter
      if (filters.day && !filters.day.includes('Any')) {
        if (group.meetingDay !== filters.day) return false;
      }

      // Time filter
      if (filters.time && !filters.time.includes('Any')) {
        if (group.meetingTime !== filters.time) return false;
      }

      // Type filter
      if (filters.type && filters.type !== 'Mixed') {
        if (group.groupType !== filters.type) return false;
      }

      // Map bounds filter - only show groups visible on the map
      if (map.bounds && group.latitude && group.longitude) {
        const groupPosition = new google.maps.LatLng(group.latitude, group.longitude);
        if (!map.bounds.contains(groupPosition)) {
          return false;
        }
      }

      return true;
    });
  }, [groups, filters, map.bounds]);

  if (groups.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center" style={{ color: 'var(--c3-text-secondary)' }}>
          <div className="text-lg font-medium mb-2">Loading groups...</div>
        </div>
      </div>
    );
  }

  if (filteredGroups.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center" style={{ color: 'var(--c3-text-secondary)' }}>
          <div className="text-lg font-medium mb-2">No groups found</div>
          <p>Try adjusting your filters to see more groups</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {filteredGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}