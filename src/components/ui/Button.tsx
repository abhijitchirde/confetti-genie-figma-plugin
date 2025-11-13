import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
  id,
}: ButtonProps) {
  const baseClass = "large-button";
  const variantClass = variant === "secondary" ? "secondary-button" : "";
  const combinedClass = [baseClass, variantClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      id={id}
      className={combinedClass}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
