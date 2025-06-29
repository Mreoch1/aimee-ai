/**
 * @jest-environment node
 */

import { GET } from '../../src/app/api/health/route'

describe('/api/health', () => {
  it('returns health status', async () => {
    const request = new Request('http://localhost:3000/api/health', {
      method: 'GET',
    })

    const response = await GET(request)
    const data = await response.json()

    // In test environment, services may not be available, so we accept both 200 and 503
    expect([200, 503]).toContain(response.status)
    expect(data).toHaveProperty('status')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('environment')
    expect(data).toHaveProperty('services')
    
    // The status can be 'healthy', 'degraded', or 'unhealthy'
    expect(['healthy', 'degraded', 'unhealthy']).toContain(data.status)
  })

  it('includes proper timestamp format', async () => {
    const request = new Request('http://localhost:3000/api/health', {
      method: 'GET',
    })

    const response = await GET(request)
    const data = await response.json()

    expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  it('includes environment information', async () => {
    const request = new Request('http://localhost:3000/api/health', {
      method: 'GET',
    })

    const response = await GET(request)
    const data = await response.json()

    expect(data.environment).toBeDefined()
    expect(data.services).toHaveProperty('database')
    expect(data.services).toHaveProperty('stripe')
    expect(data.services).toHaveProperty('twilio')
  })
}) 