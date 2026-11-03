import { api, rpc, uuid, HttpError } from "@/lib/api";
import { feedbackDetails } from "@/lib/feedback";

export const POST = api(async (request, { db, account }) => {
  const body = await request.json();
  let details;
  try { details = feedbackDetails(body); }
  catch (error) { throw new HttpError(error.message); }
  return { id: await rpc(db, "student_submit_feedback", {
    p_id: uuid(body.id),
    p_student_id: account.id,
    p_category: details.category,
    p_message: details.message,
  }) };
}, { access: "student" });
