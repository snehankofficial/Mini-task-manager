/**
 * Format a date to a readable string
 */
export const formatDate = (date, format = "short") => {
  if (!date) return "";

  const d = new Date(date);

  switch (format) {
    case "short":
      return d.toLocaleDateString();
    case "long":
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "time":
      return d.toLocaleTimeString();
    case "datetime":
      return d.toLocaleString();
    default:
      return d.toLocaleDateString();
  }
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return "";

  const now = new Date();
  const past = new Date(date);
  const diffInMs = now - past;
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) {
    return "Just now";
  } else if (diffInMins < 60) {
    return `${diffInMins} minute${diffInMins > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else {
    return formatDate(date);
  }
};

/**
 * Check if a date is today
 */
export const isToday = (date) => {
  if (!date) return false;

  const today = new Date();
  const checkDate = new Date(date);

  return today.toDateString() === checkDate.toDateString();
};

/**
 * Check if a date is tomorrow
 */
export const isTomorrow = (date) => {
  if (!date) return false;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkDate = new Date(date);

  return tomorrow.toDateString() === checkDate.toDateString();
};

/**
 * Check if a date is overdue
 */
export const isOverdue = (date) => {
  if (!date) return false;

  const now = new Date();
  const dueDate = new Date(date);

  return dueDate < now;
};

/**
 * Get days until due date
 */
export const getDaysUntilDue = (date) => {
  if (!date) return null;

  const now = new Date();
  const dueDate = new Date(date);
  const diffInMs = dueDate - now;
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
};
