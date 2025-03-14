import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

export class AIService {
  private static instance: AIService;
  private openai: OpenAI;
  private supabase: ReturnType<typeof createClient>;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateTutorResponse(prompt: string, context?: string, userId?: string): Promise<string> {
    try {
      const messages = [
        { role: 'system', content: 'Você é um tutor educacional prestativo. Forneça informações claras, concisas e precisas para ajudar os alunos a aprender.' },
      ];

      if (context) {
        messages.push({ role: 'system', content: `Contexto: ${context}` });
      }

      messages.push({ role: 'user', content: prompt });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: 0.7,
        max_tokens: 500,
      });

      const responseContent = response.choices[0]?.message?.content || 'Nenhuma resposta gerada.';
      
      // If userId is provided, save the conversation
      if (userId) {
        try {
          const conversationMessages = [
            { role: 'user', content: prompt },
            { role: 'assistant', content: responseContent }
          ];
          await this.saveConversation(userId, conversationMessages);
          
          // Update user AI stats
          await this.updateUserAIStats(userId, 'questions_answered');
        } catch (error) {
          console.error('Error saving conversation:', error);
          // Continue even if saving fails
        }
      }
      
      return responseContent;
    } catch (error) {
      console.error('Erro ao gerar resposta do tutor:', error);
      return 'Desculpe, encontrei um erro ao gerar uma resposta. Por favor, tente novamente mais tarde.';
    }
  }

  async generateContentSummary(content: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Você é um resumidor de conteúdo educacional. Crie resumos concisos e informativos de conteúdo educacional.' },
          { role: 'user', content: `Por favor, resuma o seguinte conteúdo educacional:\n\n${content}` }
        ] as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: 0.5,
        max_tokens: 300,
      });

      return response.choices[0]?.message?.content || 'Nenhum resumo gerado.';
    } catch (error) {
      console.error('Erro ao gerar resumo de conteúdo:', error);
      return 'Desculpe, encontrei um erro ao gerar um resumo. Por favor, tente novamente mais tarde.';
    }
  }

  async generateQuizQuestions(topic: string, difficulty: 'easy' | 'medium' | 'hard', count: number = 5): Promise<any[]> {
    try {
      const difficultyMap = {
        'easy': 'fácil',
        'medium': 'médio',
        'hard': 'difícil'
      };
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Você é um gerador de questionários educacionais. Crie perguntas de quiz envolventes e precisas com respostas de múltipla escolha.' },
          { role: 'user', content: `Gere ${count} perguntas de múltipla escolha de nível ${difficultyMap[difficulty]} sobre ${topic}. Formate a resposta como um array JSON com objetos contendo "pergunta", "opcoes" (array de 4 escolhas) e "respostaCorreta" (índice da opção correta).` }
        ] as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content || '{"perguntas": []}';
      const parsedContent = JSON.parse(content);
      return parsedContent.perguntas || [];
    } catch (error) {
      console.error('Erro ao gerar perguntas de quiz:', error);
      return [];
    }
  }

  async generateStudyMaterial(topic: string, level: 'beginner' | 'intermediate' | 'advanced'): Promise<string> {
    try {
      const levelMap = {
        'beginner': 'iniciante',
        'intermediate': 'intermediário',
        'advanced': 'avançado'
      };
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Você é um especialista em educação. Crie materiais de estudo informativos, bem estruturados e educacionalmente sólidos.' },
          { role: 'user', content: `Crie um material de estudo de nível ${levelMap[level]} sobre ${topic}. Inclua uma introdução, principais conceitos, exemplos e um resumo.` }
        ] as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: 0.6,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || 'Nenhum material de estudo gerado.';
    } catch (error) {
      console.error('Erro ao gerar material de estudo:', error);
      return 'Desculpe, encontrei um erro ao gerar o material de estudo. Por favor, tente novamente mais tarde.';
    }
  }

  async generateMindMap(topic: string): Promise<{ mapa: { nos: Array<{ id: string; texto: string; filhos: string[] }>; conexoes: Array<{ origem: string; destino: string }> } }> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Você é um especialista em criar mapas mentais educacionais. Crie estruturas de mapa mental claras e organizadas para tópicos educacionais.' },
          { role: 'user', content: `Crie um mapa mental para o tópico "${topic}". Formate a resposta como um objeto JSON com uma estrutura de nós e conexões. Cada nó deve ter um "id", "texto" e "filhos" (array de IDs de nós filhos).` }
        ] as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: 0.6,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content || '{"mapa": {"nos": [], "conexoes": []}}';
      return JSON.parse(content);
    } catch (error) {
      console.error('Erro ao gerar mapa mental:', error);
      return { mapa: { nos: [], conexoes: [] } };
    }
  }

  async analyzeStudentPerformance(performanceData: Record<string, unknown>): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Você é um analista educacional. Forneça insights úteis e recomendações baseadas em dados de desempenho de alunos.' },
          { role: 'user', content: `Analise os seguintes dados de desempenho do aluno e forneça insights e recomendações:\n\n${JSON.stringify(performanceData)}` }
        ] as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: 0.5,
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content || 'Nenhuma análise gerada.';
    } catch (error) {
      console.error('Erro ao analisar desempenho do aluno:', error);
      return 'Desculpe, encontrei um erro ao analisar o desempenho. Por favor, tente novamente mais tarde.';
    }
  }

  async saveConversation(userId: string, messages: Array<{ role: string; content: string }>): Promise<{ id: string }> {
    try {
      // Create a new conversation
      const { data: conversation, error: conversationError } = await this.supabase
        .from('ai.conversations')
        .insert({
          user_id: userId,
          title: messages[0]?.content.substring(0, 50) + '...',
          context: 'Student tutoring session',
        })
        .select('id')
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw new Error('Failed to create conversation');
      }

      // Save all messages
      const messagesWithConversationId = messages.map(msg => ({
        conversation_id: conversation.id,
        role: msg.role,
        content: msg.content,
      }));

      const { error: messagesError } = await this.supabase
        .from('ai.messages')
        .insert(messagesWithConversationId);

      if (messagesError) {
        console.error('Error saving messages:', messagesError);
        throw new Error('Failed to save messages');
      }

      return { id: conversation.id as string };
    } catch (error) {
      console.error('Error in saveConversation:', error);
      throw error;
    }
  }

  async getConversation(conversationId: string): Promise<Array<{ role: string; content: string; created_at: string; conversation_id: string }>> {
    try {
      const { data, error } = await this.supabase
        .from('ai.messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at');

      if (error) {
        console.error('Error fetching conversation:', error);
        throw new Error('Failed to fetch conversation');
      }

      return (data || []) as Array<{ id: string; title: string; created_at: string; user_id?: string }>;
    } catch (error) {
      console.error('Error in getConversation:', error);
      throw error;
    }
  }

  async getUserConversations(userId: string, limit = 10): Promise<Array<{ id: string; title: string; created_at: string; user_id?: string }>> {
    try {
      const { data, error } = await this.supabase
        .from('ai.conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user conversations:', error);
        throw new Error('Failed to fetch user conversations');
      }

      return (data || []) as Array<{ id: string; title: string; created_at: string; user_id?: string }>;
    } catch (error) {
      console.error('Error in getUserConversations:', error);
      throw error;
    }
  }

  async updateUserAIStats(userId: string, statType: 'questions_answered' | 'materials_generated' | 'time_saved'): Promise<void> {
    try {
      // Call the Supabase stored procedure to increment the user's AI stats
      const { error } = await this.supabase.rpc('increment_ai_stats', {
        p_user_id: userId,
        p_stat_type: statType,
        p_increment_value: 1
      });

      if (error) {
        console.error('Error updating user AI stats:', error);
        // Don't throw here, just log the error
      }
    } catch (error) {
      console.error('Error in updateUserAIStats:', error);
      // Don't throw here, just log the error
    }
  }

  async getUserAIStats(userId: string): Promise<{ questions_answered: number; materials_generated: number; time_saved: number }> {
    try {
      const { data, error } = await this.supabase
        .from('ai.user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user AI stats:', error);
        return {
          questions_answered: 0,
          materials_generated: 0,
          time_saved: 0
        };
      }

      return (data || {
        questions_answered: 0,
        materials_generated: 0,
        time_saved: 0
      }) as { questions_answered: number; materials_generated: number; time_saved: number };
    } catch (error) {
      console.error('Error in getUserAIStats:', error);
      return {
        questions_answered: 0,
        materials_generated: 0,
        time_saved: 0
      };
    }
  }
}

export const aiService = AIService.getInstance();
