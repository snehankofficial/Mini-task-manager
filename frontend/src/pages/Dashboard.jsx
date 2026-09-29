import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiCheckSquare,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
  FiCalendar,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { taskService } from "../services/taskService";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import { format } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats and recent tasks in parallel
      const [statsResponse, tasksResponse] = await Promise.all([
        taskService.getTaskStats(),
        taskService.getTasks({
          limit: 5,
          sortBy: "updatedAt",
          sortOrder: "desc",
        }),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (tasksResponse.success) {
        setRecentTasks(tasksResponse.data.tasks);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const response = await taskService.toggleTask(taskId);
      if (response.success) {
        // Update the task in recentTasks
        setRecentTasks((prev) =>
          prev.map((task) =>
            task._id === taskId
              ? { ...task, status: response.data.task.status }
              : task
          )
        );

        // Refresh stats
        fetchDashboardData();

        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your tasks today.
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

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary-100 rounded-lg mb-4">
              <FiCheckSquare className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            <p className="text-gray-600">Total Tasks</p>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-success-100 rounded-lg mb-4">
              <FiCheckSquare className="w-6 h-6 text-success-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.completed}
            </h3>
            <p className="text-gray-600">Completed</p>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-warning-100 rounded-lg mb-4">
              <FiClock className="w-6 h-6 text-warning-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.pending}
            </h3>
            <p className="text-gray-600">Pending</p>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-danger-100 rounded-lg mb-4">
              <FiAlertCircle className="w-6 h-6 text-danger-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.overdue || 0}
            </h3>
            <p className="text-gray-600">Overdue</p>
          </Card>
        </div>
      )}

      {/* Progress and Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Section */}
        {stats && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiTrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                Progress Overview
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium">{stats.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-danger-600">
                      {stats.priorityBreakdown?.high || 0}
                    </div>
                    <div className="text-xs text-gray-500">High Priority</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-warning-600">
                      {stats.priorityBreakdown?.medium || 0}
                    </div>
                    <div className="text-xs text-gray-500">Medium Priority</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-success-600">
                      {stats.priorityBreakdown?.low || 0}
                    </div>
                    <div className="text-xs text-gray-500">Low Priority</div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiCalendar className="w-5 h-5 mr-2 text-primary-600" />
                  Recent Tasks
                </h3>
                <Link to="/tasks">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {recentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <FiCheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create your first task to get started
                  </p>
                  <Link to="/tasks/new" className="mt-4 inline-block">
                    <Button variant="primary" size="sm">
                      <FiPlus className="w-4 h-4 mr-2" />
                      Create Task
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
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
                        <h4
                          className={`font-medium text-sm leading-tight break-words ${
                            task.status === "completed"
                              ? "text-gray-500 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 break-words">
                            {task.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge
                            variant={getPriorityColor(task.priority)}
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                          <Badge
                            variant={getStatusColor(task.status)}
                            className="text-xs"
                          >
                            {task.status}
                          </Badge>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500 truncate">
                              Due: {format(new Date(task.dueDate), "MMM dd")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex items-center gap-1">
                        <Link to={`/tasks/${task._id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-7 w-7"
                          >
                            <FiEdit className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Link to={`/tasks/${task._id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs px-2 py-1 h-7"
                          >
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
