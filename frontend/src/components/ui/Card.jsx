import React from "react";
import clsx from "clsx";

const Card = ({
  children,
  className,
  padding = true,
  shadow = "soft",
  ...props
}) => {
  const shadowClasses = {
    none: "",
    soft: "shadow-soft",
    medium: "shadow-medium",
    strong: "shadow-strong",
  };

  return (
    <div
      className={clsx(
        "card",
        shadowClasses[shadow],
        {
          "p-0": !padding,
        },
        className
      )}
      {...props}
    >
      {padding ? <div className="card-body">{children}</div> : children}
    </div>
  );
};

// Card sub-components
Card.Header = ({ children, className, ...props }) => (
  <div className={clsx("card-header", className)} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className, ...props }) => (
  <div className={clsx("card-body", className)} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className, ...props }) => (
  <div className={clsx("card-footer", className)} {...props}>
    {children}
  </div>
);

export default Card;
