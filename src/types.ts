// Types shared between the plugin code (code.ts) and the UI (ui.tsx).

export type Size = "small" | "medium" | "large";

export interface ShapesState {
  rectangles: boolean;
  ellipses: boolean;
  polygons: boolean;
  stars: boolean;
}

export interface GenerateData {
  sliderInput: number;
  sizeFactor: number;
  RecValue: boolean;
  EllValue: boolean;
  PolyValue: boolean;
  StarValue: boolean;
}

/** Messages sent from the UI iframe to the plugin code. */
export type UiToPluginMessage =
  | { type: "generate-random"; data: GenerateData }
  | {
      type: "generate-selection";
      data: GenerateData & { inputColors: string[] };
    }
  | { type: "get-theme" };
