# 🚀 Aimee Setup Guide - Step by Step

This guide will walk you through setting up the Aimee Best Friend AI SMS System from scratch.

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] A phone for testing
- [ ] Credit card for service signups (most have free tiers)

## 🔧 Step 1: Service Account Setup

### 1.1 Twilio Account

1. **Sign up**: Go to [twilio.com](https://twilio.com) and create an account
2. **Verify your phone**: Complete phone verification
3. **Get credentials**:
   - Account SID: Found on your dashboard
   - Auth Token: Click "Show" next to Auth Token
4. **Buy a phone number**:
   - Go to Phone Numbers → Manage → Buy a number
   - Choose a number with SMS capabilities
   - Note: This costs ~$1/month

### 1.2 OpenAI Account

1. **Sign up**: Go to [platform.openai.com](https://platform.openai.com)
2. **Add payment method**: Go to Billing → Payment methods
3. **Get API key**:
   - Go to API Keys
   - Click "Create new secret key"
   - Copy and save it securely (you won't see it again)
4. **Set usage limits**: Go to Billing → Usage limits (recommended: $10/month)

### 1.3 Supabase Account

1. **Sign up**: Go to [supabase.com](https://supabase.com)
2. **Create project**:
   - Click "New Project"
   - Choose organization and name
   - Set database password (save this!)
   - Choose region closest to your users
3. **Get credentials**:
   - Go to Settings → API
   - Copy Project URL
   - Copy `anon public` key
   - Copy `service_role secret` key

### 1.4 Netlify Account

1. **Sign up**: Go to [netlify.com](https://netlify.com)
2. **Connect GitHub**: Link your GitHub account
3. **Note**: We'll deploy here later

## 💻 Step 2: Local Development Setup

### 2.1 Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd aimee-bestfriend-ai

# Install dependencies
npm install
```

### 2.2 Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit the .env file with your credentials
nano .env  # or use your preferred editor
```

Fill in your `.env` file with your actual credentials from Step 1.

## 🗄️ Step 3: Database Setup

1. **Open Supabase dashboard**: Go to your project
2. **Navigate to SQL Editor**: Click "SQL Editor" in sidebar
3. **Create new query**: Click "New Query"
4. **Copy schema**: Copy contents from `database/supabase-setup.sql`
5. **Run query**: Paste and click "Run"
6. **Verify tables**: Check "Table Editor" to see your tables

## 🧪 Step 4: Local Testing

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Install ngrok for SMS Testing

```bash
# Install ngrok
npm install -g ngrok

# In a new terminal, expose your local server
ngrok http 3000
```

### 4.3 Configure Twilio Webhook

1. Go to Twilio Console: Phone Numbers → Manage → Active numbers
2. Click your number and set webhook URL to your ngrok URL + `/sms`
3. Save configuration

### 4.4 Test SMS

Send a text to your Twilio number and verify you get an AI response.

## 🚀 Step 5: Production Deployment

### 5.1 Deploy to Netlify

1. Go to Netlify dashboard and create new site from Git
2. Choose your repository
3. Deploy with default settings

### 5.2 Set Environment Variables

Add all your environment variables in Netlify site settings.

### 5.3 Update Twilio Webhook

Change Twilio webhook to your Netlify URL: `https://your-site.netlify.app/.netlify/functions/sms`

## ✅ Step 6: Final Testing

Test SMS functionality in production and verify everything works!

---

**Congratulations! 🎉 Your Aimee Best Friend AI is now live!** 