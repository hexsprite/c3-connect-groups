import { NextResponse } from 'next/server'
import { writeFile, mkdir, access } from 'fs/promises'
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

let isInitializing = false
let initializationPromise: Promise<void> | null = null

/**
 * Initialize groups data on service startup
 * This ensures the groups.json file exists before the app tries to load it
 */
async function initializeGroupsData(): Promise<void> {
  // Prevent multiple simultaneous initializations
  if (isInitializing) {
    if (initializationPromise) {
      await initializationPromise
    }
    return
  }

  // Check if groups.json already exists
  const publicDir = join(process.cwd(), 'public')
  const filePath = join(publicDir, 'groups.json')
  
  try {
    await access(filePath)
    console.log('✅ groups.json already exists, skipping initialization')
    return
  } catch {
    // File doesn't exist, proceed with generation
  }

  isInitializing = true
  initializationPromise = generateGroupsData()
  
  try {
    await initializationPromise
  } finally {
    isInitializing = false
    initializationPromise = null
  }
}

async function generateGroupsData(): Promise<void> {
  console.log('🚀 Starting groups data initialization at service startup...')

  try {
    // Initialize Planning Center client
    console.log('📡 Initializing Planning Center client...')
    const pcClient = new PlanningCenterClient()

    // Test connection first
    console.log('🔍 Testing Planning Center connection...')
    const isConnected = await pcClient.testConnection()
    
    if (!isConnected) {
      console.error('❌ Failed to connect to Planning Center API during startup')
      console.error('   Service will fall back to mock data')
      throw new Error('Planning Center connection failed')
    }
    
    console.log('✅ Planning Center connection successful!')

    // Fetch all groups
    console.log('📥 Fetching all groups from Planning Center...')
    const startTime = Date.now()
    const groups = await pcClient.getAllGroups()
    const fetchTime = Date.now() - startTime

    console.log(`✅ Successfully fetched ${groups.length} groups in ${fetchTime}ms`)

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

    // Write to public/groups.json
    const filePath = join(publicDir, 'groups.json')
    const jsonContent = JSON.stringify(groupsData, null, 2)

    console.log(`💾 Writing groups data to: ${filePath}`)
    await writeFile(filePath, jsonContent, 'utf8')

    const fileSize = Buffer.byteLength(jsonContent, 'utf8')
    console.log(`✅ Successfully generated ${Math.round(fileSize/1024)}KB groups.json at startup`)

  } catch (error) {
    console.error('❌ Error during startup groups data generation:', error)
    console.error('   App will fall back to mock data')
    throw error
  }
}

// API endpoint for manual initialization
export async function POST() {
  try {
    await initializeGroupsData()
    
    return NextResponse.json({
      success: true,
      message: 'Groups data initialized successfully'
    })
  } catch (error) {
    console.error('❌ Failed to initialize groups data:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize groups data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Also support GET for manual testing
export async function GET() {
  return POST()
}