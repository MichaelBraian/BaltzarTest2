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
  notes?: string
  location?: string
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
      // First, search for the patient by email
      const response = await fetch(`${this.baseUrl}/api/search-patients?query=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Muntra API error: ${response.statusText}`)
      }

      const data = await response.json()
      const patients = data.data || []
      
      // Find patient with exact email match
      const patient = patients.find((p: any) => 
        p.attributes && p.attributes.e_mail_address === email
      )
      
      if (patient) {
        // Get complete patient details using the patient ID
        try {
          // Use the correct endpoint for detailed patient information
          const detailsResponse = await fetch(`${this.baseUrl}/api/patients/${patient.id}/details`, {
            method: 'GET',
            headers: this.getHeaders(),
          });
          
          if (!detailsResponse.ok) {
            throw new Error(`Failed to fetch patient details: ${detailsResponse.statusText}`);
          }

          const detailsData = await detailsResponse.json();
          const patientDetails = detailsData.data?.attributes || {};

          // Map the patient data with all available fields
          const muntraPatient: MuntraPatient = {
            id: patient.id,
            email: patientDetails.e_mail_address || patient.attributes.e_mail_address || '',
            name: `${patientDetails.first_name || ''} ${patientDetails.last_name || ''}`.trim(),
            firstName: patientDetails.first_name || '',
            lastName: patientDetails.last_name || '',
            // Get phone numbers in order of priority
            phone: patientDetails.phone_number_cell || 
                   patientDetails.phone_number_work || 
                   patientDetails.phone_number_home || 
                   patientDetails.phone || '',
            // Get address information
            address: patientDetails.address_1 || patientDetails.address || '',
            postalCode: patientDetails.postal_code || patientDetails.postalcode || '',
            city: patientDetails.city || '',
            country: patientDetails.country || '',
            insuranceInformation: patientDetails.insurance_information || '',
          };

          console.log('Mapped patient data:', {
            id: muntraPatient.id,
            name: muntraPatient.name,
            phone: muntraPatient.phone,
            address: muntraPatient.address,
            postalCode: muntraPatient.postalCode,
            rawDetails: patientDetails
          });

          return {
            exists: true,
            patientId: patient.id,
            patient: muntraPatient
          };
        } catch (detailsError) {
          console.error('Error fetching patient details:', detailsError);
          // If details fetch fails, return basic patient info
          return {
            exists: true,
            patientId: patient.id,
            patient: {
              id: patient.id,
              email: patient.attributes.e_mail_address || '',
              name: `${patient.attributes.first_name || ''} ${patient.attributes.last_name || ''}`.trim(),
              firstName: patient.attributes.first_name || '',
              lastName: patient.attributes.last_name || '',
              phone: patient.attributes.phone_number_cell || 
                     patient.attributes.phone_number_work || 
                     patient.attributes.phone_number_home || 
                     patient.attributes.phone || '',
              address: patient.attributes.address_1 || patient.attributes.address || '',
              postalCode: patient.attributes.postal_code || patient.attributes.postalcode || '',
              city: patient.attributes.city || '',
              country: patient.attributes.country || '',
              insuranceInformation: patient.attributes.insurance_information || '',
            }
          };
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
      
      // Return a complete patient profile with all available data
      return {
        id: patientId,
        email: email,
        name: patientAttributes.name || `${patientAttributes.first_name || ''} ${patientAttributes.last_name || ''}`.trim(),
        firstName: patientAttributes.first_name || '',
        lastName: patientAttributes.last_name || '',
        // Try all phone number fields in order of priority
        phone: patientAttributes.phone_number_cell || 
               patientAttributes.phone_number_work || 
               patientAttributes.phone_number_home || 
               patientAttributes.phone || '',
        // Use the correct address fields
        address: additionalDetails.address_1 || patientAttributes.address_1 || '',
        postalCode: additionalDetails.postal_code || patientAttributes.postal_code || '',
        city: additionalDetails.city || patientAttributes.city || '',
        country: additionalDetails.country || patientAttributes.country || '',
        insuranceInformation: additionalDetails.insurance_information || patientAttributes.insurance_information || '',
        appointments: [],  // Will be populated separately
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
      if (data.address) updateAttributes.address_1 = data.address
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

      // First try to get upcoming appointments (most relevant)
      let appointments: any[] = [];
      
      try {
        const upcomingResponse = await fetch(`${this.baseUrl}/api/patients/${patientId}/appointments/upcoming`, {
        method: 'GET',
        headers: this.getHeaders(),
        });

        if (upcomingResponse.ok) {
          const upcomingData = await upcomingResponse.json();
          appointments = upcomingData.data || [];
        }
      } catch (err) {
        console.error('Error fetching upcoming appointments:', err);
        // Continue and try fetching all appointments
      }
      
      // If no upcoming appointments found, try getting all appointments
      if (appointments.length === 0) {
        const allAppointmentsResponse = await fetch(`${this.baseUrl}/api/patients/${patientId}/appointments`, {
          method: 'GET',
          headers: this.getHeaders(),
        });
        
        if (!allAppointmentsResponse.ok) {
          throw new Error(`Muntra API error: ${allAppointmentsResponse.statusText}`);
      }

        const data = await allAppointmentsResponse.json();
        appointments = data.data || [];
      }
      
      // Map appointments to our format with robust field handling
      const mappedAppointments = appointments.map((appt: any) => {
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
      
      // Sort appointments by date (most recent first)
      return mappedAppointments.sort((a, b) => {
        // Handle potential invalid dates
        let dateA: Date, dateB: Date;
        try {
          dateA = new Date(`${a.date} ${a.time}`);
          if (isNaN(dateA.getTime())) dateA = new Date(0); // Default to epoch if invalid
        } catch (e) {
          dateA = new Date(0);
        }
        
        try {
          dateB = new Date(`${b.date} ${b.time}`);
          if (isNaN(dateB.getTime())) dateB = new Date(0);
        } catch (e) {
          dateB = new Date(0);
        }
        
        return dateA.getTime() - dateB.getTime(); // Ascending order
      });
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      // Return empty array instead of throwing to make this non-critical
      return [];
    }
  }
}

// Create and export a singleton instance
export const muntraService = new MuntraService(process.env.MUNTRA_API_KEY || '', process.env.MUNTRA_API_BASE_URL || '') 