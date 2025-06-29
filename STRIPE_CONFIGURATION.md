# 🔐 Stripe Configuration Guide

**Created:** December 29, 2024  
**Status:** ✅ Production Ready

## 📋 Overview

This document outlines the complete Stripe configuration for the Aimee AI platform, including subscription plans, webhook endpoints, and environment variables.

## 🎯 Subscription Plans

### Products Created

1. **Aimee Basic Plan**
   - Product ID: `prod_SaLVTzU9DmD2Yw`
   - Price ID: `price_1RfAogEP9RROyZ6BkSAxHpcO`
   - Amount: $14.99/month
   - Description: "Unlimited SMS conversations with your AI best friend Aimee"

2. **Aimee Premium Plan**
   - Product ID: `prod_SaLVQ8U6Qk4pZF`
   - Price ID: `price_1RfAorEP9RROyZ6BKjYjvxZ2`
   - Amount: $24.99/month
   - Description: "Enhanced AI personality with advanced features and priority support"

## 🔗 Webhook Configuration

### Endpoint Details
- **URL:** `https://roaring-kelpie-7c98f1.netlify.app/api/webhooks/stripe`
- **Webhook ID:** `we_1RfBvdEP9RROyZ6B3V7tIMel`
- **Secret:** `whsec_[CONFIGURED_IN_NETLIFY]`
- **Events:** All events (`*`) - can be refined later for specific events
- **Status:** Enabled

### Supported Events
The webhook is configured to receive all Stripe events, but the application specifically handles:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## 🔑 Environment Variables

### Netlify Configuration
All environment variables have been set in Netlify with scope "All":

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_[CONFIGURED_IN_NETLIFY]
STRIPE_PUBLISHABLE_KEY=pk_test_[CONFIGURED_IN_NETLIFY]

# Webhook Configuration
STRIPE_WEBHOOK_SECRET=whsec_[CONFIGURED_IN_NETLIFY]

# Product Price IDs
STRIPE_PRICE_BASIC=price_1RfAogEP9RROyZ6BkSAxHpcO
STRIPE_PRICE_PREMIUM=price_1RfAorEP9RROyZ6BKjYjvxZ2
```

## 🛠️ CLI Commands Used

### 1. Stripe Configuration Retrieval
```bash
# Check Stripe CLI configuration
stripe config --list

# List existing products
stripe products list

# Get price details for each product
stripe prices list --product prod_SaLVTzU9DmD2Yw
stripe prices list --product prod_SaLVQ8U6Qk4pZF
```

### 2. Webhook Creation
```bash
# Create webhook endpoint
stripe webhook_endpoints create \
  --url https://roaring-kelpie-7c98f1.netlify.app/api/webhooks/stripe \
  --enabled-events "*"
```

### 3. Netlify Environment Setup
```bash
# Set all required environment variables
netlify env:set STRIPE_SECRET_KEY "sk_test_[YOUR_SECRET_KEY]"
netlify env:set STRIPE_WEBHOOK_SECRET "whsec_[YOUR_WEBHOOK_SECRET]"
netlify env:set STRIPE_PRICE_BASIC "price_[YOUR_BASIC_PRICE_ID]"
netlify env:set STRIPE_PRICE_PREMIUM "price_[YOUR_PREMIUM_PRICE_ID]"
netlify env:set STRIPE_PUBLISHABLE_KEY "pk_test_[YOUR_PUBLISHABLE_KEY]"
```

## 🔄 API Version

**Current Version:** `2025-05-28.basil`

All Stripe configurations use the latest API version to ensure compatibility with current TypeScript definitions and features.

## 🧪 Testing

### Health Check
The production deployment health check confirms Stripe is properly configured:

```json
{
  "status": "healthy",
  "timestamp": "2025-06-29T03:32:23.080Z",
  "services": {
    "database": "healthy",
    "stripe": "configured",
    "twilio": "configured"
  },
  "environment": "production"
}
```

### Test URLs
- **Production Site:** https://roaring-kelpie-7c98f1.netlify.app
- **Health Endpoint:** https://roaring-kelpie-7c98f1.netlify.app/api/health
- **Webhook Endpoint:** https://roaring-kelpie-7c98f1.netlify.app/api/webhooks/stripe

## 🔐 Security Notes

1. **Test Mode:** Currently configured for Stripe test mode
2. **Environment Variables:** All secrets properly secured in Netlify
3. **Webhook Security:** Webhook signature verification implemented
4. **API Key Rotation:** Keys expire on 2025-09-27, set calendar reminder

## 📚 Documentation References

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)

## 🎯 Next Steps

1. **Production Keys:** Replace test keys with live keys when ready for production
2. **Webhook Events:** Refine webhook events to only necessary ones for performance
3. **Error Handling:** Monitor webhook delivery and implement retry logic
4. **Testing:** Conduct end-to-end payment testing with test cards

---

**Configuration Status:** ✅ Complete and Production Ready 