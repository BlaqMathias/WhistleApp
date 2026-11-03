import { api, rpc, uuid, integer } from "@/lib/api";
export const POST = api(async (request, { db, params }) => {
  const b = await request.json();
  return rpc(db, "admin_score", {
    p_fixture_id: uuid(params.fixtureId),
    p_side: b.side,
    p_increment: integer(b.increment),
  });
});
