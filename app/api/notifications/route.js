import { api, rpc, uuid, HttpError } from "@/lib/api";

export const GET = api(async (_request, { db, account }) => {
  return rpc(db, "student_notifications", { p_student_id: account.id });
}, { access: "student" });

export const POST = api(async (request, { db, account }) => {
  const body = await request.json();
  if (!Array.isArray(body.notification_ids) || body.notification_ids.length > 200)
    throw new HttpError("Select up to 200 notifications at a time.");
  await rpc(db, "student_read_notifications", {
    p_student_id: account.id,
    p_notification_ids: [...new Set(body.notification_ids.map(uuid))],
  });
  return { ok: true };
}, { access: "student" });
