import { Group } from "@/types";
import { mockGroups } from "./mockData";

interface GroupsDataFile {
  metadata: {
    lastUpdated: string;
    totalGroups: number;
    version: string;
    source: string;
  };
  groups: Group[];
}

/**
 * Load groups data from the static JSON file or fallback to mock data
 * If groups.json doesn't exist, it will trigger initialization
 */
export async function loadGroupsData(): Promise<{
  groups: Group[];
  metadata?: GroupsDataFile["metadata"];
}> {
  try {
    // Try to load from the static JSON file first
    const response = await fetch('/groups.json', {
      cache: 'no-cache'
    })

    if (response.ok) {
      const data: GroupsDataFile = await response.json()

      console.log(
        `✅ Loaded ${data.groups.length} groups from Planning Center data`
      )
      console.log(`📅 Last updated: ${data.metadata.lastUpdated}`)

      // Convert string coordinates to numbers for Google Maps compatibility
      const groupsWithNumericCoords = data.groups.map(group => ({
        ...group,
        latitude: typeof group.latitude === 'string' ? parseFloat(group.latitude) : group.latitude,
        longitude: typeof group.longitude === 'string' ? parseFloat(group.longitude) : group.longitude,
      }))

      return {
        groups: groupsWithNumericCoords,
        metadata: data.metadata,
      }
    } else if (response.status === 404) {
      // File doesn't exist, trigger initialization
      console.log('⚠️ groups.json not found, attempting to initialize...')
      await triggerInitialization()
      
      // Retry loading after initialization
      const retryResponse = await fetch('/groups.json', {
        cache: 'no-cache'
      })
      
      if (retryResponse.ok) {
        const data: GroupsDataFile = await retryResponse.json()
        console.log(`✅ Successfully loaded ${data.groups.length} groups after initialization`)
        
        const groupsWithNumericCoords = data.groups.map(group => ({
          ...group,
          latitude: typeof group.latitude === 'string' ? parseFloat(group.latitude) : group.latitude,
          longitude: typeof group.longitude === 'string' ? parseFloat(group.longitude) : group.longitude,
        }))

        return {
          groups: groupsWithNumericCoords,
          metadata: data.metadata,
        }
      } else {
        throw new Error('Initialization failed')
      }
    } else {
      throw new Error(`HTTP ${response.status}`)
    }
  } catch (error) {
    console.warn('⚠️ Failed to load groups.json, using mock data:', error)

    return {
      groups: mockGroups,
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalGroups: mockGroups.length,
        version: '1.0',
        source: 'mock-data',
      },
    }
  }
}

/**
 * Trigger groups data initialization
 */
async function triggerInitialization(): Promise<void> {
  try {
    console.log('🚀 Triggering groups data initialization...')
    const response = await fetch('/api/initialize', {
      method: 'POST',
      cache: 'no-cache'
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.details || 'Initialization failed')
    }
    
    console.log('✅ Groups data initialization completed')
  } catch (error) {
    console.error('❌ Failed to initialize groups data:', error)
    throw error
  }
}

// Export for server-side usage
export { loadGroupsData as getGroupsData };
