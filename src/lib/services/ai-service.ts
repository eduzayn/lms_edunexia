import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

export class AIService {
  private static instance: AIService;
  private openai: OpenAI;
  private supabase: ReturnType<typeof createClient>;

  constructor() {
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
        { role: 'system', content: 'Você é a Prof. Ana, uma tutora educacional prestativa. Forneça informações claras, concisas e precisas para ajudar os alunos a aprender. Seu tom é amigável, encorajador e profissional. Você sempre se refere a si mesma como "Prof. Ana" e nunca como "IA" ou "assistente".' },
      ];

      if (context) {
        messages.push({ role: 'system', content: `Contexto da conversa: ${context}` });
      }

      messages.push({ role: 'user', content: prompt });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as any,
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

  async generateStudyMaterial(prompt: string, context?: string, type: string = 'summary'): Promise<string> {
    try {
      let systemPrompt = 'Você é a Prof. Ana, uma especialista em educação. ';
      
      switch (type) {
        case 'summary':
          systemPrompt += 'Crie um resumo conciso e bem estruturado sobre o tópico discutido. Use linguagem clara e organize as informações em seções lógicas.';
          break;
        case 'mindmap':
          systemPrompt += 'Crie um mapa mental textual sobre o tópico discutido. Use um formato hierárquico com o conceito principal no centro, ramificando para subtópicos e detalhes. Use hífens e indentação para mostrar a hierarquia.';
          break;
        case 'flashcards':
          systemPrompt += 'Crie um conjunto de flashcards (pergunta e resposta) sobre o tópico discutido. Cada flashcard deve ter uma pergunta clara e uma resposta concisa. Separe cada flashcard com uma linha em branco.';
          break;
        case 'explanation':
          systemPrompt += 'Forneça uma explicação detalhada sobre o tópico discutido. Inclua definições, exemplos, aplicações práticas e conexões com outros conceitos relevantes.';
          break;
        default:
          systemPrompt += 'Crie um material de estudo útil sobre o tópico discutido.';
      }

      const messages = [
        { role: 'system', content: systemPrompt },
      ];

      if (context) {
        messages.push({ role: 'system', content: `Contexto da conversa: ${context}` });
      }

      messages.push({ role: 'user', content: prompt });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || 'Nenhum material gerado.';
    } catch (error) {
      console.error('Erro ao gerar material de estudo:', error);
      return 'Desculpe, encontrei um erro ao gerar o material de estudo. Por favor, tente novamente mais tarde.';
    }
  }

  async generateQuiz(topic: string, difficulty: string = 'medium', numberOfQuestions: number = 5): Promise<string> {
    try {
      const prompt = `Crie um quiz sobre "${topic}" com ${numberOfQuestions} questões de múltipla escolha de dificuldade ${difficulty}. Cada questão deve ter 4 alternativas, com apenas uma correta. Indique a resposta correta para cada questão.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é a Prof. Ana, uma especialista em educação que cria quizzes educacionais de alta qualidade.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || 'Nenhum quiz gerado.';
    } catch (error) {
      console.error('Erro ao gerar quiz:', error);
      return 'Desculpe, encontrei um erro ao gerar o quiz. Por favor, tente novamente mais tarde.';
    }
  }

  async analyzePerformance(answers: string[], correctAnswers: string[]): Promise<string> {
    try {
      if (answers.length !== correctAnswers.length) {
        return 'Erro: O número de respostas não corresponde ao número de respostas corretas.';
      }

      let correctCount = 0;
      const analysis: string[] = [];

      for (let i = 0; i < answers.length; i++) {
        if (answers[i] === correctAnswers[i]) {
          correctCount++;
          analysis.push(`Questão ${i + 1}: Correta`);
        } else {
          analysis.push(`Questão ${i + 1}: Incorreta. Resposta correta: ${correctAnswers[i]}`);
        }
      }

      const percentage = (correctCount / answers.length) * 100;
      const overallAnalysis = `Você acertou ${correctCount} de ${answers.length} questões (${percentage.toFixed(2)}%).`;

      const prompt = `
        Análise de desempenho:
        ${overallAnalysis}
        
        Detalhes:
        ${analysis.join('\n')}
        
        Por favor, forneça uma análise detalhada do desempenho, destacando áreas de força e sugestões para melhorar nas áreas de fraqueza.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é a Prof. Ana, uma especialista em educação que fornece análises de desempenho construtivas e úteis.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content || 'Nenhuma análise gerada.';
    } catch (error) {
      console.error('Erro ao analisar desempenho:', error);
      return 'Desculpe, encontrei um erro ao analisar o desempenho. Por favor, tente novamente mais tarde.';
    }
  }

  async saveConversation(userId: string, messages: any[]): Promise<{ id: string }> {
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

  async getConversation(conversationId: string): Promise<any[]> {
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

      return data || [];
    } catch (error) {
      console.error('Error in getConversation:', error);
      throw error;
    }
  }

  async getUserConversations(userId: string, limit: number = 10): Promise<any[]> {
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

      return data || [];
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

  async getUserAIStats(userId: string): Promise<any> {
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

      return data || {
        questions_answered: 0,
        materials_generated: 0,
        time_saved: 0
      };
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
