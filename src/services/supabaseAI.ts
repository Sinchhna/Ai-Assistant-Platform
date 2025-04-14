
import { createClient } from '@supabase/supabase-js';

// Constants for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to call OpenAI through Supabase Edge Function
export const callOpenAIViaSupabase = async (
  systemPrompt: string,
  messages: Array<{role: 'user' | 'assistant' | 'system', content: string}>,
  modelName = 'gpt-4o'
) => {
  try {
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        systemPrompt,
        messages,
        modelName
      }
    });

    if (error) {
      console.error('Error calling Supabase Edge Function:', error);
      throw new Error('Failed to get AI response via Supabase');
    }

    return data.response;
  } catch (error) {
    console.error('Error in callOpenAIViaSupabase:', error);
    throw error;
  }
};
