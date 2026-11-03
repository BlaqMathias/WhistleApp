"use client";
import Button from "@/components/shared/Button";
export default function FeedbackError({ reset }) {
  return <section className="empty-state"><h1>We couldn’t load the feedback form.</h1><p>Check your connection and try again.</p><div className="actions section"><Button onClick={reset}>Try again</Button></div></section>;
}
