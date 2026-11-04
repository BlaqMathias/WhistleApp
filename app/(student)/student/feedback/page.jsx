import FeedbackForm from '@/components/student/FeedbackForm';

export const metadata = {title: 'Feedback'};

export default function Feedback() {
  return (
    <section className="student-feedback">
      <div className="page-heading"><h1>Feedback</h1></div>
      <FeedbackForm/>
    </section>
  );
}
