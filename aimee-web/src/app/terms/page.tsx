import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Aimee
              </span>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> January 1, 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Welcome to Aimee</h2>
            <p className="text-gray-700 mb-6">
              These Terms of Service ("Terms") govern your use of Aimee AI's companion service ("Service") 
              operated by Aimee AI ("us", "we", or "our"). By accessing or using our Service, you agree 
              to be bound by these Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By creating an account or using our Service, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these 
              Terms, please do not use our Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Description of Service</h2>
            <p className="text-gray-700 mb-6">
              Aimee is an AI-powered companion service that provides personalized conversations via SMS. 
              Our Service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>24/7 AI companion conversations</li>
              <li>Personalized memory and relationship building</li>
              <li>Emotional support and companionship</li>
              <li>Web dashboard for managing your experience</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Eligibility</h2>
            <p className="text-gray-700 mb-6">
              You must be at least 13 years old to use our Service. If you are under 18, you must have 
              parental consent. By using our Service, you represent and warrant that you meet these 
              age requirements.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Account Registration</h2>
            <p className="text-gray-700 mb-4">To use our Service, you must:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update any changes to your information</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Subscription and Billing</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Subscription Plans</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Basic Plan:</strong> $14.99/month - Core AI companion features</li>
              <li><strong>Premium Plan:</strong> $24.99/month - Enhanced personality and features</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Billing Terms</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Subscriptions are billed monthly in advance</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>We may change pricing with 30 days notice</li>
              <li>Failed payments may result in service suspension</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 mb-4">You agree not to use our Service to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Violate any laws or regulations</li>
              <li>Harass, abuse, or harm others</li>
              <li>Share illegal, harmful, or inappropriate content</li>
              <li>Attempt to hack, disrupt, or damage our systems</li>
              <li>Use our Service for commercial purposes without permission</li>
              <li>Impersonate others or provide false information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">AI Companion Limitations</h2>
            <p className="text-gray-700 mb-4">Important disclaimers about our AI service:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Not a Human:</strong> Aimee is an AI and does not replace human relationships</li>
              <li><strong>Not Medical Advice:</strong> Our Service does not provide medical, legal, or professional advice</li>
              <li><strong>Emergency Situations:</strong> Do not rely on Aimee for emergency situations - contact appropriate authorities</li>
              <li><strong>AI Limitations:</strong> AI responses may sometimes be inaccurate or inappropriate</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 mb-6">
              Our Service, including all content, features, and functionality, is owned by Aimee AI and 
              protected by copyright, trademark, and other intellectual property laws. You retain ownership 
              of content you provide, but grant us license to use it to provide our Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Privacy and Data</h2>
            <p className="text-gray-700 mb-6">
              Your privacy is important to us. Our collection and use of your information is governed by 
              our Privacy Policy, which is incorporated into these Terms by reference.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Service Availability</h2>
            <p className="text-gray-700 mb-6">
              While we strive for 24/7 availability, we do not guarantee uninterrupted service. We may 
              temporarily suspend service for maintenance, updates, or other operational reasons.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Termination</h2>
            <p className="text-gray-700 mb-4">Either party may terminate your account:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>By You:</strong> Cancel anytime through your account settings</li>
              <li><strong>By Us:</strong> For violation of these Terms or other legitimate reasons</li>
              <li><strong>Effect:</strong> Upon termination, your access ends and data may be deleted</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Disclaimers</h2>
            <p className="text-gray-700 mb-6">
              OUR SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
              EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND 
              NON-INFRINGEMENT.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, AIMEE AI SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF OUR SERVICE.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Indemnification</h2>
            <p className="text-gray-700 mb-6">
              You agree to indemnify and hold harmless Aimee AI from any claims, damages, or expenses 
              arising from your use of our Service or violation of these Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These Terms are governed by the laws of [Your State/Country]. Any disputes will be resolved 
              in the courts of [Your Jurisdiction].
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              We may update these Terms from time to time. We will notify you of material changes via 
              email or through our Service. Continued use after changes constitutes acceptance.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-6">
              Questions about these Terms? Contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@aimee-ai.com</p>
              <p className="text-gray-700 mb-2"><strong>Phone:</strong> (866) 812-4397</p>
              <p className="text-gray-700"><strong>Address:</strong> Aimee AI Legal Team, [Your Address]</p>
            </div>

            <div className="mt-8 p-6 bg-pink-50 border border-pink-200 rounded-lg">
              <h3 className="text-lg font-semibold text-pink-800 mb-2">Thank You</h3>
              <p className="text-pink-700">
                Thank you for choosing Aimee as your AI companion. We're committed to providing you with 
                a safe, supportive, and meaningful friendship experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 