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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          active: boolean
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
          active?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          active?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          details?: Json | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          instructor_id: string
          published: boolean
          cover_image: string | null
          duration: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          instructor_id: string
          published?: boolean
          cover_image?: string | null
          duration?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          instructor_id?: string
          published?: boolean
          cover_image?: string | null
          duration?: number | null
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
