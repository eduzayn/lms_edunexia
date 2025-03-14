import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

interface FeedbackRequest {
  studentId: string;
  activityId: string;
  submissionId: string;
  content: string;
  courseId?: string;
  lessonId?: string;
}

interface FeedbackResponse {
  id?: string;
  studentId: string;
  activityId: string;
  submissionId: string;
  feedback: string;
  score?: number;
  strengths: string[];
  improvements: string[];
  created_at?: string;
}

export class StudentFeedbackService {
  private static instance: StudentFeedbackService;
  private supabaseUrl: string;
  private supabaseKey: string;
  private openaiKey: string;
  private openai: OpenAI | null = null;

  private constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    this.openaiKey = process.env.OPENAI_API_KEY || '';
    
    if (this.openaiKey) {
      this.openai = new OpenAI({
        apiKey: this.openaiKey
      });
    }
  }

  public static getInstance(): StudentFeedbackService {
    if (!StudentFeedbackService.instance) {
      StudentFeedbackService.instance = new StudentFeedbackService();
    }
    return StudentFeedbackService.instance;
  }

  async generateFeedback(request: FeedbackRequest): Promise<{ success: boolean; data?: FeedbackResponse; error?: string }> {
    try {
      if (!this.openai) {
        return { 
          success: false, 
          error: 'OpenAI API key not configured' 
        };
      }

      // Get activity details to provide context for the AI
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      const { data: activityData, error: activityError } = await supabase
        .from('academic.activities')
        .select('*')
        .eq('id', request.activityId)
        .single();
      
      if (activityError) {
        console.error('Error fetching activity:', activityError);
        return { success: false, error: activityError.message };
      }

      // Generate AI feedback
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é a Prof. Ana, uma tutora de IA especializada em fornecer feedback construtivo para atividades discursivas. 
            Seu objetivo é ajudar os alunos a melhorar seu aprendizado através de feedback detalhado e personalizado.
            
            Ao analisar a resposta do aluno, considere:
            1. Precisão do conteúdo
            2. Clareza da expressão
            3. Organização das ideias
            4. Profundidade da análise
            5. Uso de evidências/exemplos
            
            Forneça feedback em português do Brasil, em tom encorajador mas honesto.
            Estruture sua resposta com:
            - Uma avaliação geral (2-3 frases)
            - 3-5 pontos fortes específicos
            - 2-4 áreas para melhoria com sugestões práticas
            - Uma nota sugerida de 0 a 10
            - Uma mensagem final de incentivo`
          },
          {
            role: 'user',
            content: `Atividade: ${activityData.title}
            
            Descrição da atividade: ${activityData.description || 'Não fornecida'}
            
            Resposta do aluno:
            ${request.content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      // Parse the AI response
      const aiResponse = response.choices[0]?.message?.content || '';
      
      // Extract score using regex (assuming the AI includes a score in the format "Nota: X/10")
      const scoreMatch = aiResponse.match(/Nota:?\s*(\d+(?:\.\d+)?)\s*\/\s*10/i);
      const score = scoreMatch ? parseFloat(scoreMatch[1]) : undefined;
      
      // Extract strengths and improvements
      const strengthsMatch = aiResponse.match(/Pontos fortes:(.*?)(?=Áreas para melhoria:|$)/s);
      const improvementsMatch = aiResponse.match(/Áreas para melhoria:(.*?)(?=Nota:|$)/s);
      
      const strengths = strengthsMatch 
        ? strengthsMatch[1].split(/\n-|\n\d+\./).filter(Boolean).map(s => s.trim())
        : [];
      
      const improvements = improvementsMatch
        ? improvementsMatch[1].split(/\n-|\n\d+\./).filter(Boolean).map(s => s.trim())
        : [];

      // Save feedback to database
      const feedbackData: FeedbackResponse = {
        studentId: request.studentId,
        activityId: request.activityId,
        submissionId: request.submissionId,
        feedback: aiResponse,
        score,
        strengths,
        improvements
      };

      const { data: savedFeedback, error: saveError } = await supabase
        .from('academic.ai_feedback')
        .insert(feedbackData)
        .select()
        .single();
      
      if (saveError) {
        console.error('Error saving feedback:', saveError);
        return { success: false, error: saveError.message };
      }
      
      return { success: true, data: savedFeedback as FeedbackResponse };
    } catch (error) {
      console.error('Error in generateFeedback:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async getFeedback(submissionId: string): Promise<{ success: boolean; data?: FeedbackResponse; error?: string }> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      const { data, error } = await supabase
        .from('academic.ai_feedback')
        .select('*')
        .eq('submissionId', submissionId)
        .single();
      
      if (error) {
        console.error('Error fetching feedback:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data: data as FeedbackResponse };
    } catch (error) {
      console.error('Error in getFeedback:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async listFeedbackByStudent(studentId: string): Promise<{ success: boolean; data?: FeedbackResponse[]; error?: string }> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      const { data, error } = await supabase
        .from('academic.ai_feedback')
        .select('*')
        .eq('studentId', studentId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error listing feedback:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data: data as FeedbackResponse[] };
    } catch (error) {
      console.error('Error in listFeedbackByStudent:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}

export const studentFeedbackService = StudentFeedbackService.getInstance();
