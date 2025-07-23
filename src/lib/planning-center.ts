import { Group } from '@/types'

// Planning Center API response types
interface PlanningCenterGroup {
  id: string
  type: string
  attributes: {
    name: string
    description?: string
    location?: string
    enrollment_open: boolean
    enrollment_strategy: string
    group_type?: string
    public_church_center_web_url?: string
    memberships_count?: number
    max_memberships?: number
    created_at: string
    updated_at: string
    avatar_url?: string
    header_image?: {
      thumbnail?: string
      medium?: string
      original?: string
    }
    photo_url?: string
    image_url?: string
  }
  relationships?: {
    group_type?: {
      data?: {
        id: string
        type: string
      }
    }
    location?: {
      data?: {
        id: string
        type: string
      }
    }
    events?: {
      data?: Array<{
        id: string
        type: string
      }>
    }
    attachments?: {
      data?: Array<{
        id: string
        type: string
      }>
    }
  }
}

// Union type for all possible included resources
type PlanningCenterIncluded = PlanningCenterEvent | PlanningCenterLocation | PlanningCenterAttachment | PlanningCenterGroupType

interface PlanningCenterGroupType {
  id: string
  type: 'GroupType'
  attributes: {
    name: string
    description?: string
    color?: string
    default_group_settings?: Record<string, unknown>
  }
}

interface PlanningCenterResponse {
  data: PlanningCenterGroup[]
  included?: PlanningCenterIncluded[]
  meta: {
    total_count: number
    count: number
    can_order_by: string[]
    can_query_by: string[]
    can_include: string[]
    parent: {
      id: string
      type: string
    }
  }
  links: {
    self: string
    next?: string
    prev?: string
  }
}

interface PlanningCenterEvent {
  id: string
  type: 'Event'
  attributes: {
    name?: string
    description?: string
    starts_at?: string
    ends_at?: string
    recurrence?: string
    recurrence_description?: string
    location_type_preference?: string
    repeating?: boolean
    multi_day?: boolean
  }
}

interface PlanningCenterLocation {
  id: string
  type: 'Location'
  attributes: {
    name?: string
    full_formatted_address?: string
    latitude?: number
    longitude?: number
    strategy?: string
  }
}

interface PlanningCenterAttachment {
  id: string
  type: 'Attachment'
  attributes: {
    name?: string
    description?: string
    file_extension?: string
    content_type?: string
    created_at: string
    updated_at: string
    url?: string
    thumbnail_url?: string
  }
}

// Rate limiter class
class RateLimiter {
  private requests: number[] = []
  private readonly maxRequests: number
  private readonly timeWindow: number // in milliseconds

  constructor(maxRequests: number = 80, timeWindowMinutes: number = 1) {
    this.maxRequests = maxRequests
    this.timeWindow = timeWindowMinutes * 60 * 1000
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now()

    // Remove requests older than the time window
    this.requests = this.requests.filter((time) => now - time < this.timeWindow)

    if (this.requests.length >= this.maxRequests) {
      // Calculate how long to wait
      const oldestRequest = Math.min(...this.requests)
      const waitTime = this.timeWindow - (now - oldestRequest) + 100 // Add 100ms buffer

      console.log(`Rate limit reached. Waiting ${waitTime}ms...`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))

      // Recursively check again after waiting
      return this.waitIfNeeded()
    }

    // Record this request
    this.requests.push(now)
  }
}

export class PlanningCenterClient {
  private appId: string
  private secret: string
  private apiBase: string
  private rateLimiter: RateLimiter
  private authHeader: string

  constructor() {
    this.appId = process.env.PLANNING_CENTER_APP_ID!
    this.secret = process.env.PLANNING_CENTER_SECRET!
    this.apiBase =
      process.env.PLANNING_CENTER_API_BASE ||
      'https://api.planningcenteronline.com'

    if (!this.appId || !this.secret) {
      throw new Error('Missing Planning Center credentials')
    }

    this.rateLimiter = new RateLimiter()
    this.authHeader = `Basic ${Buffer.from(
      `${this.appId}:${this.secret}`
    ).toString('base64')}`
  }

