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

declare function require(path: string): any;

// Size type
type Size = "small" | "medium" | "large";

// Shapes state type
interface ShapesState {
  rectangles: boolean;
  ellipses: boolean;
  polygons: boolean;
  stars: boolean;
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
    checked: boolean
  ) => {
    setShapes({ ...shapes, [shapeName]: checked });
  };

  // Get size factor based on selected size
  const getSizeFactor = (selectedSize: Size): number => {
    switch (selectedSize) {
      case "small":
        return 0.5;
      case "medium":
        return 1.4;
      case "large":
        return 4.0;
    }
  };

  // Adjust density based on size factor
  const adjustDensity = (baseDensity: number, sizeFactor: number): number => {
    if (sizeFactor < 1) {
      return baseDensity * 2;
    } else if (sizeFactor > 3) {
      return baseDensity * 0.7;
    }
    return baseDensity;
  };

  // Handle generate with selected colors
  const handleGenerateWithColors = () => {
    // Validate colors array
    if (colors.length === 0) {
      setColorError(true);
      setTimeout(() => setColorError(false), 400);
      return;
    }

    const sizeFactor = getSizeFactor(size);
    const adjustedDensity = adjustDensity(density, sizeFactor);

    sendMessage("generate-selection", {
      sliderInput: adjustedDensity,
      inputColors: colors,
      RecValue: shapes.rectangles,
      EllValue: shapes.ellipses,
      PolyValue: shapes.polygons,
      StarValue: shapes.stars,
      sizeFactor,
    });
  };

  // Handle generate with random colors
  const handleGenerateRandom = () => {
    const sizeFactor = getSizeFactor(size);
    const adjustedDensity = adjustDensity(density, sizeFactor);

    sendMessage("generate-random", {
      sliderInput: adjustedDensity,
      RecValue: shapes.rectangles,
      EllValue: shapes.ellipses,
      PolyValue: shapes.polygons,
      StarValue: shapes.stars,
      sizeFactor,
    });
  };

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
