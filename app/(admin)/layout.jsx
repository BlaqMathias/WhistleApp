import {redirect} from "next/navigation";
import {currentAdmin} from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import AppBar from "@/components/shared/AppBar";
export const dynamic = "force-dynamic";
export default async function AdminLayout({children}) {
  const admin = await currentAdmin();
  if (!admin) redirect("/login");
  return <div className="app-shell"><AppBar name={admin.name} admin/><main id="main">{children}</main><AdminNav/></div>;
}
