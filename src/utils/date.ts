export function getTodayKey(): string {
  const dateString = new Date().toISOString().split("T")[0];
  if (!dateString) {
    throw new Error("Failed to generate date string");
  }
  return dateString;
}
