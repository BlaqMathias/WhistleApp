import { api, rpc } from "@/lib/api";
export const GET = api(async (_, { db }) => rpc(db, "admin_snapshot"));
