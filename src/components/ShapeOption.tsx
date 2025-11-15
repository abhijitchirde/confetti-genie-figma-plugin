import React from "react";

interface ShapeOptionProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ShapeOption({
  id,
  label,
  icon,
  checked,
  onChange,
}: ShapeOptionProps) {
  return (
    <div className="dropdown-option">
      <input
        className="checkbox"
        type="checkbox"
        id={id}
        name={id}
        value={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="dropdown-option-icon">{icon}</span>
      <label className="checkbox-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
