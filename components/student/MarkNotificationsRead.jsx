"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import { send, FormStatus } from "@/components/shared/FormState";

export default function MarkNotificationsRead({ ids }) {
  const router = useRouter();
  const key = ids.join(",");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const markRead = useCallback(async () => {
    if (!key) return;
    setPending(true);
    setError("");
    try {
      const unread = key.split(",");
      for (let i = 0; i < unread.length; i += 200)
        await send("/api/notifications", { notification_ids: unread.slice(i, i + 200) });
      router.refresh();
    } catch (error) { setError(error.message); }
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
  return error ? <div className="section"><FormStatus error={error} /><div className="actions section"><Button variant="secondary" disabled={pending} onClick={markRead}>Retry marking as read</Button></div></div> : null;
}
