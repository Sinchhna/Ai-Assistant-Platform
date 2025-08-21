# 🚀 Quick Edge Function Deployment Guide

Since Supabase CLI installation had issues, use this **Dashboard Method** instead.

## 📋 **Step 1: Deploy Edge Function via Dashboard**

1. **Go to**: https://app.supabase.com
2. **Select your project**: `qcsmzchblerexbffjdct`
3. **Navigate to**: Edge Functions → New Function
4. **Function Name**: `openai-chat`
5. **Copy this code** into the function editor:

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

interface RequestBody {
  systemPrompt?: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  modelName?: string;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    // Get request body
    const body: RequestBody = await req.json();
    const { systemPrompt, messages = [] } = body;

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get environment variables
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('[Supabase Edge Function] Gemini API key is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Gemini API key is not configured', 
          message: 'Please set the GEMINI_API_KEY secret in your Supabase project.'
        }),
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Convert messages to Gemini format and combine system prompt
    const formattedMessages = messages.map(msg => msg.content).join('\n');
    const prompt = systemPrompt 
      ? `${systemPrompt}\n\n${formattedMessages}`
      : formattedMessages;

    console.log(`[Supabase Edge Function] Calling Gemini with prompt length: ${prompt.length}`);
    
    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Return the response
    return new Response(
      JSON.stringify({ 
        response: `[model:gemini-pro] ${text}`,
        model: 'gemini-pro',
        usage: null, // Gemini doesn't provide token usage info
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  }
});
```

6. **Click "Deploy"**

## 🔑 **Step 2: Set Gemini API Key Secret**

1. **In Supabase Dashboard**: Settings → API → Edge Functions → Secrets
2. **Add New Secret**:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## ✅ **Step 3: Test the Backend**

1. **Your dev server is already running** ✅
2. **Open browser console** - should see "Supabase is properly configured"
3. **Create a new AI model** and test chatting
4. **Look for real AI responses** (not simulated ones)

## 🐛 **Troubleshooting**

- **"Edge Function not found"**: Make sure function name is exactly `openai-chat`
- **"API key not configured"**: Check the secret name is exactly `GEMINI_API_KEY`
- **CORS errors**: The function is configured to allow all origins

## 🎯 **What You'll See When Working**

✅ **Console logs**: "Supabase is properly configured"
✅ **AI responses**: Real responses from Google Gemini
✅ **No more "offline mode" messages**

---

**Need help?** Check the browser console for specific error messages!
