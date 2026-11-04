"use client";

import {useEffect, useId, useRef, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Icon from "@/components/shared/Icon";
import InstallAppButton from "@/components/shared/InstallAppButton";

const links = [
  {href: "/student", label: "Home", icon: "home"},
  {href: "/student/live", label: "Live", icon: "live"},
  {href: "/student/fixtures", label: "Fixtures", icon: "calendar"},
  {href: "/student/profile", label: "Profile", icon: "user"},
  {href: "/student/notifications", label: "Notifications", icon: "bell"},
];

export default function StudentMenu({onOpen}) {
  const pathname = usePathname();
  const dialog = useRef(null);
  const id = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function openMenu() {
    onOpen?.();
    dialog.current.showModal();
    setOpen(true);
  }

  function closeMenu() {
    dialog.current.close();
  }

  return (
    <>
      <button
        type="button"
        className="icon-button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-controls={id}
        aria-expanded={open}
        onClick={openMenu}
      >
        <Icon name="menu"/>
      </button>
      <dialog
        ref={dialog}
        id={id}
        className="mobile-menu student-menu"
        aria-labelledby={`${id}-title`}
        onClose={() => setOpen(false)}
        onClick={event => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="mobile-menu-content">
          <div className="section-header">
            <h2 id={`${id}-title`}>Menu</h2>
            <button type="button" className="icon-button" aria-label="Close menu" onClick={closeMenu}>
              <Icon name="close"/>
            </button>
          </div>
          <nav aria-label="Student menu navigation">
            {links.map(({href, label, icon}) => (
              <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={closeMenu}>
                <Icon name={icon}/>
                {label}
              </Link>
            ))}
          </nav>
          <div className="mobile-menu-account student-menu-account">
            <InstallAppButton label="Install as app" className="student-menu-install"/>
            <form action="/api/auth/logout" method="post">
              <button className="sign-out" type="submit">Sign out</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
