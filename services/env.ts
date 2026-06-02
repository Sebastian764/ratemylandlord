// Demo/mock mode flag, kept in its own module so it can be imported WITHOUT
// pulling in the Supabase client (services/supabase.ts constructs the client at
// module load, which is undesirable for components/tests that only need the flag).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isMockMode = !supabaseUrl || !supabaseAnonKey;
