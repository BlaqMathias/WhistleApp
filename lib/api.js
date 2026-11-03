import "server-only";
import { NextResponse } from "next/server";
import { currentAdmin, currentAccount } from "./auth.js";
import { adminClient } from "./supabase/admin.js";
export class HttpError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export function uuid(value) {
  if (
    typeof value !== "string" ||
    !/^[\da-f]{8}-[\da-f]{4}-[1-8][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(
      value,
    )
  )
    throw new HttpError("Invalid record identifier.");
  return value;
}
export function required(value, label) {
  if (typeof value !== "string" || !value.trim())
    throw new HttpError(`${label} is required.`);
  return value.trim();
}
export function timestamp(value) {
  if (
    typeof value !== "string" ||
    !/[zZ]$|[+-]\d\d:\d\d$/.test(value) ||
    !Number.isFinite(Date.parse(value))
  )
    throw new HttpError("Enter a valid date and time.");
  return new Date(value).toISOString();
}
export function integer(value) {
  if (!Number.isSafeInteger(value) || value < 0 || value > 2147483647)
    throw new HttpError("Scores must be non-negative whole numbers.");
  return value;
}
export async function rpc(db, name, args = {}) {
  const { data, error } = await db.rpc(name, args);
  if (error) {
    if (error.code === "23505")
      throw new HttpError(
        "This record already exists. Team names must be unique within their sport.",
        409,
      );
    if (error.code === "P0001") throw new HttpError(error.message, 409);
    if (["23502", "23514", "22P02", "22003"].includes(error.code))
      throw new HttpError("Check the required fields, sport, and values.");
    if (error.code === "23503")
      throw new HttpError("One of the selected records no longer exists.", 409);
    console.error("Database request failed:", name, error.code, error.message);
    throw new HttpError(
      "The database request failed. Check the Supabase setup and try again.",
      500,
    );
  }
  return data;
}
export function api(handler, { access = "admin" } = {}) {
  return async (request, context) => {
    try {
      if (!["GET", "HEAD"].includes(request.method)) {
        const origin = request.headers.get("origin");
        const host =
          request.headers.get("x-forwarded-host") ||
          request.headers.get("host");
        if (!origin || new URL(origin).host !== host)
          throw new HttpError("This request must come from Whistle.", 403);
      }
      const account = access === "admin" ? await currentAdmin() : await currentAccount();
      if (!account)
        throw new HttpError(access === "admin" ? "Admin sign-in required." : access === "student" ? "Student sign-in required." : "Sign-in required.", 401);
      if (access === "student" && account.is_admin)
        throw new HttpError("Student access required.", 403);
      const params = (await context?.params) || {};
      const db = adminClient();
      const result = await handler(request, { params, db, account });
      const response =
        result instanceof Response
          ? result
          : NextResponse.json(result ?? { ok: true });
      response.headers.set("Cache-Control", "private, no-store, max-age=0");
      return response;
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof SyntaxError
              ? "Invalid request body."
              : error.message || "Request failed.",
        },
        {
          status: error.status || 500,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }
  };
}
