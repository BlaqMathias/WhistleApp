import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST(request) {
  const origin = request.headers.get("origin");
  if (
    !origin ||
    new URL(origin).host !==
      (request.headers.get("x-forwarded-host") || request.headers.get("host"))
  )
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  const db = await createClient();
  await db.auth.signOut();
  return NextResponse.redirect(new URL("/login", origin), 303);
}
