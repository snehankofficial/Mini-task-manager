/**
 * Task priority levels
 */
export const TASK_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

/**
 * Task status types
 */
export const TASK_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  TASKS: {
    LIST: "/tasks",
    CREATE: "/tasks",
    GET: (id) => `/tasks/${id}`,
    UPDATE: (id) => `/tasks/${id}`,
    DELETE: (id) => `/tasks/${id}`,
    TOGGLE: (id) => `/tasks/${id}/toggle`,
    STATS: "/tasks/stats/overview",
  },
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  SETTINGS: "settings",
};

/**
 * Route paths
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  TASKS: "/tasks",
  TASK_NEW: "/tasks/new",
  TASK_EDIT: (id) => `/tasks/${id}/edit`,
  TASK_DETAIL: (id) => `/tasks/${id}`,
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN: "Login successful!",
  SIGNUP: "Account created successfully!",
  LOGOUT: "Logged out successfully!",
  TASK_CREATED: "Task created successfully!",
  TASK_UPDATED: "Task updated successfully!",
  TASK_DELETED: "Task deleted successfully!",
  TASK_COMPLETED: "Task marked as completed!",
  TASK_PENDING: "Task marked as pending!",
};

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
  TASK_TITLE: {
    MAX_LENGTH: 200,
  },
  TASK_DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  CATEGORY: {
    MAX_LENGTH: 50,
  },
  TAG: {
    MAX_LENGTH: 30,
    MAX_COUNT: 10,
  },
};

/**
 * Theme colors
 */
export const THEME_COLORS = {
  PRIMARY: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  SUCCESS: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  WARNING: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  DANGER: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
};

/**
 * Default pagination settings
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

/**
 * Date formats
 */
export const DATE_FORMATS = {
  SHORT: "MMM dd",
  LONG: "MMMM dd, yyyy",
  FULL: "EEEE, MMMM dd, yyyy",
  TIME: "HH:mm",
  DATETIME: "MMM dd, yyyy HH:mm",
};

/**
 * File upload constraints
 */
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
};
