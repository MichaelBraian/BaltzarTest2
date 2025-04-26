import { apiClient } from '../client'
import { config } from '@/lib/config'

// Define appointment status type locally instead of importing
export type AppointmentStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed' 
  | 'no-show'
  | 'rescheduled';

// Muntra API Types based on the API documentation
export interface MuntraPatient {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  phone: string
  address?: string
  postalCode?: string
  city?: string
  country?: string
  insuranceInformation?: string
  appointments?: MuntraAppointment[]
}

export interface MuntraAppointment {
  id: string
  date: string
  time: string
  duration: number
  clinicName: string
  clinicianName: string
  status: AppointmentStatus
  type: string
}

export interface MuntraVerificationResponse {
  exists: boolean
  patientId?: string
  patient?: MuntraPatient
}

export interface MuntraPatientDetailsResponse {
  patient: MuntraPatient
  appointments?: MuntraAppointment[]
}

// Muntra service class
export class MuntraService {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    }
  }

  // Verify if a patient exists in Muntra by searching for their email
  async verifyPatient(email: string): Promise<MuntraVerificationResponse> {
    try {
      // Use the search-patients endpoint to find a patient by email
      const response = await fetch(`${this.baseUrl}/api/search-patients?query=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Muntra API error: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Check if any patients were found with the given email
      const patients = data.data || []
      const patient = patients.find((p: any) => 
        p.attributes && p.attributes.e_mail_address === email
      )
      
      if (patient) {
        // Map the Muntra patient data to our interface
        const muntraPatient: MuntraPatient = {
          id: patient.id,
          email: patient.attributes.e_mail_address,
          name: patient.attributes.first_name + ' ' + patient.attributes.last_name,
          phone: patient.attributes.phone_number_cell || patient.attributes.phone_number_work || patient.attributes.phone_number_home || '',
          address: patient.attributes.address,
          postalCode: patient.attributes.postal_code,
          city: patient.attributes.city,
          country: patient.attributes.country,
          insuranceInformation: patient.attributes.insurance_information || 'Folktandvården Insurance',
          appointments: patient.attributes.appointments?.map((appt: any) => ({
            id: appt.id,
            date: appt.attributes?.date || '',
            time: appt.attributes?.time || '',
            duration: appt.attributes?.duration || 30,
            clinicName: appt.attributes?.clinic?.name || '',
            clinicianName: appt.attributes?.clinician?.name || '',
            status: appt.attributes?.status || 'scheduled',
            type: appt.attributes?.type || 'consultation'
          }))
        }
        
        return {
          exists: true,
          patientId: patient.id,
          patient: muntraPatient
        }
      }
      
      return {
        exists: false
      }
    } catch (error) {
      console.error('Muntra verification error:', error)
      throw error
    }
  }

  // Get patient details from Muntra
  async getPatientDetails(email: string): Promise<MuntraPatient | null> {
    try {
      // First, get the patient ID using email
      const response = await fetch(`${this.baseUrl}/api/patients/search?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.error('Failed to fetch patient:', response.statusText);
        return null;
      }

      const data = await response.json();
      const patient = data.data?.[0];
      
      if (!patient) {
        console.error('Patient not found for email:', email);
        return null;
      }

      const patientId = patient.id;
      const patientAttributes = patient.attributes || {};

      // Get additional patient details if available
      let additionalDetails: Record<string, any> = {};
      try {
        const detailsResponse = await fetch(`${this.baseUrl}/api/patients/${patientId}/details`, {
          method: 'GET',
          headers: this.getHeaders(),
        });
        
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          additionalDetails = detailsData.data?.attributes || {};
        }
      } catch (err) {
        console.error('Failed to fetch additional patient details:', err);
        // Continue even if additional details fail - non-critical
      }

      // Fetch appointments (if any)
      let appointments: MuntraAppointment[] = [];
      try {
        const appointmentsResponse = await fetch(`${this.baseUrl}/api/patients/${patientId}/appointments`, {
          method: 'GET',
          headers: this.getHeaders(),
        });
        
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          appointments = (appointmentsData.data || []).map((appt: any) => ({
            id: appt.id,
            date: appt.attributes?.date || '',
            time: appt.attributes?.time || '',
            duration: appt.attributes?.duration || 30,
            clinicName: appt.attributes?.clinic?.name || '',
            clinicianName: appt.attributes?.clinician?.name || '',
            status: appt.attributes?.status || 'scheduled',
            type: appt.attributes?.type || 'consultation'
          }));
        }
      } catch (err) {
        console.error('Failed to fetch patient appointments:', err);
        // Continue even if appointments fetch fails - non-critical
      }
      
      // Return a complete patient profile with all available data
      return {
        id: patientId,
        email: email,
        name: patientAttributes.name || patientAttributes.first_name + ' ' + patientAttributes.last_name || '',
        phone: patientAttributes.phone || patientAttributes.phone_number_cell || patientAttributes.phone_number_home || '',
        address: additionalDetails.address || patientAttributes.address || '',
        postalCode: additionalDetails.postal_code || patientAttributes.postal_code || '',
        city: additionalDetails.city || patientAttributes.city || '',
        country: additionalDetails.country || patientAttributes.country || '',
        insuranceInformation: additionalDetails.insurance || patientAttributes.insurance_information || '',
        appointments: appointments,
      };
    } catch (error) {
      console.error('Error fetching patient details:', error);
      return null;
    }
  }

  // Update patient profile in Muntra
  async updatePatientProfile(patientId: string, data: Partial<MuntraPatient>): Promise<MuntraPatient | null> {
    try {
      // Prepare the data to update
      const updateAttributes: Record<string, any> = {}
      
      // Map the data fields to the Muntra API expected format
      if (data.name) updateAttributes.name = data.name
      if (data.phone) updateAttributes.phone = data.phone
      if (data.address) updateAttributes.address = data.address
      if (data.postalCode) updateAttributes.postal_code = data.postalCode
      if (data.city) updateAttributes.city = data.city
      if (data.country) updateAttributes.country = data.country
      if (data.insuranceInformation) updateAttributes.insurance = data.insuranceInformation
      
      // Handle first name and last name if provided separately
      if (data.firstName && data.lastName) {
        updateAttributes.first_name = data.firstName
        updateAttributes.last_name = data.lastName
      }
      
      // Update patient data
      const updateResponse = await fetch(`${this.baseUrl}/api/patients/${patientId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          data: {
            attributes: updateAttributes
          }
        }),
      });

      if (!updateResponse.ok) {
        console.error('Failed to update patient:', updateResponse.statusText);
        return null;
      }

      // Return updated patient data
      return this.getPatientDetails(patientId);
    } catch (error) {
      console.error('Error updating patient profile:', error);
      return null;
    }
  }

  // Get patient appointments
  async getPatientAppointments(patientId: string): Promise<MuntraAppointment[]> {
    try {
      if (!patientId) {
        throw new Error('Patient ID is required to fetch appointments')
      }

      // Make API call to get appointments
      const response = await fetch(`${this.baseUrl}/api/patients/${patientId}/appointments`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Muntra API error: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Map response to our appointment interface
      return (data.data || []).map((appt: any) => ({
        id: appt.id,
        patientId: appt.patient_id || patientId,
        providerId: appt.provider_id,
        providerName: appt.provider_name,
        appointmentType: appt.appointment_type,
        date: appt.date,
        time: appt.time,
        duration: appt.duration,
        status: appt.status,
        notes: appt.notes,
        location: appt.location
      }))
    } catch (error) {
      console.error('Error fetching patient appointments:', error)
      // Return empty array instead of throwing to make this non-critical
      return []
    }
  }
}

// Create and export a singleton instance
export const muntraService = new MuntraService(process.env.MUNTRA_API_KEY || '', process.env.MUNTRA_API_BASE_URL || '') 