#!/usr/bin/env tsx

import { config } from 'dotenv'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { PlanningCenterClient } from '../src/lib/planning-center'

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') })

interface GroupsData {
  metadata: {
    lastUpdated: string
    totalGroups: number
    version: string
    source: string
  }
  groups: any[]
}

async function generateGroups() {
  console.log('🚀 Starting Planning Center groups data generation...\n')

  const startTime = Date.now()

  try {
    // Initialize Planning Center client
    console.log('📡 Initializing Planning Center client...')
    const pcClient = new PlanningCenterClient()

    // Test connection first
    console.log('🔍 Testing Planning Center connection...')
    const isConnected = await pcClient.testConnection()
    
    if (!isConnected) {
      console.error('❌ Failed to connect to Planning Center API')
      console.error('   Please check your credentials in .env.local')
      process.exit(1)
    }
    
    console.log('✅ Planning Center connection successful!\n')

    // Fetch all groups
    console.log('📥 Fetching all groups from Planning Center...')
    const fetchStartTime = Date.now()
    const groups = await pcClient.getAllGroups()
    const fetchTime = Date.now() - fetchStartTime

    console.log(`✅ Successfully fetched ${groups.length} groups in ${fetchTime}ms\n`)

    // Analyze the data
    console.log('📊 Analyzing fetched data...')
    const stats = {
      total: groups.length,
      open: groups.filter(g => g.isOpen).length,
      withCoordinates: groups.filter(g => g.latitude && g.longitude).length,
      withCapacity: groups.filter(g => g.capacity).length,
      withImages: groups.filter(g => g.imageUrl).length,
      withSchedule: groups.filter(g => g.meetingDay !== 'TBD').length,
      groupTypes: {
        mixed: groups.filter(g => g.groupType === 'Mixed').length,
        men: groups.filter(g => g.groupType === 'Men').length,
        women: groups.filter(g => g.groupType === 'Women').length,
      },
      campuses: {
        downtown: groups.filter(g => g.campusLocation === 'Downtown').length,
        midtown: groups.filter(g => g.campusLocation === 'Midtown').length,
        hamilton: groups.filter(g => g.campusLocation === 'Hamilton').length,
      }
    }

    console.log(`   📈 Statistics:`)
    console.log(`      • Total groups: ${stats.total}`)
    console.log(`      • Open groups: ${stats.open} (${Math.round(stats.open/stats.total*100)}%)`)
    console.log(`      • With coordinates: ${stats.withCoordinates} (${Math.round(stats.withCoordinates/stats.total*100)}%)`)
    console.log(`      • With capacity: ${stats.withCapacity} (${Math.round(stats.withCapacity/stats.total*100)}%)`)
    console.log(`      • With images: ${stats.withImages} (${Math.round(stats.withImages/stats.total*100)}%)`)
    console.log(`      • With schedule: ${stats.withSchedule} (${Math.round(stats.withSchedule/stats.total*100)}%)`)
    console.log(`      • Group types: Mixed(${stats.groupTypes.mixed}), Men(${stats.groupTypes.men}), Women(${stats.groupTypes.women})`)
    console.log(`      • Campuses: Downtown(${stats.campuses.downtown}), Midtown(${stats.campuses.midtown}), Hamilton(${stats.campuses.hamilton})`)

    // Show sample groups with detailed info
    console.log('\n🔍 Sample groups with detailed field analysis:')
    const sampleGroups = groups.slice(0, 3)
    sampleGroups.forEach((group, index) => {
      console.log(`\n   📋 Group ${index + 1}: "${group.name}"`)
      console.log(`      • ID: ${group.id}`)
      console.log(`      • Description: ${group.description || 'None'}`)
      console.log(`      • Location: ${group.location}`)
      console.log(`      • Coordinates: ${group.latitude && group.longitude ? `${group.latitude}, ${group.longitude}` : 'None'}`)
      console.log(`      • Schedule: ${group.meetingDay} ${group.meetingTime}`)
      console.log(`      • Type: ${group.groupType}`)
      console.log(`      • Campus: ${group.campusLocation}`)
      console.log(`      • Capacity: ${group.capacity || 'None'}`)
      console.log(`      • Members: ${group.currentMemberCount || 'None'}`)
      console.log(`      • Open: ${group.isOpen}`)
      console.log(`      • Image: ${group.imageUrl ? 'Present' : 'None'}`)
      console.log(`      • PC URL: ${group.planningCenterUrl}`)
    })

    // Show examples of groups that might need filtering
    console.log('\n🔍 Groups that might need filtering:')
    const potentialInternalGroups = groups.filter(g => 
      g.name.toLowerCase().includes('team') || 
      g.name.toLowerCase().includes('production') || 
      g.name.toLowerCase().includes('coach') ||
      g.name.toLowerCase().includes('leader')
    ).slice(0, 5)
    
    potentialInternalGroups.forEach((group, index) => {
      console.log(`\n   🚫 Potential Internal Group ${index + 1}: "${group.name}"`)
      console.log(`      • Open: ${group.isOpen}`)
      console.log(`      • Members: ${group.currentMemberCount || 'None'}`)
      console.log(`      • Type: ${group.groupType}`)
    })

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
    console.log(`\n📁 Ensuring public directory exists: ${publicDir}`)
    
    try {
      await mkdir(publicDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, that's OK
    }

    // Write to public/groups.json
    const filePath = join(publicDir, 'groups.json')
    const jsonContent = JSON.stringify(groupsData, null, 2)

    console.log(`💾 Writing groups data to: ${filePath}`)
    await writeFile(filePath, jsonContent, 'utf8')

    const fileSize = Buffer.byteLength(jsonContent, 'utf8')
    const totalTime = Date.now() - startTime

    console.log(`✅ Successfully wrote ${Math.round(fileSize/1024)}KB to ${filePath}`)
    console.log(`\n🎉 Generation complete in ${totalTime}ms!`)
    console.log(`\n📄 Generated file contains:`)
    console.log(`   • ${stats.total} groups`)
    console.log(`   • ${stats.open} open for enrollment`)
    console.log(`   • ${stats.withCoordinates} with map coordinates`)
    console.log(`   • ${stats.withImages} with images`)
    console.log(`   • File size: ${Math.round(fileSize/1024)}KB`)
    console.log(`   • Last updated: ${groupsData.metadata.lastUpdated}`)

  } catch (error) {
    console.error('\n❌ Error generating group data:', error)
    
    if (error instanceof Error) {
      console.error('   Error details:', error.message)
      
      // Provide specific help for common issues
      if (error.message.includes('credentials')) {
        console.error('\n💡 Fix: Check your .env.local file contains:')
        console.error('   PLANNING_CENTER_APP_ID=your_app_id')
        console.error('   PLANNING_CENTER_SECRET=your_secret')
      } else if (error.message.includes('rate limit')) {
        console.error('\n💡 Fix: Try running the command again in a few minutes')
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        console.error('\n💡 Fix: Check your internet connection and try again')
      }
    }
    
    process.exit(1)
  }
}

// Run the generator
if (require.main === module) {
  generateGroups()
}