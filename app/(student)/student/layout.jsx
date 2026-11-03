import {redirect} from "next/navigation";
import {currentAccount} from "@/lib/auth";
import Sidebar from "@/components/student/Sidebar";
import AppBar from "@/components/shared/AppBar";
export const dynamic = "force-dynamic";
export default async function StudentLayout({children}) {
  const account = await currentAccount();
  if (!account) redirect("/login");
  if (account.is_admin) redirect("/dashboard");
  return <div className="app-shell"><AppBar name={account.name}/><main id="main">{children}</main><Sidebar/></div>;
}
