"use client";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import { useMutation, send } from "@/components/shared/FormState";
import { dateTime } from "@/lib/format";
import { FEEDBACK_CATEGORIES } from "@/lib/constants";
export default function FeedbackReview({ item, student }) {
  const m = useMutation();
  return (
    <article className="message-row">
      <div className="message-heading">
        <h3>{FEEDBACK_CATEGORIES[item.category]}</h3>
        <Badge status={item.status} />
      </div>
      <small>
        {student?.name} / {student?.matric_number}
        <br />
        {dateTime(item.created_at)} WAT
      </small>
      <p className="feedback-message">{item.message}</p>
      <div className="actions">
        {[
          ["reviewed", "Mark Reviewed"],
          ["resolved", "Mark Resolved"],
        ].map(([status, label]) => (
          <Button
            key={status}
            variant="small secondary"
            disabled={m.pending || item.status === status}
            onClick={() =>
              m.run(
                () => send(`/api/feedback/${item.id}`, { status }, "PATCH"),
                status === "resolved" ? "Feedback resolved." : "Feedback marked as reviewed.",
              )
            }
          >
            {label}
          </Button>
        ))}
      </div>
    </article>
  );
}
