"use client";
import { createClient } from "@supabase/supabase-js";
// Only used for one-object signed logo uploads. Admin sessions stay in HTTP-only cookies.
export function uploadClient() {
  return createClient(
    process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_WHISTLE_DEMO === '1' ? `${window.location.origin}/__test_supabase` : process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
