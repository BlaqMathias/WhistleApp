"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
export async function send(url, body, method = "POST") {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error || "The change could not be saved.");
  return result;
}
export function useMutation() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const busy = useRef(false);
  async function run(task, message = "Saved.") {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    setSuccess("");
    try {
      const result = await task();
      setSuccess(message);
      router.refresh();
      return result;
    } catch (e) {
      setError(e.message);
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return { pending, error, success, run, router };
}
export function FormStatus({ error, success }) {
  return (
    <>
      {error && (
        <p className="form-message error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="form-message" role="status">
          {success}
        </p>
      )}
    </>
  );
}
