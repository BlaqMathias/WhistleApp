import { api, rpc, HttpError } from "@/lib/api";

export const PATCH = api(async (request, { db, account }) => {
  const body = await request.json();
  if (typeof body.notifications_enabled !== "boolean")
    throw new HttpError("Choose whether notifications are on or off.");
  return { notifications_enabled: await rpc(db, "student_set_notifications", {
    p_student_id: account.id, p_enabled: body.notifications_enabled,
  }) };
}, { access: "student" });
