import { api, rpc, uuid, HttpError } from "@/lib/api";

export const POST = api(async (request, { db, params }) => {
  const body = await request.json();
  if (!body || typeof body !== "object" || Array.isArray(body) ||
      !body.player_details || typeof body.player_details !== "object" || Array.isArray(body.player_details))
    throw new HttpError("Enter valid match player details.");
  return rpc(db, "admin_save_player_details", {
    p_fixture_id: uuid(params.fixtureId),
    p_details: body.player_details,
  });
});
