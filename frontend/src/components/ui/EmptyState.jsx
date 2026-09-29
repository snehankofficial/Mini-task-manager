import React from "react";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionText,
  illustration = null,
}) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="mx-auto max-w-md">
        {illustration || (
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            {Icon ? (
              <Icon className="h-full w-full" />
            ) : (
              <svg
                className="h-full w-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            )}
          </div>
        )}

        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

        <p className="text-gray-500 mb-6">{description}</p>

        {action && actionText && (
          <button
            onClick={action}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
