
import { createClient } from '@supabase/supabase-js';

// Type for Supabase configuration
interface SupabaseConfig {
  isConfigured: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  getClient: () => ReturnType<typeof createClient> | null;
}

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create and export Supabase configuration
export const supabaseConfig: SupabaseConfig = {
  isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  supabaseUrl,
  supabaseAnonKey,
  
  // Lazy singleton initialization of Supabase client
  getClient: () => {
    // Only create client if configuration is available
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[Supabase Config] Supabase is not properly configured. Missing URL or Anonymous Key.');
      return null;
    }
    
    try {
      // Reuse a single client across the app to avoid multiple GoTrue instances
      const w = typeof window !== 'undefined' ? (window as any) : undefined;
      if (w && w.__supabaseClient) {
        return w.__supabaseClient;
      }
      const client = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storageKey: 'aimarketplace-auth',
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      if (w) w.__supabaseClient = client;
      return client;
    } catch (error) {
      console.error('[Supabase Config] Error creating Supabase client:', error);
      return null;
    }
  }
};

// Log configuration state on initialization (helps with debugging)
console.log(`[Supabase Config] Supabase is ${supabaseConfig.isConfigured ? 'properly configured' : 'NOT configured'}`);
