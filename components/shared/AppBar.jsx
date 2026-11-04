"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useId, useState} from "react";
import StudentMenu from "@/components/student/StudentMenu";
import Logo from "./Logo";
import Icon from "./Icon";
import InstallAppButton from "./InstallAppButton";
import ThemeToggle from "./ThemeToggle";
import {HeaderSearchToggle, HeaderSearchPanel} from "./HeaderSearch";

export default function AppBar({name, admin = false}) {
  const path = usePathname();
  const searchId = useId();
  const [searchOpen, setSearchOpen] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => setSearchOpen(false), [path]);
  useEffect(() => {
    const hour = Number(new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos", hour: "numeric", hourCycle: "h23",
    }).format(new Date()));
    setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
  }, []);

  const home = path === "/student" && !admin;

  return (
    <header className="app-bar">
      <div className="app-bar-row">
        {home ? (
          <Link className="app-greeting" href="/student/profile">
            <span><small>{greeting}</small><strong>{name.trim().split(/\s+/)[0]}</strong></span>
          </Link>
        ) : (
          <div className="app-brand">
            <Link className="brand" href={admin ? "/dashboard" : "/student"} aria-label={admin ? "Whistle match desk" : "Whistle student overview"}>
              <Logo/>
            </Link>
            <small>{admin ? "Campus sports / Admin" : "TU sports platform"}</small>
          </div>
        )}
        <div className="actions">
          <ThemeToggle/>
          {admin ? (
            <>
              <InstallAppButton/>
              <details className="app-menu">
                <summary className="icon-button" aria-label="Admin account"><Icon name="user"/></summary>
                <div className="app-menu-panel">
                  <strong>{name}</strong>
                  <form action="/api/auth/logout" method="post">
                    <button type="submit" className="sign-out">Sign out</button>
                  </form>
                </div>
              </details>
            </>
          ) : (
            <>
              <HeaderSearchToggle open={searchOpen} onClick={() => setSearchOpen(value => !value)} id={searchId}/>
              <StudentMenu onOpen={() => setSearchOpen(false)}/>
            </>
          )}
        </div>
      </div>
      {!admin && searchOpen && <HeaderSearchPanel id={searchId} onNavigate={() => setSearchOpen(false)}/>}
    </header>
  );
}