  private async makeRequest<T>(url: string): Promise<T> {
    await this.rateLimiter.waitIfNeeded()

    console.log(`Making request to: ${url}`)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
        'User-Agent': 'C3-Connect-Groups/1.0',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Planning Center API error (${response.status}): ${errorText}`
      )
    }

    return response.json()
  }

  async getAllGroupsRaw(): Promise<{ groups: PlanningCenterGroup[], included: PlanningCenterIncluded[] }> {
    console.log('Starting to fetch all groups from Planning Center (raw)...')

    let allGroups: PlanningCenterGroup[] = []
    let currentUrl = `${this.apiBase}/groups/v2/groups?per_page=100&include=group_type,location,events,attachments`
    let pageCount = 0

    // Collect all included data (attachments, locations, etc.)
    let allIncluded: PlanningCenterIncluded[] = []

    // Fetch all pages of groups with includes
    while (currentUrl) {
      pageCount++
      console.log(`Fetching page ${pageCount} (groups + attachments)...`)

      const response: PlanningCenterResponse = await this.makeRequest(
        currentUrl
      )
      allGroups = allGroups.concat(response.data)

      if (response.included) {
        allIncluded = allIncluded.concat(response.included)
      }

      currentUrl = response.links.next || ''
    }

    return { groups: allGroups, included: allIncluded }
  }

  async getAllGroups(): Promise<Group[]> {
    const { groups: allGroups, included: allIncluded } = await this.getAllGroupsRaw()

    console.log(
      `Collected ${allIncluded.length} included resources (attachments, locations, etc.)`
    )

    // Debug: Log what types of included resources we have
    const includedTypes = allIncluded.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    console.log('Included resource types:', includedTypes)

    // Debug: Check if any groups have attachments relationships
    const groupsWithAttachments = allGroups.filter(
      (g) =>
        g.relationships?.attachments?.data &&
        g.relationships.attachments.data.length > 0
    )
    console.log(
      `Groups with attachments: ${groupsWithAttachments.length}/${allGroups.length}`
    )

    if (groupsWithAttachments.length > 0) {
      console.log('Sample group with attachments:', {
        name: groupsWithAttachments[0].attributes.name,
        attachmentIds:
          groupsWithAttachments[0].relationships?.attachments?.data?.map(
            (a) => a.id
          ),
      })
    }

    // Transform Planning Center groups to our Group interface
    const transformedGroups = allGroups.map((pcGroup) =>
      this.transformGroup(pcGroup, allIncluded)
    )

    // Filter out groups that couldn't be properly transformed
    const validGroups = transformedGroups.filter(
      (group) => group !== null
    ) as Group[]

    // Filter out internal/organizational groups
    const publicGroups = validGroups.filter(group => this.isPublicConnectGroup(group, allGroups, allIncluded))

    console.log(`Successfully transformed ${validGroups.length} groups`)
    console.log(`Filtered to ${publicGroups.length} public Connect Groups (${validGroups.length - publicGroups.length} internal groups excluded)`)

    return publicGroups
  }

  isPublicConnectGroup(group: Group, allGroups: PlanningCenterGroup[], allIncluded: PlanningCenterIncluded[]): boolean {
    // Find the original Planning Center group data
    const pcGroup = allGroups.find(g => g.id === group.id)
    if (!pcGroup) return false

    // Get the group type information
    const groupTypeId = pcGroup.relationships?.group_type?.data?.id
    if (!groupTypeId) return false

    // Find the group type in included resources
    const groupType = allIncluded.find(
      (item): item is PlanningCenterGroupType => item.type === 'GroupType' && item.id === groupTypeId
    )

    if (!groupType) return false

    // Filter out "Teams" group type (internal organizational groups)
    if (groupTypeId === '444317' || groupType.attributes?.name === 'Teams') {
      console.log(`🚫 Filtering out Teams group: "${group.name}"`)
      return false
    }

    // Filter out groups with coach/leader patterns (internal)
    const name = group.name.toLowerCase()
    if (
      name.includes('coach group') ||
      name.includes('all coaches') ||
      name.includes('head coaches') ||
      name.includes('team leaders') ||
      name.includes('cg leaders') ||
      name.includes('service production') ||
      name.includes('production team') ||
      name.includes('creative team') ||
      name.includes('events team') ||
      name.includes('digital team') ||
      name.includes('screens team') ||
      name.includes('live video') ||
      name.includes('next steps team') ||
      name.includes('worship team') ||
      name.includes('prayer link') ||
      name.includes('photo drop') ||
      name.includes('social invite list') ||
      name.includes('c3 kids') ||
      name.includes('pastor dinner')
    ) {
      console.log(`🚫 Filtering out internal group: "${group.name}"`)
      return false
    }

    // Include groups that start with "Summer 2025 CG -" (public connect groups)
    if (name.startsWith('summer 2025 cg -')) {
      console.log(`✅ Including public Connect Group: "${group.name}"`)
      return true
    }

    // Include groups that start with seasonal patterns (Winter, Fall, Spring)
    if (
      name.startsWith('winter ') ||
      name.startsWith('fall ') ||
      name.startsWith('spring ')
    ) {
      // But exclude if they contain leader/coach patterns
      if (
        name.includes('leaders') ||
        name.includes('coaches') ||
        name.includes('team')
      ) {
        console.log(`🚫 Filtering out seasonal leadership group: "${group.name}"`)
        return false
      }
    }

    // For any other groups, be conservative and exclude them
    // This ensures we only show groups we're confident are public connect groups
    console.log(`🚫 Filtering out unrecognized group: "${group.name}"`)
    return false
  }

  transformGroup(
    pcGroup: PlanningCenterGroup,
    included: PlanningCenterIncluded[] = []
  ): Group | null {
    try {
      // Extract basic information
      const id = pcGroup.id
      const name = pcGroup.attributes.name || 'Unnamed Group'
      const rawDescription = pcGroup.attributes.description || ''
      // Strip HTML tags from description and decode HTML entities
      const description = rawDescription
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
        .replace(/&amp;/g, '&') // Replace encoded ampersands
        .replace(/&lt;/g, '<') // Replace encoded less-than
        .replace(/&gt;/g, '>') // Replace encoded greater-than
        .replace(/&quot;/g, '"') // Replace encoded quotes
        .trim() // Remove leading/trailing whitespace
      const isOpen = pcGroup.attributes.enrollment_open || false
      const currentMemberCount = pcGroup.attributes.memberships_count
      const capacity = pcGroup.attributes.max_memberships

      // Generate Planning Center URL
      const planningCenterUrl =
        pcGroup.attributes.public_church_center_web_url ||
        `https://c3toronto.churchcenter.com/groups/${id}`

      // Determine group type from group_type or fallback to Mixed
      let groupType: 'Mixed' | 'Men' | 'Women' = 'Mixed'

      // Get group type from included data
      const groupTypeId = pcGroup.relationships?.group_type?.data?.id
      if (groupTypeId) {
        const groupTypeData = included.find(
          (item): item is PlanningCenterGroupType => item.type === 'GroupType' && item.id === groupTypeId
        )
        if (groupTypeData) {
          const groupTypeStr = groupTypeData.attributes.name?.toLowerCase() || ''
          if (groupTypeStr.includes('men') && !groupTypeStr.includes('women')) {
            groupType = 'Men'
          } else if (
            groupTypeStr.includes('women') &&
            !groupTypeStr.includes('men')
          ) {
            groupType = 'Women'
          }
        }
      }

      // Default values that will be enhanced with actual PC data
      let location = pcGroup.attributes.location || 'Location TBD'
      let meetingDay = 'TBD'
      let meetingTime = 'Evening' // Default to evening
      let campusLocation: 'Downtown' | 'Midtown' | 'Hamilton' = 'Downtown' // Default
      let latitude: number | undefined
      let longitude: number | undefined
      let imageUrl: string | undefined

      // Extract location data from included resources
      const locationId = pcGroup.relationships?.location?.data?.id
      if (locationId) {
        const locationData = included.find(
          (item): item is PlanningCenterLocation => item.type === 'Location' && item.id === locationId
        )

        if (locationData) {
          location = locationData.attributes.name || 'Location TBD'
          latitude = locationData.attributes.latitude
          longitude = locationData.attributes.longitude
        }
      }

      // First, check if Planning Center has direct image URL fields
      imageUrl =
        pcGroup.attributes.avatar_url ||
        pcGroup.attributes.header_image?.original ||
        pcGroup.attributes.header_image?.medium ||
        pcGroup.attributes.header_image?.thumbnail ||
        pcGroup.attributes.photo_url ||
        pcGroup.attributes.image_url

      if (imageUrl) {
        console.log(`✅ Found direct image URL for group ${name}: ${imageUrl}`)
      }

      // If no direct image URL, try to extract from attachments
      if (
        !imageUrl &&
        pcGroup.relationships?.attachments?.data &&
        included.length > 0
      ) {
        // Find attachment IDs for this group
        const attachmentIds = pcGroup.relationships.attachments.data.map(
          (att) => att.id
        )

        console.log(
          `Group "${name}" has ${attachmentIds.length} attachment IDs:`,
          attachmentIds
        )

        // Find the actual attachment data in included resources
        const groupAttachments = included.filter(
          (item): item is PlanningCenterAttachment =>
            item.type === 'Attachment' && attachmentIds.includes(item.id)
        )

        console.log(
          `Found ${groupAttachments.length} attachment objects for group "${name}"`
        )

        if (groupAttachments.length > 0) {
          console.log(
            'Attachment details:',
            groupAttachments.map((att) => ({
              id: att.id,
              contentType: att.attributes.content_type,
              fileExtension: att.attributes.file_extension,
              url: att.attributes.url,
              thumbnailUrl: att.attributes.thumbnail_url,
            }))
          )
        }

        // Look for image attachments
        const imageAttachment = groupAttachments.find(
          (att) =>
            att.attributes.content_type?.startsWith('image/') ||
            ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
              att.attributes.file_extension?.toLowerCase() || ''
            )
        )

        if (imageAttachment) {
          // Use the full URL, or thumbnail if full isn't available
          imageUrl =
            imageAttachment.attributes.url ||
            imageAttachment.attributes.thumbnail_url
          console.log(
            `✅ Found Planning Center image for group ${name}: ${imageUrl}`
          )
        } else if (groupAttachments.length > 0) {
          console.log(`⚠️ Group "${name}" has attachments but none are images`)
        }
      } else {
        console.log(`ℹ️ Group "${name}" has no attachments`)
      }

