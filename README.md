# 🤖💛 Aimee - Your Best Friend AI

**Aimee** is a Best Friend AI SMS system that provides warm, caring conversations via text messages. She remembers personal details, checks in proactively, and responds exactly like a real human best friend would.

## 🎉 **SYSTEM STATUS: 100% READY!** ✅

### 📱 **Ready to Text**
- **Phone Number**: `+1 (866) 812-4397`
- **Status**: Fully operational for inbound messages
- **Outbound**: Pending toll-free verification (1-2 business days)

### 🤖 **AI Configuration**
- **Current Mode**: Cost-effective testing (Deepseek API)
- **Production Mode**: Available (OpenAI GPT-4)
- **Cost Savings**: 95% during testing phase
- **Personality**: Natural, warm, human-like responses

---

## 🚀 **Quick Start**

### **Text Aimee Right Now!**
Send a message to **+1 (866) 812-4397** and start chatting!

Example conversations:
- "Hey Aimee! How are you?"
- "I'm having a rough day..."
- "Guess what happened at work today!"
- "What should I do this weekend?"

### **What Aimee Does**
- ✅ **Remembers everything** important you tell her
- ✅ **Responds naturally** like a real best friend
- ✅ **Checks in proactively** (once verification completes)
- ✅ **Celebrates your wins** and supports you through challenges
- ✅ **Asks follow-up questions** to show genuine interest

---

## 💰 **Cost Optimization**

### **Current Setup (Testing Mode)**
- **API**: Deepseek (~$0.0014/1K tokens)
- **Monthly Cost**: $2-5 for moderate usage
- **Savings**: 95% compared to GPT-4

### **Switch to Production Mode**
```bash
netlify env:set AI_MODE "production"
netlify deploy --prod
```

### **Monitor Costs**
```bash
node scripts/cost-monitor.js analyze
```

---

## 🔧 **System Architecture**

### **Components**
- **SMS**: Twilio integration with +1 (866) 812-4397
- **AI**: Smart dual system (Deepseek + OpenAI)
- **Database**: Supabase with memory system
- **Hosting**: Netlify serverless functions
- **Memory**: AI-powered extraction and context injection

### **Key Features**
- **Human-like Personality**: Responds like a real 20-something best friend
- **Smart Memory**: Remembers personal details, preferences, important dates
- **Proactive Messaging**: Morning check-ins, birthday reminders
- **Cost Efficient**: 95% savings during development
- **Production Ready**: Scalable infrastructure

---

## 🧪 **Testing & Monitoring**

### **Check System Status**
```bash
node scripts/twilio-status.js
```

### **Analyze Usage & Costs**
```bash
node scripts/cost-monitor.js analyze 30  # Last 30 days
```

### **Test SMS System**
```bash
node scripts/test-sms.js "+15551234567" "Test message"
```

---

## 📊 **Current Configuration**

### **Environment Variables** (Set in Netlify)
- ✅ `AI_MODE=testing` (Cost-effective Deepseek)
- ✅ `DEEPSEEK_API_KEY` (For testing)
- ✅ `OPENAI_API_KEY` (For production)
- ✅ `TWILIO_ACCOUNT_SID` 
- ✅ `TWILIO_AUTH_TOKEN`
- ✅ `TWILIO_PHONE_NUMBER=+18668124397`
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

### **Twilio Configuration**
- ✅ Phone number active: +1 (866) 812-4397
- ✅ Webhook configured: `https://roaring-kelpie-7c98f1.netlify.app/.netlify/functions/sms`
- ✅ SMS capabilities enabled
- 🔄 Toll-free verification submitted (pending approval)

---

## 🎯 **What's Next**

### **Immediate (Available Now)**
- ✅ **Receive & respond to texts** - Try it now!
- ✅ **Memory system working** - She'll remember your conversations
- ✅ **Human-like responses** - Natural, caring, genuine

### **After Verification (1-2 days)**
- 🔄 **Proactive messaging** - Morning check-ins, birthday reminders
- 🔄 **Outbound SMS** - Aimee can text you first

### **Production Mode (When Ready)**
- 🎯 Switch to OpenAI GPT-4 for highest quality responses
- 🎯 Full production deployment

---

## 💡 **Tips for Best Experience**

### **Conversation Starters**
- Share what's happening in your life
- Tell her about your interests and hobbies
- Mention important dates (birthdays, anniversaries)
- Ask for advice or support
- Share your wins and challenges

### **What She Remembers**
- Personal details (job, relationships, hobbies)
- Your preferences and interests  
- Important dates and events
- Current situations and concerns
- Your goals and aspirations

---

## 🚨 **Support & Troubleshooting**

### **Common Issues**
- **No response**: Check webhook configuration with `node scripts/twilio-status.js`
- **High costs**: Monitor usage with `node scripts/cost-monitor.js analyze`
- **AI quality**: Switch to production mode for best responses

### **Files to Check**
- `LAUNCH_STATUS.md` - Complete system status
- `scripts/twilio-status.js` - Twilio configuration check
- `scripts/cost-monitor.js` - Usage and cost analysis

---

## 🎉 **Ready to Chat!**

Your Aimee is **100% ready** to be your best friend! 

**Text her now**: `+1 (866) 812-4397`

She's waiting to meet you and start building a genuine friendship through text messages. 💛

---

**Built with**: Node.js, Twilio, OpenAI/Deepseek, Supabase, Netlify
**Phone**: +1 (866) 812-4397
**Status**: Production Ready ✅

# Aimee - AI Best Friend Web Platform

