"use client";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import Icon from "@/components/shared/Icon";
const items = [["/dashboard", "Match desk", "home"], ["/teams", "Teams", "users"], ["/leagues", "Leagues", "trophy"], ["/friendlies", "Friendlies", "calendar"], ["/feedback", "Feedback", "whistle"]];
export default function AdminNav() {
  const path = usePathname();
  return <nav className="tab-bar" aria-label="Admin navigation"><Link href="/dashboard" className="rail-brand" aria-label="Whistle match desk"><Image src="/icons/icon-192.png" width={40} height={40} alt="" unoptimized/></Link>{items.map(([href, label, icon]) => <Link href={href} key={href} className={path.startsWith(href) ? "active" : ""} aria-current={path.startsWith(href) ? "page" : undefined}><span className="tab-icon"><Icon name={icon}/></span><span>{label}</span></Link>)}</nav>;
}
