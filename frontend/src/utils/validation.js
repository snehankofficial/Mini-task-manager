/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate username format
 */
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return (
    username.length >= 3 &&
    username.length <= 30 &&
    usernameRegex.test(username)
  );
};

/**
 * Validate task title
 */
export const isValidTaskTitle = (title) => {
  return title && title.trim().length > 0 && title.length <= 200;
};

/**
 * Validate task description
 */
export const isValidTaskDescription = (description) => {
  return !description || description.length <= 1000;
};

/**
 * Validate category name
 */
export const isValidCategory = (category) => {
  return !category || category.length <= 50;
};

/**
 * Validate tag
 */
export const isValidTag = (tag) => {
  return tag && tag.trim().length > 0 && tag.length <= 30;
};

/**
 * Clean and validate tags array
 */
export const validateTags = (tags) => {
  if (!Array.isArray(tags)) return [];

  return tags
    .map((tag) => tag.trim())
    .filter((tag) => isValidTag(tag))
    .slice(0, 10); // Limit to 10 tags
};
