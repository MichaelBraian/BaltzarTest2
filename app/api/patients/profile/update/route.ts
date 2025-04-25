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

    // Prepare data to update
    const updateData = {
      name: requestData.fullName,
      phone: requestData.phone,
      // Add other fields as necessary
    }

    try {
      // Update patient data in Muntra
      // This would be the real implementation in a production environment
      // const updatedPatient = await muntraService.updatePatient(userEmail, updateData);
      
      // For now, just mock a successful response
      const mockUpdatedData = {
        ...updateData,
        email: userEmail,
        updatedAt: new Date().toISOString()
      }
      
      return NextResponse.json({
        success: true,
        patient: mockUpdatedData
      })
    } catch (error: any) {
      console.error('Error updating patient in Muntra:', error)
      
      // Return a more specific error
      if (error.status === 404) {
        return NextResponse.json(
          { error: 'Patient not found' },
          { status: 404 }
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