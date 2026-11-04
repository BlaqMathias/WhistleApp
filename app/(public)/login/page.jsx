import { redirect } from "next/navigation";
import Link from "next/link";
import { currentAccount } from "@/lib/auth";
import { accountHome, matchReturnPath } from "@/lib/account";
import { configured } from "@/lib/supabase/server";
import LoginForm from "@/components/admin/LoginForm";
import InstallAppButton from "@/components/shared/InstallAppButton";
import Logo from "@/components/shared/Logo";
import Court from "@/components/shared/Court";
export const dynamic = "force-dynamic";
export default async function Login({ searchParams }) {
  const query = await searchParams;
  const account = await currentAccount();
  const next = matchReturnPath(query?.next);
  if (account) redirect(next || accountHome(account));
  return (
    <main id="main" className="login-page">
      <section className="login-identity"><Court/>
        <header className="auth-brand-row"><Link href="/" className="brand" aria-label="Whistle home"><Logo /></Link><InstallAppButton/></header>
        <div>
          <h1>
            The match
            <br />
            starts here.
          </h1>
          <p>
            TU sports platform
            <br />
            Campus sports
          </p>
        </div>
        <span>Football / Basketball / Volleyball</span>
      </section>
      <section className="login-form">
        <h2>Sign in to Whistle</h2>
        {query?.confirmation === "failed" && <p className="form-message error" role="alert">This confirmation link is invalid or has expired. Try signing in if you already confirmed your email, or return to signup to request another email.</p>}
        {configured() ? (
          <LoginForm next={next} />
        ) : (
          <p className="form-message">
            Sign in is temporarily unavailable. Please try again later.
          </p>
        )}
      </section>
    </main>
  );
}