      // Only use fallback if no Planning Center image found
      if (!imageUrl) {
        console.log(
          `⚠️ No Planning Center image found for "${name}", this group needs an image uploaded to PC`
        )
        // For now, don't use fallback images - leave undefined to identify groups that need images
        // imageUrl = fallbackImages[groupType]
      }

      // Determine campus location based on location name/description
      if (location.toLowerCase().includes('hamilton')) {
        campusLocation = 'Hamilton'
      } else if (
        location.toLowerCase().includes('midtown') ||
        location.toLowerCase().includes('north york') ||
        location.toLowerCase().includes('eglinton')
      ) {
        campusLocation = 'Midtown'
      } else {
        campusLocation = 'Downtown'
      }

      // Extract meeting day/time from events if available
      const eventIds = pcGroup.relationships?.events?.data?.map(e => e.id) || []
      const events = eventIds.map(id => included.find(
        (item): item is PlanningCenterEvent => item.type === 'Event' && item.id === id
      )).filter((event): event is PlanningCenterEvent => event !== undefined)

      if (events.length > 0) {
        // Find the first recurring event or any event with schedule info
        const recurringEvent = events.find(e => e.attributes.repeating) || events[0]
        
        if (recurringEvent && recurringEvent.attributes.starts_at) {
          try {
            const startDate = new Date(recurringEvent.attributes.starts_at)
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            meetingDay = dayNames[startDate.getDay()]
            
            const hours = startDate.getHours()
            if (hours < 12) {
              meetingTime = 'Morning'
            } else if (hours < 17) {
              meetingTime = 'Afternoon'
            } else {
              meetingTime = 'Evening'
            }
          } catch (error) {
            console.warn(`Failed to parse event date for group ${name}:`, error)
          }
        }
      }

