# 🚨 CRITICAL PRODUCTION FIXES GUIDE

## 1. 🔴 IMMEDIATE: Fix Supabase Database (BLOCKING ALL FUNCTIONALITY)

### Problem
Your current Supabase URL `https://ijccgyjgdlldodipciop.supabase.co` returns 404 - the project doesn't exist.

### Solution
You need to create a new Supabase project:

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign in to your account**
3. **Click "New Project"**
4. **Fill in project details:**
   - Project Name: "Aimee AI Production"
   - Database Password: Generate a strong password and SAVE IT
   - Region: Choose closest to your users
5. **Wait for project creation (2-3 minutes)**
6. **Get your new credentials:**
   - Go to Settings → API
   - Copy: Project URL, anon key, service_role key

### Update Environment Variables
Replace in your `.env.local`:
```bash
SUPABASE_URL=YOUR_NEW_PROJECT_URL
SUPABASE_ANON_KEY=YOUR_NEW_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_NEW_SERVICE_ROLE_KEY
```

### Run Database Migrations
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Push your schema
supabase db push
```

---

## 2. 🔴 CRITICAL: Set Up Error Monitoring (Sentry)

### Install Sentry
```bash
npm install @sentry/nextjs
```

### Configure Sentry
Create `sentry.client.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

Create `sentry.server.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Get Sentry DSN
1. Go to [sentry.io](https://sentry.io)
2. Create account/project
3. Get DSN from project settings
4. Add to environment variables

---

## 3. 🔴 CRITICAL: API Testing Setup

### Install Testing Dependencies
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### Create Jest Configuration
Create `jest.config.js`:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

### Create Basic API Tests
Create `__tests__/api/health.test.js`:
```javascript
import { createMocks } from 'node-mocks-http';
import handler from '../../src/app/api/health/route';

describe('/api/health', () => {
  it('returns 200 with status OK', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      status: 'OK',
      timestamp: expect.any(String),
    });
  });
});
```

---

## 4. 🔴 CRITICAL: HTTPS Certificate & Production Security

### Environment Variables for Production
Add to your production environment:
```bash
# Security
NODE_ENV=production
NEXTAUTH_SECRET=your-very-long-random-string-here

# Supabase (NEW PROJECT)
SUPABASE_URL=https://your-new-project.supabase.co
SUPABASE_ANON_KEY=your-new-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-new-service-role-key

# Sentry
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Stripe (Production Keys)
STRIPE_SECRET_KEY=sk_live_your-live-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-live-key
STRIPE_WEBHOOK_SECRET=whsec_your-live-webhook-secret
```

### SSL Certificate
- **Netlify**: Automatically provides SSL certificates
- **Vercel**: Automatically provides SSL certificates
- **Custom Domain**: Use Let's Encrypt or Cloudflare

---

## 5. 🟡 MEDIUM: Database Migration Strategy

### Create Migration Scripts
Create `scripts/migrate-production.js`:
```javascript
const { createClient } = require('@supabase/supabase-js');

async function migrateProduction() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('🚀 Running production migration...');
  
  // Test connection
  const { data, error } = await supabase
    .from('users')
    .select('count', { count: 'exact', head: true });

  if (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  console.log('✅ Migration completed successfully');
}

migrateProduction();
```

---

## 6. 🟡 MEDIUM: Automated Backups

### Create Backup Script
Create `scripts/backup-database.js`:
```javascript
const { exec } = require('child_process');
const fs = require('fs');

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}.sql`;
  
  const command = `pg_dump "${process.env.DATABASE_URL}" > backups/${filename}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Backup failed:', error);
      return;
    }
    console.log(`✅ Backup created: ${filename}`);
  });
}

// Schedule backups (use cron job in production)
backupDatabase();
```

### Set up Cron Job (Production Server)
```bash
# Run daily at 2 AM
0 2 * * * cd /path/to/your/app && node scripts/backup-database.js
```

---

## 7. 🟡 MEDIUM: Monitoring & Alerting

### Health Check Monitoring
Use services like:
- **UptimeRobot** (free)
- **Pingdom**
- **StatusCake**

Monitor these endpoints:
- `https://your-domain.com/api/health`
- `https://your-domain.com/`

### Set Up Alerts
Configure alerts for:
- API downtime
- High error rates
- Database connection failures
- Payment processing errors

---

## 8. 🟢 NICE TO HAVE: Performance Optimizations

### Redis for Rate Limiting
```bash
# Install Redis client
npm install redis

# Update rate limiting to use Redis
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);
```

### CDN Setup
- **Cloudflare**: Free CDN with DDoS protection
- **AWS CloudFront**: Enterprise-grade CDN
- **Netlify CDN**: Automatic with Netlify hosting

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Going Live:
- [ ] Create new Supabase project
- [ ] Update all environment variables
- [ ] Run database migrations
- [ ] Set up Sentry error monitoring
- [ ] Configure Stripe webhooks for production
- [ ] Set up SSL certificate
- [ ] Configure domain DNS
- [ ] Set up monitoring/alerts
- [ ] Create database backups
- [ ] Test all API endpoints
- [ ] Test payment flow end-to-end
- [ ] Test SMS integration
- [ ] Verify error handling works

### Post-Launch:
- [ ] Monitor error rates
- [ ] Check payment processing
- [ ] Verify SMS delivery
- [ ] Monitor database performance
- [ ] Set up regular backups
- [ ] Configure log retention
- [ ] Set up team alerts

---

## 🆘 EMERGENCY CONTACTS

### Critical Services:
- **Supabase Status**: status.supabase.com
- **Stripe Status**: status.stripe.com
- **Twilio Status**: status.twilio.com
- **Netlify Status**: status.netlify.com

### Support:
- **Supabase**: support@supabase.com
- **Stripe**: support@stripe.com
- **Twilio**: help@twilio.com

---

## 📋 PRIORITY ORDER

1. **IMMEDIATE (Do Now)**:
   - Fix Supabase database
   - Set up Sentry
   - Create basic tests

2. **THIS WEEK**:
   - Set up production environment
   - Configure monitoring
   - Set up automated backups

3. **NEXT WEEK**:
   - Performance optimizations
   - Advanced monitoring
   - Load testing

Remember: **Don't deploy to production until the Supabase database is fixed!** 