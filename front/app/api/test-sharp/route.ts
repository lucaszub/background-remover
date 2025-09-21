import { NextResponse } from 'next/server'
import { testSharpAvailability } from '@/lib/azure-storage'

export async function GET() {
  try {
    const sharpTest = testSharpAvailability()

    return NextResponse.json({
      sharpAvailable: sharpTest.available,
      error: sharpTest.error || null,
      message: sharpTest.available
        ? 'Sharp is working correctly'
        : 'Sharp is not available, using fallbacks',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      {
        sharpAvailable: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Sharp test endpoint failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}