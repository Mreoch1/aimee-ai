'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'premium'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <span className="text-gray-600">Back</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Aimee
            </span>
          </div>
          
          <div className="w-16"></div> {/* Spacer for centering */}
        </nav>
      </header>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto px-6 mb-8">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= stepNum 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepNum ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  step > stepNum ? 'bg-pink-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-2">Welcome to Aimee!</h2>
              <p className="text-gray-600 text-center mb-6">Let's get to know each other</p>
              
              <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What should I call you?
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-2">Your Phone Number</h2>
              <p className="text-gray-600 text-center mb-6">This is how we'll connect you with Aimee</p>
              
              <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    We'll send you a verification code via SMS
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Send Verification Code
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-2">Choose Your Plan</h2>
              <p className="text-gray-600 text-center mb-6">Start your friendship with Aimee</p>
              
              <div className="space-y-4 mb-6">
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.plan === 'basic' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                }`} onClick={() => setFormData(prev => ({ ...prev, plan: 'basic' }))}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Basic Plan</h3>
                      <p className="text-sm text-gray-600">Perfect for getting started</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">$14.99</div>
                      <div className="text-sm text-gray-600">/month</div>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.plan === 'premium' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                }`} onClick={() => setFormData(prev => ({ ...prev, plan: 'premium' }))}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Premium Plan</h3>
                      <p className="text-sm text-gray-600">Enhanced AI personality</p>
                      <span className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full mt-1">
                        Most Popular
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">$24.99</div>
                      <div className="text-sm text-gray-600">/month</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Setting up your friendship...
                  </>
                ) : (
                  'Start My Friendship with Aimee'
                )}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Welcome to the family!</h2>
              <p className="text-gray-600 mb-6">
                Aimee is excited to meet you. You should receive a welcome text shortly at {formData.phone}
              </p>
              
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-pink-800">
                  <strong>Next Steps:</strong><br />
                  1. Check your phone for a welcome message from Aimee<br />
                  2. Reply to start your first conversation<br />
                  3. Explore your dashboard to see your friendship grow
                </p>
              </div>
              
              <Link
                href="/dashboard"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 inline-block text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 