"use client";

import {useEffect, useId, useRef, useState} from "react";
import Icon from "./Icon";

export default function InstallAppButton({label, className = "icon-button"}) {
  const dialog = useRef(null);
  const titleId = useId();
  const [installed, setInstalled] = useState(false);
  const [prompting, setPrompting] = useState(false);
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    let latestCheck = 0;

    async function update() {
      const check = ++latestCheck;
      const confirmed = Boolean(standalone.matches || navigator.standalone || window.whistleInstalled);
      if (confirmed || window.whistleInstallPrompt || typeof navigator.getInstalledRelatedApps !== "function") {
        setInstalled(confirmed);
        return;
      }

      // The manifest lists only Whistle itself as a related web app.
      try {
        const apps = await navigator.getInstalledRelatedApps();
        if (check === latestCheck) setInstalled(apps.some(app => app.platform === "webapp"));
      } catch {
        if (check === latestCheck) setInstalled(false);
      }
    }

    function checkWhenVisible() {
      if (document.visibilityState === "visible") update();
    }

    update();
    standalone.addEventListener("change", update);
    window.addEventListener("appinstalled", update);
    window.addEventListener("beforeinstallprompt", update);
    document.addEventListener("visibilitychange", checkWhenVisible);
    return () => {
      latestCheck++;
      standalone.removeEventListener("change", update);
      window.removeEventListener("appinstalled", update);
      window.removeEventListener("beforeinstallprompt", update);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, []);

  async function install() {
    const prompt = window.whistleInstallPrompt;
    if (prompt) {
      // The browser allows each deferred prompt to be used once.
      delete window.whistleInstallPrompt;
      setPrompting(true);
      try {
        await prompt.prompt();
        await prompt.userChoice;
        return;
      } catch {
        // If the browser no longer accepts this prompt, offer the manual steps.
      } finally {
        setPrompting(false);
      }
    }

    const isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent)
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isAppleMobile) {
      setInstructions("Open Whistle in Safari, tap Share, then choose Add to Home Screen. If you see Open as Web App, leave it on and tap Add.");
    } else if (!window.isSecureContext) {
      setInstructions("Open Whistle over HTTPS, then choose Install app or Add to Home Screen in your browser menu.");
    } else {
      setInstructions("Open your browser menu and look for Install Whistle, Install app, or Add to Home Screen. In Safari on Mac, look for Add to Dock in the File menu.");
    }
    dialog.current?.showModal();
  }

  if (installed) return null;

  return (
    <>
      <button type="button" className={className} aria-label={label || "Install Whistle app"} title={label || "Install Whistle app"} onClick={install} disabled={prompting}>
        <Icon name="download"/>
        {label}
      </button>
      <dialog className="install-dialog" ref={dialog} aria-labelledby={titleId}>
        <h2 id={titleId}>Install Whistle</h2>
        <p>{instructions}</p>
        <form method="dialog">
          <button type="submit" className="button small">Close</button>
        </form>
      </dialog>
    </>
  );
}
