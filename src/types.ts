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

/** "auto" follows Figma's theme; "light" and "dark" override it. */
export type ThemePreference = "auto" | "light" | "dark";

/** UI choices remembered between sessions. */
export interface SavedSettings {
  density: number;
  size: Size;
  shapes: ShapesState;
  /** "#RRGGBB" colors added for "Generate with selected colors" */
  colors: string[];
}

/** Messages sent from the UI iframe to the plugin code. */
export type UiToPluginMessage =
  | { type: "generate"; data: GenerateData }
  | { type: "load-settings" }
  | { type: "save-settings"; settings: SavedSettings }
  | { type: "load-theme" }
  | { type: "save-theme"; theme: ThemePreference };

/** Messages sent from the plugin code to the UI iframe. */
export type PluginToUiMessage =
  | { type: "settings"; settings: SavedSettings | null }
  | { type: "theme"; theme: ThemePreference };
