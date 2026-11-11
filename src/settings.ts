import type { SavedSettings, Size, ThemePreference } from "./types";

export const MIN_DENSITY = 30;
export const MAX_DENSITY = 300;

export const DEFAULT_SETTINGS: SavedSettings = {
  density: 115,
  size: "medium",
  shapes: { rectangles: true, ellipses: true, polygons: true, stars: true },
  colors: [],
};

const SIZES: Size[] = ["small", "medium", "large"];
const HEX_COLOR = /^#[0-9A-F]{6}$/i;
const MAX_SAVED_COLORS = 100;

/**
 * Reads settings saved by an earlier session. Anything missing or invalid
 * (e.g. from an older plugin version) falls back to the default for that
 * field. Returns null if nothing usable was saved.
 */
export function parseSavedSettings(value: unknown): SavedSettings | null {
  if (!value || typeof value !== "object") return null;
  const saved = value as Record<string, unknown>;
  const settings: SavedSettings = {
    ...DEFAULT_SETTINGS,
    shapes: { ...DEFAULT_SETTINGS.shapes },
  };

  if (
    typeof saved.density === "number" &&
    saved.density >= MIN_DENSITY &&
    saved.density <= MAX_DENSITY
  ) {
    settings.density = Math.round(saved.density);
  }

  if (SIZES.includes(saved.size as Size)) {
    settings.size = saved.size as Size;
  }

  if (saved.shapes && typeof saved.shapes === "object") {
    const shapes = saved.shapes as Record<string, unknown>;
    for (const key of Object.keys(
      settings.shapes,
    ) as (keyof SavedSettings["shapes"])[]) {
      if (typeof shapes[key] === "boolean") settings.shapes[key] = shapes[key];
    }
  }

  if (Array.isArray(saved.colors)) {
    settings.colors = saved.colors
      .filter((c): c is string => typeof c === "string" && HEX_COLOR.test(c))
      .map((c) => c.toUpperCase())
      .slice(0, MAX_SAVED_COLORS);
  }

  return settings;
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "auto" || value === "light" || value === "dark";
}
