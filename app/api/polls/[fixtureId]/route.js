import { api, rpc, uuid } from "@/lib/api";

// Every read requires an account; students receive only their own choice.
export const GET = api(async (_request, { params, db, account }) => {
  return { poll: await rpc(db, "whistle_poll_snapshot", {
    p_fixture_id: uuid(params.fixtureId), p_student_id: account.is_admin ? null : account.id,
  }) };
}, { access: "account" });
