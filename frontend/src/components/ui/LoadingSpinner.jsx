import React from "react";
import clsx from "clsx";

const LoadingSpinner = ({
  size = "md",
  color = "primary",
  className,
  text,
  ...props
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-4",
    xl: "w-12 h-12 border-4",
  };

  const colorClasses = {
    primary: "border-primary-200 border-t-primary-600",
    white: "border-white/30 border-t-white",
    gray: "border-gray-200 border-t-gray-600",
  };

  return (
    <div
      className={clsx("flex flex-col items-center justify-center", className)}
      {...props}
    >
      <div
        className={clsx(
          "rounded-full animate-spin",
          sizeClasses[size],
          colorClasses[color]
        )}
        aria-label="Loading"
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
