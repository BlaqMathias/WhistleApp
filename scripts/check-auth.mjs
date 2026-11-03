// Read-only: no signup requests, email delivery, or account changes.
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd(), true);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing public Supabase URL or key in .env.local.");
  process.exit(1);
}
try {
  const endpoint = new URL("auth/v1/settings", url.replace(/\/?$/, "/"));
  const response = await fetch(endpoint, { headers: { apikey: key }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Auth settings returned HTTP ${response.status}`);
  const settings = await response.json();
  let ready = true;
  for (const [label, actual, expected] of [
    ["Email/password authentication enabled", settings.external?.email, true],
    ["New account signup enabled", settings.disable_signup, false],
    ["Email confirmation required", settings.mailer_autoconfirm, false],
  ]) {
    const passed = actual === expected;
    console.log(`${passed ? "PASS" : "CHECK"}: ${label}${typeof actual !== "boolean" ? " (not reported by the API; verify in the dashboard)" : ""}`);
    ready &&= passed;
  }
  console.log("SMTP delivery, email templates, and allowed redirect URLs must be checked in the Supabase dashboard.");
  process.exitCode = ready ? 0 : 1;
} catch (error) {
  console.error(`Auth setup check failed: ${error.cause?.code || error.code || error.message}`);
  process.exitCode = 1;
}
