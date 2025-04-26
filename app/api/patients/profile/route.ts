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

    // Get the user metadata from Supabase
    const userData = session.user.user_metadata || {}
    
    // Define the patient info type
    type PatientInfo = {
      name: string;
      email: string;
      phone: string;
      address: string;
      postalCode: string;
      city: string;
      country: string;
      preferredLanguage: string;
      emailNotifications: boolean;
      smsNotifications: boolean;
      appointments?: any[];
    }
    
    // Initialize patient data with metadata
    let patientInfo: PatientInfo = {
      name: userData.full_name || '',
      email: userEmail,
      phone: userData.phone || '',
      address: userData.address || '',
      postalCode: userData.postal_code || '',
      city: userData.city || '',
      country: userData.country || '',
      preferredLanguage: userData.preferred_language || 'en',
      emailNotifications: userData.email_notifications !== false,
      smsNotifications: !!userData.sms_notifications,
    }

    // Try to get patient data from Muntra
    try {
      // First try to get patient data and appointments in one request
      const verificationResult = await muntraService.verifyPatient(userEmail)
      
      if (verificationResult.exists && verificationResult.patient) {
        const muntraPatient = verificationResult.patient;
        
        // Merge the Muntra data with the Supabase data
        // Prefer Muntra data for medical information but keep user preferences from Supabase
        patientInfo = {
          ...patientInfo,
          name: muntraPatient.name || patientInfo.name,
          phone: muntraPatient.phone || patientInfo.phone,
          address: muntraPatient.address || patientInfo.address,
          postalCode: muntraPatient.postalCode || patientInfo.postalCode,
          city: muntraPatient.city || patientInfo.city,
          country: muntraPatient.country || patientInfo.country,
        }
        
        // Handle appointments - always fetch them separately to ensure fresh data
        if (verificationResult.patientId) {
          const patientAppointments = await muntraService.getPatientAppointments(verificationResult.patientId)
          if (patientAppointments && patientAppointments.length > 0) {
            patientInfo.appointments = patientAppointments
          }
        }
      }
    } catch (error) {
      console.error('Error fetching Muntra patient data:', error)
      // Continue with metadata only - non-fatal error
    }

    return NextResponse.json({
      success: true,
      patient: patientInfo
    })
    
  } catch (error) {
    console.error('Error fetching patient profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient data' },
      { status: 500 }
    )
  }
} 