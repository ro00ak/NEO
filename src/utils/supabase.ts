import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  'https://yyxxrtrysiqtpgsusuoai.supabase.co';

const supabaseKey =
  'ضع هنا مفتاح sb_publishable كاملًا';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('بيانات اتصال Supabase غير موجودة');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
);
