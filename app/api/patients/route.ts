import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get the access token from Supabase
    const accessToken = session.access_token
    
    // Here you would make a call to your API to get patient data
    // For example:
    // const apiResponse = await fetch('YOUR_API_ENDPOINT/patients', {
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`,
    //     'Content-Type': 'application/json',
    //   },
    // })
    
    // For now, we'll return mock data
    // In a real implementation, you would parse the API response and return it
    const patientData = {
      name: 'John Doe',
      socialSecurityNumber: '19810811-1496',
      email: session.user.email,
      phone: '+46 70 123 45 67',
      address: 'Example Street 123, 12345 Stockholm',
      nextAppointment: '2023-05-15 10:00',
      lastVisit: '2023-01-10',
    }
    
    return NextResponse.json(patientData)
  } catch (error) {
    console.error('Error fetching patient data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 