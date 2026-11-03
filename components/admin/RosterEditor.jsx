"use client";
import { useState } from "react";
export default function RosterEditor({ students, selected, onChange }) {
  const [query, setQuery] = useState("");
  const available = students.filter((s) => !s.is_admin);
  const results = available.filter((s) =>
    `${s.name} ${s.matric_number}`.toLowerCase().includes(query.toLowerCase()),
  );
  function toggle(id) {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  }
  return (
    <fieldset>
      <legend>
        Roster <small>({selected.length} selected)</small>
      </legend>
      <label>
        Find a registered student
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name or matric number"
        />
      </label>
      <div className="search-results">
        {results.map((s) => (
          <label className="student-choice" key={s.id}>
            <input
              type="checkbox"
              checked={selected.includes(s.id)}
              onChange={() => toggle(s.id)}
            />
            <span>
              {s.name}
              <small>
                {s.matric_number} / {s.faculty}
              </small>
            </span>
          </label>
        ))}
        {!results.length && (
          <p className="form-note">No registered students match that search.</p>
        )}
      </div>
      <div className="selected-roster">
        {available
          .filter((s) => selected.includes(s.id))
          .map((s) => (
            <span className="roster-chip" key={s.id}>
              {s.name}
              <button
                type="button"
                aria-label={`Remove ${s.name}`}
                onClick={() => toggle(s.id)}
              >
                ×
              </button>
            </span>
          ))}
      </div>
      <p className="help">
        At least one registered student is required. There is no roster limit.
      </p>
    </fieldset>
  );
}
