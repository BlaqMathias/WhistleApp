"use client";
import Link from "next/link";
import { useState } from "react";
import Button from "./Button";
import { send } from "./FormState";
import { notify } from "@/components/shared/Toast";
import { FACULTIES } from "@/lib/constants";
import { campusEmail } from "@/lib/account";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      if (form.get("password") !== form.get("confirmPassword")) throw new Error("Your passwords do not match.");
      const result = await send("/api/auth/signup", Object.fromEntries(form));
      if (result.redirect) window.location.assign(result.redirect);
      else {
        notify("Confirmation email sent.");
        setSent(true);
        setPending(false);
      }
    } catch (error) { notify(error.message, "error"); setPending(false); }
  }
  if (sent) return (
    <div className="form-stack">
      <p className="help">Check your university inbox for a confirmation email. Follow the link to finish signing up. If you already have an account, sign in.</p>
      <p className="help">Check your spam folder too. If the link has expired, submit the signup form again to request another email.</p>
      <Button onClick={() => setSent(false)} variant="secondary">Back to signup</Button>
      <Link href="/login" className="quiet-link">Return to sign in</Link>
    </div>
  );
  return (
    <form onSubmit={submit} className="form-stack">
      <label>Full name<input name="name" autoComplete="name" maxLength={120} required /></label>
      <label>University email<input name="email" type="email" autoComplete="username" placeholder="matric@topfaith.edu.ng" value={email} onChange={(event) => setEmail(event.target.value)} required aria-describedby="matric-preview" /></label>
      <p id="matric-preview" className="help">{campusEmail(email) ? `Matric number: ${campusEmail(email).split("@")[0]}` : "Your matric number is taken automatically from your university email."}</p>
      <label>Faculty<select name="faculty" defaultValue="" required><option value="" disabled>Select your faculty</option>{FACULTIES.map((faculty) => <option key={faculty}>{faculty}</option>)}</select></label>
      <label>Password<input name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} aria-describedby="password-help" required /></label>
      <p id="password-help" className="help">Use at least 8 characters.</p>
      <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required /></label>
      <Button disabled={pending}>{pending ? "Creating account…" : "Create account"}</Button>
      <p className="help">Already registered? <Link href="/login">Sign in</Link>.</p>
    </form>
  );
}
