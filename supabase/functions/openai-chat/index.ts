
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

    // Determine which model to use - support both paid and free models
    let finalModelName = modelName;
    
    // Provide fallbacks for different model types
    if (modelName === 'gpt-4o' && Deno.env.get('USE_FREE_MODELS') === 'true') {
      console.log('[Supabase Edge Function] Using free model fallback instead of GPT-4o');
      finalModelName = 'gpt-3.5-turbo';
    }
    
    console.log(`[Supabase Edge Function] Using model: ${finalModelName}`);
    
    // Call OpenAI API with error handling
    const response = await openai.chat.completions.create({
      model: finalModelName,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1500,
    }).catch(async (err) => {
      console.error(`[Supabase Edge Function] Error with model ${finalModelName}:`, err.message);
      
      // If the model fails and it's not already a fallback, try with gpt-3.5-turbo
      if (finalModelName !== 'gpt-3.5-turbo') {
        console.log('[Supabase Edge Function] Falling back to gpt-3.5-turbo');
        return await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1500,
        });
      }
      
      // Re-throw if we can't use the fallback or the fallback also failed
      throw err;
    });

    // Get the content from the response
    const content = response.choices[0]?.message?.content || '';
    
    // Add model information as a tag at the beginning of the response
    // This will be parsed and removed on the client side
    const responseWithModelTag = `[model:${finalModelName}] ${content}`;
    
    // Return the response
    return new Response(
      JSON.stringify({ 
        response: responseWithModelTag,
        model: finalModelName,
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
