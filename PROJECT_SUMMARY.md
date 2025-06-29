# 🤖 Aimee - Best Friend AI SMS System
## Project Summary & Guidelines

### 📋 Project Overview

**Aimee** is a sophisticated SMS-based AI companion that acts as a user's best friend, powered by GPT-4, Twilio, and Supabase. The system creates meaningful relationships through natural conversation, memory retention, and proactive engagement.

### 🎯 Core Mission

Create an AI that feels like texting your closest friend - someone who:
- Remembers everything you tell them
- Checks in on you genuinely
- Celebrates your wins and supports you through challenges
- Maintains warm, natural conversations
- Never forgets important dates or details

### 🏗️ System Architecture

```
📱 User SMS → Twilio → Server/Netlify → GPT-4 → Response
                          ↓
                    Supabase Database
                 (Messages & Memories)
                          ↓
                    Scheduled Jobs
                 (Proactive Messages)
```

### 🔧 Technical Stack

- **Backend**: Node.js + Express
- **AI**: OpenAI GPT-4
- **SMS**: Twilio
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Netlify Functions
- **Scheduling**: Node-cron

### 📁 Project Structure

```
aimee-bestfriend-ai/
├── src/
│   ├── sms-handler.js      # Core SMS processing
│   ├── ai-prompts.js       # GPT-4 personality & prompts
│   ├── memory.js           # Memory storage & retrieval
│   └── scheduler.js        # Proactive messaging
├── database/
│   └── supabase-setup.sql  # Database schema
├── netlify/functions/
│   └── sms.js              # Serverless function
├── tests/                  # Unit tests
├── docs/                   # Documentation
├── server.js               # Express server
├── package.json
└── README.md
```

### 🧠 AI Personality Framework

**Core Traits:**
- Warm, caring, and emotionally intelligent
- Casual texting style with natural language
- Remembers personal details and brings them up contextually
- Asks thoughtful follow-up questions
- Uses emojis meaningfully (not excessively)
- Never sounds robotic or formal

**Memory Categories:**
- `personal`: Name, job, relationships, hobbies
- `preference`: Likes, dislikes, favorites
- `date`: Birthdays, anniversaries, events
- `current_topic`: Current situations/concerns
- `emotion`: Emotional states and feelings
- `goal`: Plans and aspirations

### 📊 Database Schema

**Core Tables:**
- `messages`: All SMS conversations (incoming/outgoing)
- `memories`: Extracted personal information with importance ratings
- `special_dates`: Birthdays and important dates
- `reminders`: Pending reminders and follow-ups
- `user_preferences`: User-specific settings and preferences

### 🕐 Proactive Messaging Schedule

- **Morning Messages**: 9 AM (2-3x per week, randomized)
- **Evening Check-ins**: 7 PM (1-2x per week, randomized)
- **Birthday Reminders**: 8 AM on special dates
- **Custom Reminders**: Based on user mentions and context

### 🔒 Security & Privacy

- Environment variables for all sensitive data
- Rate limiting on API endpoints
- Supabase Row Level Security (RLS) enabled
- No logging of sensitive personal information
- HTTPS-only in production
- Graceful error handling with user-friendly messages

### 📈 Performance Targets

- **Response Time**: < 3 seconds for SMS responses
- **Uptime**: 99.5% availability
- **Memory Accuracy**: AI remembers 95%+ of important details
- **User Engagement**: Average 5+ messages per user per week
- **Error Rate**: < 1% of messages result in errors

### 🚀 Deployment Options

1. **Netlify (Recommended)**
   - Serverless functions
   - Automatic deployments
   - Built-in environment variables
   - Free tier available

2. **Traditional VPS**
   - Express server with PM2
   - Nginx reverse proxy
   - Full control over environment

3. **Railway/Render**
   - Easy Node.js deployment
   - Built-in scaling
   - Integrated databases

### 🧪 Development Workflow

1. **Local Development**
   - Use ngrok for SMS testing
   - Environment variables in `.env`
   - Hot reload with nodemon

