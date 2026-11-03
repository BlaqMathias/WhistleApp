"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Icon from "@/components/shared/Icon";
const items = [["/student", "Home", "home"], ["/student/fixtures", "Fixtures", "calendar"], ["/student/live", "Live", "live"], ["/student/standings", "Table", "trophy"], ["/student/profile", "Me", "user"]];
export default function Sidebar() {
  const path = usePathname();
  return <nav className="tab-bar" aria-label="Student navigation"><Link href="/student" className="rail-brand" aria-label="Whistle student overview">w.</Link>{items.map(([href, label, icon]) => {
    const active = href === "/student" ? path === href : path.startsWith(href);
    return <Link href={href} key={href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}><span className="tab-icon"><Icon name={icon}/></span><span>{label}</span></Link>;
  })}</nav>;
}
