"use client";
import Button from "@/components/shared/Button";
export default function ErrorPage({ error, reset }) {
  return (
    <section className="section">
      <h1>Couldn’t load the match desk</h1>
      <p>
        The connection to Whistle’s database failed. Check your setup or try
        again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
