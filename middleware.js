import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { matchReturnPath } from "./lib/account.js";
export async function middleware(request) {
  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
    return NextResponse.redirect(new URL("/login", request.url));
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (values) => {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
            }),
          );
        },
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let allowed = false;
  const studentRoute = request.nextUrl.pathname === "/student" || request.nextUrl.pathname.startsWith("/student/");
  const sharedRoute = request.nextUrl.pathname === "/" || request.nextUrl.pathname.startsWith("/matches/");
  if (user && /^[^@\s]+@topfaith\.edu\.ng$/i.test(user.email || "")) {
    const { data } = await supabase
      .from("students")
      .select("is_admin")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (data && !sharedRoute && (studentRoute ? data.is_admin : !data.is_admin)) {
      const destination = NextResponse.redirect(new URL(data.is_admin ? "/dashboard" : "/student", request.url));
      response.cookies.getAll().forEach((c) => destination.cookies.set(c));
      destination.headers.set("Cache-Control", "private, no-store, max-age=0");
      return destination;
    }
    allowed = !!data && (sharedRoute || (studentRoute ? !data.is_admin : !!data.is_admin));
  }
  if (!allowed) {
    const login = new URL("/login", request.url);
    const next = matchReturnPath(request.nextUrl.pathname + request.nextUrl.search) || matchReturnPath(request.nextUrl.pathname);
    if (next) login.searchParams.set('next', next);
    const denied = NextResponse.redirect(login);
    response.cookies.getAll().forEach((c) => denied.cookies.set(c));
    denied.headers.set("Cache-Control", "private, no-store, max-age=0");
    return denied;
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
export const config = {
  matcher: [
    "/",
    "/matches/:path*",
    "/student/:path*",
    "/dashboard/:path*",
    "/teams/:path*",
    "/leagues/:path*",
    "/friendlies/:path*",
    "/fixtures/:path*",
    "/feedback/:path*",
  ],
};
