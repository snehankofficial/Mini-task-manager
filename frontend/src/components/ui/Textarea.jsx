import React, { forwardRef } from "react";
import clsx from "clsx";

const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className,
      containerClassName,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaClasses = clsx(
      "textarea",
      {
        "input-error": error,
      },
      className
    );

    return (
      <div className={clsx("form-group", containerClassName)}>
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={textareaClasses}
          {...props}
        />
        {error && <div className="form-error">{error}</div>}
        {helperText && !error && <div className="form-help">{helperText}</div>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
