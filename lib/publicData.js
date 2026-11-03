import "server-only";
import { configured } from "./supabase/server.js";
import { adminClient } from "./supabase/admin.js";
import { rpc, HttpError } from "./api.js";
import { currentAccount } from "./auth.js";

export async function getPublicHome() {
  if (!(await currentAccount())) throw new HttpError('Sign-in required.', 401);
  if (!configured()) return null;
  try { return await rpc(adminClient(), "public_home"); }
  catch { return null; }
}

export async function getPublicFixture(id) {
  const account = await currentAccount();
  if (!account) throw new HttpError('Sign-in required.', 401);
  if (!configured()) return null;
  return rpc(adminClient(), 'public_fixture', {p_fixture_id: id, p_student_id: account.is_admin ? null : account.id});
}
