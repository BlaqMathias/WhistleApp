import { STATUS_NAMES } from "@/lib/constants";
export default function Badge({ status, children }) {
  return (
    <span className={`badge ${status}`}>
      {status === "live" && <span className="live-dot" />}
      {children || STATUS_NAMES[status] || status}
    </span>
  );
}
