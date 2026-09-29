import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiCheckSquare,
  FiCalendar,
  FiClock,
  FiFlag,
  FiTag,
  FiUser,
} from "react-icons/fi";
import { taskService } from "../services/taskService";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import { format, isAfter, formatDistanceToNow } from "date-fns";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTask(id);

      if (response.success) {
        setTask(response.data.task);
      } else {
        toast.error("Task not found");
        navigate("/tasks");
      }
    } catch (error) {
      console.error("Fetch task error:", error);
      toast.error("Failed to load task");
      navigate("/tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async () => {
    try {
      const response = await taskService.toggleTask(id);
      if (response.success) {
        setTask((prev) => ({
          ...prev,
          status: response.data.task.status,
          completedAt: response.data.task.completedAt,
        }));
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Toggle task error:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this task? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await taskService.deleteTask(id);
      if (response.success) {
        toast.success("Task deleted successfully");
        navigate("/tasks");
      }
    } catch (error) {
      console.error("Delete task error:", error);
      toast.error("Failed to delete task");
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

  const isOverdue = () => {
    return (
      task?.dueDate &&
      task.status === "pending" &&
      isAfter(new Date(), new Date(task.dueDate))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading task..." />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Task not found
        </h2>
        <Link to="/tasks">
          <Button variant="primary">Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/tasks")}
            className="flex items-center space-x-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Tasks</span>
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={handleToggleTask}
            variant={task.status === "completed" ? "warning" : "success"}
            className="flex items-center space-x-2"
          >
            <FiCheckSquare className="w-4 h-4" />
            <span>
              Mark as {task.status === "completed" ? "Pending" : "Complete"}
            </span>
          </Button>

          <Link to={`/tasks/${id}/edit`}>
            <Button variant="outline" className="flex items-center space-x-2">
              <FiEdit className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          </Link>

          <Button
            variant="danger"
            onClick={handleDeleteTask}
            className="flex items-center space-x-2"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Content */}
          <Card>
            <Card.Header>
              <div className="flex items-start justify-between">
                <h1
                  className={`text-2xl font-bold ${
                    task.status === "completed"
                      ? "text-gray-500 line-through"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </h1>
                <div className="flex items-center space-x-2 ml-4">
                  <Badge variant={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  {isOverdue() && <Badge variant="danger">Overdue</Badge>}
                </div>
              </div>
            </Card.Header>

            <Card.Body>
              {task.description ? (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {task.description}
                  </p>
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No description provided for this task.
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiTag className="w-5 h-5 mr-2" />
                  Tags
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Activity Timeline */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiClock className="w-5 h-5 mr-2" />
                Activity Timeline
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {/* Creation */}
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Task created</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(task.createdAt), "PPP p")} (
                      {formatDistanceToNow(new Date(task.createdAt), {
                        addSuffix: true,
                      })}
                      )
                    </p>
                  </div>
                </div>

                {/* Last Updated */}
                {task.updatedAt !== task.createdAt && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Task updated</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(task.updatedAt), "PPP p")} (
                        {formatDistanceToNow(new Date(task.updatedAt), {
                          addSuffix: true,
                        })}
                        )
                      </p>
                    </div>
                  </div>
                )}

                {/* Completion */}
                {task.status === "completed" && task.completedAt && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Task completed</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(task.completedAt), "PPP p")} (
                        {formatDistanceToNow(new Date(task.completedAt), {
                          addSuffix: true,
                        })}
                        )
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Task Information
              </h3>
            </Card.Header>
            <Card.Body className="space-y-4">
              {/* Priority */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <FiFlag className="w-4 h-4 mr-2" />
                  Priority
                </span>
                <Badge variant={getPriorityColor(task.priority)}>
                  {task.priority} priority
                </Badge>
              </div>

              {/* Category */}
              {task.category && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Category
                  </span>
                  <Badge variant="secondary">{task.category}</Badge>
                </div>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    Due Date
                  </span>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        isOverdue() ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {format(new Date(task.dueDate), "PPP")}
                    </p>
                    <p
                      className={`text-xs ${
                        isOverdue() ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      {formatDistanceToNow(new Date(task.dueDate), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Status
                </span>
                <Badge variant={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
              </div>
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </Card.Header>
            <Card.Body className="space-y-3">
              <Button
                onClick={handleToggleTask}
                variant={task.status === "completed" ? "warning" : "success"}
                className="w-full justify-center"
              >
                <FiCheckSquare className="w-4 h-4 mr-2" />
                Mark as {task.status === "completed" ? "Pending" : "Complete"}
              </Button>

              <Link to={`/tasks/${id}/edit`} className="block">
                <Button variant="outline" className="w-full justify-center">
                  <FiEdit className="w-4 h-4 mr-2" />
                  Edit Task
                </Button>
              </Link>

              <Button
                variant="danger"
                onClick={handleDeleteTask}
                className="w-full justify-center"
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Delete Task
              </Button>
            </Card.Body>
          </Card>

          {/* Task Stats */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Task Details
              </h3>
            </Card.Header>
            <Card.Body className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-600">Created:</span>
                <p className="font-medium">
                  {format(new Date(task.createdAt), "PPP")}
                </p>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Last Modified:</span>
                <p className="font-medium">
                  {format(new Date(task.updatedAt), "PPP")}
                </p>
              </div>

              {task.status === "completed" && task.completedAt && (
                <div className="text-sm">
                  <span className="text-gray-600">Completed:</span>
                  <p className="font-medium">
                    {format(new Date(task.completedAt), "PPP")}
                  </p>
                </div>
              )}

              <div className="text-sm">
                <span className="text-gray-600">Task ID:</span>
                <p className="font-mono text-xs text-gray-500">{task._id}</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
