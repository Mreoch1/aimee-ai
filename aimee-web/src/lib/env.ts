// Environment variable validation
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_APP_URL'
] as const

const optionalEnvVars = [
  'OPENAI_API_KEY',
  'DEEPSEEK_API_KEY',
  'SENTRY_DSN'
] as const

type RequiredEnvVar = typeof requiredEnvVars[number]
type OptionalEnvVar = typeof optionalEnvVars[number]

class EnvValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvValidationError'
  }
}

function validateEnvVars() {
  const missing: string[] = []
  const invalid: string[] = []

  // Check required variables
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar]
    if (!value) {
      missing.push(envVar)
    } else {
      // Validate specific formats
      switch (envVar) {
        case 'SUPABASE_URL':
          if (!value.startsWith('https://') || !value.includes('.supabase.co')) {
            invalid.push(`${envVar} (must be a valid Supabase URL)`)
          }
          break
        case 'TWILIO_PHONE_NUMBER':
          if (!value.startsWith('+')) {
            invalid.push(`${envVar} (must start with +)`)
          }
          break
        case 'NEXT_PUBLIC_APP_URL':
          try {
            new URL(value)
          } catch {
            invalid.push(`${envVar} (must be a valid URL)`)
          }
          break
      }
    }
  }

  if (missing.length > 0) {
    throw new EnvValidationError(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }

  if (invalid.length > 0) {
    throw new EnvValidationError(
      `Invalid environment variables: ${invalid.join(', ')}`
    )
  }
}

// Validate on import (server-side only)
if (typeof window === 'undefined') {
  try {
    validateEnvVars()
  } catch (error) {
    console.warn('Environment validation warning:', error instanceof Error ? error.message : error)
    // Don't fail build for missing env vars in development
    if (process.env.NODE_ENV === 'production') {
      throw error
    }
  }
}

export function getEnvVar(name: RequiredEnvVar): string
export function getEnvVar(name: OptionalEnvVar): string | undefined
export function getEnvVar(name: RequiredEnvVar | OptionalEnvVar): string | undefined {
  return process.env[name]
}

export { EnvValidationError } 