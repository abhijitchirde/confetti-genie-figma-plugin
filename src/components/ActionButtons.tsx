import React from "react";
import { Button } from "./ui";

interface ActionButtonsProps {
  onGenerateWithColors: () => void;
  onGenerateRandom: () => void;
  disabled?: boolean;
}

export function ActionButtons({
  onGenerateWithColors,
  onGenerateRandom,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <div className="button-div">
      <Button
        id="generateSelection"
        variant="primary"
        onClick={onGenerateWithColors}
        disabled={disabled}
      >
        Generate with selected colors
      </Button>
      <Button
        id="generateRandom"
        variant="secondary"
        onClick={onGenerateRandom}
        disabled={disabled}
      >
        ✨ Generate with random colors
      </Button>
    </div>
  );
}
