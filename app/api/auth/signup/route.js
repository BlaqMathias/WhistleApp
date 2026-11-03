import { NextResponse } from "next/server";
import { createClient, configured } from "@/lib/supabase/server";
import { signupDetails } from "@/lib/account";
import { signupFailure } from "@/lib/signupFailure";

export async function POST(request) {
  const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
  try {
    const origin = request.headers.get("origin");
    if (!origin || new URL(origin).host !== (request.headers.get("x-forwarded-host") || request.headers.get("host")))
      return reply({ error: "Invalid request origin." }, 403);
    if (!configured()) return reply({ error: "Signup is temporarily unavailable." }, 503);
    let details;
    try { details = signupDetails(await request.json()); }
    catch (error) { return reply({ error: error instanceof SyntaxError ? "Invalid request body." : error.message }, 400); }
    const db = await createClient();
    const { data: existing } = await db.auth.getUser();
    if (existing.user) return reply({ error: "Sign out before creating another account." }, 409);
    const { data, error } = await db.auth.signUp({
      email: details.email, password: details.password,
      options: { data: { name: details.name, faculty: details.faculty }, emailRedirectTo: `${origin}/auth/confirm` },
    });
    if (error) {
      const failure = signupFailure(error);
      console.warn("Signup failed:", { code: error.code || "unknown", status: error.status, category: failure.category });
      return reply({ error: failure.error }, failure.status);
    }
    return reply(data.session ? { redirect: "/student" } : { confirmationRequired: true });
  } catch {
    return reply({ error: "Signup could not be completed. Check your connection and try again." }, 500);
  }
}
