"use client";

import {useEffect, useState} from "react";
import Icon from "./Icon";

export function notify(message, type = "success") {
  if (!message) return;
  window.dispatchEvent(new CustomEvent("whistle-toast", {detail: {message, type}}));
}

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let timeout;
    let id = 0;

    function show(event) {
      const {message, type} = event.detail ?? {};
      if (typeof message !== "string" || !message.trim()) return;

      const variant = type === "error" ? "error" : "success";
      clearTimeout(timeout);
      setToast({message, variant, id: ++id});
      timeout = setTimeout(() => setToast(null), variant === "error" ? 6500 : 3500);
    }

    window.addEventListener("whistle-toast", show);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("whistle-toast", show);
    };
  }, []);

  return (
    <div className="toast-region">
      <div role="status" aria-atomic="true">
        {toast?.variant === "success" && (
          <div className="toast-pill" key={toast.id}><Icon name="check"/>{toast.message}</div>
        )}
      </div>
      <div role="alert" aria-atomic="true">
        {toast?.variant === "error" && (
          <div className="toast-pill toast-error" key={toast.id}><Icon name="close"/>{toast.message}</div>
        )}
      </div>
    </div>
  );
}
