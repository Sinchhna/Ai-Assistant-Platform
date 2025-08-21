# 🚀 Complete Backend Setup Guide

This guide will help you set up the complete backend for your AI Marketplace application.

## 📋 Prerequisites

1. **Supabase Account**: [Sign up at supabase.com](https://supabase.com)
2. **Google Gemini API Key**: [Get one at Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Node.js & npm**: Already installed in your project

## 🔧 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `ai-marketplace` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be created (2-3 minutes)

## 🔑 Step 2: Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefghijklm.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## 📁 Step 3: Create Environment File

1. In your project root, create a file named `.env.local`
2. Add this content (replace with your actual values):

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## 🚀 Step 4: Install Supabase CLI (Alternative Methods)

### Method A: Using Chocolatey (Recommended for Windows)
```bash
# Install Chocolatey first if you don't have it
# Run PowerShell as Administrator and execute:
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Then install Supabase CLI
choco install supabase
```

### Method B: Manual Download
1. Go to [Supabase CLI Releases](https://github.com/supabase/cli/releases)
2. Download the latest Windows executable
3. Extract and add to your PATH

### Method C: Using npm (Local Installation)
```bash
# Install locally in your project
npm install --save-dev supabase
# Then use with npx
npx supabase --version
```

## 🔐 Step 5: Login to Supabase CLI

```bash
supabase login
# Follow the prompts to authenticate
```

## 🚀 Step 6: Deploy Edge Function

1. **Link your project** (replace with your project ref):
```bash
supabase link --project-ref your-project-ref
```

2. **Deploy the Edge Function**:
```bash
supabase functions deploy openai-chat --project-ref your-project-ref
```

## 🔑 Step 7: Set Gemini API Key Secret

### Option A: Using CLI
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key --project-ref your-project-ref
```

### Option B: Using Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API** → **Edge Functions** → **Secrets**
3. Add new secret:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key

## ✅ Step 8: Test the Backend

1. **Restart your development server**:
```bash
npm run dev
```

2. **Check browser console** for:
   - "Supabase is properly configured"
   - No configuration errors

3. **Test AI functionality**:
   - Create a new AI model
   - Try chatting with it
   - Check for real AI responses (not simulated)

## 🐛 Troubleshooting

### Common Issues:

1. **"Supabase is NOT configured"**
   - Check your `.env.local` file
   - Ensure environment variables are correct
   - Restart dev server after changes

2. **"Edge Function not found"**
   - Verify the function was deployed successfully
   - Check your project ref is correct
   - Ensure you're logged into Supabase CLI

3. **"Gemini API key is not configured"**
   - Verify the secret was set correctly
   - Check the secret name is exactly `GEMINI_API_KEY`
   - Ensure your Gemini API key is valid

4. **CORS Errors**
   - The Edge Function is configured to allow all origins
   - If you still get CORS errors, check your Supabase project settings

### Debug Steps:

1. **Check Supabase Dashboard**:
   - Go to **Edge Functions** section
   - Verify `openai-chat` function is deployed and active

2. **Check Function Logs**:
   - In Supabase dashboard, go to **Edge Functions** → **Logs**
   - Look for any error messages

3. **Verify Environment Variables**:
   - Check browser console for configuration messages
   - Ensure `.env.local` is in project root

## 🎯 What You'll Have After Setup

✅ **Real AI Integration**: Google Gemini API working through Supabase
✅ **Secure Backend**: API keys stored safely in Supabase secrets
✅ **Scalable Infrastructure**: Supabase handles authentication, database, and edge functions
✅ **Production Ready**: Can deploy to any hosting platform

## 🚀 Next Steps After Setup

1. **Customize AI Models**: Modify the Edge Function for your specific needs
2. **Add Database Tables**: Create tables for users, models, and conversations
3. **Implement Authentication**: Add user signup/login with Supabase Auth
4. **Add Real-time Features**: Use Supabase real-time subscriptions
5. **Deploy**: Use the deployment guide in your README

---

**Need Help?** Check the console logs and Supabase dashboard for specific error messages.
