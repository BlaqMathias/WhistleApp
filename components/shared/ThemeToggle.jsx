"use client";
import {useEffect, useState} from "react";
import Icon from "./Icon";
export default function ThemeToggle({segmented = false}) {
  const [choice, setChoice] = useState("system");
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function sync(event) {
      let saved = "system";
      try { saved = localStorage.getItem("whistle-theme") || "system"; } catch {}
      if (event?.type === "whistle-theme-change") saved = event.detail;
      if (!["light", "dark"].includes(saved)) saved = "system";
      const root = document.documentElement;
      if (saved === "system") root.removeAttribute("data-theme");
      else root.dataset.theme = saved;
      setChoice(saved);
      setDark(saved === "dark" || (saved === "system" && media.matches));
      const colour = getComputedStyle(root).getPropertyValue("--bg").trim();
      document.querySelectorAll('meta[name="theme-color"]').forEach(meta => { meta.content = colour; meta.removeAttribute("media"); });
    }
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("whistle-theme-change", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("whistle-theme-change", sync);
    };
  }, []);
  function choose(value) {
    try {
      if (value === "system") localStorage.removeItem("whistle-theme");
      else localStorage.setItem("whistle-theme", value);
    } catch {}
    const root = document.documentElement;
    if (value === "system") root.removeAttribute("data-theme");
    else root.dataset.theme = value;
    setChoice(value);
    const isDark = value === "dark" || (value === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    const colour = getComputedStyle(root).getPropertyValue("--bg").trim();
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {meta.content = colour; meta.removeAttribute("media");});
    window.dispatchEvent(new CustomEvent("whistle-theme-change", {detail: value}));
  }
  if (segmented) return <div className="theme-options" role="group" aria-label="Appearance">{["light", "dark", "system"].map(value => <button key={value} type="button" aria-pressed={choice === value} onClick={() => choose(value)}>{value[0].toUpperCase() + value.slice(1)}</button>)}</div>;
  return <button type="button" className="icon-button" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} onClick={() => choose(dark ? "light" : "dark")}><Icon name={dark ? "sun" : "moon"}/></button>;
}
