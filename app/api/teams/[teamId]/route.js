import { api, rpc, required, uuid } from "@/lib/api";
export const PATCH = api(async (request, { db, params }) => {
  const b = await request.json();
  const id = uuid(params.teamId);
  if (b.action === "archive")
    return rpc(db, "admin_archive", { p_entity: "teams", p_id: id });
  return {
    id: await rpc(db, "admin_save_team", {
      p_id: id,
      p_name: required(b.name, "Team name"),
      p_sport: b.sport,
      p_student_ids: (b.student_ids || []).map(uuid),
    }),
  };
});