      // Fallback: try to extract day/time from name/description if events didn't provide info
      if (meetingDay === 'TBD' || meetingTime === 'Evening') {
        const nameAndDesc = (name + ' ' + description).toLowerCase()

        // Try to extract day from name/description
        const days = [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ]
        const foundDay = days.find((day) => nameAndDesc.includes(day))
        if (foundDay && meetingDay === 'TBD') {
          meetingDay = foundDay.charAt(0).toUpperCase() + foundDay.slice(1)
        }

        // Try to extract time from name/description
        if (
          nameAndDesc.includes('morning') ||
          nameAndDesc.includes('9am') ||
          nameAndDesc.includes('10am')
        ) {
          meetingTime = 'Morning'
        } else if (
          nameAndDesc.includes('afternoon') ||
          nameAndDesc.includes('lunch') ||
          nameAndDesc.includes('1pm') ||
          nameAndDesc.includes('2pm')
        ) {
          meetingTime = 'Afternoon'
        }
      }

      return {
        id,
        name,
        description,
        location,
        meetingDay,
        meetingTime,
        groupType,
        capacity,
        currentMemberCount,
        isOpen,
        imageUrl,
        planningCenterUrl,
        latitude,
        longitude,
        campusLocation,
      }
    } catch (error) {
      console.warn(`Failed to transform group ${pcGroup.id}:`, error)
      return null
    }
  }

  // Method to get a single group with full details (including events and location)
  async getGroupDetails(groupId: string): Promise<PlanningCenterGroup | null> {
    try {
      const url = `${this.apiBase}/groups/v2/groups/${groupId}?include=group_type,location,events,attachments`
      const response = await this.makeRequest<{
        data: PlanningCenterGroup
        included?: PlanningCenterIncluded[]
      }>(url)
      return response.data
    } catch (error) {
      console.warn(`Failed to fetch details for group ${groupId}:`, error)
      return null
    }
  }

  // Health check method
  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.apiBase}/groups/v2/groups?per_page=1`
      await this.makeRequest(url)
      return true
    } catch (error) {
      console.error('Planning Center connection test failed:', error)
      return false
    }
  }
}
