"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/shared/Button";
import { send, FormStatus } from "@/components/shared/FormState";
export default function LoginForm({next = ''}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      const result = await send("/api/auth/login", {
        email: data.get("email"),
        password: data.get("password"),
        next,
      });
      window.location.assign(result.redirect);
    } catch (e) {
      setError(e.message);
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit} className="form-stack">
      <label>
        University email
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="name@topfaith.edu.ng"
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <FormStatus error={error} />
      <Button disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
      <p className="help">
        New to Whistle? <Link href="/signup">Create your student account</Link>.
      </p>
    </form>
  );
}
