import React from "react";
import { FormSection } from "./ui";

interface DensityControlProps {
  value: number;
  onChange: (value: number) => void;
}

export function DensityControl({ value, onChange }: DensityControlProps) {
  // Function to get label text based on density value
  const getDensityLabel = (density: number): string => {
    if (density >= 30 && density <= 84) return "minimal";
    if (density > 84 && density <= 138) return "festive";
    if (density > 138 && density <= 192) return "party";
    if (density > 192 && density <= 246) return "bash";
    if (density > 246 && density <= 300) return "blast";
    return "party";
  };

  // Function to get color CSS variable based on density value
  const getDensityColor = (density: number): string => {
    if (density >= 30 && density <= 84)
      return "var(--figma-color-text-tertiary)";
    if (density > 84 && density <= 138)
      return "var(--figma-color-text-secondary)";
    if (density > 138 && density <= 192) return "var(--figma-color-text)";
    if (density > 192 && density <= 246) return "var(--figma-color-text)";
    if (density > 246 && density <= 300) return "var(--figma-color-text)";
    return "var(--figma-color-text)";
  };

  const label = getDensityLabel(value);
  const color = getDensityColor(value);

  return (
    <FormSection>
      <p className="confetti-type-label">DENSITY</p>
      <p className="slider-label" id="slider-label-density" style={{ color }}>
        {label}
      </p>
      <input
        type="range"
        id="slider-density"
        className="slider-input"
        min="30"
        max="300"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    </FormSection>
  );
}
