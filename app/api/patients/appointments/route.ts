import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { muntraService } from '@/lib/api/services/muntraService'
import { MuntraAppointment } from '@/lib/api/services/muntraService'

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

    console.log('Fetching appointments for user:', userEmail);
    
    // Try multiple approaches to get appointment data
    const appointments: MuntraAppointment[] = [];
    let patientId = '';
    
    // First verify if the patient exists in Muntra to get their ID
    try {
      const verificationResult = await muntraService.verifyPatient(userEmail)
      
      if (verificationResult.exists) {
        patientId = verificationResult.patientId || '';
        console.log('Found patient ID:', patientId);
        
        // If verification already included appointments, use them
        if (verificationResult.patient?.appointments && verificationResult.patient.appointments.length > 0) {
          console.log(`Found ${verificationResult.patient.appointments.length} appointments in verification result`);
          if (verificationResult.patient && verificationResult.patient.appointments) {
            verificationResult.patient.appointments.forEach(appt => appointments.push(appt));
          }
        }
      } else {
        console.log('Patient not found in Muntra');
        return NextResponse.json({
          success: false,
          message: 'Patient not found in system',
          appointments: []
        });
      }
    } catch (error) {
      console.error('Error verifying patient:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to verify patient',
        appointments: []
      }, { status: 500 });
    }
    
    // If we have a patient ID but no appointments yet, try the getPatientAppointments method
    if (patientId && appointments.length === 0) {
      try {
        console.log('Fetching appointments using getPatientAppointments');
        const patientAppointments = await muntraService.getPatientAppointments(patientId);
        console.log(`Found ${patientAppointments.length} appointments through getPatientAppointments`);
        
        if (patientAppointments.length > 0) {
          patientAppointments.forEach(appt => appointments.push(appt));
        }
      } catch (error) {
        console.error('Error fetching appointments through getPatientAppointments:', error);
      }
    }
    
    // If still no appointments, try a direct API call
    if (patientId && appointments.length === 0) {
      try {
        console.log('Attempting direct API call for appointments');
        const directResponse = await fetch(`${process.env.MUNTRA_API_BASE_URL}/api/patients/${patientId}/appointments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MUNTRA_API_KEY}`,
          },
        });
        
        if (directResponse.ok) {
          const directData = await directResponse.json();
          console.log(`Direct API call returned ${directData.data?.length || 0} appointments`);
          
          if (directData.data && directData.data.length > 0) {
            // Map to our appointment format
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
              } as MuntraAppointment;
            });
            
            mappedAppointments.forEach((appt: MuntraAppointment) => appointments.push(appt));
          }
        } else {
          console.log('Direct API call failed with status:', directResponse.status);
        }
      } catch (error) {
        console.error('Error in direct API call for appointments:', error);
      }
    }
    
    // Try also upcoming appointments endpoint
    if (patientId && appointments.length === 0) {
      try {
        console.log('Attempting upcoming appointments API call');
        const upcomingResponse = await fetch(`${process.env.MUNTRA_API_BASE_URL}/api/patients/${patientId}/appointments/upcoming`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MUNTRA_API_KEY}`,
          },
        });
        
        if (upcomingResponse.ok) {
          const upcomingData = await upcomingResponse.json();
          console.log(`Upcoming API call returned ${upcomingData.data?.length || 0} appointments`);
          
          if (upcomingData.data && upcomingData.data.length > 0) {
            // Map to our appointment format
            const mappedAppointments = upcomingData.data.map((appt: any) => {
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
              } as MuntraAppointment;
            });
            
            mappedAppointments.forEach((appt: MuntraAppointment) => appointments.push(appt));
          }
        } else {
          console.log('Upcoming API call failed with status:', upcomingResponse.status);
        }
      } catch (error) {
        console.error('Error in upcoming API call for appointments:', error);
      }
    }
    
    // Return whatever appointments we found
    return NextResponse.json({
      success: true,
      appointments: appointments
    });
    
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment data' },
      { status: 500 }
    );
  }
} 