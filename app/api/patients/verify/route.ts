import { NextResponse } from 'next/server'
import { muntraService } from '@/lib/api/services/muntraService'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Verify if the patient exists in Muntra
    const verificationResult = await muntraService.verifyPatient(email)

    if (!verificationResult.exists) {
      return NextResponse.json(
        { 
          error: 'No patient record found',
          code: 'NO_PATIENT_RECORD'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      exists: true,
      patientId: verificationResult.patientId,
      patient: verificationResult.patient
    })
  } catch (error) {
    console.error('Patient verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 