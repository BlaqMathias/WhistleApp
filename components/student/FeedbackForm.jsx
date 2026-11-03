"use client";
import { useRef, useState } from "react";
import Button from "@/components/shared/Button";
import { useMutation, send, FormStatus } from "@/components/shared/FormState";
import { FEEDBACK_CATEGORIES, FEEDBACK_MAX_LENGTH } from "@/lib/constants";
import { feedbackDetails } from "@/lib/feedback";

export default function FeedbackForm() {
  const mutation = useMutation();
  const [message, setMessage] = useState("");
  const draft = useRef(null);
  async function submit(event) {
    event.preventDefault();
    if (mutation.pending) return;
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    await mutation.run(async () => {
      const details = feedbackDetails(body);
      if (!draft.current || draft.current.category !== details.category || draft.current.message !== details.message)
        draft.current = { ...details, id: crypto.randomUUID() };
      await send("/api/feedback", draft.current);
      form.reset();
      setMessage("");
      draft.current = null;
    }, "Feedback sent. Thank you for sharing it with the sports administrator.");
  }
  return (
    <form onSubmit={submit} className="form-panel form-stack">
      <h2>Share your feedback</h2>
      <fieldset><legend>Category</legend><div className="chip-row">{Object.entries(FEEDBACK_CATEGORIES).map(([value, label]) => <label className="chip" key={value}><input className="sr-only" type="radio" name="category" value={value} required disabled={mutation.pending}/>{label}</label>)}</div></fieldset>
      <label>Message
        <textarea name="message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={FEEDBACK_MAX_LENGTH} required disabled={mutation.pending} aria-describedby="feedback-help feedback-count" placeholder="Tell us what would help, what went wrong, or how to reproduce a bug." />
      </label>
      <div><p className="help" id="feedback-help">Include enough detail for the sports administrator to understand your feedback.</p><p className="help" id="feedback-count">{message.length.toLocaleString("en-NG")} / {FEEDBACK_MAX_LENGTH.toLocaleString("en-NG")} characters</p></div>
      <p className="form-note">Your feedback is linked to your student account and sent to the sports administrator. Replies are not available in the app.</p>
      <FormStatus error={mutation.error} success={mutation.success} />
      <Button disabled={mutation.pending}>{mutation.pending ? "Sending…" : "Send feedback"}</Button>
    </form>
  );
}
