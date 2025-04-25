import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { patientService } from '@/lib/api/services/patientService'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // First, verify if the patient exists in your existing system
    const verificationResult = await patientService.verifyPatient(email)

    if (verificationResult.exists && verificationResult.patientId) {
      // Patient exists in your system
      // Check if they already have an auth account
      const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.error('Error checking auth users:', authError)
        return NextResponse.json(
          { error: 'Failed to check existing auth account' },
          { status: 500 }
        )
      }

      const existingAuthUser = users?.find(user => user.email === email)

      if (existingAuthUser) {
        return NextResponse.json(
          { 
            error: 'An account with this email already exists. Please use the login page or reset your password if you forgot it.',
            code: 'EXISTING_ACCOUNT'
          },
          { status: 400 }
        )
      }

      // Get patient details from your system
      const patientDetails = await patientService.getPatientDetails(verificationResult.patientId)

      // Create auth account and link it to existing patient record
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })

      if (signUpError) {
        return NextResponse.json(
          { error: signUpError.message },
          { status: 400 }
        )
      }

      // Create a patient record in Supabase with data from your system
      const { error: profileError } = await supabase
        .from('patients')
        .insert({
          id: authData.user?.id,
          email: email,
          first_name: patientDetails.firstName,
          last_name: patientDetails.lastName,
          phone: patientDetails.phone,
          date_of_birth: patientDetails.dateOfBirth,
          medical_history: patientDetails.medicalHistory,
        })

      if (profileError) {
        console.error('Error creating patient profile:', profileError)
        return NextResponse.json(
          { error: 'Failed to create patient profile' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        user: authData.user,
        session: authData.session,
      })
    }

    // If we get here, the patient doesn't exist in your system
    return NextResponse.json(
      { 
        error: 'No patient record found with this email. Please contact the clinic to register.',
        code: 'NO_PATIENT_RECORD'
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 