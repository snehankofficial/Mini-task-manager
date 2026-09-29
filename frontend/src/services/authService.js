import api from "./api";

export const authService = {
  // User signup
  async signup(userData) {
    try {
      const response = await api.post("/auth/signup", userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // User login
  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // User logout
  async logout() {
    try {
      const response = await api.post("/auth/logout");
      return response;
    } catch (error) {
      // Don't throw error for logout, as it's mainly for cleanup
      console.error("Logout error:", error);
      return { success: true };
    }
  },
};
