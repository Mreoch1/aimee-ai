import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> January 1, 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Commitment to Your Privacy</h2>
            <p className="text-gray-700 mb-6">
              At Aimee AI, your privacy and trust are fundamental to everything we do. This Privacy Policy explains how we collect, use, protect, and share your information when you use our AI companion service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Information You Provide</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Account Information:</strong> Name, email address, phone number</li>
              <li><strong>Conversation Data:</strong> All messages you send to and receive from Aimee</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe</li>
              <li><strong>Personal Preferences:</strong> Settings and customizations you make</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Information We Automatically Collect</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Usage Data:</strong> How you interact with our service</li>
              <li><strong>Device Information:</strong> Basic device and browser information</li>
              <li><strong>Log Data:</strong> Service usage logs and error reports</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Provide Service:</strong> Deliver personalized AI conversations and remember your preferences</li>
              <li><strong>Improve Experience:</strong> Enhance Aimee's personality and conversation quality</li>
              <li><strong>Account Management:</strong> Process payments, send notifications, and provide support</li>
              <li><strong>Safety & Security:</strong> Protect against abuse and ensure service reliability</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Information Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">
              <strong>We do not sell your personal information.</strong> We only share your information in these limited circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Service Providers:</strong> Trusted partners who help us operate our service (like Twilio for SMS, Stripe for payments)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly agree to sharing</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Encryption in transit and at rest</li>
              <li>Regular security audits and monitoring</li>
              <li>Limited access controls and employee training</li>
              <li>Secure data centers and infrastructure</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correct:</strong> Update or correct inaccurate information</li>
              <li><strong>Delete:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your conversation history</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Retention</h2>
            <p className="text-gray-700 mb-6">
              We retain your information for as long as your account is active or as needed to provide services. 
              Conversation data is kept to maintain Aimee's memory of your relationship. You can request deletion 
              at any time through your account settings or by contacting us.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 mb-6">
              Our service is not intended for children under 13. We do not knowingly collect personal information 
              from children under 13. If you believe we have collected information from a child under 13, 
              please contact us immediately.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">International Users</h2>
            <p className="text-gray-700 mb-6">
              Our service is operated from the United States. If you are accessing our service from outside 
              the US, please be aware that your information may be transferred to, stored, and processed in 
              the United States where our servers are located.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by email or through our service. Your continued use of our service after changes become effective 
              constitutes acceptance of the revised policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@aimee-ai.com</p>
              <p className="text-gray-700 mb-2"><strong>Phone:</strong> (866) 812-4397</p>
              <p className="text-gray-700"><strong>Address:</strong> Aimee AI Privacy Team, [Your Address]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 