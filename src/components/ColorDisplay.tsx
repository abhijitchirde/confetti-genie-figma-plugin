import React from "react";
import { ColorPill } from "./ColorPill";

interface ColorDisplayProps {
  colors: string[];
  onRemove: (index: number) => void;
  hasError?: boolean;
}

export function ColorDisplay({
  colors,
  onRemove,
  hasError = false,
}: ColorDisplayProps) {
  return (
    <div className="display-color-div" id="display-color-div">
      {colors.length === 0 ? (
        <p
          className={`empty-state-text ${hasError ? "error" : ""}`}
          id="empty-state"
        >
          No colors added
        </p>
      ) : (
        colors.map((color, index) => (
          <ColorPill
            key={`${color}-${index}`}
            color={color}
            index={index}
            onRemove={onRemove}
          />
        ))
      )}
    </div>
  );
}
