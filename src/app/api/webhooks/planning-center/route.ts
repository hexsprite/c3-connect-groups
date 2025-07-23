import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { PlanningCenterClient } from '@/lib/planning-center'
import { Group } from '@/types'

interface GroupsData {
  metadata: {
    lastUpdated: string
    totalGroups: number
    version: string
    source: string
  }
  groups: Group[]
}

export async function POST() {
  console.log(
    '🚀 Planning Center webhook triggered - starting group data generation...'
  )

  try {
    // Initialize Planning Center client
    const pcClient = new PlanningCenterClient()

    // Test connection first
    console.log('📡 Testing Planning Center connection...')
    const isConnected = await pcClient.testConnection()
    if (!isConnected) {
      throw new Error('Failed to connect to Planning Center API')
    }
    console.log('✅ Planning Center connection successful')

    // Fetch raw groups data once
    console.log('📥 Fetching all groups from Planning Center...')
    const startTime = Date.now()
    const rawData = await pcClient.getAllGroupsRaw()
    const fetchTime = Date.now() - startTime

    console.log(
      `✅ Successfully fetched ${rawData.groups.length} raw groups in ${fetchTime}ms`
    )

    // Process the raw groups into our format
    console.log('🔄 Processing raw groups data...')
    const processStartTime = Date.now()
    const groups = rawData.groups
      .map(group => pcClient.transformGroup(group, rawData.included))
      .filter((group): group is Group => group !== null)
      .filter(group => pcClient.isPublicConnectGroup(group, rawData.groups, rawData.included))
    const processTime = Date.now() - processStartTime

    console.log(
      `✅ Processed ${groups.length} public groups from ${rawData.groups.length} raw groups in ${processTime}ms`
    )

    // Create groups data structure
    const groupsData: GroupsData = {
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalGroups: groups.length,
        version: '1.0',
        source: 'planning-center',
      },
      groups,
    }

    // Ensure public directory exists
    const publicDir = join(process.cwd(), 'public')
    try {
      await mkdir(publicDir, { recursive: true })
    } catch {
      // Directory might already exist, that's OK
    }

    // Write processed groups to public/groups.json
    const filePath = join(publicDir, 'groups.json')
    const jsonContent = JSON.stringify(groupsData, null, 2)

    console.log('💾 Writing processed groups data to public/groups.json...')
    await writeFile(filePath, jsonContent, 'utf8')

    const fileSize = Buffer.byteLength(jsonContent, 'utf8')
    console.log(`✅ Successfully wrote ${fileSize} bytes to ${filePath}`)

    // Write raw groups data to project root for inspection (not public)
    const rawGroupsData = {
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalRawGroups: rawData.groups.length,
        totalIncludedResources: rawData.included.length,
        version: '1.0',
        source: 'planning-center-raw',
        note: 'This file contains the raw Planning Center API data for inspection purposes only. Not published to web.'
      },
      groups: rawData.groups,
      included: rawData.included
    }

    const rawFilePath = join(process.cwd(), 'groups_raw.json')
    const rawJsonContent = JSON.stringify(rawGroupsData, null, 2)

    console.log('💾 Writing raw groups data to project root (groups_raw.json)...')
    await writeFile(rawFilePath, rawJsonContent, 'utf8')

    const rawFileSize = Buffer.byteLength(rawJsonContent, 'utf8')
    console.log(`✅ Successfully wrote ${rawFileSize} bytes to ${rawFilePath}`)

    // Log some sample data for verification
    console.log('\n📊 Sample of generated data:')
    console.log(`- Total groups: ${groups.length}`)
    console.log(`- Open groups: ${groups.filter((g) => g.isOpen).length}`)
    console.log(
      `- Group types: Mixed(${
        groups.filter((g) => g.groupType === 'Mixed').length
      }), Men(${groups.filter((g) => g.groupType === 'Men').length}), Women(${
        groups.filter((g) => g.groupType === 'Women').length
      })`
    )
    console.log(
      `- Campus locations: Downtown(${
        groups.filter((g) => g.campusLocation === 'Downtown').length
      }), Midtown(${
        groups.filter((g) => g.campusLocation === 'Midtown').length
      }), Hamilton(${
        groups.filter((g) => g.campusLocation === 'Hamilton').length
      })`
    )

    if (groups.length > 0) {
      console.log(
        `- Sample group: "${groups[0].name}" (${groups[0].groupType}, ${groups[0].campusLocation})`
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Group data successfully generated and saved',
      data: {
        totalGroups: groups.length,
        filePath: '/groups.json', // Public URL path
        fileSize: `${Math.round(fileSize / 1024)}KB`,
        lastUpdated: groupsData.metadata.lastUpdated,
        fetchTimeMs: fetchTime,
        stats: {
          openGroups: groups.filter((g) => g.isOpen).length,
          groupTypes: {
            mixed: groups.filter((g) => g.groupType === 'Mixed').length,
            men: groups.filter((g) => g.groupType === 'Men').length,
            women: groups.filter((g) => g.groupType === 'Women').length,
          },
          campusLocations: {
            downtown: groups.filter((g) => g.campusLocation === 'Downtown')
              .length,
            midtown: groups.filter((g) => g.campusLocation === 'Midtown')
              .length,
            hamilton: groups.filter((g) => g.campusLocation === 'Hamilton')
              .length,
          },
        },
      },
    })
  } catch (error) {
    console.error('❌ Error generating group data:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate group data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Also support GET for manual testing
export async function GET() {
  console.log('🔧 Manual webhook test triggered via GET request')

  // Just forward to POST handler
  return POST()
}
