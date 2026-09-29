import React, { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className,
      containerClassName,
      required,
      ...props
    },
    ref
  ) => {
    const inputClasses = clsx(
      "input",
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
        <input ref={ref} className={inputClasses} {...props} />
        {error && <div className="form-error">{error}</div>}
        {helperText && !error && <div className="form-help">{helperText}</div>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
