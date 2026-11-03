import { api, rpc, uuid } from "@/lib/api";
export const PATCH = api(async (request, { db, params }) => {
  const b = await request.json();
  return rpc(db, "admin_review_feedback", {
    p_id: uuid(params.feedbackId),
    p_status: b.status,
  });
});
