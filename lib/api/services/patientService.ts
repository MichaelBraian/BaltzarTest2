import { apiClient } from '../client'
import { config } from '@/lib/config'
import { muntraService } from './muntraService'

// Define patient types
export interface Patient {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  medicalHistory?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface PatientVerificationResponse {
  exists: boolean
  patientId?: string
}

export interface PatientDetailsResponse {
  patient: Patient
}

// Patient service class
export class PatientService {
  // Verify if a patient exists by email
  async verifyPatient(email: string): Promise<PatientVerificationResponse> {
    try {
      // First try to verify with Muntra
      const muntraVerification = await muntraService.verifyPatient(email)
      return muntraVerification
    } catch (error) {
      console.error('Muntra verification failed, falling back to local verification:', error)
      // Fallback to local verification if Muntra fails
      const response = await apiClient.post<PatientVerificationResponse>(
        config.api.endpoints.verifyPatient,
        { email }
      )

      if (response.error) {
        throw new Error(response.error)
      }

      return response.data as PatientVerificationResponse
    }
  }

  // Get patient details by ID
  async getPatientDetails(patientId: string): Promise<Patient> {
    try {
      // First try to get details from Muntra
      const muntraPatient = await muntraService.getPatientDetails(patientId)
      // Add required fields that Muntra API doesn't provide
      return {
        ...muntraPatient,
        phone: muntraPatient.phoneNumberCell || muntraPatient.phoneNumberHome || muntraPatient.phoneNumberWork,
        createdAt: new Date().toISOString(), // Use current time as fallback
        updatedAt: new Date().toISOString(), // Use current time as fallback
      } as Patient
    } catch (error) {
      console.error('Muntra get details failed, falling back to local details:', error)
      // Fallback to local details if Muntra fails
      const response = await apiClient.get<PatientDetailsResponse>(
        `${config.api.endpoints.getPatientDetails}/${patientId}`
      )

      if (response.error) {
        throw new Error(response.error)
      }

      return (response.data as PatientDetailsResponse).patient
    }
  }

  // Update patient profile
  async updatePatientProfile(patientId: string, data: Partial<Patient>): Promise<Patient> {
    try {
      // First try to update in Muntra
      const muntraPatient = await muntraService.updatePatientProfile(patientId, data)
      // Add required fields that Muntra API doesn't provide
      return {
        ...muntraPatient,
        phone: muntraPatient.phoneNumberCell || muntraPatient.phoneNumberHome || muntraPatient.phoneNumberWork,
        createdAt: new Date().toISOString(), // Use current time as fallback
        updatedAt: new Date().toISOString(), // Use current time as fallback
      } as Patient
    } catch (error) {
      console.error('Muntra update failed, falling back to local update:', error)
      // Fallback to local update if Muntra fails
      const response = await apiClient.put<PatientDetailsResponse>(
        `${config.api.endpoints.getPatientDetails}/${patientId}`,
        { patient: data }
      )

      if (response.error) {
        throw new Error(response.error)
      }

      return (response.data as PatientDetailsResponse).patient
    }
  }
}

// Create and export a singleton instance
export const patientService = new PatientService() 