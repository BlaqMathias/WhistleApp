import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="section">
      <h1>Record not found</h1>
      <p>This link doesn’t point to an available Whistle record.</p>
      <Link href="/" className="button">
        Back to campus scores
      </Link>
    </main>
  );
}
