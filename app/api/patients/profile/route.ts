import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { muntraService } from '@/lib/api/services/muntraService'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    console.log("Profile API: Starting request")
    
    // Authenticate request using Supabase
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      console.log("Profile API: No session found")
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userEmail = session.user.email
    
    if (!userEmail) {
      console.log("Profile API: No user email found")
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }

    console.log("Profile API: Processing request for", userEmail)
    
    // Get user metadata for basic profile info
    const userData = session.user.user_metadata || {}
    
    // Always provide basic profile data first
    const basicProfile = {
      name: userData.full_name || userEmail.split('@')[0],
      email: userEmail,
      phone: userData.phone || '',
      // Add more fields from user metadata as needed
    }

    // First verify if the patient exists in Muntra
    try {
      console.log("Profile API: Verifying patient in Muntra")
      const verificationResult = await muntraService.verifyPatient(userEmail)
      
      if (!verificationResult.exists) {
        console.log("Profile API: Patient not found in Muntra")
        // Return basic profile if not found in Muntra
        return NextResponse.json({
          patient: basicProfile,
          email: userEmail,
          source: 'supabase'
        })
      }
      
      // If patient exists in Muntra and we have the patientId, get details
      if (verificationResult.patientId) {
        console.log("Profile API: Patient found, getting details with ID", verificationResult.patientId)
        try {
          const patientData = await muntraService.getPatientDetails(verificationResult.patientId)
          
          console.log("Profile API: Retrieved patient details")
          
          return NextResponse.json({
            patient: {
              ...basicProfile,
              ...patientData,
              // Map any additional fields from Muntra
              name: `${patientData.firstName} ${patientData.lastName}`,
              phone: patientData.phoneNumberCell || patientData.phoneNumberWork || patientData.phoneNumberHome || basicProfile.phone,
            },
            email: userEmail,
            source: 'muntra'
          })
        } catch (detailsError) {
          console.error('Profile API: Error getting patient details:', detailsError)
          // If details fetch fails, fall back to basic profile + mock data
        }
      }
    } catch (verifyError) {
      console.error('Profile API: Muntra verification error:', verifyError)
      // If verification fails, continue with mock data
    }
    
    // Mock data for development/testing or if Muntra fails
    console.log("Profile API: Using mock data")
    const mockPatientData = {
      ...basicProfile,
      lastVisit: '2023-01-15',
      nextAppointment: '2023-08-20 at 14:30',
      dentist: 'Dr. Sara Lindberg',
      clinic: 'Baltzar Tandvård',
      status: 'Regular Patient',
      insurance: 'Folktandvården Insurance'
    }
    
    return NextResponse.json({
      patient: mockPatientData,
      email: userEmail,
      source: 'mock'
    })
  } catch (error) {
    console.error('Profile API: Fatal error fetching patient profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient data' },
      { status: 500 }
    )
  }
} 