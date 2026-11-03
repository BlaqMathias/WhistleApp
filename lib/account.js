import { FACULTIES } from "./constants.js";

export function campusEmail(value) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  return /^[^@\s]+@topfaith\.edu\.ng$/.test(email) ? email : null;
}

export function signupDetails(body) {
  const email = campusEmail(body.email);
  if (!email) throw new Error("Use your @topfaith.edu.ng email address.");
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name || name.length > 120) throw new Error("Enter your full name (up to 120 characters).");
  if (!FACULTIES.includes(body.faculty)) throw new Error("Select your faculty.");
  if (typeof body.password !== "string" || body.password.length < 8 || body.password.length > 128)
    throw new Error("Use a password between 8 and 128 characters.");
  return { email, password: body.password, name, faculty: body.faculty };
}

export const accountHome = (profile) => profile.is_admin ? "/dashboard" : "/student";

// Only Whistle match URLs may be used as a post-login destination.
export function matchReturnPath(value) {
  return typeof value === 'string' && /^\/matches\/[a-f\d]{8}-[a-f\d]{4}-[1-8][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}(?:\?tab=(?:predictions|squad))?$/i.test(value) ? value : '';
}
export const matchHref = (id, tab = 'predictions') => `/matches/${id}?tab=${tab === 'squad' ? 'squad' : 'predictions'}`;
