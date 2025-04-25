export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          created_at: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          date_of_birth: string | null
          medical_history: Json | null
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          date_of_birth?: string | null
          medical_history?: Json | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          date_of_birth?: string | null
          medical_history?: Json | null
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          start_time: string
          end_time: string
          status: string
          type: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          start_time: string
          end_time: string
          status: string
          type: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          start_time?: string
          end_time?: string
          status?: string
          type?: string
          notes?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 