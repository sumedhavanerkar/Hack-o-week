/**
 * Format date string (YYYY-MM-DD) into readable format: "14 Oct 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format relative deadline: "Today", "Tomorrow", "Yesterday", or "In X days" / "X days ago"
 */
export function formatRelativeDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Due Today";
  if (diffDays === 1) return "Due Tomorrow";
  if (diffDays === -1) return "Overdue (Yesterday)";
  if (diffDays < -1) return `Overdue (${Math.abs(diffDays)}d ago)`;
  return `In ${diffDays} days`;
}

/**
 * Check if a date string is in the past (strictly before today)
 */
export function isOverdue(dateString, status) {
  if (status === "Completed") return false;
  if (!dateString) return false;
  const [year, month, day] = dateString.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target.getTime() < today.getTime();
}

/**
 * Check if date is today
 */
export function isToday(dateString) {
  if (!dateString) return false;
  const today = new Date().toISOString().split("T")[0];
  return dateString === today;
}

/**
 * Format 24-hr time "16:30" to "4:30 PM"
 */
export function formatTime(time24) {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

/**
 * Get dates for the current week (Monday to Sunday)
 */
export function getCurrentWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday
  // Adjust so Monday is day 0
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    week.push({
      dateStr,
      dayName,
      formattedDate,
      isToday: isToday(dateStr),
    });
  }
  return week;
}
