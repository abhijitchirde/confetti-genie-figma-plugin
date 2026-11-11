import React from "react";
import { FormSection } from "./ui";
import {
  densityLevelOf,
  MAX_DENSITY,
  MIN_DENSITY,
  type DensityLevel,
} from "../settings";

interface DensityControlProps {
  value: number;
  onChange: (value: number) => void;
}

// Label colour for each density level
const LEVEL_COLORS: Record<DensityLevel, string> = {
  minimal: "var(--cg-color-text-tertiary)",
  festive: "var(--cg-color-text-secondary)",
  party: "var(--cg-color-text)",
  bash: "var(--cg-color-text)",
  blast: "var(--cg-color-text)",
};

export function DensityControl({ value, onChange }: DensityControlProps) {
  const level = densityLevelOf(value);

  return (
    <FormSection>
      <p className="confetti-type-label">DENSITY</p>
      <p
        className="slider-label"
        id="slider-label-density"
        style={{ color: LEVEL_COLORS[level] }}
      >
        {level}
      </p>
      <input
        type="range"
        id="slider-density"
        className="slider-input"
        min={MIN_DENSITY}
        max={MAX_DENSITY}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        aria-label="Density"
      />
    </FormSection>
  );
}
