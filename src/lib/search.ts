import { Index } from 'flexsearch';
import { Group } from '@/types';

// Create a FlexSearch index for groups
class GroupSearchService {
  private index: Index;
  private groups: Group[] = [];

  constructor() {
    // Initialize FlexSearch with basic configuration
    this.index = new Index({
      tokenize: 'forward',
      resolution: 9,
    });
  }

  // Index all groups for searching
  indexGroups(groups: Group[]) {
    this.groups = groups;
    
    // Clear existing index
    this.index.clear();
    
    // Index each group with combined searchable text
    groups.forEach((group, idx) => {
      const searchableText = [
        group.name,
        group.description,
        group.location,
        group.meetingDay,
        group.meetingTime,
        group.groupType,
        group.campusLocation,
      ].join(' ').toLowerCase();
      
      this.index.add(idx, searchableText);
    });
  }

  // Search groups and return matching Group objects
  search(query: string): Group[] {
    if (!query.trim()) {
      return this.groups;
    }

    try {
      // Perform search and get indices
      const results = this.index.search(query.toLowerCase(), {
        limit: 100, // Limit results
        suggest: true, // Enable fuzzy matching
      });

      // Map indices back to Group objects
      return results.map((idx) => this.groups[idx as number]).filter(Boolean);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to basic string matching if FlexSearch fails
      return this.groups.filter((group) => {
        const searchTerm = query.toLowerCase();
        return (
          group.name.toLowerCase().includes(searchTerm) ||
          group.description.toLowerCase().includes(searchTerm) ||
          group.location.toLowerCase().includes(searchTerm) ||
          group.meetingDay.toLowerCase().includes(searchTerm) ||
          group.groupType.toLowerCase().includes(searchTerm) ||
          group.campusLocation.toLowerCase().includes(searchTerm)
        );
      });
    }
  }

  // Get all groups (for when no search is active)
  getAllGroups(): Group[] {
    return this.groups;
  }
}

// Export a singleton instance
export const groupSearchService = new GroupSearchService();