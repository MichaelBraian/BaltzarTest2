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
    interface DebugInfo {
      verificationResult: {
        exists: boolean;
        patientId?: string;
        hasPatient: boolean;
      } | null;
      muntraPatientData: {
        name: string;
        email: string;
        phone: string;
        address?: string;
        postalCode?: string;
        city?: string;
        country?: string;
      } | null;
      mergedData: {
        finalAddress: string;
        finalPostalCode: string;
        finalCity: string;
        finalCountry: string;
        muntraAddress?: string;
        muntraPostalCode?: string;
        supabaseAddress: string;
        supabasePostalCode: string;
      } | null;
      errors: Array<{
        message: string;
        error: string;
      }>;
    }

    let debugInfo: DebugInfo = {
      verificationResult: null,
      muntraPatientData: null,
      mergedData: null,
      errors: []
    };

    try {
      console.log('Fetching patient data from Muntra for email:', userEmail);
      
      // Verify patient exists and get basic info
      const verificationResult = await muntraService.verifyPatient(userEmail)
      
      // Log verification result
      console.log('=== DEBUG: Verification Result ===');
      console.log(JSON.stringify(verificationResult, null, 2));
      
      debugInfo.verificationResult = {
        exists: verificationResult.exists,
        patientId: verificationResult.patientId,
        hasPatient: !!verificationResult.patient
      };
      
      if (verificationResult.exists && verificationResult.patient) {
        const muntraPatient = verificationResult.patient;
        
        // Log raw patient data
        console.log('=== DEBUG: Raw Muntra Patient Data ===');
        console.log(JSON.stringify(muntraPatient, null, 2));
        
        debugInfo.muntraPatientData = {
          name: muntraPatient.name,
          email: muntraPatient.email,
          phone: muntraPatient.phone,
          address: muntraPatient.address,
          postalCode: muntraPatient.postalCode,
          city: muntraPatient.city,
          country: muntraPatient.country,
        };
        
        // Merge the Muntra data with the Supabase data
        patientInfo = {
          ...patientInfo,
          name: muntraPatient.name || patientInfo.name,
          phone: muntraPatient.phone || patientInfo.phone,
          address: muntraPatient.address || patientInfo.address || '',
          postalCode: muntraPatient.postalCode || patientInfo.postalCode || '',
          city: muntraPatient.city || patientInfo.city || '',
          country: muntraPatient.country || patientInfo.country || '',
        }
        
        // Log merged data
        console.log('=== DEBUG: Merged Patient Data ===');
        console.log(JSON.stringify(patientInfo, null, 2));
        
        debugInfo.mergedData = {
          finalAddress: patientInfo.address,
          finalPostalCode: patientInfo.postalCode,
          finalCity: patientInfo.city,
          finalCountry: patientInfo.country,
          muntraAddress: muntraPatient.address,
          muntraPostalCode: muntraPatient.postalCode,
          supabaseAddress: userData.address,
          supabasePostalCode: userData.postal_code
        };
        
        // Handle appointments - always fetch separately to ensure fresh data
        if (verificationResult.patientId) {
          console.log('Fetching appointments for patient ID:', verificationResult.patientId);
          const patientAppointments = await muntraService.getPatientAppointments(verificationResult.patientId)
          console.log(`Found ${patientAppointments.length} appointments`);
          
          // Log appointment details for debugging
          if (patientAppointments && patientAppointments.length > 0) {
            console.log('First appointment details:', JSON.stringify(patientAppointments[0]));
            patientInfo.appointments = patientAppointments;
          } else {
            console.log('No appointments returned from getPatientAppointments');
            
            // Try one more attempt with a different endpoint
            try {
              console.log('Attempting to fetch appointments with direct endpoint call');
              const directResponse = await fetch(`${process.env.MUNTRA_API_BASE_URL}/api/patients/${verificationResult.patientId}/appointments`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.MUNTRA_API_KEY}`,
                },
              });
              
              if (directResponse.ok) {
                const directData = await directResponse.json();
                console.log(`Direct endpoint returned ${directData.data?.length || 0} appointments`);
                
                if (directData.data && directData.data.length > 0) {
                  // Map the appointments directly
                  const mappedAppointments = directData.data.map((appt: any) => {
                    const attrs = appt.attributes || {};
                    return {
                      id: appt.id,
                      date: attrs.date || attrs.appointment_date || '',
                      time: attrs.time || attrs.appointment_time || '',
                      duration: attrs.duration || 30,
                      clinicName: (attrs.clinic && attrs.clinic.name) || attrs.clinic_name || '',
                      clinicianName: (attrs.clinician && attrs.clinician.name) || attrs.clinician_name || '',
                      status: attrs.status || 'scheduled',
                      type: attrs.type || attrs.appointment_type || 'consultation',
                      notes: attrs.notes || '',
                      location: attrs.location || ''
                    };
                  });
                  
                  patientInfo.appointments = mappedAppointments;
                  console.log('Successfully mapped appointments from direct endpoint');
                }
              } else {
                console.log('Direct endpoint call failed with status:', directResponse.status);
              }
            } catch (directErr) {
              console.error('Error in direct appointment fetch:', directErr);
            }
          }
        }
      } else {
        console.log('No Muntra patient found for email:', userEmail);
      }
    } catch (error) {
      console.error('Error fetching Muntra patient data:', error);
      debugInfo.errors.push({
        message: 'Error fetching Muntra patient data',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    return NextResponse.json({
      success: true,
      patient: patientInfo,
      debug: debugInfo  // Include debug info in response
    })
    
  } catch (error) {
    console.error('Error fetching patient profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient data' },
      { status: 500 }
    )
  }
} 