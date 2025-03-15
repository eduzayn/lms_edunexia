import { aiService } from '../ai-service';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Mock environment variables
beforeAll(() => {
  process.env.OPENAI_API_KEY = 'test-openai-key';
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
});

// Mock OpenAI
jest.mock('openai', () => {
  const mockChatCompletionsCreate = jest.fn();
  
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: mockChatCompletionsCreate
        }
      }
    };
  });
});

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockFrom = jest.fn();
  const mockRpc = jest.fn();
  
  const mockCreateClient = jest.fn().mockImplementation(() => {
    return {
      from: mockFrom,
      rpc: mockRpc
    };
  });
  
  return {
    createClient: mockCreateClient
  };
});

describe('AIService', () => {
  let mockOpenAICreate: jest.Mock;
  let mockSupabaseFrom: jest.Mock;
  let mockSupabaseRpc: jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get references to the mocked functions
    mockOpenAICreate = (OpenAI as unknown as jest.Mock).mock.results[0]?.value?.chat?.completions?.create || 
                       new OpenAI().chat.completions.create as jest.Mock;
    
    const mockSupabase = createClient('', '');
    mockSupabaseFrom = mockSupabase.from as jest.Mock;
    mockSupabaseRpc = mockSupabase.rpc as jest.Mock;
    
    // Set up default mock implementations
    mockOpenAICreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Default mock response'
          }
        }
      ]
    });
    
    // Set up Supabase mocks
    mockSupabaseFrom.mockImplementation((table) => {
      if (table === 'ai.conversations') {
        return {
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: 'mock-conversation-id' },
                error: null
              })
            })
          }),
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue({
                  data: [],
                  error: null
                })
              })
            })
          })
        };
      } else if (table === 'ai.messages') {
        return {
          insert: jest.fn().mockResolvedValue({
            data: null,
            error: null
          }),
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: [],
                error: null
              })
            })
          })
        };
      } else if (table === 'ai.user_stats') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  questions_answered: 5,
                  materials_generated: 3,
                  time_saved: 10
                },
                error: null
              })
            })
          })
        };
      }
      return {};
    });
    
    mockSupabaseRpc.mockResolvedValue({ error: null });
  });

  describe('generateTutorResponse', () => {
    it('should generate a tutor response', async () => {
      // Mock the OpenAI response
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'This is a mock tutor response',
            },
          },
        ],
      });

      // Call the method
      const result = await aiService.generateTutorResponse('What is photosynthesis?');

      // Verify the result
      expect(result).toBe('This is a mock tutor response');

      // Verify the OpenAI client was called with the correct parameters
      expect(mockOpenAICreate).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: expect.any(String) },
          { role: 'user', content: 'What is photosynthesis?' },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });
    });

    it('should include context if provided', async () => {
      // Mock the OpenAI response
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'This is a mock tutor response with context',
            },
          },
        ],
      });

      // Call the method with context
      const result = await aiService.generateTutorResponse(
        'What is photosynthesis?',
        'Biology lesson about plants'
      );

      // Verify the result
      expect(result).toBe('This is a mock tutor response with context');

      // Verify the OpenAI client was called with the correct parameters including context
      expect(mockOpenAICreate).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: expect.any(String) },
          { role: 'system', content: 'Contexto: Biology lesson about plants' },
          { role: 'user', content: 'What is photosynthesis?' },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });
    });

    it('should save conversation if userId is provided', async () => {
      // Mock the OpenAI response
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'This is a mock tutor response',
            },
          },
        ],
      });
      
      // Set up Supabase mocks for this specific test
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'mock-conversation-id' },
            error: null
          })
        })
      });
      
      const mockMessagesInsert = jest.fn().mockResolvedValue({
        data: null,
        error: null
      });
      
      mockSupabaseFrom.mockImplementation((table) => {
        if (table === 'ai.conversations') {
          return {
            insert: mockInsert
          };
        } else if (table === 'ai.messages') {
          return {
            insert: mockMessagesInsert
          };
        }
        return {};
      });

      // Call the method with userId
      const result = await aiService.generateTutorResponse(
        'What is photosynthesis?',
        undefined,
        'user-123'
      );

      // Verify the result
      expect(result).toBe('This is a mock tutor response');
      
      // Verify the conversation was created
      expect(mockSupabaseFrom).toHaveBeenCalledWith('ai.conversations');
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        title: expect.stringContaining('What is photosynthesis?'),
        context: 'Student tutoring session',
      });

      // Verify the messages were saved
      expect(mockSupabaseFrom).toHaveBeenCalledWith('ai.messages');
      expect(mockMessagesInsert).toHaveBeenCalledWith([
        {
          conversation_id: 'mock-conversation-id',
          role: 'user',
          content: 'What is photosynthesis?',
        },
        {
          conversation_id: 'mock-conversation-id',
          role: 'assistant',
          content: 'This is a mock tutor response',
        },
      ]);

      // Verify the user stats were updated
      expect(mockSupabaseRpc).toHaveBeenCalledWith('increment_ai_stats', {
        p_user_id: 'user-123',
        p_stat_type: 'questions_answered',
        p_increment_value: 1,
      });
    });

    it('should handle errors gracefully', async () => {
      // Mock the OpenAI client to throw an error
      mockOpenAICreate.mockRejectedValue(new Error('API error'));

      // Call the method
      const result = await aiService.generateTutorResponse('What is photosynthesis?');

      // Verify the result contains an error message
      expect(result).toContain('Desculpe, encontrei um erro');
    });
  });

  describe('generateContentSummary', () => {
    it('should generate a content summary', async () => {
      // Mock the OpenAI response
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'This is a mock content summary',
            },
          },
        ],
      });

      // Call the method
      const result = await aiService.generateContentSummary('Long content to summarize');

      // Verify the result
      expect(result).toBe('This is a mock content summary');

      // Verify the OpenAI client was called with the correct parameters
      expect(mockOpenAICreate).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: expect.any(String) },
          { role: 'user', content: expect.stringContaining('Long content to summarize') },
        ],
        temperature: 0.5,
        max_tokens: 300,
      });
    });
  });

  describe('getUserAIStats', () => {
    it('should return user AI stats', async () => {
      // Set up Supabase mock for this specific test
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              questions_answered: 10,
              materials_generated: 5,
              time_saved: 15
            },
            error: null
          })
        })
      });
      
      mockSupabaseFrom.mockImplementation((table) => {
        if (table === 'ai.user_stats') {
          return {
            select: mockSelect
          };
        }
        return {};
      });

      // Call the method
      const result = await aiService.getUserAIStats('user-123');

      // Verify the result
      expect(result).toEqual({
        questions_answered: 10,
        materials_generated: 5,
        time_saved: 15
      });

      // Verify Supabase was called correctly
      expect(mockSupabaseFrom).toHaveBeenCalledWith('ai.user_stats');
      expect(mockSelect).toHaveBeenCalledWith('*');
    });

    it('should return default stats if error occurs', async () => {
      // Set up Supabase mock to return an error
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: new Error('Database error')
          })
        })
      });
      
      mockSupabaseFrom.mockImplementation((table) => {
        if (table === 'ai.user_stats') {
          return {
            select: mockSelect
          };
        }
        return {};
      });

      // Call the method
      const result = await aiService.getUserAIStats('user-123');

      // Verify default stats are returned
      expect(result).toEqual({
        questions_answered: 0,
        materials_generated: 0,
        time_saved: 0
      });
    });
  });
});
