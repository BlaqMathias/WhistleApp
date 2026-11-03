"use client";
import Button from "@/components/shared/Button";
import { useMutation, send, FormStatus } from "@/components/shared/FormState";
export default function ArchiveButton({ entity, id, label }) {
  const m = useMutation();
  return (
    <div className="archive-section">
      <p className="help">
        Archiving keeps this {label.toLowerCase()} and its history.
      </p>
      <div className="actions section">
        <Button
          disabled={m.pending}
          variant="secondary"
          onClick={() => {
            if (
              window.confirm(
                `Archive this ${label.toLowerCase()}? Its history will be preserved.`,
              )
            )
              m.run(
                () =>
                  send(`/api/${entity}/${id}`, { action: "archive" }, "PATCH"),
                `${label} archived.`,
              );
          }}
        >
          Archive {label.toLowerCase()}
        </Button>
      </div>
      <FormStatus {...m} />
    </div>
  );
}
