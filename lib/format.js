import { TIME_ZONE } from "./constants.js";
export function asDate(value) {
  return new Date(/[Zz]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`);
}
export function dateTime(value) {
  return value
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: TIME_ZONE,
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(asDate(value))
    : "Not scheduled";
}
export function toInput(value) {
  if (!value) return "";
  return new Date(asDate(value).getTime() + 3600000).toISOString().slice(0, 16);
}
export function fromInput(value) {
  return value ? new Date(`${value}:00+01:00`).toISOString() : null;
}
