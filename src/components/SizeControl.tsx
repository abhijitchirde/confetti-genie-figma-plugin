import React, { useRef } from "react";
import { FormSection, ChoiceChip } from "./ui";
import type { Size } from "../types";

interface SizeControlProps {
  value: Size;
  onChange: (value: Size) => void;
}

const SIZES: { value: Size; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const ARROW_STEPS: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

export function SizeControl({ value, onChange }: SizeControlProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  // Arrow keys move the selection, as in a native radio group
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = ARROW_STEPS[e.key];
    if (!step) return;
    e.preventDefault();

    const current = SIZES.findIndex((s) => s.value === value);
    const next = (current + step + SIZES.length) % SIZES.length;
    onChange(SIZES[next].value);
    const chips =
      groupRef.current?.querySelectorAll<HTMLElement>(".choice-chip");
    chips?.[next]?.focus();
  };

  return (
    <FormSection>
      <div className="size-label-chips-row">
        <p className="confetti-type-label" id="size-label">
          SIZE
        </p>
        <div
          className="choice-chips-container"
          role="radiogroup"
          aria-labelledby="size-label"
          ref={groupRef}
          onKeyDown={handleKeyDown}
        >
          {SIZES.map((size) => (
            <ChoiceChip
              key={size.value}
              id={`size-${size.value}`}
              label={size.label}
              selected={value === size.value}
              onClick={() => onChange(size.value)}
            />
          ))}
        </div>
      </div>
    </FormSection>
  );
}
