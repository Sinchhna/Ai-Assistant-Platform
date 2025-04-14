
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.29.0';
import OpenAI from 'https://esm.sh/openai@4.0.0';

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
    const { systemPrompt, messages = [], modelName = 'gpt-4o' } = body;

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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('[Supabase Edge Function] OpenAI API key is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key is not configured', 
          message: 'Please set the OPENAI_API_KEY secret in your Supabase project. See SUPABASE_AI_SETUP.md for instructions.'
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

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // Prepare messages for OpenAI
    const apiMessages = [...messages];
    
    // Add system prompt if provided and not already included
    if (systemPrompt && !messages.some(m => m.role === 'system')) {
      apiMessages.unshift({
        role: 'system',
        content: systemPrompt,
      });
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Return the response
    return new Response(
      JSON.stringify({ 
        response: response.choices[0]?.message?.content || '',
        model: modelName,
        usage: response.usage,
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (error) {
    // Handle errors
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
