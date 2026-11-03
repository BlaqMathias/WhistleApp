import { NextResponse } from "next/server";
import { createClient, configured } from "@/lib/supabase/server";
import { campusEmail, accountHome, matchReturnPath } from "@/lib/account";
export async function POST(request) {
  try {
    if (!configured())
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 503 },
      );
    if (
      new URL(request.headers.get("origin") || "http://invalid").host !==
      (request.headers.get("x-forwarded-host") || request.headers.get("host"))
    )
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 },
      );
    const body = await request.json();
    const email = campusEmail(body.email);
    const { password } = body;
    if (
      !email ||
      typeof password !== "string"
    )
      return NextResponse.json(
        { error: "Use your Topfaith University account." },
        { status: 400 },
      );
    const db = await createClient();
    const { data, error } = await db.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error || !data.user)
      return NextResponse.json(
        { error: "Sign-in failed. Check your email and password." },
        { status: 401 },
      );
    const { data: profile } = await db
      .from("students")
      .select("is_admin")
      .eq("auth_user_id", data.user.id)
      .maybeSingle();
    if (!profile) {
      await db.auth.signOut();
      return NextResponse.json(
        { error: "Your student profile is unavailable. Contact the Whistle administrator." },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { ok: true, redirect: matchReturnPath(body.next) || accountHome(profile) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Sign-in could not be completed. Check your connection and Supabase setup.",
      },
      { status: 500 },
    );
  }
}
