import React, { ReactNode } from "react";

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function IconButton({
  icon,
  onClick,
  ariaLabel,
  disabled = false,
  className = "",
  id,
}: IconButtonProps) {
  const baseClass = "small-button icon-button";
  const combinedClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <button
      id={id}
      className={combinedClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type="button"
    >
      {icon}
    </button>
  );
}
