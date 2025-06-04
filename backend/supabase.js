import { createClient } from '@supabase/supabase-js';
// dotenv should be loaded by server.js at the application's entry point.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use SERVICE_ROLE_KEY for backend admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem ser definidos no arquivo .env carregado pelo servidor.');
  // Consider how to handle this critical error. For a library, throwing might be better.
  // For an app, if it cannot initialize, it might need to prevent startup.
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Optional: log successful initialization, but can be removed for production
// console.log('Cliente Supabase (backend com service role) inicializado.');

export default supabase;
