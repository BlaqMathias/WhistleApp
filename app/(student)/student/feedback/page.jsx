import FeedbackForm from "@/components/student/FeedbackForm";

export const metadata = { title: "Feedback" };
export default function Feedback() {
  return <>
    <div className="page-heading"><div><h1>Feedback</h1><p>Suggestions, complaints, and bug reports for campus sports.</p></div></div>
    <FeedbackForm />
  </>;
}
