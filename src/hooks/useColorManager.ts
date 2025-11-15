import { useState } from "react";

interface UseColorManagerReturn {
  colors: string[];
  currentColor: string;
  setCurrentColor: (color: string) => void;
  addColor: () => void;
  removeColor: (index: number) => void;
  resetColors: () => void;
}

export function useColorManager(
  initialColor: string = "#FF7272"
): UseColorManagerReturn {
  const [colors, setColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState<string>(initialColor);

  const addColor = () => {
    // Always add the color, even if it's a duplicate (allows color dominance)
    setColors([...colors, currentColor.toUpperCase()]);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const resetColors = () => {
    setColors([]);
    setCurrentColor(initialColor);
  };

  return {
    colors,
    currentColor,
    setCurrentColor,
    addColor,
    removeColor,
    resetColors,
  };
}
