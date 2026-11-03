import { createClient } from '@supabase/supabase-js';
export function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || /YOUR_|your-project/i.test(url + key)) throw new Error('Set the real project URL and server-only service-role key in .env.local.');
  return createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false}});
}
export function check(result) {
  if (result.error) throw new Error(result.error.message || 'Supabase request failed.');
  return result.data;
}
