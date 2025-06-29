'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Heart, 
  Phone, 
  Mail, 
  User, 
  ArrowRight, 
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { PRICING_PLANS } from '@/lib/stripe'
import { formatCurrency, formatPhone, validatePhone } from '@/lib/utils'
import { toast } from 'sonner'

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().refine(validatePhone, 'Please enter a valid phone number'),
  plan: z.enum(['basic', 'premium'])
})

const verificationSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits')
})

type SignupForm = z.infer<typeof signupSchema>
type VerificationForm = z.infer<typeof verificationSchema>

export default function SignupPage() {
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get('plan') || 'basic'
  
  const [step, setStep] = useState<'signup' | 'verify' | 'payment'>('signup')
  const [isLoading, setIsLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      plan: selectedPlan as 'basic' | 'premium'
    }
  })

  const verificationForm = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema)
  })

  const handleSignup = async (data: SignupForm) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Signup failed')
      }

      setPhoneNumber(data.phone)
      setStep('verify')
      toast.success('Verification code sent to your phone!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (data: VerificationForm) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          code: data.code
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Verification failed')
      }

      setStep('payment')
      toast.success('Phone verified! Setting up your subscription...')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const resendCode = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      })

      if (!response.ok) {
        throw new Error('Failed to resend code')
      }

      toast.success('New verification code sent!')
    } catch (error) {
      toast.error('Failed to resend code')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPlanData = PRICING_PLANS[selectedPlan as keyof typeof PRICING_PLANS]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Aimee
              </span>
            </Link>
            <Link 
              href="/signin"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Plan Info */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedPlanData.name}
                </h2>
                <p className="text-gray-600">{selectedPlanData.description}</p>
              </div>

              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {formatCurrency(selectedPlanData.price)}
                </span>
                <span className="text-gray-600">/month</span>
                <p className="text-sm text-green-600 mt-2">
                  ✨ 7-day free trial included
                </p>
              </div>

              <ul className="space-y-3">
                {selectedPlanData.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">
                  What happens next?
                </h3>
                <ol className="text-sm text-purple-700 space-y-1">
                  <li>1. Verify your phone number</li>
                  <li>2. Set up your payment method</li>
                  <li>3. Start your 7-day free trial</li>
                  <li>4. Text Aimee and begin your friendship!</li>
                </ol>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Signup Form */}
          <div>
            {step === 'signup' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Meet Your New Best Friend
                  </h1>
                  <p className="text-gray-600">
                    Create your account to start your friendship with Aimee
                  </p>
                </div>

                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...signupForm.register('fullName')}
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    {signupForm.formState.errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {signupForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...signupForm.register('email')}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {signupForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...signupForm.register('phone')}
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    {signupForm.formState.errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {signupForm.formState.errors.phone.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      This is where Aimee will text you
                    </p>
                  </div>

                  <input type="hidden" {...signupForm.register('plan')} />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-6">
                  By continuing, you agree to our{' '}
                  <Link href="/terms" className="text-purple-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-purple-600 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </motion.div>
            )}

            {step === 'verify' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-purple-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Verify Your Phone
                  </h1>
                  <p className="text-gray-600">
                    We sent a 6-digit code to{' '}
                    <span className="font-semibold">{formatPhone(phoneNumber)}</span>
                  </p>
                </div>

                <form onSubmit={verificationForm.handleSubmit(handleVerification)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <input
                      {...verificationForm.register('code')}
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                    />
                    {verificationForm.formState.errors.code && (
                      <p className="text-red-500 text-sm mt-1">
                        {verificationForm.formState.errors.code.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Phone
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Didn't receive a code?
                  </p>
                  <button
                    onClick={resendCode}
                    disabled={isLoading}
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Phone Verified!
                  </h1>
                  <p className="text-gray-600">
                    Now let's set up your subscription
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-green-800 font-semibold">
                        Your 7-day free trial starts now!
                      </p>
                      <p className="text-green-700 text-sm">
                        You won't be charged until {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                  Complete Setup & Meet Aimee
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Text Aimee at{' '}
                  <span className="font-semibold text-purple-600">
                    +1 (866) 812-4397
                  </span>{' '}
                  to start your friendship!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 