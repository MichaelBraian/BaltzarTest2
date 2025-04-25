import { apiClient } from '../client'
import { config } from '@/lib/config'

// Muntra API Types based on the API documentation
export interface MuntraPatient {
  id: string
  patientNumber: string
  socialSecurityNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  phoneNumberWork?: string
  phoneNumberHome?: string
  phoneNumberCell?: string
  email: string
  clinicName: string
  status: string
  deleted: boolean
}

export interface MuntraVerificationResponse {
  exists: boolean
  patientId?: string
  patient?: MuntraPatient
}

export interface MuntraPatientDetailsResponse {
  patient: MuntraPatient
}

// Muntra service class
export class MuntraService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.MUNTRA_API_BASE_URL || ''
    this.apiKey = process.env.MUNTRA_API_KEY || ''
  }

  private getHeaders() {
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
          patientNumber: patient.attributes.patient_number,
          socialSecurityNumber: patient.attributes.social_security_number,
          firstName: patient.attributes.first_name,
          lastName: patient.attributes.last_name,
          dateOfBirth: patient.attributes.date_of_birth,
          phoneNumberWork: patient.attributes.phone_number_work,
          phoneNumberHome: patient.attributes.phone_number_home,
          phoneNumberCell: patient.attributes.phone_number_cell,
          email: patient.attributes.e_mail_address,
          clinicName: patient.attributes.clinic_name,
          status: patient.attributes.status,
          deleted: patient.attributes.deleted,
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
  async getPatientDetails(patientId: string): Promise<MuntraPatient> {
    try {
      // First try to get the patient using the search-patients endpoint
      const response = await fetch(`${this.baseUrl}/api/search-patients?query=${encodeURIComponent(patientId)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Muntra API error: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Find the patient with the matching ID
      const patients = data.data || []
      const patient = patients.find((p: any) => p.id === patientId)
      
      if (!patient) {
        throw new Error(`Patient with ID ${patientId} not found`)
      }
      
      // Map the Muntra patient data to our interface
      return {
        id: patient.id,
        patientNumber: patient.attributes.patient_number,
        socialSecurityNumber: patient.attributes.social_security_number,
        firstName: patient.attributes.first_name,
        lastName: patient.attributes.last_name,
        dateOfBirth: patient.attributes.date_of_birth,
        phoneNumberWork: patient.attributes.phone_number_work,
        phoneNumberHome: patient.attributes.phone_number_home,
        phoneNumberCell: patient.attributes.phone_number_cell,
        email: patient.attributes.e_mail_address,
        clinicName: patient.attributes.clinic_name,
        status: patient.attributes.status,
        deleted: patient.attributes.deleted,
      }
    } catch (error) {
      console.error('Muntra get patient details error:', error)
      throw error
    }
  }

  // Update patient profile in Muntra
  // Note: This is a placeholder as the API docs don't show a direct patient update endpoint
  // You may need to use a different endpoint or approach based on Muntra's requirements
  async updatePatientProfile(patientId: string, data: Partial<MuntraPatient>): Promise<MuntraPatient> {
    try {
      // This is a placeholder - you'll need to implement the actual update logic
      // based on Muntra's API requirements
      console.warn('Patient update not implemented - check Muntra API documentation for the correct endpoint')
      
      // For now, just return the patient details
      return this.getPatientDetails(patientId)
    } catch (error) {
      console.error('Muntra update patient error:', error)
      throw error
    }
  }
}

// Create and export a singleton instance
export const muntraService = new MuntraService() 