A cutting-edge web application for Aimee, the AI best friend that provides genuine companionship via SMS. This platform handles user registration, subscription management, conversation history, and integrates seamlessly with the existing Aimee SMS system.

## 🌟 Features

### 🎯 Core Features
- **Beautiful Landing Page** - Modern, responsive design with animations
- **User Registration & Authentication** - Phone verification system
- **Subscription Management** - Stripe integration with multiple plans
- **User Dashboard** - Conversation history, memories, and account management
- **SMS Integration** - Seamless connection to existing Aimee SMS system
- **Real-time Notifications** - Toast notifications for user actions

### 💎 Advanced Features
- **Phone Verification** - SMS-based verification for security
- **Memory System** - View what Aimee remembers about you
- **Billing Management** - Stripe webhooks for subscription lifecycle
- **Responsive Design** - Works perfectly on all devices
- **SEO Optimized** - Full metadata and OpenGraph support
- **Accessibility** - WCAG compliant design

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Lucide React** - Beautiful icons

### Backend & Infrastructure
- **Supabase** - Database and authentication
- **Stripe** - Payment processing and subscriptions
- **Twilio** - SMS messaging
- **Netlify** - Deployment and hosting
- **Vercel** - Alternative deployment option

### Integrations
- **Existing Aimee SMS System** - Seamless integration
- **Stripe Webhooks** - Real-time subscription updates
- **Twilio SMS** - Phone verification and messaging
- **Supabase Real-time** - Live data updates

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Twilio account

### 1. Clone and Install
```bash
git clone <repository-url>
cd aimee-web
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# App Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database Setup
```bash
# Run the migration
supabase db push
```

### 4. Stripe Setup
```bash
# Install Stripe CLI
# Create products and prices in Stripe dashboard
# Update price IDs in src/lib/stripe.ts
```

### 5. Run Development Server
```bash
npm run dev
```

## 🏗️ Project Structure

```
aimee-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── webhooks/      # Stripe webhooks
│   │   │   └── aimee/         # Aimee system integration
│   │   ├── dashboard/         # User dashboard
│   │   ├── signup/            # Registration flow
│   │   └── page.tsx           # Landing page
│   ├── lib/                   # Utilities and configurations
│   │   ├── supabase.ts        # Database client
│   │   ├── stripe.ts          # Payment processing
│   │   └── utils.ts           # Helper functions
│   └── components/            # Reusable UI components
├── supabase/
│   └── migrations/            # Database migrations
├── public/                    # Static assets
└── package.json
```

## 🔧 Configuration

### Stripe Products Setup
1. Create products in Stripe Dashboard:
   - Basic Plan: $14.99/month
   - Premium Plan: $24.99/month
2. Update price IDs in `src/lib/stripe.ts`
3. Configure webhook endpoints

### Supabase Setup
1. Run database migrations
2. Configure RLS policies
3. Set up authentication

### Twilio Integration
1. Configure phone number
2. Set up webhook endpoints
3. Verify toll-free number (if applicable)

## 🚀 Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Netlify Deployment
```bash
# Build the application
npm run build

# Deploy to Netlify
# Configure environment variables in Netlify dashboard
```

## 🔄 Integration with Existing Aimee System

The web application seamlessly integrates with your existing Aimee SMS system:

1. **User Registration** - New users are automatically initialized in the SMS system
2. **Phone Verification** - Verified users receive welcome messages from Aimee
3. **Conversation Sync** - Messages are synced between web dashboard and SMS
4. **Memory Integration** - Memories are shared between systems
5. **Subscription Status** - SMS system respects subscription status

## 📊 Features Overview

### Landing Page
- Hero section with animated conversation preview
- Feature highlights with icons and descriptions
- Pricing plans with feature comparison
- Customer testimonials
- Call-to-action sections

### Registration Flow
- Multi-step signup process
- Phone verification via SMS
- Plan selection
- Payment setup (Stripe)
- Welcome message integration

### User Dashboard
- Overview with quick stats
- Conversation history viewer
- Memory management
- Billing and subscription management
- Account settings

### Subscription Management
- Multiple pricing tiers
- Free trial support
- Stripe webhook integration
- Automatic status updates
- Billing history

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks

## 🔐 Security

- Phone verification for user registration
- Stripe secure payment processing
- Supabase Row Level Security (RLS)
- Environment variable protection
- CSRF protection
- Input validation with Zod

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Accessible design patterns
- Cross-browser compatibility

## 🎨 UI/UX Features

- Smooth animations with Framer Motion
- Toast notifications for user feedback
- Loading states and error handling
- Consistent design system
- Accessible color schemes

## 📈 Analytics & Monitoring

- User registration tracking
- Subscription conversion metrics
- Error monitoring
- Performance tracking
- User engagement analytics

## 🚨 Error Handling

- Comprehensive error boundaries
- User-friendly error messages
- Automatic retry mechanisms
- Graceful degradation
- Logging and monitoring

## 🔄 Future Enhancements

- [ ] Admin dashboard for user management
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] API rate limiting
- [ ] Advanced user segmentation
- [ ] A/B testing framework
- [ ] Multi-language support
- [ ] Advanced notification system

## 📞 Support

For technical support or questions:
- Email: support@aimee-ai.com
- Documentation: [docs.aimee-ai.com]
- GitHub Issues: [repository-issues-url]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Stripe for seamless payment processing
- Supabase for the backend infrastructure
- Twilio for SMS capabilities
- The open-source community

---

**Built with ❤️ for genuine AI companionship** 