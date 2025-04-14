
# Supabase AI Integration Setup

This guide will help you set up the Supabase Edge Function that powers the AI features in this application.

## Overview

The application uses a Supabase Edge Function to securely call the OpenAI API. This approach keeps your OpenAI API key safe by storing it as a Supabase secret rather than exposing it in the frontend code.

## Prerequisites

1. A Supabase account and project
2. An OpenAI API key (get one at https://platform.openai.com/api-keys)
3. Supabase CLI installed on your development machine

## Step 1: Install Supabase CLI

If you haven't already, install the Supabase CLI:

```bash
npm install -g supabase
```

## Step 2: Login to Supabase CLI

```bash
supabase login
```

Follow the prompts to authenticate with your Supabase account.

## Step 3: Navigate to Your Project Directory

```bash
cd your-project-directory
```

## Step 4: Deploy the Edge Function

```bash
supabase functions deploy openai-chat --project-ref your-project-ref
```

Replace `your-project-ref` with your Supabase project reference ID, which you can find in the Supabase dashboard.

## Step 5: Set the OpenAI API Key as a Secret

Option 1: Using the CLI:

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key --project-ref your-project-ref
```

Option 2: Using the Supabase Dashboard:

1. Go to your project in the Supabase dashboard
2. Navigate to Settings > API > Edge Functions > Secrets
3. Add a new secret with the name `OPENAI_API_KEY` and your API key as the value

## Testing the Integration

Once you've set up the Edge Function and API key:

1. Create a new AI model in the application
2. Wait for the training to complete (this is simulated in this demo)
3. Open the model and try interacting with it
4. Check browser console logs for debugging information

## Troubleshooting

If you encounter issues:

1. **Edge Function Not Found Error**: Make sure you've correctly deployed the function
2. **API Key Error**: Verify your OpenAI API key is correctly set in the secrets
3. **CORS Issues**: The Edge Function is configured to allow requests from any origin, so this shouldn't be a problem
4. **Timeout Errors**: The API might time out for large requests; try with a shorter message

If you still face issues, the application will fall back to simulated AI responses to ensure it remains functional.

## Advanced Configuration

You can modify the Edge Function behavior by editing:

- `supabase/functions/openai-chat/index.ts` - The Edge Function code
- `src/services/supabaseAI.ts` - The function that calls the Edge Function
- `src/services/aiService.ts` - The service that handles AI responses and fallbacks
