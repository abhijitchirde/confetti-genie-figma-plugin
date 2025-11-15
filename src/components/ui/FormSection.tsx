import React, { ReactNode } from "react";

interface FormSectionProps {
  children: ReactNode;
  className?: string;
}

export function FormSection({ children, className = "" }: FormSectionProps) {
  const baseClass = "density-container";
  const combinedClass = className ? `${baseClass} ${className}` : baseClass;

  return <div className={combinedClass}>{children}</div>;
}
