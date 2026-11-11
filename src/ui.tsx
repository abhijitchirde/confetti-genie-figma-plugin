import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";
import { Header } from "./components/Header";
import { DensityControl } from "./components/DensityControl";
import { SizeControl } from "./components/SizeControl";
import { ShapesDropdown } from "./components/ShapesDropdown";
import { ColorControl } from "./components/ColorControl";
import { ActionButtons } from "./components/ActionButtons";
import BottomSection from "./components/BottomSection";
import { useColorManager } from "./hooks/useColorManager";
import { useFigmaMessage } from "./hooks/useFigmaMessage";
import type { Size, ShapesState } from "./types";

// How much bigger each size preset makes the confetti
const SIZE_FACTORS: Record<Size, number> = {
  small: 0.5,
  medium: 1.4,
  large: 4.0,
};

// Smaller confetti needs more pieces to look as full; larger needs fewer
function adjustDensity(baseDensity: number, sizeFactor: number): number {
  if (sizeFactor < 1) return baseDensity * 2;
  if (sizeFactor > 3) return baseDensity * 0.7;
  return baseDensity;
}

function App() {
  // Density state (30-300, default 115)
  const [density, setDensity] = useState<number>(115);

  // Size state (default: medium)
  const [size, setSize] = useState<Size>("medium");

  // Shapes state (all true by default)
  const [shapes, setShapes] = useState<ShapesState>({
    rectangles: true,
    ellipses: true,
    polygons: true,
    stars: true,
  });

  // Color state (using custom hook)
  const {
    colors,
    currentColor,
    setCurrentColor,
    addColor,
    removeColor,
    resetColors,
  } = useColorManager("#FF7272");

  // Color error state
  const [colorError, setColorError] = useState(false);

  // Figma message hook
  const { sendMessage } = useFigmaMessage();

  // Handle shape change
  const handleShapeChange = (
    shapeName: keyof ShapesState,
    checked: boolean,
  ) => {
    setShapes({ ...shapes, [shapeName]: checked });
  };

  const sendGenerate = (colorsToUse?: string[]) => {
    const sizeFactor = SIZE_FACTORS[size];
    sendMessage({
      type: "generate",
      data: {
        count: adjustDensity(density, sizeFactor),
        sizeFactor,
        shapes,
        colors: colorsToUse,
      },
    });
  };

  const handleGenerateWithColors = () => {
    if (colors.length === 0) {
      setColorError(true);
      setTimeout(() => setColorError(false), 400);
      return;
    }
    sendGenerate(colors);
  };

  const handleGenerateRandom = () => sendGenerate();

  return (
    <main>
      <Header />

      <DensityControl value={density} onChange={setDensity} />

      <SizeControl value={size} onChange={setSize} />

      <ShapesDropdown shapes={shapes} onShapeChange={handleShapeChange} />

      <ColorControl
        colors={colors}
        currentColor={currentColor}
        onColorChange={setCurrentColor}
        onAddColor={addColor}
        onRemoveColor={removeColor}
        onResetColors={resetColors}
        hasError={colorError}
      />

      <ActionButtons
        onGenerateWithColors={handleGenerateWithColors}
        onGenerateRandom={handleGenerateRandom}
      />

      <BottomSection />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")!).render(<App />);
