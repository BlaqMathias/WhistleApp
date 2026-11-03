import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/auth";
import { accountHome } from "@/lib/account";

export const dynamic = "force-dynamic";
export default async function Index() {
  const account = await currentAccount();
  redirect(account ? accountHome(account) : '/login');
}
