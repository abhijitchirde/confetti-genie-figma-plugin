import React from "react";
import { FormSection } from "./ui";
import { MAX_DENSITY, MIN_DENSITY } from "../settings";

interface DensityControlProps {
  value: number;
  onChange: (value: number) => void;
}

// Label and label colour for each density band, by its upper bound
const DENSITY_LEVELS = [
  { max: 84, label: "minimal", color: "var(--cg-color-text-tertiary)" },
  { max: 138, label: "festive", color: "var(--cg-color-text-secondary)" },
  { max: 192, label: "party", color: "var(--cg-color-text)" },
  { max: 246, label: "bash", color: "var(--cg-color-text)" },
  { max: MAX_DENSITY, label: "blast", color: "var(--cg-color-text)" },
];

export function DensityControl({ value, onChange }: DensityControlProps) {
  const level =
    DENSITY_LEVELS.find((l) => value <= l.max) ??
    DENSITY_LEVELS[DENSITY_LEVELS.length - 1];

  return (
    <FormSection>
      <p className="confetti-type-label">DENSITY</p>
      <p
        className="slider-label"
        id="slider-label-density"
        style={{ color: level.color }}
      >
        {level.label}
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
