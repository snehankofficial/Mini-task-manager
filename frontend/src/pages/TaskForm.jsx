import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { taskService } from "../services/taskService";
import {
  FiSave,
  FiArrowLeft,
  FiCalendar,
  FiFlag,
  FiTag,
  FiX,
} from "react-icons/fi";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import toast from "react-hot-toast";

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      category: "",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (isEdit) {
      fetchTask();
    } else {
      setLoading(false);
    }
  }, [id, isEdit]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTask(id);

      if (response.success) {
        const task = response.data.task;

        // Format date for input field
        const formattedDate = task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "";

        reset({
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          status: task.status,
          category: task.category || "",
          dueDate: formattedDate,
        });

        setTags(task.tags || []);
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

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      // Prepare task data
      const taskData = {
        ...data,
        tags,
        dueDate: data.dueDate || null,
      };

      let response;
      if (isEdit) {
        response = await taskService.updateTask(id, taskData);
      } else {
        response = await taskService.createTask(taskData);
      }

      if (response.success) {
        toast.success(
          isEdit ? "Task updated successfully!" : "Task created successfully!"
        );
        navigate("/tasks");
      } else {
        toast.error(
          response.message || `Failed to ${isEdit ? "update" : "create"} task`
        );
      }
    } catch (error) {
      console.error("Save task error:", error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} task`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (
      tagInput.trim() &&
      !tags.includes(tagInput.trim()) &&
      tags.length < 10
    ) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading task..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/tasks")}
            className="flex items-center space-x-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Tasks</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Task" : "Create New Task"}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEdit
                ? "Update your task details"
                : "Add a new task to your list"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">
                  Task Details
                </h3>
              </Card.Header>
              <Card.Body className="space-y-6">
                {/* Title */}
                <Input
                  label="Task Title"
                  placeholder="Enter task title..."
                  required
                  error={errors.title?.message}
                  {...register("title", {
                    required: "Task title is required",
                    maxLength: {
                      value: 200,
                      message: "Title cannot exceed 200 characters",
                    },
                  })}
                />

                {/* Description */}
                <Textarea
                  label="Description"
                  placeholder="Describe your task in detail..."
                  rows={6}
                  error={errors.description?.message}
                  {...register("description", {
                    maxLength: {
                      value: 1000,
                      message: "Description cannot exceed 1000 characters",
                    },
                  })}
                />

                {/* Category */}
                <Input
                  label="Category"
                  placeholder="e.g., Work, Personal, Shopping..."
                  error={errors.category?.message}
                  {...register("category", {
                    maxLength: {
                      value: 50,
                      message: "Category cannot exceed 50 characters",
                    },
                  })}
                />

                {/* Tags */}
                <div className="form-group">
                  <label className="form-label">Tags</label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim() || tags.length >= 10}
                      >
                        <FiTag className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 text-primary-600 hover:text-primary-800"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-sm text-gray-500">
                      {tags.length}/10 tags added
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">
                  Task Settings
                </h3>
              </Card.Header>
              <Card.Body className="space-y-6">
                {/* Priority */}
                <div className="form-group">
                  <label className="form-label flex items-center">
                    <FiFlag className="w-4 h-4 mr-2" />
                    Priority
                  </label>
                  <select className="input" {...register("priority")}>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                {/* Status */}
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="input" {...register("status")}>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Due Date */}
                <div className="form-group">
                  <label className="form-label flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    Due Date
                  </label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    error={errors.dueDate?.message}
                    {...register("dueDate")}
                  />
                  <p className="form-help">
                    Leave empty if no due date is required
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Action Buttons */}
            <Card>
              <Card.Body>
                <div className="space-y-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={saving}
                    className="w-full justify-center"
                  >
                    <FiSave className="w-4 h-4 mr-2" />
                    {saving
                      ? isEdit
                        ? "Updating..."
                        : "Creating..."
                      : isEdit
                      ? "Update Task"
                      : "Create Task"}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate("/tasks")}
                    className="w-full justify-center"
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
