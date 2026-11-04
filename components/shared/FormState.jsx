"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { notify } from "./Toast";
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
  const busy = useRef(false);
  async function run(task, message = "Saved.") {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    try {
      const result = await task();
      notify(message);
      router.refresh();
      return result;
    } catch (e) {
      notify(e.message || "The change could not be saved.", "error");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return { pending, run, router };
}
