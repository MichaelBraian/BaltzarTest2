import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { muntraService } from '@/lib/api/services/muntraService'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
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

    // Parse request body
    const requestData = await request.json()
    
    // Validate request data
    if (!requestData) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Get the patient ID from metadata or through a verification method
    // First verify if the patient exists in Muntra by their email
    const patientVerification = await muntraService.verifyPatient(userEmail)
    
    if (!patientVerification.exists || !patientVerification.patientId) {
      return NextResponse.json(
        { error: 'Patient not found in Muntra system' },
        { status: 404 }
      )
    }

    // Prepare data to update in Muntra format
    const patientId = patientVerification.patientId
    const updateData = {
      firstName: requestData.fullName?.split(' ')[0] || '',
      lastName: requestData.fullName?.split(' ').slice(1).join(' ') || '',
      phoneNumberCell: requestData.phone || '',
      email: userEmail,
      address_1: requestData.address || '',
      postal_code: requestData.postalCode || '',
      city: requestData.city || '',
      country: requestData.country || '',
      // Map other fields as needed
    }

    try {
      // Update patient data in Muntra using the actual service method
      const updatedPatient = await muntraService.updatePatientProfile(patientId, updateData)
      
      // Log the update attempt for debugging
      console.log('Update attempt:', {
        patientId,
        updateData,
        updatedPatient: updatedPatient ? {
          hasAddress: !!updatedPatient.address,
          address: updatedPatient.address,
          postalCode: updatedPatient.postalCode
        } : null
      });
      
      return NextResponse.json({
        success: true,
        patient: {
          name: requestData.fullName,
          phone: requestData.phone,
          email: userEmail,
          address: requestData.address,
          postalCode: requestData.postalCode,
          city: requestData.city,
          country: requestData.country,
          preferredLanguage: requestData.preferredLanguage,
          emailNotifications: requestData.emailNotifications,
          smsNotifications: requestData.smsNotifications,
          updatedAt: new Date().toISOString()
        }
      })
    } catch (error: any) {
      console.error('Error updating patient in Muntra:', error)
      
      // Return a more specific error message based on the error
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Patient not found in Muntra system' },
          { status: 404 }
        )
      } else if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Unauthorized access to Muntra API' },
          { status: 401 }
        )
      }
      
      throw error // Rethrow to be caught by the outer try/catch
    }
  } catch (error) {
    console.error('Error updating patient profile:', error)
    return NextResponse.json(
      { error: 'Failed to update patient data' },
      { status: 500 }
    )
  }
} 