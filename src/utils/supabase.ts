import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL غير موجود');
}

if (!supabaseKey) {
  throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY غير موجود');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
);
