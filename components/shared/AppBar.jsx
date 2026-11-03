"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import Logo from "./Logo";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";
export default function AppBar({name, admin = false}) {
  const path = usePathname();
  const [greeting, setGreeting] = useState("Good morning");
  useEffect(() => {
    const hour = Number(new Intl.DateTimeFormat("en-GB", {timeZone: "Africa/Lagos", hour: "numeric", hourCycle: "h23"}).format(new Date()));
    setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
  }, []);
  const home = path === "/student" && !admin;
  const initials = name.split(/\s+/).filter(Boolean).slice(0,2).map(n => n[0]).join("");
  return <header className="app-bar">{home ? <Link className="app-greeting" href="/student/profile"><span className="initial-avatar">{initials}</span><span><small>{greeting}</small><strong>{name.split(" ")[0]}</strong></span></Link> : <div className="app-brand"><Link className="brand" href={admin ? "/dashboard" : "/student"} aria-label={admin ? "Whistle match desk" : "Whistle student overview"}><Logo/></Link><small>{admin ? "Campus sports / Admin" : "TU sports platform"}</small></div>}<div className="actions"><ThemeToggle/>{admin ? <details className="app-menu"><summary className="icon-button" aria-label="Admin account"><Icon name="user"/></summary><div className="app-menu-panel"><strong>{name}</strong><form action="/api/auth/logout" method="post"><button type="submit" className="sign-out">Sign out</button></form></div></details> : <Link className="icon-button" href="/student/notifications" aria-label="Notifications"><Icon name="bell"/></Link>}</div></header>;
}
