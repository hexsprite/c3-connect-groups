import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🔧 Manual group data generation triggered via admin endpoint')

  try {
    // Forward to the webhook endpoint
    const baseUrl = request.nextUrl.origin
    const webhookUrl = `${baseUrl}/api/webhooks/planning-center`

    console.log(`Forwarding to webhook: ${webhookUrl}`)

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    return NextResponse.json(
      {
        success: true,
        message: 'Manual group data generation completed',
        webhook_response: data,
      },
      { status: response.status }
    )
  } catch (error) {
    console.error('❌ Error in manual group data generation:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to trigger group data generation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  console.log('🔧 Manual group data generation triggered via GET request')

  // Forward to POST handler
  return POST(request)
}
