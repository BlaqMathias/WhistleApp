// Return actionable categories without exposing upstream details or identities.
export function signupFailure(error) {
  const code = error.code || "unknown";
  const message = error.message || "";
  if (error.status === 429 || ["over_email_send_rate_limit", "over_request_rate_limit"].includes(code))
    return { error: "Too many signup attempts. Please wait a few minutes before trying again.", status: 429, category: "rate_limit" };
  if (code === "email_address_not_authorized" || /error sending (confirmation|verification) (email|mail)/i.test(message))
    return { error: "The confirmation email could not be sent. Ask the Whistle administrator to check Supabase SMTP settings and email logs.", status: 503, category: "email_delivery" };
  if (/database error (saving|creating) (new )?user/i.test(message))
    return { error: "Your account could not be saved. Ask the Whistle administrator to check Supabase Auth and database logs.", status: 503, category: "database" };
  if (code === "signup_disabled" || code === "email_provider_disabled")
    return { error: "Email signup is currently disabled. Contact the Whistle administrator.", status: 503, category: "signup_disabled" };
  if (code === "weak_password")
    return { error: "Choose a stronger password that meets the university account requirements.", status: 400, category: "password" };
  if (code === "email_address_invalid")
    return { error: "Check your university email address and try again.", status: 400, category: "email" };
  if (error.name === "AuthRetryableFetchError" || /fetch failed|network request failed/i.test(message))
    return { error: "The signup service could not be reached. Please try again shortly.", status: 503, category: "connection" };
  return { error: "Account creation could not be completed. Check your details or sign in if you already have an account.", status: 400, category: "signup" };
}
