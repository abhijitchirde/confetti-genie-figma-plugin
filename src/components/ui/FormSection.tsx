import React, { ReactNode } from "react";

interface FormSectionProps {
  children: ReactNode;
  className?: string;
}

export function FormSection({ children, className = "" }: FormSectionProps) {
  const baseClass = "form-section";
  const combinedClass = className ? `${baseClass} ${className}` : baseClass;

  return <div className={combinedClass}>{children}</div>;
}
