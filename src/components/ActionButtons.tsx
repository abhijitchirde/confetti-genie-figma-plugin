import React from "react";
import { Button } from "./ui";

interface ActionButtonsProps {
  onGenerateWithColors: () => void;
  onGenerateRandom: () => void;
}

export function ActionButtons({
  onGenerateWithColors,
  onGenerateRandom,
}: ActionButtonsProps) {
  return (
    <div className="button-div">
      <Button
        id="generateSelection"
        variant="primary"
        onClick={onGenerateWithColors}
      >
        Generate with selected colors
      </Button>
      <Button
        id="generateRandom"
        variant="secondary"
        onClick={onGenerateRandom}
      >
        ✨ Generate with random colors
      </Button>
    </div>
  );
}
