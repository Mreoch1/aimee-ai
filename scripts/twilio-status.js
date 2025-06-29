#!/usr/bin/env node

/**
 * Twilio Status Checker
 * Checks Twilio account status, phone number verification, and outbound messaging capabilities
 */

const twilio = require('twilio');

// Load environment variables
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !phoneNumber) {
    console.error('❌ Missing required environment variables:');
    console.error('   TWILIO_ACCOUNT_SID');
    console.error('   TWILIO_AUTH_TOKEN');
    console.error('   TWILIO_PHONE_NUMBER');
    console.error('\nPlease set these in your .env file or environment variables.');
    process.exit(1);
}

const client = twilio(accountSid, authToken);

async function checkTwilioStatus() {
    console.log('🔍 Checking Twilio Status...\n');

    try {
        // Check account status
        console.log('📋 Account Information:');
        const account = await client.api.accounts(accountSid).fetch();
        console.log(`   Status: ${account.status}`);
        console.log(`   Type: ${account.type}`);
        console.log(`   Date Created: ${account.dateCreated}`);
        
        // Check phone number details
        console.log('\n📞 Phone Number Information:');
        const phoneNumbers = await client.incomingPhoneNumbers.list();
        const ourNumber = phoneNumbers.find(num => num.phoneNumber === phoneNumber);
        
        if (ourNumber) {
            console.log(`   Phone Number: ${ourNumber.phoneNumber}`);
            console.log(`   Friendly Name: ${ourNumber.friendlyName}`);
            console.log(`   Status: Active`);
            console.log(`   SMS Enabled: ${ourNumber.capabilities.sms ? '✅' : '❌'}`);
            console.log(`   Voice Enabled: ${ourNumber.capabilities.voice ? '✅' : '❌'}`);
            
            // Check if it's a toll-free number
            if (ourNumber.phoneNumber.startsWith('+1800') || ourNumber.phoneNumber.startsWith('+1888') || 
                ourNumber.phoneNumber.startsWith('+1877') || ourNumber.phoneNumber.startsWith('+1866') || 
                ourNumber.phoneNumber.startsWith('+1855') || ourNumber.phoneNumber.startsWith('+1844') || 
                ourNumber.phoneNumber.startsWith('+1833') || ourNumber.phoneNumber.startsWith('+1822')) {
                console.log(`   Type: Toll-Free Number`);
                
                // Check toll-free verification status
                try {
                    const tollfreeVerifications = await client.messaging.v1.tollfreeVerifications.list();
                    const verification = tollfreeVerifications.find(v => v.customerProfileSid);
                    
                    if (verification) {
                        console.log(`   Toll-Free Verification: ${verification.status}`);
                        if (verification.status === 'pending') {
                            console.log('   ⚠️  Toll-free verification is pending. Outbound messaging may be limited.');
                        } else if (verification.status === 'approved') {
                            console.log('   ✅ Toll-free verification approved. Full messaging capabilities available.');
                        }
                    } else {
                        console.log('   ⚠️  No toll-free verification found. This may limit outbound messaging.');
                    }
                } catch (error) {
                    console.log('   ⚠️  Could not check toll-free verification status');
                }
            } else {
                console.log(`   Type: Local Number`);
            }
        } else {
            console.log(`   ❌ Phone number ${phoneNumber} not found in account`);
        }

        // Check recent messages
        console.log('\n💬 Recent Messages (last 5):');
        const messages = await client.messages.list({ limit: 5 });
        
        if (messages.length === 0) {
            console.log('   No messages found');
        } else {
            messages.forEach((message, index) => {
                console.log(`   ${index + 1}. ${message.direction} - ${message.status} - ${message.dateCreated}`);
                console.log(`      From: ${message.from} To: ${message.to}`);
                if (message.errorCode) {
                    console.log(`      Error: ${message.errorCode} - ${message.errorMessage}`);
                }
            });
        }

        // Check for any account restrictions
        console.log('\n🔒 Account Restrictions:');
        try {
            const usage = await client.usage.records.list({ category: 'sms', limit: 1 });
            console.log('   ✅ SMS usage accessible - no apparent restrictions');
        } catch (error) {
            console.log(`   ⚠️  Potential restriction: ${error.message}`);
        }

        // Test webhook endpoint (if configured)
        if (ourNumber && ourNumber.smsUrl) {
            console.log('\n🔗 Webhook Configuration:');
            console.log(`   SMS URL: ${ourNumber.smsUrl}`);
            console.log(`   SMS Method: ${ourNumber.smsMethod}`);
        }

        console.log('\n✅ Twilio status check complete!');

    } catch (error) {
        console.error('❌ Error checking Twilio status:', error.message);
        
        if (error.code === 20003) {
            console.error('   This usually means invalid credentials.');
        } else if (error.code === 20404) {
            console.error('   Resource not found. Check your account SID and phone number.');
        }
        
        process.exit(1);
    }
}

// Run the status check
checkTwilioStatus(); 