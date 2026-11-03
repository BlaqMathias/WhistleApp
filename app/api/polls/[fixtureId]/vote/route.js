import { api, rpc, uuid, HttpError } from "@/lib/api";

export const POST = api(async (request, { params, db, account }) => {
  const body = await request.json();
  if (!["win_home", "draw", "win_away"].includes(body.choice))
    throw new HttpError("Choose a valid prediction.");
  return rpc(db, "student_vote", {
    p_fixture_id: uuid(params.fixtureId),
    p_student_id: account.id,
    p_choice: body.choice,
  });
}, { access: "student" });
