import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import {
  FiEye,
  FiEyeOff,
  FiCheckSquare,
  FiMail,
  FiLock,
  FiUser,
} from "react-icons/fi";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isLoading, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      clearError();

      // Remove confirmPassword from data before sending to API
      const { confirmPassword, ...signupData } = data;

      const result = await signup(signupData);

      if (result.success) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        // Handle specific validation errors
        if (result.message.includes("email")) {
          setError("email", { message: "This email is already registered" });
        } else if (result.message.includes("username")) {
          setError("username", { message: "This username is already taken" });
        } else {
          toast.error(result.message || "Failed to create account");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Header */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
            <FiCheckSquare className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join us and start managing your tasks efficiently
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-strong rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="John"
                  required
                  error={errors.firstName?.message}
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "Must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Cannot exceed 50 characters",
                    },
                  })}
                />
                <FiUser className="absolute right-3 top-9 w-5 h-5 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  required
                  error={errors.lastName?.message}
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: {
                      value: 2,
                      message: "Must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Cannot exceed 50 characters",
                    },
                  })}
                />
                <FiUser className="absolute right-3 top-9 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Username Field */}
            <div className="relative">
              <Input
                label="Username"
                type="text"
                placeholder="johndoe"
                required
                error={errors.username?.message}
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Must be at least 3 characters",
                  },
                  maxLength: {
                    value: 30,
                    message: "Cannot exceed 30 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Username can only contain letters, numbers, and underscores",
                  },
                })}
              />
              <FiUser className="absolute right-3 top-9 w-5 h-5 text-gray-400" />
            </div>

            {/* Email Field */}
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              <FiMail className="absolute right-3 top-9 w-5 h-5 text-gray-400" />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                required
                error={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                  },
                })}
              />
              <div className="absolute right-3 top-9 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
                <FiLock className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                required
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <FiLock className="absolute right-3 top-9 w-5 h-5 text-gray-400" />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full justify-center"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6">
            <Link to="/login" className="w-full btn btn-outline justify-center">
              Sign In Instead
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
