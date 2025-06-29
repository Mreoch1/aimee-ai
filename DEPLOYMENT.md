# Aimee Web Application - Deployment Guide

This guide will walk you through deploying the Aimee web application to Netlify.

## 🚀 Quick Deployment (Netlify)

### 1. Prepare Your Environment Variables

First, gather all your credentials:

```env
# Supabase (from your existing setup)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Twilio (your existing credentials)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Stripe (you need to set these up)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
NEXTAUTH_SECRET=your_random_32_character_secret
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

### 2. Deploy to Netlify

1. **Connect GitHub Repository**:
   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Connect your GitHub account
   - Select the `aimee-ai` repository

2. **Configure Build Settings**:
   - Build command: `cd aimee-web && npm run build`
   - Publish directory: `aimee-web/.next`
   - Node version: 18

3. **Set Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add all the environment variables from step 1

4. **Deploy**:
   - Click "Deploy site"
   - Netlify will automatically deploy when you push to GitHub

## 🏗️ Stripe Setup

### 1. Create Stripe Account & Products

1. **Create Stripe Account**: https://dashboard.stripe.com/register
2. **Create Products**:
   - Basic Plan: $14.99/month
   - Premium Plan: $24.99/month

### 2. Create Products in Stripe Dashboard

```bash
# Using Stripe CLI (recommended)
stripe products create --name="Basic Plan" --description="Your AI best friend with unlimited conversations"
stripe prices create --product=prod_xxx --unit-amount=1499 --currency=usd --recurring[interval]=month

stripe products create --name="Premium Plan" --description="Enhanced AI personality with advanced features"  
stripe prices create --product=prod_xxx --unit-amount=2499 --currency=usd --recurring[interval]=month
```

### 3. Update Price IDs

Update `aimee-web/src/lib/stripe.ts` with your actual price IDs:

```typescript
export const PRICING_PLANS = {
  basic: {
    // ... other properties
    priceId: 'price_1ABC123...', // Your actual price ID
  },
  premium: {
    // ... other properties  
    priceId: 'price_1XYZ789...', // Your actual price ID
  }
}
```

### 4. Configure Webhooks

1. In Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to environment variables

## 🗄️ Database Setup

The database migration has already been run! Your Supabase database now includes:
- `users` table (extended with web app columns)
- `phone_verifications` table (new)
- `user_dashboard_data` view (new)

## 🔄 Integration Testing

### 1. Test User Registration Flow

1. Visit your deployed site
2. Click "Start Your Friendship"
3. Fill out registration form
4. Verify SMS code is received
5. Check that welcome message is sent from Aimee

### 2. Test Stripe Integration

1. Use Stripe test cards: `4242 4242 4242 4242`
2. Complete a test subscription
3. Verify webhook events are received
4. Check user status updates in database

### 3. Test SMS Integration

1. Text your Twilio number
2. Verify messages appear in dashboard
3. Check memory extraction works
4. Confirm conversation history syncs

## 📊 Monitoring & Analytics

### 1. Netlify Analytics

Enable in Netlify dashboard → Analytics

### 2. Stripe Dashboard

Monitor subscriptions, payments, and webhooks

### 3. Supabase Monitoring

Check database performance and API usage

## 🚨 Production Checklist

### Before Going Live:

- [ ] All environment variables set correctly in Netlify
- [ ] Stripe products and prices created
- [ ] Webhook endpoints configured and tested
- [ ] Database migration completed ✅
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Netlify)
- [ ] Test complete user flow
- [ ] Verify SMS integration works
- [ ] Check error handling and logging

### Security Checklist:

- [ ] Use production Stripe keys (not test keys)
- [ ] Secure webhook secrets configured
- [ ] Environment variables properly secured in Netlify
- [ ] Database RLS policies active ✅
- [ ] Phone verification working
- [ ] Input validation active

## 🔧 Troubleshooting

### Common Issues:

1. **SMS not sending**: Check Twilio credentials and phone number verification
2. **Stripe webhooks failing**: Verify webhook secret and endpoint URL
3. **Database connection issues**: Check Supabase credentials
4. **Build failures**: Check TypeScript errors and dependency issues

### Debug Mode:

Set `NODE_ENV=development` temporarily in Netlify to see detailed error messages.

## 📈 Scaling Considerations

### Performance Optimization:

- Netlify Edge Functions for API routes
- Supabase connection pooling
- Implement proper caching strategies
- Monitor and optimize database queries

### Cost Management:

- Monitor Stripe transaction fees
- Track Twilio SMS costs
- Watch Supabase usage limits
- Set up billing alerts

## 🔄 Updates & Maintenance

### Deploying Updates:

```bash
# Deploy new version (automatic with GitHub integration)
git push origin main
```

### Database Updates:

```bash
# Create new migration
supabase migration new update_name

# Apply migration
supabase db push
```

## 🎉 Go Live!

Once everything is tested and working:

1. Update your marketing materials with the new web app URL
2. Send announcement to existing users
3. Monitor initial user registrations
4. Be ready to provide support for new users

Your Aimee web application is now ready to provide an amazing user experience! 🚀

## 📞 Support

If you encounter issues during deployment:

1. Check the logs in Netlify dashboard
2. Review Stripe webhook logs
3. Check Supabase logs and metrics
4. Verify all environment variables are set correctly

---

**Your complete Aimee AI system is now ready for production!** 🎊 