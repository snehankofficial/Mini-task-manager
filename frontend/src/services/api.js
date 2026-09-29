import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle 401 errors (unauthorized) but be very careful about redirects
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === "/login" || currentPath === "/signup";

      // Only redirect if we're not on auth pages and this is from /auth/me endpoint
      // This prevents redirects on other 401s that might be temporary
      if (!isAuthPage && error.config?.url?.includes("/auth/me")) {
        localStorage.removeItem("token");

        // Small delay to prevent redirect during page load
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    // Return the error response for handling in components
    return Promise.reject(error);
  }
);

export default api;
