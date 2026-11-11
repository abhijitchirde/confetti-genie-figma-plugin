// Types shared between the plugin code (code.ts) and the UI (ui.tsx).

export type Size = "small" | "medium" | "large";

export interface ShapesState {
  rectangles: boolean;
  ellipses: boolean;
  polygons: boolean;
  stars: boolean;
}

export interface GenerateData {
  /** Pieces to add to each target, already adjusted for the size preset */
  count: number;
  /** Scales piece size relative to the target's dimensions */
  sizeFactor: number;
  shapes: ShapesState;
  /** "#RRGGBB" colors to use; omit to use the built-in random palette */
  colors?: string[];
}

/** Messages sent from the UI iframe to the plugin code. */
export type UiToPluginMessage = { type: "generate"; data: GenerateData };
