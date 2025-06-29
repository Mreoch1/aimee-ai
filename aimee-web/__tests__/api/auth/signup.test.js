/**
 * @jest-environment node
 */

import { POST } from '../../../src/app/api/auth/signup/route'

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: jest.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null }))
    }))
  }))
}))

// Mock Twilio
jest.mock('twilio', () => {
  return jest.fn(() => ({
    messages: {
      create: jest.fn(() => Promise.resolve({ sid: 'test-message-sid' }))
    }
  }))
})

describe('/api/auth/signup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('validates required fields', async () => {
    const request = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('required')
  })

  it('validates phone number format', async () => {
    const request = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: 'invalid-phone',
        plan: 'free',
        step: 'verify-phone'
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('phone')
  })

  it('validates email format', async () => {
    const request = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid-email',
        phone: '+1234567890',
        plan: 'free',
        step: 'verify-phone'
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('email')
  })

  it('handles rate limiting', async () => {
    // Make multiple requests rapidly
    const requests = Array.from({ length: 10 }, () => 
      new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': '192.168.1.1'
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          plan: 'free',
          step: 'verify-phone'
        }),
      })
    )

    const responses = await Promise.all(requests.map(req => POST(req)))
    
    // At least one should be rate limited
    const rateLimited = responses.some(res => res.status === 429)
    expect(rateLimited).toBe(true)
  })
}) 