import { getData } from "@/lib/data";
import FeedbackReview from "@/components/admin/FeedbackReview";
import EmptyState from "@/components/shared/EmptyState";
export default async function Feedback() {
  const d = await getData();
  const items = d.feedback.sort(
    (a, b) =>
      ({ new: 0, reviewed: 1, resolved: 2 })[a.status] -
        { new: 0, reviewed: 1, resolved: 2 }[b.status] ||
      b.created_at.localeCompare(a.created_at),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Feedback</h1>
          <p>Suggestions, complaints, and bug reports.</p>
        </div>
      </div>
      {items.length ? (
        items.map((item) => (
          <FeedbackReview
            key={item.id}
            item={item}
            student={d.students.find((s) => s.id === item.student_id)}
          />
        ))
      ) : (
        <EmptyState title="No feedback to review">
          Submitted feedback will appear here, tied to the student’s account.
        </EmptyState>
      )}
    </>
  );
}
