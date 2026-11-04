"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/shared/Button";
import { send } from "@/components/shared/FormState";
import { notify } from "@/components/shared/Toast";
export default function LoginForm({next = ''}) {
  const [pending, setPending] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setPending(true);
    const data = new FormData(e.currentTarget);
    try {
      const result = await send("/api/auth/login", {
        email: data.get("email"),
        password: data.get("password"),
        next,
      });
      window.location.assign(result.redirect);
    } catch (e) {
      notify(e.message, "error");
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
      <Button disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
      <p className="help">
        New to Whistle? <Link href="/signup">Create your student account</Link>.
      </p>
    </form>
  );
}
