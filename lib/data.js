import "server-only";
import { cache } from "react";
import { currentAdmin } from "./auth.js";
import { redirect } from "next/navigation";
import { adminClient } from "./supabase/admin.js";
import { rpc } from "./api.js";
export const getData = cache(async () => {
  if (!(await currentAdmin())) redirect("/login");
  return rpc(adminClient(), "admin_snapshot");
});

export async function getStandings(id) {
  if (!(await currentAdmin())) redirect("/login");
  return rpc(adminClient(), "admin_standings", { p_league_id: id });
}
