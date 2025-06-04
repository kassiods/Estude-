
import { createClient } from '@supabase/supabase-js';
// dotenv should be loaded by server.js at the application's entry point.
// No need to call dotenv.config() here again.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // This should be the service_role key for admin operations if needed, or anon key for general use.
                                          // For user-specific operations proxied by the backend, it often uses the service_role key.
                                          // If this client is for user-specific actions based on their token, it might be different.
                                          // Given userService.js uses supabase.auth.admin, SUPABASE_KEY here MUST be the SERVICE_ROLE_KEY.

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: SUPABASE_URL e SUPABASE_KEY (geralmente service_role para backend) devem ser definidos no arquivo .env carregado pelo servidor.');
  // Consider how to handle this critical error. Exiting might be too abrupt for a library.
  // Throwing an error might be better if this is initialized early.
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Optional: log successful initialization, but can be removed for production
// console.log('Cliente Supabase (backend) inicializado.');

export default supabase;
