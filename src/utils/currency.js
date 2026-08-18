export function formatInr(value, fallback = "Available") {
  if (value === null || value === undefined || value === "") return fallback;
  const numericValue = typeof value === "string"
    ? Number(value.replace(/[^0-9.-]/g, ""))
    : Number(value);
  if (!Number.isFinite(numericValue)) return String(value);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericValue);
}
