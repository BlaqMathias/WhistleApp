"use client";
import Button from "@/components/shared/Button";
import { useMutation, send } from "@/components/shared/FormState";

export default function NotificationPreference({ enabled }) {
  const mutation = useMutation();
  return (
    <section className="form-panel form-stack notification-preference" aria-label="Notification preference">
      <div><h2>Stay in the game</h2><p className="help">Receive live score updates and announcements about new leagues and Friendlies.</p></div>
      <div className="actions">
        <Button role="switch" aria-checked={enabled} aria-label="Sports notifications" disabled={mutation.pending}
          onClick={() => mutation.run(() => send("/api/notifications/preferences", { notifications_enabled: !enabled }, "PATCH"), enabled ? "Notifications turned off." : "Notifications turned on.")}>
          {mutation.pending ? "Saving…" : enabled ? "Notifications on" : "Notifications off"}
        </Button>
        {!enabled&&<span className="help">New updates are paused. Your earlier notifications remain in your feed.</span>}
      </div>
    </section>
  );
}
