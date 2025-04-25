import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { muntraService } from '@/lib/api/services/muntraService'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Authenticate request using Supabase
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userEmail = session.user.email
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }

    // Fetch patient data from Muntra
    try {
      const patientData = await muntraService.getPatientDetails(userEmail)
      
      return NextResponse.json({
        patient: patientData,
        email: userEmail
      })
    } catch (error: any) {
      // If patient not found in Muntra, return basic profile
      if (error.message?.includes('not found') || error.status === 404) {
        return NextResponse.json({
          patient: {
            name: session.user.user_metadata?.full_name || 'Patient',
            email: userEmail,
          },
          email: userEmail
        })
      }
      
      // Otherwise rethrow the error
      throw error
    }
  } catch (error) {
    console.error('Error fetching patient profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient data' },
      { status: 500 }
    )
  }
} 