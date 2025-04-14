
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/config/supabase';

// Function to safely get the Supabase client
const getSupabaseClient = () => {
  // Use the configuration module to get client
  const client = supabaseConfig.getClient();
  
  // Throw meaningful error if client cannot be created
  if (!client) {
    throw new Error('Supabase configuration is incomplete. Please check your environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  
  return client;
};

// Function to call OpenAI through Supabase Edge Function
export const callOpenAIViaSupabase = async (
  systemPrompt: string,
  messages: Array<{role: 'user' | 'assistant' | 'system', content: string}>,
  modelName = 'gpt-4o'
) => {
  try {
    console.log(`[Supabase AI] Invoking openai-chat Edge Function with model: ${modelName}`);
    console.log(`[Supabase AI] System prompt length: ${systemPrompt.length} characters`);
    console.log(`[Supabase AI] Messages count: ${messages.length}`);
    
    // Initialize Supabase client when needed (lazy initialization)
    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (error) {
      console.error('[Supabase AI] Failed to initialize Supabase client:', error);
      throw error;
    }
    
    const startTime = Date.now();
    
    // Use the initialized Supabase client
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        systemPrompt,
        messages,
        modelName
      }
    });

    const duration = Date.now() - startTime;
    console.log(`[Supabase AI] Edge Function completed in ${duration}ms`);

    if (error) {
      console.error('[Supabase AI] Error calling Supabase Edge Function:', error);
      
      if (error.message.includes('not found') || error.message.includes('404')) {
        throw new Error('The openai-chat Edge Function is not deployed. Please deploy it first.');
      }
      
      if (error.message.includes('timeout') || error.message.includes('aborted')) {
        throw new Error('The AI request timed out. Please try again with a shorter prompt or fewer messages.');
      }
      
      throw new Error(`Failed to get AI response via Supabase: ${error.message}`);
    }

    if (!data || !data.response) {
      console.error('[Supabase AI] No data or response returned from Edge Function');
      throw new Error('The AI service returned an empty response');
    }

    console.log(`[Supabase AI] Successfully retrieved response of length: ${data.response.length} characters`);
    return data.response;
  } catch (error) {
    console.error('[Supabase AI] Error in callOpenAIViaSupabase:', error);
    throw error;
  }
};
