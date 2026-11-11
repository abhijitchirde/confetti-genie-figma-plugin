import React from "react";

interface ChoiceChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
  id?: string;
}

/**
 * One option in a single-choice group. Render inside an element with
 * role="radiogroup"; only the selected chip is in the Tab order, and the
 * group handles arrow keys.
 */
export function ChoiceChip({
  label,
  selected,
  onClick,
  className = "",
  id,
}: ChoiceChipProps) {
  const combinedClass = ["choice-chip", selected ? "selected" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id={id}
      className={combinedClass}
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {label}
    </div>
  );
}
