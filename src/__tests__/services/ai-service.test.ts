import { AIService, aiService } from '@/lib/services/ai-service';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }));
});

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    rpc: jest.fn().mockReturnThis()
  };
  
  return {
    createClient: jest.fn(() => mockSupabase)
  };
});

describe('AIService', () => {
  let mockOpenAI: jest.Mocked<OpenAI>;
  let mockSupabase: ReturnType<typeof createClient>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup OpenAI mock
    mockOpenAI = new OpenAI() as jest.Mocked<OpenAI>;
    mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Mock response content'
          }
        }
      ]
    });
    
    // Setup Supabase mock
    mockSupabase = createClient('', '');
    (mockSupabase.from as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.select as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.insert as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.eq as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.single as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.order as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.limit as jest.Mock).mockReturnValue(mockSupabase);
    (mockSupabase.rpc as jest.Mock).mockReturnValue(mockSupabase);
  });
  
  describe('getInstance', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = aiService;
      const instance2 = aiService;
      
      expect(instance1).toBe(instance2);
    });
  });
  
  describe('generateTutorResponse', () => {
    it('should generate a tutor response successfully', async () => {
      (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'This is a helpful tutor response'
            }
          }
        ]
      });
      
      const response = await aiService.generateTutorResponse('How do I solve this math problem?');
      
      expect(response).toBe('This is a helpful tutor response');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4',
          messages: expect.arrayContaining([
            { role: 'system', content: expect.any(String) },
            { role: 'user', content: 'How do I solve this math problem?' }
          ]),
        })
      );
    });
    
    it('should include context when provided', async () => {
      await aiService.generateTutorResponse('How do I solve this?', 'Math problem context');
      
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            { role: 'system', content: expect.any(String) },
            { role: 'system', content: 'Contexto: Math problem context' },
            { role: 'user', content: 'How do I solve this?' }
          ]),
        })
      );
    });
    
    it('should save conversation when userId is provided', async () => {
      (mockSupabase.insert as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          single: jest.fn().mockResolvedValueOnce({
            data: { id: 'conv-123' },
            error: null
          })
        })
      });
      
      (mockSupabase.insert as jest.Mock).mockReturnValueOnce({
        error: null
      });
      
      await aiService.generateTutorResponse('How do I solve this?', undefined, 'user-123');
      
      // Check if conversation was saved
      expect(mockSupabase.from).toHaveBeenCalledWith('ai.conversations');
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-123',
          title: expect.any(String),
          context: expect.any(String)
        })
      );
      
      // Check if messages were saved
      expect(mockSupabase.from).toHaveBeenCalledWith('ai.messages');
    });
    
    it('should handle errors gracefully', async () => {
      (mockOpenAI.chat.completions.create as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      
      const response = await aiService.generateTutorResponse('How do I solve this?');
      
      expect(response).toContain('Desculpe, encontrei um erro');
    });
  });
  
  describe('generateContentSummary', () => {
    it('should generate a content summary successfully', async () => {
      (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'This is a summary of the content'
            }
          }
        ]
      });
      
      const response = await aiService.generateContentSummary('Long content to summarize');
      
      expect(response).toBe('This is a summary of the content');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4',
          messages: expect.arrayContaining([
            { role: 'system', content: expect.any(String) },
            { role: 'user', content: expect.stringContaining('Long content to summarize') }
          ]),
        })
      );
    });
    
    it('should handle errors gracefully', async () => {
      (mockOpenAI.chat.completions.create as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      
      const response = await aiService.generateContentSummary('Content to summarize');
      
      expect(response).toContain('Desculpe, encontrei um erro');
    });
  });
  
  describe('generateQuizQuestions', () => {
    it('should generate quiz questions successfully', async () => {
      const mockQuestions = [
        {
          pergunta: 'What is 2+2?',
          opcoes: ['3', '4', '5', '6'],
          respostaCorreta: 1
        }
      ];
      
      (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({ perguntas: mockQuestions })
            }
          }
        ]
      });
      
      const response = await aiService.generateQuizQuestions('Math', 'easy', 1);
      
      expect(response).toEqual(mockQuestions);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4',
          response_format: { type: 'json_object' }
        })
      );
    });
    
    it('should handle errors gracefully', async () => {
      (mockOpenAI.chat.completions.create as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      
      const response = await aiService.generateQuizQuestions('Math', 'easy');
      
      expect(response).toEqual([]);
    });
  });
  
  describe('generateStudyMaterial', () => {
    it('should generate study material successfully', async () => {
      (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'This is study material content'
            }
          }
        ]
      });
      
      const response = await aiService.generateStudyMaterial('Physics', 'beginner');
      
      expect(response).toBe('This is study material content');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4',
          messages: expect.arrayContaining([
            { role: 'system', content: expect.any(String) },
            { role: 'user', content: expect.stringContaining('iniciante') }
          ]),
        })
      );
    });
    
    it('should handle errors gracefully', async () => {
      (mockOpenAI.chat.completions.create as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      
      const response = await aiService.generateStudyMaterial('Physics', 'beginner');
      
      expect(response).toContain('Desculpe, encontrei um erro');
    });
  });
  
  describe('generateMindMap', () => {
    it('should generate a mind map successfully', async () => {
      const mockMindMap = {
        mapa: {
          nos: [
            { id: 'node1', texto: 'Main Topic', filhos: ['node2', 'node3'] },
            { id: 'node2', texto: 'Subtopic 1', filhos: [] },
            { id: 'node3', texto: 'Subtopic 2', filhos: [] }
          ],
          conexoes: [
            { origem: 'node1', destino: 'node2' },
            { origem: 'node1', destino: 'node3' }
          ]
        }
      };
      
      (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(mockMindMap)
            }
          }
        ]
      });
      
      const response = await aiService.generateMindMap('Learning');
      
      expect(response).toEqual(mockMindMap);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4',
          response_format: { type: 'json_object' }
        })
      );
    });
    
    it('should handle errors gracefully', async () => {
      (mockOpenAI.chat.completions.create as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      
      const response = await aiService.generateMindMap('Learning');
      
      expect(response).toEqual({ mapa: { nos: [], conexoes: [] } });
    });
  });
  
  describe('analyzeStudentPerformance', () => {
    it('should analyze student performance successfully', async () => {
      (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'This is performance analysis'
            }
          }
        ]
      });
      
      const performanceData = { score: 85, completedLessons: 10 };
      const response = await aiService.analyzeStudentPerformance(performanceData);
      
      expect(response).toBe('This is performance analysis');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4',
          messages: expect.arrayContaining([
            { role: 'system', content: expect.any(String) },
            { role: 'user', content: expect.stringContaining(JSON.stringify(performanceData)) }
          ]),
        })
      );
    });
    
    it('should handle errors gracefully', async () => {
      (mockOpenAI.chat.completions.create as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      
      const response = await aiService.analyzeStudentPerformance({ score: 85 });
      
      expect(response).toContain('Desculpe, encontrei um erro');
    });
  });
  
  describe('saveConversation', () => {
    it('should save a conversation successfully', async () => {
      (mockSupabase.insert as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          single: jest.fn().mockResolvedValueOnce({
            data: { id: 'conv-123' },
            error: null
          })
        })
      });
      
      (mockSupabase.insert as jest.Mock).mockReturnValueOnce({
        error: null
      });
      
      const messages = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there' }
      ];
      
      const result = await aiService.saveConversation('user-123', messages);
      
      expect(result).toEqual({ id: 'conv-123' });
      expect(mockSupabase.from).toHaveBeenCalledWith('ai.conversations');
      expect(mockSupabase.from).toHaveBeenCalledWith('ai.messages');
    });
    
    it('should throw an error if conversation creation fails', async () => {
      (mockSupabase.insert as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          single: jest.fn().mockResolvedValueOnce({
            data: null,
            error: { message: 'Database error' }
          })
        })
      });
      
      const messages = [
        { role: 'user', content: 'Hello' }
      ];
      
      await expect(aiService.saveConversation('user-123', messages)).rejects.toThrow();
    });
  });
  
  describe('getConversation', () => {
    it('should get a conversation successfully', async () => {
      const mockMessages = [
        { id: 'msg-1', role: 'user', content: 'Hello', created_at: '2025-01-01' },
        { id: 'msg-2', role: 'assistant', content: 'Hi there', created_at: '2025-01-01' }
      ];
      
      (mockSupabase.select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnValueOnce({
          order: jest.fn().mockResolvedValueOnce({
            data: mockMessages,
            error: null
          })
        })
      });
      
      const result = await aiService.getConversation('conv-123');
      
      expect(result).toEqual(mockMessages);
      expect(mockSupabase.from).toHaveBeenCalledWith('ai.messages');
      expect(mockSupabase.eq).toHaveBeenCalledWith('conversation_id', 'conv-123');
    });
    
    it('should throw an error if fetching fails', async () => {
      (mockSupabase.select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnValueOnce({
          order: jest.fn().mockResolvedValueOnce({
            data: null,
            error: { message: 'Database error' }
          })
        })
      });
      
      await expect(aiService.getConversation('conv-123')).rejects.toThrow();
    });
  });
  
  describe('getUserConversations', () => {
    it('should get user conversations successfully', async () => {
      const mockConversations = [
        { id: 'conv-1', title: 'Conversation 1', created_at: '2025-01-01' },
        { id: 'conv-2', title: 'Conversation 2', created_at: '2025-01-02' }
      ];
      
      (mockSupabase.select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnValueOnce({
          order: jest.fn().mockReturnValueOnce({
            limit: jest.fn().mockResolvedValueOnce({
              data: mockConversations,
              error: null
            })
          })
        })
      });
      
      const result = await aiService.getUserConversations('user-123', 2);
      
      expect(result).toEqual(mockConversations);
      expect(mockSupabase.from).toHaveBeenCalledWith('ai.conversations');
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(mockSupabase.limit).toHaveBeenCalledWith(2);
    });
    
    it('should throw an error if fetching fails', async () => {
      (mockSupabase.select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnValueOnce({
          order: jest.fn().mockReturnValueOnce({
            limit: jest.fn().mockResolvedValueOnce({
              data: null,
              error: { message: 'Database error' }
            })
          })
        })
      });
      
      await expect(aiService.getUserConversations('user-123')).rejects.toThrow();
    });
  });
  
  describe('updateUserAIStats', () => {
    it('should update user AI stats successfully', async () => {
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        error: null
      });
      
      await aiService.updateUserAIStats('user-123', 'questions_answered');
      
      expect(mockSupabase.rpc).toHaveBeenCalledWith('increment_ai_stats', {
        p_user_id: 'user-123',
        p_stat_type: 'questions_answered',
        p_increment_value: 1
      });
    });
    
    it('should handle errors gracefully', async () => {
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        error: { message: 'Database error' }
      });
      
      // Should not throw an error
      await expect(aiService.updateUserAIStats('user-123', 'questions_answered')).resolves.not.toThrow();
    });
  });
  
  describe('getUserAIStats', () => {
    it('should get user AI stats successfully', async () => {
      const mockStats = {
        questions_answered: 10,
        materials_generated: 5,
        time_saved: 120
      };
      
      (mockSupabase.select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnValueOnce({
          single: jest.fn().mockResolvedValueOnce({
            data: mockStats,
            error: null
          })
        })
      });
      
      const result = await aiService.getUserAIStats('user-123');
      
      expect(result).toEqual(mockStats);
      expect(mockSupabase.from).toHaveBeenCalledWith('ai.user_stats');
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-123');
    });
    
    it('should return default stats if fetching fails', async () => {
      (mockSupabase.select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnValueOnce({
          single: jest.fn().mockResolvedValueOnce({
            data: null,
            error: { message: 'Database error' }
          })
        })
      });
      
      const result = await aiService.getUserAIStats('user-123');
      
      expect(result).toEqual({
        questions_answered: 0,
        materials_generated: 0,
        time_saved: 0
      });
    });
  });
});
