import React from "react";
import { IconButton } from "./ui";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  onReset: () => void;
}

export function ColorPicker({
  value,
  onChange,
  onAdd,
  onReset,
}: ColorPickerProps) {
  return (
    <div className="color-controls-row">
      <p className="confetti-type-label">ADD COLORS</p>
      <input
        type="color"
        name="color"
        id="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="icon-buttons-group">
        <IconButton
          id="add"
          icon="+"
          onClick={onAdd}
          ariaLabel="Add color"
        />
        <IconButton
          id="reset"
          icon="↺"
          onClick={onReset}
          ariaLabel="Reset colors"
        />
      </div>
    </div>
  );
}
