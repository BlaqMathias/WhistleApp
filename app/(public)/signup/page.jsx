import { redirect } from "next/navigation";
import Link from "next/link";
import { currentAccount } from "@/lib/auth";
import { accountHome } from "@/lib/account";
import { configured } from "@/lib/supabase/server";
import SignupForm from "@/components/shared/SignupForm";
import InstallAppButton from "@/components/shared/InstallAppButton";
import Logo from "@/components/shared/Logo";
import Court from "@/components/shared/Court";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create account" };
export default async function Signup() {
  const account = await currentAccount();
  if (account) redirect(accountHome(account));
  return (
    <main id="main" className="login-page">
      <section className="login-identity"><Court/><header className="auth-brand-row"><Link href="/" className="brand" aria-label="Whistle home"><Logo /></Link><InstallAppButton/></header><div><h1>Your campus.<br />Your game.</h1><p>TU sports platform<br />Campus sports</p></div><span>Football / Basketball / Volleyball</span></section>
      <section className="login-form"><h2>Join Whistle</h2>{configured() ? <SignupForm /> : <p className="form-message">Signup is temporarily unavailable. Please try again later.</p>}</section>
    </main>
  );
}
