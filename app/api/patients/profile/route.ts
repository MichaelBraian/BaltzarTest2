import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { muntraService, MuntraPatient, MuntraVerificationResponse } from '@/lib/api/services/muntraService'

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
    
    console.log('User metadata from Supabase:', JSON.stringify(userData));
    
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
      // Try to get patient data from Muntra
      let dataSource = 'supabase';
      
      try {
        // Try to get patient data from Muntra
        const verificationResult = await muntraService.verifyPatient(userEmail)
        
        if (verificationResult.exists && verificationResult.patient) {
          dataSource = 'muntra';
          const muntraPatient = verificationResult.patient;
          
          // Update patient info with Muntra data, preferring Muntra data over Supabase
          patientInfo = {
            ...patientInfo, // Keep Supabase data as fallback
            name: muntraPatient.name || patientInfo.name,
            email: muntraPatient.email || patientInfo.email,
            phone: muntraPatient.phone || patientInfo.phone,
            address: muntraPatient.address || patientInfo.address,
            postalCode: muntraPatient.postalCode || patientInfo.postalCode,
            city: muntraPatient.city || patientInfo.city,
            country: muntraPatient.country || patientInfo.country,
          }

          // Log the data we're using
          console.log('Patient data sources:', {
            muntra: {
              name: muntraPatient.name,
              phone: muntraPatient.phone,
              address: muntraPatient.address,
              postalCode: muntraPatient.postalCode,
            },
            supabase: {
              name: userData.full_name,
              phone: userData.phone,
              address: userData.address,
              postalCode: userData.postal_code,
            },
            final: {
              name: patientInfo.name,
              phone: patientInfo.phone,
              address: patientInfo.address,
              postalCode: patientInfo.postalCode,
            }
          });

          // Get appointments if available
          if (verificationResult.patientId) {
            const appointments = await muntraService.getPatientAppointments(verificationResult.patientId);
            if (appointments && appointments.length > 0) {
              patientInfo.appointments = appointments;
            }
          }
        } else {
          console.log('No Muntra patient found, using Supabase data only:', userData);
        }
      } catch (error) {
        console.error('Error fetching Muntra patient data:', error);
        // Continue with Supabase data on error
      }

      return NextResponse.json({
        success: true,
        patient: patientInfo,
        source: dataSource,
        _timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error fetching patient profile:', error)
      return NextResponse.json(
        { error: 'Failed to fetch patient data' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error fetching patient profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient data' },
      { status: 500 }
    )
  }
} 