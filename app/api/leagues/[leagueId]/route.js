import { api, rpc, uuid, HttpError } from "@/lib/api";
export const PATCH = api(async (request, { db, params }) => {
  const b = await request.json();
  if (b.action !== "archive") throw new HttpError("Choose an archive action.");
  return rpc(db, "admin_archive", {
    p_entity: "leagues",
    p_id: uuid(params.leagueId),
  });
});
