import { FEEDBACK_CATEGORIES, FEEDBACK_MAX_LENGTH } from "./constants.js";

export function feedbackDetails(body) {
  if (!body || typeof body !== "object" || typeof body.category !== "string" || !Object.hasOwn(FEEDBACK_CATEGORIES, body.category))
    throw new Error("Choose Suggestion, Complaint, or Bug Report.");
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > FEEDBACK_MAX_LENGTH)
    throw new Error("Enter feedback between 1 and 5,000 characters.");
  return { category: body.category, message };
}
