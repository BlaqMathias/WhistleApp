import "server-only";
import { createClient, configured } from "./supabase/server.js";
export async function currentAccount() {
  if (!configured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user || !/^[^@\s]+@topfaith\.edu\.ng$/i.test(user.email || ""))
    return null;
  const { data: profile } = await supabase
    .from("students")
    .select("id,name,is_admin,email,matric_number,faculty")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  return profile ? { ...profile, auth_user_id: user.id } : null;
}

export async function currentAdmin() {
  const profile = await currentAccount();
  return profile?.is_admin ? profile : null;
}
