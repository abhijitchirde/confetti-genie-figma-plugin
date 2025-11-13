import React from "react";

interface ChoiceChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
  id?: string;
}

export function ChoiceChip({
  label,
  selected,
  onClick,
  className = "",
  id,
}: ChoiceChipProps) {
  const baseClass = "choice-chip";
  const selectedClass = selected ? "selected" : "";
  const combinedClass = [baseClass, selectedClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div id={id} className={combinedClass} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}>
      {label}
    </div>
  );
}
