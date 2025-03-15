import { aiService } from '../ai-service';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Mock the OpenAI and Supabase clients
jest.mock('openai');
jest.mock('@supabase/supabase-js');

describe('AIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTutorResponse', () => {
    it('should generate a tutor response', async () => {
      // Mock the OpenAI response
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'This is a mock tutor response',
            },
          },
        ],
      };

      // Set up the mock implementation
      (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockResponse);

      // Call the method
      const result = await aiService.generateTutorResponse('What is photosynthesis?');

      // Verify the result
      expect(result).toBe('This is a mock tutor response');

      // Verify the OpenAI client was called with the correct parameters
      expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalledWith({
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
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'This is a mock tutor response with context',
            },
          },
        ],
      };

      // Set up the mock implementation
      (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockResponse);

      // Call the method with context
      const result = await aiService.generateTutorResponse(
        'What is photosynthesis?',
        'Biology lesson about plants'
      );

      // Verify the result
      expect(result).toBe('This is a mock tutor response with context');

      // Verify the OpenAI client was called with the correct parameters including context
      expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalledWith({
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
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'This is a mock tutor response',
            },
          },
        ],
      };

      // Set up the mock implementation
      (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockResponse);
      
      // Mock the Supabase response for conversation creation
      const mockConversationResponse = {
        data: { id: 'mock-conversation-id' },
        error: null,
      };
      
      // Mock the Supabase response for message insertion
      const mockMessagesResponse = {
        data: null,
        error: null,
      };
      
      // Set up the Supabase mock implementations
      (createClient as jest.Mock).mockReturnValue({
        from: jest.fn().mockImplementation((table) => {
          if (table === 'ai.conversations') {
            return {
              insert: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue(mockConversationResponse),
                }),
              }),
            };
          } else if (table === 'ai.messages') {
            return {
              insert: jest.fn().mockResolvedValue(mockMessagesResponse),
            };
          }
          return {};
        }),
        rpc: jest.fn().mockResolvedValue({ error: null }),
      });

      // Call the method with userId
      const result = await aiService.generateTutorResponse(
        'What is photosynthesis?',
        undefined,
        'user-123'
      );

      // Verify the result
      expect(result).toBe('This is a mock tutor response');

      // Verify the conversation was saved
      expect(createClient).toHaveBeenCalled();
      
      // Use a different approach to verify the calls
      const mockSupabase = createClient();
      expect(mockSupabase.from).toHaveBeenCalledWith('ai.conversations');
      
      // Verify the insert was called with correct data
      const insertCall = mockSupabase.from('ai.conversations').insert;
      expect(insertCall).toHaveBeenCalledWith({
        user_id: 'user-123',
        title: expect.stringContaining('What is photosynthesis?'),
        context: 'Student tutoring session',
      });

      // Verify the messages were saved
      expect(mockSupabase.from).toHaveBeenCalledWith('ai.messages');
      
      // Verify the message insert was called with correct data
      const messagesInsert = mockSupabase.from('ai.messages').insert;
      expect(messagesInsert).toHaveBeenCalledWith([
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
      expect(mockSupabase.rpc).toHaveBeenCalledWith('increment_ai_stats', {
        p_user_id: 'user-123',
        p_stat_type: 'questions_answered',
        p_increment_value: 1,
      });
    });

    it('should handle errors gracefully', async () => {
      // Mock the OpenAI client to throw an error
      (OpenAI.prototype.chat.completions.create as jest.Mock).mockRejectedValue(
        new Error('API error')
      );

      // Call the method
      const result = await aiService.generateTutorResponse('What is photosynthesis?');

      // Verify the result contains an error message
      expect(result).toContain('Desculpe, encontrei um erro');
    });
  });

  // Add more tests for other AIService methods...
});
