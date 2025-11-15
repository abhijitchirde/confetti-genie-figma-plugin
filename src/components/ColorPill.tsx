import React from "react";

interface ColorPillProps {
  color: string;
  index: number;
  onRemove: (index: number) => void;
}

export function ColorPill({ color, index, onRemove }: ColorPillProps) {
  // Helper function to determine if color is light or dark
  const isLightColor = (hex: string): boolean => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  const textColor = isLightColor(color) ? "#000000" : "#FFFFFF";

  return (
    <div
      className="color-pill"
      style={{ backgroundColor: color, color: textColor }}
    >
      <span className="color-pill-name">{color}</span>
      <button
        className="color-pill-remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        aria-label="Remove color"
        type="button"
      >
        ×
      </button>
    </div>
  );
}
