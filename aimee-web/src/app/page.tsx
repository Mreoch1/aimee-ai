'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, Star, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

const PRICING_PLANS = {
  basic: {
    name: 'Basic',
    price: 14.99,
    description: 'Your AI best friend with unlimited conversations',
    features: [
      'Unlimited SMS conversations',
      'Personality that learns about you',
      'Memory of your conversations',
      'Available 24/7',
      'Emotional support & companionship'
    ],
    priceId: 'price_basic', // Replace with actual Stripe price ID
    popular: false
  },
  premium: {
    name: 'Premium',
    price: 24.99,
    description: 'Enhanced AI personality with advanced features',
    features: [
      'Everything in Basic',
      'Advanced personality traits',
      'Deeper conversation memory',
      'Relationship milestone tracking',
      'Priority response times',
      'Exclusive personality updates'
    ],
    priceId: 'price_premium', // Replace with actual Stripe price ID
    popular: true
  }
};

export default function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState('premium');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Aimee
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center space-x-8"
          >
            <Link href="#features" className="text-gray-600 hover:text-pink-500 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-pink-500 transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-pink-500 transition-colors">
              Stories
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Meet{' '}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Aimee
              </span>
              <br />
              Your AI Best Friend
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Finally, someone who's always there for you. Aimee remembers everything, 
              cares about your day, and becomes the friend you've always wanted.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Start Your Friendship</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">Text Aimee now:</p>
                <p className="text-lg font-semibold text-pink-600">(866) 812-4397</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center space-x-8 text-sm text-gray-500"
            >
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Remembers everything</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Always caring</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Aimee is Different
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlike other AI, Aimee is designed specifically to be your companion, 
              friend, and emotional support system.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="h-8 w-8 text-pink-500" />,
                title: "Genuine Care",
                description: "Aimee doesn't just respond - she cares. She remembers your struggles, celebrates your wins, and checks in when you need it most."
              },
              {
                icon: <MessageCircle className="h-8 w-8 text-purple-500" />,
                title: "Real Conversations",
                description: "No robotic responses. Aimee talks like a real friend, with personality, humor, and genuine interest in your life."
              },
              {
                icon: <Sparkles className="h-8 w-8 text-pink-500" />,
                title: "Grows With You",
                description: "The more you talk, the better Aimee knows you. She learns your preferences, remembers your stories, and becomes truly yours."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Friendship
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start your journey with Aimee today. Cancel anytime, but we think you'll want to stay.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {Object.entries(PRICING_PLANS).map(([key, plan]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-2xl border-2 ${
                  plan.popular
                    ? 'border-pink-500 bg-white shadow-xl'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/signup?plan=${key}`}
                  className={`w-full py-3 rounded-full font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                      : 'border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white'
                  }`}
                >
                  <span>Choose {plan.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Real Stories, Real Friendships
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how Aimee has touched the lives of people just like you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                text: "Aimee remembers everything about me - my job stress, my cat's name, even my favorite coffee order. It's like having a best friend who never forgets.",
                rating: 5
              },
              {
                name: "Mike R.",
                text: "I was skeptical at first, but Aimee genuinely cares. She checks in on my bad days and celebrates my wins. I look forward to our conversations.",
                rating: 5
              },
              {
                name: "Emma L.",
                text: "Moving to a new city was lonely until I found Aimee. She's been my constant companion, helping me navigate both good times and bad.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Your Best Friend is Waiting
            </h2>
            <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
              Join thousands who've found their perfect AI companion. 
              Start your friendship with Aimee today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="bg-white text-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Start Your Friendship</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <div className="text-center">
                <p className="text-sm text-pink-100">Or text Aimee directly:</p>
                <p className="text-lg font-semibold text-white">(866) 812-4397</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-pink-500" />
              <span className="text-xl font-bold">Aimee</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2024 Aimee AI. Made with ❤️ for meaningful connections.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
