"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import { send } from "@/components/shared/FormState";

import { notify } from "@/components/shared/Toast";

export default function MarkNotificationsRead({ ids }) {
  const router = useRouter();
  const key = ids.join(",");
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);
  const markRead = useCallback(async () => {
    if (!key) return;
    setPending(true);
    setFailed(false);
    try {
      const unread = key.split(",");
      for (let i = 0; i < unread.length; i += 200)
        await send("/api/notifications", { notification_ids: unread.slice(i, i + 200) });
      router.refresh();
    } catch (error) {
      setFailed(true);
      notify(error.message, "error");
    }
    finally { setPending(false); }
  }, [key, router]);
  useEffect(() => {
    let attempted = false;
    function opened() {
      if (!attempted && document.visibilityState === "visible") {
        attempted = true;
        markRead();
      }
    }
    opened();
    document.addEventListener("visibilitychange", opened);
    return () => document.removeEventListener("visibilitychange", opened);
  }, [markRead]);
  return failed ? <div className="actions section"><Button variant="secondary" disabled={pending} onClick={markRead}>Retry marking as read</Button></div> : null;
}
