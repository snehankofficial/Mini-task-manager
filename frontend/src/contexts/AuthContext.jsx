import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

// Auth action types
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  SIGNUP_START: "SIGNUP_START",
  SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
  SIGNUP_FAILURE: "SIGNUP_FAILURE",
  RESTORE_USER: "RESTORE_USER",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Initial state
const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.SIGNUP_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.SIGNUP_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.SIGNUP_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.RESTORE_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // First, set user as authenticated with the stored token
          // This prevents immediate redirect to login
          dispatch({
            type: AUTH_ACTIONS.RESTORE_USER,
            payload: {
              user: null, // We'll get user data from API
              token,
            },
          });

          // Then verify token with backend
          try {
            const response = await authService.getCurrentUser();
            if (response.success) {
              // Update with actual user data
              dispatch({
                type: AUTH_ACTIONS.RESTORE_USER,
                payload: {
                  user: response.data.user,
                  token,
                },
              });
            } else {
              // Token is invalid, remove it
              localStorage.removeItem("token");
              dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
          } catch (error) {
            // Only logout if it's a clear 401 unauthorized
            if (error.response?.status === 401) {
              localStorage.removeItem("token");
              dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
            // For other errors (network, 500, etc.), keep the user logged in
            // They can still try to use the app
          }
        } else {
          // No token found, user needs to login
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        // Don't logout on general errors, only on specific auth failures
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await authService.login(credentials);

      if (response.success) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: response.data,
        });

        return { success: true, data: response.data };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message || "Login failed",
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SIGNUP_START });

      const response = await authService.signup(userData);

      if (response.success) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);

        dispatch({
          type: AUTH_ACTIONS.SIGNUP_SUCCESS,
          payload: response.data,
        });

        return { success: true, data: response.data };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SIGNUP_FAILURE,
          payload: response.message || "Signup failed",
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Signup failed";
      dispatch({
        type: AUTH_ACTIONS.SIGNUP_FAILURE,
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API (optional, for logging purposes)
      await authService.logout();
    } catch (error) {
      // Ignore logout API errors
    } finally {
      // Remove token from localStorage
      localStorage.removeItem("token");

      // Update state
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    ...state,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
