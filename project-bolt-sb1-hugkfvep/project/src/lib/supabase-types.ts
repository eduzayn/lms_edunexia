export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'student' | 'teacher' | 'polo_manager' | 'partner' | 'operator'
          active: boolean
          email_verified: boolean
          last_sign_in: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: 'admin' | 'student' | 'teacher' | 'polo_manager' | 'partner' | 'operator'
          active?: boolean
          email_verified?: boolean
          last_sign_in?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'student' | 'teacher' | 'polo_manager' | 'partner' | 'operator'
          active?: boolean
          email_verified?: boolean
          last_sign_in?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      permissions: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          module: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          module: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          module?: string
          created_at?: string
        }
      }
      role_permissions: {
        Row: {
          id: string
          role: string
          permission_id: string
          created_at: string
        }
        Insert: {
          id?: string
          role: string
          permission_id: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: string
          permission_id?: string
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity: string
          entity_id: string | null
          details: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity: string
          entity_id?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity?: string
          entity_id?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
  }
}