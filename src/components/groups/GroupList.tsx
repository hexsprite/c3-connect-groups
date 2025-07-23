'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGroupStore } from '@/store/useGroupStore';
import { loadGroupsData } from '@/lib/groups-data';
import { groupSearchService } from '@/lib/search';
import GroupCard from './GroupCard';

export default function GroupList() {
  const { groups, filters, map, ui, setGroups, updateUIState } = useGroupStore();
  const [dataSource, setDataSource] = useState<string>('loading');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Load real groups data and initialize search index on component mount
  useEffect(() => {
    const loadData = async () => {
      updateUIState({ loading: true });
      
      try {
        const data = await loadGroupsData();
        setGroups(data.groups);
        
        // Index groups for FlexSearch
        groupSearchService.indexGroups(data.groups);
        
        // Track data source and last updated info
        setDataSource(data.metadata?.source || 'unknown');
        setLastUpdated(data.metadata?.lastUpdated || '');
        
        console.log(`📊 Loaded ${data.groups.length} groups from ${data.metadata?.source || 'unknown'} source`);
        
      } catch (error) {
        console.error('Failed to load groups data:', error);
        // Error handling is already done in loadGroupsData (falls back to mock data)
      } finally {
        updateUIState({ loading: false });
      }
    };

    loadData();
  }, [setGroups, updateUIState]);

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
      if (filters.type && !filters.type.includes('Mixed')) {
        // Extract the actual type from the dropdown value (e.g., "♂ Men" -> "Men")
        const actualType = filters.type.split(' ').slice(1).join(' ');
        if (group.groupType !== actualType) return false;
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

  // Show loading state
  if (ui.loading || groups.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center" style={{ color: 'var(--c3-text-secondary)' }}>
          <div className="text-lg font-medium mb-2">
            {ui.loading ? 'Loading groups...' : 'No groups available'}
          </div>
          {dataSource === 'loading' && (
            <p className="text-sm">Fetching data from Planning Center...</p>
          )}
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
        {/* Data source indicator for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="col-span-full text-xs text-gray-500 mb-2 p-2 bg-gray-50 rounded">
            📊 Data source: <strong>{dataSource}</strong>
            {lastUpdated && (
              <span className="ml-2">
                | Last updated: {new Date(lastUpdated).toLocaleString()}
              </span>
            )}
            <span className="ml-2">| Total groups: {groups.length}</span>
          </div>
        )}
        
        {filteredGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}