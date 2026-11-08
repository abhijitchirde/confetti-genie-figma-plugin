import React from "react";
import { FormSection, ChoiceChip } from "./ui";
import type { Size } from "../types";

interface SizeControlProps {
  value: Size;
  onChange: (value: Size) => void;
}

export function SizeControl({ value, onChange }: SizeControlProps) {
  return (
    <FormSection>
      <div className="size-label-chips-row">
        <p className="confetti-type-label">SIZE</p>
        <div className="choice-chips-container">
          <ChoiceChip
            id="size-small"
            label="Small"
            selected={value === "small"}
            onClick={() => onChange("small")}
          />
          <ChoiceChip
            id="size-medium"
            label="Medium"
            selected={value === "medium"}
            onClick={() => onChange("medium")}
          />
          <ChoiceChip
            id="size-large"
            label="Large"
            selected={value === "large"}
            onClick={() => onChange("large")}
          />
        </div>
      </div>
    </FormSection>
  );
}
