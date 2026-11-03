import { api, rpc, required, uuid } from "@/lib/api";
export const POST = api(async (request, { db }) => {
  const b = await request.json();
  return {
    id: await rpc(db, "admin_save_team", {
      p_id: null,
      p_name: required(b.name, "Team name"),
      p_sport: b.sport,
      p_student_ids: (b.student_ids || []).map(uuid),
    }),
  };
});
