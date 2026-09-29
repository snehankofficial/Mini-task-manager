import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiCheckSquare,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { taskService } from "../services/taskService";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import { format, isAfter } from "date-fns";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    priority: "",
    category: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, [filters, searchTerm]);

  const fetchTasks = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: searchTerm,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === "all") {
          delete params[key];
        }
      });

      const response = await taskService.getTasks(params);

      if (response.success) {
        setTasks(response.data.tasks);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalTasks: response.data.pagination.totalTasks,
        });
      }
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const response = await taskService.toggleTask(taskId);
      if (response.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId
              ? { ...task, status: response.data.task.status }
              : task
          )
        );
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await taskService.deleteTask(taskId);
      if (response.success) {
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
        toast.success("Task deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePageChange = (page) => {
    fetchTasks(page);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status) => {
    return status === "completed" ? "success" : "warning";
  };

  const isOverdue = (task) => {
    return (
      task.dueDate &&
      task.status === "pending" &&
      isAfter(new Date(), new Date(task.dueDate))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="mt-2 text-gray-600">
            Manage and organize your tasks efficiently
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/tasks/new">
            <Button variant="primary" className="flex items-center space-x-2">
              <FiPlus className="w-4 h-4" />
              <span>Add New Task</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="input"
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Category Filter */}
          <Input
            type="text"
            placeholder="Filter by category..."
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          />
        </div>
      </Card>

      {/* Tasks List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading tasks..." />
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FiCheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ||
              filters.status !== "all" ||
              filters.priority ||
              filters.category
                ? "Try adjusting your search or filters"
                : "Create your first task to get started"}
            </p>
            {!searchTerm &&
              !filters.priority &&
              !filters.category &&
              filters.status === "all" && (
                <Link to="/tasks/new">
                  <Button variant="primary">
                    <FiPlus className="w-4 h-4 mr-2" />
                    Create Your First Task
                  </Button>
                </Link>
              )}
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card
              key={task._id}
              className="hover:shadow-lg transition-all duration-200 border border-gray-200"
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => handleToggleTask(task._id)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    {/* Title and Description */}
                    <div className="mb-3">
                      <h3
                        className={`text-base font-semibold mb-1 break-words ${
                          task.status === "completed"
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-sm text-gray-600 leading-relaxed break-words line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        variant={getPriorityColor(task.priority)}
                        className="text-xs font-medium"
                      >
                        {task.priority}
                      </Badge>

                      <Badge
                        variant={getStatusColor(task.status)}
                        className="text-xs font-medium"
                      >
                        {task.status}
                      </Badge>

                      {task.category && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          {task.category}
                        </Badge>
                      )}

                      {isOverdue(task) && (
                        <Badge variant="danger" className="text-xs font-medium">
                          Overdue
                        </Badge>
                      )}
                    </div>

                    {/* Date Information */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2">
                      {task.dueDate && (
                        <div className="flex items-center">
                          <FiCalendar className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            Due:{" "}
                            {format(new Date(task.dueDate), "MMM dd, yyyy")}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center">
                        <FiClock className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          Updated: {format(new Date(task.updatedAt), "MMM dd")}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                        {task.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-medium">
                            +{task.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <Link to={`/tasks/${task._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs px-2 py-1 h-8"
                      >
                        View
                      </Button>
                    </Link>

                    <Link to={`/tasks/${task._id}/edit`}>
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                        <FiEdit className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
            {Math.min(pagination.currentPage * 10, pagination.totalTasks)} of{" "}
            {pagination.totalTasks} tasks
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Previous
            </Button>

            <span className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded">
              {pagination.currentPage} of {pagination.totalPages}
            </span>

            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
