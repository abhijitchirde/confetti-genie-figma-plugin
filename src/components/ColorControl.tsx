import React from "react";
import { ColorPicker } from "./ColorPicker";
import { ColorDisplay } from "./ColorDisplay";

interface ColorControlProps {
  colors: string[];
  currentColor: string;
  onColorChange: (color: string) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onResetColors: () => void;
  hasError?: boolean;
}

export function ColorControl({
  colors,
  currentColor,
  onColorChange,
  onAddColor,
  onRemoveColor,
  onResetColors,
  hasError = false,
}: ColorControlProps) {
  return (
    <div className="select-colors" id="selectColors">
      <div className="input-colors-section">
        <ColorPicker
          value={currentColor}
          onChange={onColorChange}
          onAdd={onAddColor}
          onReset={onResetColors}
        />
        <ColorDisplay
          colors={colors}
          onRemove={onRemoveColor}
          hasError={hasError}
        />
      </div>
    </div>
  );
}
