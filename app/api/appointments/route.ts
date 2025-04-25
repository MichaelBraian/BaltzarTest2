import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Types for appointments
interface Appointment {
  id: string
  date: string
  time: string
  type: string
  dentist: string
  location: string
  duration: number
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

// Mock data generator - creates realistic appointments around the current date
function generateMockAppointments(userEmail: string): { upcoming: Appointment[], past: Appointment[] } {
  // Generate a deterministic "random" value based on the email
  // This ensures the same user always gets the same appointments
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
  
  const userHash = hashCode(userEmail);
  
  // Appointment types
  const appointmentTypes = [
    'Regular Check-up',
    'Dental Cleaning',
    'Filling',
    'Root Canal Treatment',
    'Extraction',
    'Consultation'
  ];
  
  // Dentists
  const dentists = [
    'Dr. Sara Lindberg',
    'Dr. Erik Johansson',
    'Dr. Maria Andersson',
    'Dr. Oscar Nilsson'
  ];
  
  // Locations
  const locations = [
    'Baltzar Tandvård, Floor 2, Room 201',
    'Baltzar Tandvård, Floor 2, Room 204',
    'Baltzar Tandvård, Floor 3, Room 302',
    'Baltzar Tandvård, Floor 3, Room 305'
  ];
  
  // Generate dates
  const today = new Date();
  
  // Create upcoming appointments (1-3 appointments)
  const upcomingCount = (userHash % 3) + 1;
  const upcoming: Appointment[] = [];
  
  for (let i = 0; i < upcomingCount; i++) {
    const daysInFuture = 7 + ((userHash + i * 13) % 90); // Between 1 week and 3 months
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + daysInFuture);
    
    // Generate a time between 8:00 and 16:00
    const hour = 8 + ((userHash + i * 7) % 8);
    const minute = ((userHash + i * 11) % 4) * 15; // 0, 15, 30, or 45
    
    upcoming.push({
      id: `future-${userHash}-${i}`,
      date: appointmentDate.toISOString().split('T')[0],
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      type: appointmentTypes[(userHash + i) % appointmentTypes.length],
      dentist: dentists[(userHash + i) % dentists.length],
      location: locations[(userHash + i) % locations.length],
      duration: [30, 60, 90][(userHash + i) % 3],
      status: 'scheduled'
    });
  }
  
  // Sort upcoming by date
  upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Create past appointments (2-5 appointments)
  const pastCount = 2 + ((userHash % 4));
  const past: Appointment[] = [];
  
  for (let i = 0; i < pastCount; i++) {
    const daysInPast = 7 + ((userHash + i * 17) % 365); // Between 1 week and 1 year
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() - daysInPast);
    
    // Generate a time between 8:00 and 16:00
    const hour = 8 + ((userHash + i * 13) % 8);
    const minute = ((userHash + i * 19) % 4) * 15; // 0, 15, 30, or 45
    
    past.push({
      id: `past-${userHash}-${i}`,
      date: appointmentDate.toISOString().split('T')[0],
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      type: appointmentTypes[(userHash + i * 3) % appointmentTypes.length],
      dentist: dentists[(userHash + i * 5) % dentists.length],
      location: locations[(userHash + i * 7) % locations.length],
      duration: [30, 60, 90][(userHash + i) % 3],
      status: 'completed'
    });
  }
  
  // Sort past by date in descending order (most recent first)
  past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return { upcoming, past };
}

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

    // In a real implementation, we would fetch appointments from the dental system
    // For now, we generate realistic mock data based on the user's email
    // This ensures the user always sees the same appointments during testing
    const appointments = generateMockAppointments(userEmail);
    
    return NextResponse.json({
      appointments,
      message: "Note: These are mock appointments for demonstration purposes. Integration with your actual dental system would be implemented in production."
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
} 