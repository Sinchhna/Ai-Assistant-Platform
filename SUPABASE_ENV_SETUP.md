
# Supabase Environment Setup Guide

This application requires Supabase configuration to enable AI features. Follow these steps to set up your environment variables.

## Required Environment Variables

The application needs two environment variables to connect to Supabase:

1. `VITE_SUPABASE_URL` - Your Supabase project URL
2. `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

## How to Set Up Environment Variables

### Method 1: Create a .env File (Development)

Create a file named `.env.local` in the root of your project with the following content:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project values.

### Method 2: Set Environment Variables in Deployment Platform

If you're deploying to a hosting platform (Vercel, Netlify, etc.), set these environment variables in your platform's dashboard.

## Where to Find Your Supabase Credentials

1. Log in to your [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Go to Project Settings > API
4. Under "Project URL", copy the URL for `VITE_SUPABASE_URL`
5. Under "Project API keys", copy the "anon/public" key for `VITE_SUPABASE_ANON_KEY`

## Verifying Your Configuration

After setting up your environment variables:

1. Restart your development server
2. Open the browser console
3. Look for a log message saying "Supabase is properly configured"

If you see an error or "Supabase is NOT configured", double-check your environment variable values.

## Next Steps

Once you have Supabase configured, follow the instructions in `SUPABASE_AI_SETUP.md` to deploy the Edge Function for OpenAI integration.
