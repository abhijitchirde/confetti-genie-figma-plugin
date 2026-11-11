import * as React from "react";
import { useEffect, useState } from "react";
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
import { postToPlugin, usePluginMessage } from "./hooks/usePluginMessages";
import { DEFAULT_SETTINGS, toGenerateData } from "./settings";
import type { Size, ShapesState } from "./types";

function App() {
  const [density, setDensity] = useState(DEFAULT_SETTINGS.density);
  const [size, setSize] = useState<Size>(DEFAULT_SETTINGS.size);
  const [shapes, setShapes] = useState<ShapesState>(DEFAULT_SETTINGS.shapes);

  // Color state (using custom hook)
  const {
    colors,
    currentColor,
    setCurrentColor,
    addColor,
    removeColor,
    resetColors,
    setColors,
  } = useColorManager("#FF7272");

  // Color error state
  const [colorError, setColorError] = useState(false);

  // Restore the last session's settings, then save changes as they happen.
  // Saving waits until loading has finished so defaults don't overwrite them.
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  usePluginMessage((message) => {
    if (message.type !== "settings") return;
    if (message.settings) {
      setDensity(message.settings.density);
      setSize(message.settings.size);
      setShapes(message.settings.shapes);
      setColors(message.settings.colors);
    }
    setSettingsLoaded(true);
  });

  useEffect(() => {
    postToPlugin({ type: "load-settings" });
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    // Debounced, so dragging the density slider doesn't write on every step
    const timer = setTimeout(() => {
      postToPlugin({
        type: "save-settings",
        settings: { density, size, shapes, colors },
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [settingsLoaded, density, size, shapes, colors]);

  // Handle shape change
  const handleShapeChange = (
    shapeName: keyof ShapesState,
    checked: boolean,
  ) => {
    setShapes({ ...shapes, [shapeName]: checked });
  };

  const sendGenerate = (colorsToUse?: string[]) => {
    postToPlugin({
      type: "generate",
      data: toGenerateData({ density, size, shapes }, colorsToUse),
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
        disabled={!Object.values(shapes).some(Boolean)}
      />

      <BottomSection />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")!).render(<App />);
