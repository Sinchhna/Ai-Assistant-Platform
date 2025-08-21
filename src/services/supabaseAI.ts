
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

// Function to call Gemini through Supabase Edge Function
export const callOpenAIViaSupabase = async (
  systemPrompt: string,
  messages: Array<{role: 'user' | 'assistant' | 'system', content: string}>,
  modelName = 'gemini-pro'
) => {
  try {
    console.log(`[Supabase AI] Preparing to invoke Edge Function with model: ${modelName}`);
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
    
    // Try multiple possible function names for robustness
    const candidateFunctionNames = ['open-ai-chat', 'openai-chat'];
    let lastError: unknown = null;

    for (const functionName of candidateFunctionNames) {
      const startTime = Date.now();
      console.log(`[Supabase AI] Invoking Edge Function '${functionName}'...`);
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          systemPrompt,
          messages,
          modelName
        }
      });

      const duration = Date.now() - startTime;
      console.log(`[Supabase AI] Edge Function '${functionName}' completed in ${duration}ms`);

      if (error) {
        lastError = error;
        console.warn(`[Supabase AI] Error from '${functionName}':`, error);
        // If function not found, try next candidate
        if (error.message?.includes('not found') || error.message?.includes('404')) {
          continue;
        }
        
        if (error.message?.includes('timeout') || error.message?.includes('aborted')) {
          throw new Error('The AI request timed out. Please try again with a shorter prompt or fewer messages.');
        }
        
        // Other errors: stop and surface
        throw new Error(`Failed to get AI response via Supabase ('${functionName}'): ${error.message || 'Unknown error'}`);
      }

      if (!data || !data.response) {
        console.error(`[Supabase AI] No data or response returned from Edge Function '${functionName}'`);
        // Try next candidate if available
        lastError = new Error('Empty response');
        continue;
      }

      console.log(`[Supabase AI] Successfully retrieved response (length: ${data.response.length}) from '${functionName}'`);
      return data.response;
    }

    // If we reach here, all candidates failed
    if (lastError) {
      throw new Error(
        `Could not invoke any Edge Function variants (${candidateFunctionNames.join(', ')}). Last error: ${
          (lastError as any)?.message || String(lastError)
        }`
      );
    }

    throw new Error('No Edge Function candidates available to invoke.');
  } catch (error) {
    console.error('[Supabase AI] Error in callOpenAIViaSupabase:', error);
    throw error;
  }
};
