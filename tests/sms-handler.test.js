const { handleIncomingSMS, generateBestFriendResponse } = require('../src/sms-handler');

// Mock services for testing
const mockServices = {
  twilioClient: {
    messages: {
      create: jest.fn()
    }
  },
  openai: {
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  },
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ data: null, error: null })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({ data: [], error: null }))
          }))
        }))
      }))
    }))
  }
};

describe('SMS Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleIncomingSMS', () => {
    const mockReq = {
      body: {
        From: '+1234567890',
        Body: 'Hello Aimee!',
        To: '+18668124397',
        MessageSid: 'SM123456'
      }
    };

    const mockRes = {
      type: jest.fn(() => mockRes),
      send: jest.fn()
    };

    it('should process incoming SMS and return TwiML response', async () => {
      // Mock OpenAI response
      mockServices.openai.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: 'Hey there! Nice to meet you! 😊'
          }
        }]
      });

      const result = await handleIncomingSMS(mockReq, mockRes, mockServices);

      expect(result).toContain('<Response>');
      expect(result).toContain('<Message>');
      expect(result).toContain('Hey there! Nice to meet you! 😊');
    });

    it('should handle errors gracefully', async () => {
      // Mock OpenAI error
      mockServices.openai.chat.completions.create.mockRejectedValue(new Error('API Error'));

      const result = await handleIncomingSMS(mockReq, mockRes, mockServices);

      expect(result).toContain('<Response>');
      expect(result).toContain('Sorry, I\'m having a moment!');
    });
  });

  describe('generateBestFriendResponse', () => {
    it('should generate appropriate response', async () => {
      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{
                message: {
                  content: 'That sounds amazing! Tell me more about it 😊'
                }
              }]
            })
          }
        }
      };

      const response = await generateBestFriendResponse(
        mockOpenAI,
        'I just got a new job!',
        [],
        '+1234567890'
      );

      expect(response).toBe('That sounds amazing! Tell me more about it 😊');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: "gpt-4",
        messages: expect.any(Array),
        temperature: 0.8,
        max_tokens: 300,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      });
    });

    it('should handle long responses by truncating', async () => {
      const longResponse = 'a'.repeat(2000);
      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{
                message: {
                  content: longResponse
                }
              }]
            })
          }
        }
      };

      const response = await generateBestFriendResponse(
        mockOpenAI,
        'Tell me a long story',
        [],
        '+1234567890'
      );

      expect(response.length).toBeLessThanOrEqual(1503); // 1500 + "..."
      expect(response).toEndWith('...');
    });

    it('should return fallback message on error', async () => {
      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('API Error'))
          }
        }
      };

      const response = await generateBestFriendResponse(
        mockOpenAI,
        'Hello',
        [],
        '+1234567890'
      );

      expect(response).toBe("Hey! I'm having a little tech hiccup. Give me a sec and text me again? 💛");
    });
  });
});

module.exports = {
  mockServices
}; 