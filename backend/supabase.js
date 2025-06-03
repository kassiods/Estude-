import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: SUPABASE_URL e SUPABASE_KEY devem ser definidos no arquivo .env localizado na pasta /backend');
  process.exit(1); // Encerra o processo se as chaves não estiverem configuradas
}

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Cliente Supabase inicializado.');
