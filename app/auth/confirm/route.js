import { NextResponse } from "next/server";
import { createClient, configured } from "@/lib/supabase/server";
import { accountHome } from "@/lib/account";

export async function GET(request) {
  const url = new URL(request.url);
  let destination = "/login?confirmation=failed";
  try {
    if (configured()) {
      const db = await createClient();
      const token_hash = url.searchParams.get("token_hash");
      const code = url.searchParams.get("code");
      const result = token_hash && url.searchParams.get("type") === "email"
        ? await db.auth.verifyOtp({ token_hash, type: "email" })
        : code ? await db.auth.exchangeCodeForSession(code) : null;
      if (result && !result.error && result.data.user) {
        const { data: profile } = await db.from("students").select("is_admin").eq("auth_user_id", result.data.user.id).maybeSingle();
        if (profile) destination = accountHome(profile);
        else await db.auth.signOut();
      }
    }
  } catch { /* Show a retry message without exposing confirmation tokens. */ }
  const response = NextResponse.redirect(new URL(destination, url.origin), 303);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
