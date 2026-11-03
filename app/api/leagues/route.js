import { api, rpc, required, uuid } from "@/lib/api";
export const POST = api(async (request, { db }) => {
  const b = await request.json();
  const teams = (b.team_ids || []).map(uuid);
  return {
    id: await rpc(db, "admin_create_league", {
      p_name: required(b.name, "League name"),
      p_sport: b.sport,
      p_season: required(b.season, "Season"),
      p_team_ids: teams,
      p_best_of: b.sport === "volleyball" ? Number(b.best_of) : null,
    }),
  };
});
