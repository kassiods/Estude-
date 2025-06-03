const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Loads .env variables into process.env

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: SUPABASE_URL e SUPABASE_KEY devem ser definidos no arquivo .env localizado na pasta /backend');
  // process.exit(1); // Consider exiting if essential config is missing, or handle gracefully
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Optional: log successful initialization, but can be removed for production
// console.log('Cliente Supabase inicializado.');

module.exports = supabase;
