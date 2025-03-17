export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'professor' | 'aluno' | 'polo' | 'parceiro'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: UserRole
          active: boolean
          email_verified: boolean
          created_at: string
          updated_at: string
          avatar_url?: string
          institution_id?: string
          course_id?: string
          registration_number?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          company_name: string | null
          cnpj: string | null
          website: string | null
          partnership_type: 'content' | 'technology' | 'infrastructure' | 'marketing' | null
          partnership_details?: Json
          commission_rate: number | null
          email_notifications: boolean
          push_notifications: boolean
          marketing_emails: boolean
          security_alerts: boolean
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: UserRole
          active?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
          avatar_url?: string
          institution_id?: string
          course_id?: string
          registration_number?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          company_name?: string | null
          cnpj?: string | null
          website?: string | null
          partnership_type?: 'content' | 'technology' | 'infrastructure' | 'marketing' | null
          partnership_details?: Json
          commission_rate?: number | null
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          security_alerts?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: UserRole
          active?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
          avatar_url?: string
          institution_id?: string
          course_id?: string
          registration_number?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          company_name?: string | null
          cnpj?: string | null
          website?: string | null
          partnership_type?: 'content' | 'technology' | 'infrastructure' | 'marketing' | null
          partnership_details?: Json
          commission_rate?: number | null
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          security_alerts?: boolean
        }
      }
      institutions: {
        Row: {
          id: string
          name: string
          type: 'university' | 'school' | 'company'
          active: boolean
          created_at: string
          updated_at: string
          logo_url?: string
          website?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
        }
        Insert: {
          id?: string
          name: string
          type: 'university' | 'school' | 'company'
          active?: boolean
          created_at?: string
          updated_at?: string
          logo_url?: string
          website?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'university' | 'school' | 'company'
          active?: boolean
          created_at?: string
          updated_at?: string
          logo_url?: string
          website?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
        }
      }
      courses: {
        Row: {
          id: string
          name: string
          description: string
          institution_id: string
          active: boolean
          created_at: string
          updated_at: string
          start_date?: string
          end_date?: string
          workload?: number
          price?: number
          image_url?: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          institution_id: string
          active?: boolean
          created_at?: string
          updated_at?: string
          start_date?: string
          end_date?: string
          workload?: number
          price?: number
          image_url?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          institution_id?: string
          active?: boolean
          created_at?: string
          updated_at?: string
          start_date?: string
          end_date?: string
          workload?: number
          price?: number
          image_url?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          details: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          details?: Json
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          course_id: string
          order: number
          content: Json
          published: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          course_id: string
          order: number
          content: Json
          published?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          course_id?: string
          order?: number
          content?: Json
          published?: boolean
        }
      }
      enrollments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          course_id: string
          status: string
          progress: number
          completed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          course_id: string
          status?: string
          progress?: number
          completed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          course_id?: string
          status?: string
          progress?: number
          completed_at?: string | null
        }
      }
      assessments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          course_id: string
          lesson_id: string | null
          questions: Json
          time_limit: number | null
          passing_score: number
          published: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          course_id: string
          lesson_id?: string | null
          questions: Json
          time_limit?: number | null
          passing_score: number
          published?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          course_id?: string
          lesson_id?: string | null
          questions?: Json
          time_limit?: number | null
          passing_score?: number
          published?: boolean
        }
      }
      assessment_submissions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          assessment_id: string
          answers: Json
          score: number
          passed: boolean
          feedback: Json | null
          time_spent: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          assessment_id: string
          answers: Json
          score: number
          passed: boolean
          feedback?: Json | null
          time_spent: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          assessment_id?: string
          answers?: Json
          score?: number
          passed?: boolean
          feedback?: Json | null
          time_spent?: number
        }
      }
      payments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          amount: number
          currency: string
          status: string
          payment_method: string
          payment_details: Json
          invoice_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          amount: number
          currency: string
          status: string
          payment_method: string
          payment_details: Json
          invoice_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          amount?: number
          currency?: string
          status?: string
          payment_method?: string
          payment_details?: Json
          invoice_id?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          amount: number
          currency: string
          status: string
          due_date: string
          items: Json
          paid_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          amount: number
          currency: string
          status: string
          due_date: string
          items: Json
          paid_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          amount?: number
          currency?: string
          status?: string
          due_date?: string
          items?: Json
          paid_at?: string | null
        }
      }
      referrals: {
        Row: {
          id: string
          partner_id: string
          name: string
          email: string
          phone: string
          type: 'student' | 'institution'
          notes: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          partner_id: string
          name: string
          email: string
          phone: string
          type: 'student' | 'institution'
          notes?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          partner_id?: string
          name?: string
          email?: string
          phone?: string
          type?: 'student' | 'institution'
          notes?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          updated_at?: string
        }
      }
      commissions: {
        Row: {
          id: string
          partner_id: string
          amount: number
          status: 'pending' | 'paid'
          payment_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          partner_id: string
          amount: number
          status?: 'pending' | 'paid'
          payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          partner_id?: string
          amount?: number
          status?: 'pending' | 'paid'
          payment_date?: string | null
          updated_at?: string
        }
      }
      materials: {
        Row: {
          id: string
          title: string
          description: string
          file_url: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          file_url: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          file_url?: string
          is_active?: boolean
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
  ai: {
    Tables: {
      conversations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          context: Json | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          context?: Json | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          context?: Json | null
          metadata?: Json | null
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          conversation_id: string
          role: string
          content: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          conversation_id: string
          role: string
          content: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          conversation_id?: string
          role?: string
          content?: string
          metadata?: Json | null
        }
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          total_conversations: number
          total_messages: number
          average_response_time: number | null
          topics: Json | null
          feedback_ratings: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          total_conversations?: number
          total_messages?: number
          average_response_time?: number | null
          topics?: Json | null
          feedback_ratings?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          total_conversations?: number
          total_messages?: number
          average_response_time?: number | null
          topics?: Json | null
          feedback_ratings?: Json | null
        }
      }
      feedback: {
        Row: {
          id: string
          created_at: string
          message_id: string
          user_id: string
          rating: number
          comment: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          message_id: string
          user_id: string
          rating: number
          comment?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          message_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
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
