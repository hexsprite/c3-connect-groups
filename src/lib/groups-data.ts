import { Group } from '@/types'
import { mockGroups } from './mockData'

interface GroupsDataFile {
  metadata: {
    lastUpdated: string
    totalGroups: number
    version: string
    source: string
  }
  groups: Group[]
}

/**
 * Load groups data from the static JSON file or fallback to mock data
 */
export async function loadGroupsData(): Promise<{
  groups: Group[]
  metadata?: GroupsDataFile['metadata']
}> {
  try {
    // Try to fetch from the static file first
    const response = await fetch('/groups.json', {
      // Add cache busting for development
      cache: process.env.NODE_ENV === 'development' ? 'no-cache' : 'default',
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
    } else {
      console.warn('⚠️ groups.json not found, falling back to mock data')
      throw new Error('groups.json not found')
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

// Export for server-side usage
export { loadGroupsData as getGroupsData }
