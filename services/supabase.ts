import { createClient } from '@supabase/supabase-js';
import { isMockMode } from './env';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Re-exported for backward-compat; prefer importing from './env' when you only
// need the flag and not the client.
export { isMockMode };

// Only defined when isMockMode is false. Services that use this must only be
// instantiated after checking isMockMode (done in App.tsx).
export const supabase = isMockMode ? null : createClient(supabaseUrl, supabaseAnonKey);
