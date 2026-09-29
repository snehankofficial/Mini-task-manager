import api from "./api";

export const taskService = {
  // Get all tasks
  async getTasks(params = {}) {
    try {
      const response = await api.get("/tasks", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single task
  async getTask(taskId) {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new task
  async createTask(taskData) {
    try {
      const response = await api.post("/tasks", taskData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update task
  async updateTask(taskId, taskData) {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete task
  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Toggle task completion
  async toggleTask(taskId) {
    try {
      const response = await api.patch(`/tasks/${taskId}/toggle`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get task statistics
  async getTaskStats() {
    try {
      const response = await api.get("/tasks/stats/overview");
      return response;
    } catch (error) {
      throw error;
    }
  },
};