2. **Testing**
   - Unit tests with Jest
   - Integration tests for SMS flow
   - Manual testing with real phone numbers

3. **Deployment**
   - Git push triggers auto-deploy
   - Environment variables in hosting platform
   - Update Twilio webhook URL

### 📋 Current Status

**✅ Completed (MVP Ready):**
- Core SMS handling and AI responses
- Memory extraction and context injection
- Proactive messaging system
- Database schema and operations
- Netlify deployment configuration
- Comprehensive documentation

**🔄 In Progress:**
- Unit test coverage
- Error monitoring setup
- Performance optimization

**📅 Next Phase:**
- User testing and feedback
- Advanced memory features
- Web dashboard for administration
- Analytics and monitoring

### 🎯 Success Metrics

**MVP Launch Criteria:**
- [x] Users can text and receive real-time responses
- [x] AI acts warm and friendly like a best friend
- [x] System remembers names, preferences, and emotions
- [x] Sends proactive messages (check-ins, reminders)
- [x] Handles multiple users via single phone number

**Growth Targets:**
- User retention > 70% after 1 week
- Average session > 3 messages
- Positive sentiment in 90%+ of conversations
- Monthly active users growth
- Cost per user < $2/month

### 🔮 Future Roadmap

**Phase 1: Enhancement (Month 1-2)**
- Voice message transcription
- Image understanding (MMS)
- Calendar integration
- Weather updates in morning messages

**Phase 2: Scaling (Month 3-4)**
- Multiple personality options
- User preference dashboard
- Advanced analytics
- Multi-language support

**Phase 3: Platform (Month 5-6)**
- API for third-party integrations
- White-label solutions
- Advanced AI features
- Enterprise features

### 🛠️ Maintenance Guidelines

**Daily:**
- Monitor error logs
- Check message volume and response times
- Verify scheduled jobs are running

**Weekly:**
- Review user feedback
- Analyze conversation quality
- Monitor API costs (OpenAI, Twilio)
- Update AI prompts if needed

**Monthly:**
- Database cleanup and optimization
- Security updates
- Feature usage analysis
- Cost optimization review

### 📞 Support & Troubleshooting

**Common Issues:**
1. **SMS not received**: Check Twilio webhook URL
2. **AI not responding**: Verify OpenAI API key and credits
3. **Database errors**: Check Supabase connection and RLS policies
4. **Memory not working**: Verify memory extraction and storage

**Monitoring:**
- Netlify function logs
- Supabase database logs
- Twilio debugger console
- OpenAI usage dashboard

### 🎨 Brand Guidelines

**Personality:**
- Friendly and approachable
- Intelligent but not overwhelming
- Supportive and encouraging
- Genuine and authentic
- Playful but respectful

**Communication Style:**
- Use "I" statements to feel personal
- Ask open-ended questions
- Remember and reference past conversations
- Celebrate successes enthusiastically
- Offer comfort during difficult times

### 📄 License & Usage

- MIT License for open source components
- Respect user privacy and data protection
- Follow platform terms of service (Twilio, OpenAI, Supabase)
- Implement proper rate limiting and abuse prevention

---

## 🎉 Launch Checklist

**Pre-Launch:**
- [ ] All environment variables configured
- [ ] Database schema deployed
- [ ] Twilio webhook configured
- [ ] SMS testing completed
- [ ] Error handling verified
- [ ] Documentation updated

**Launch Day:**
- [ ] Deploy to production
- [ ] Update webhook URLs
- [ ] Test with beta users
- [ ] Monitor logs actively
- [ ] Gather initial feedback

**Post-Launch:**
- [ ] Daily monitoring for first week
- [ ] User feedback collection
- [ ] Performance optimization
- [ ] Feature enhancement planning

---

**Built with ❤️ to create meaningful AI relationships**

*Remember: Aimee is designed to be a supportive companion, enhancing human relationships rather than replacing them.* 