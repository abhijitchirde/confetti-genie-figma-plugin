import type {
  GenerateData,
  SavedSettings,
  ShapesState,
  Size,
  ThemePreference,
} from "./types";

export const MIN_DENSITY = 30;
export const MAX_DENSITY = 300;

export const DEFAULT_SETTINGS: SavedSettings = {
  density: 115,
  size: "medium",
  shapes: { rectangles: true, ellipses: true, polygons: true, stars: true },
  colors: [],
};

export type DensityLevel = "minimal" | "festive" | "party" | "bash" | "blast";

/** Named density bands shown in the UI, by their upper bound. */
export const DENSITY_LEVELS: { level: DensityLevel; max: number }[] = [
  { level: "minimal", max: 84 },
  { level: "festive", max: 138 },
  { level: "party", max: 192 },
  { level: "bash", max: 246 },
  { level: "blast", max: MAX_DENSITY },
];

export function densityLevelOf(density: number): DensityLevel {
  const band = DENSITY_LEVELS.find((b) => density <= b.max);
  return (band ?? DENSITY_LEVELS[DENSITY_LEVELS.length - 1]).level;
}

/** Density in the middle of a named band, used by Quick Actions. */
export function densityForLevel(level: DensityLevel): number {
  const index = DENSITY_LEVELS.findIndex((b) => b.level === level);
  const min = index === 0 ? MIN_DENSITY : DENSITY_LEVELS[index - 1].max + 1;
  return Math.round((min + DENSITY_LEVELS[index].max) / 2);
}

export function isDensityLevel(value: unknown): value is DensityLevel {
  return DENSITY_LEVELS.some((b) => b.level === value);
}

export const SIZES: Size[] = ["small", "medium", "large"];

export function isSize(value: unknown): value is Size {
  return SIZES.includes(value as Size);
}

// How much bigger each size preset makes the confetti
const SIZE_FACTORS: Record<Size, number> = {
  small: 0.5,
  medium: 1.4,
  large: 4.0,
};

/**
 * The generate request for the given settings. Smaller confetti gets more
 * pieces so it looks as full; larger gets fewer. Omit `colors` to use the
 * random palette.
 */
export function toGenerateData(
  settings: Pick<SavedSettings, "density" | "size" | "shapes">,
  colors?: string[],
): GenerateData {
  const sizeFactor = SIZE_FACTORS[settings.size];
  const count =
    sizeFactor < 1
      ? settings.density * 2
      : sizeFactor > 3
        ? settings.density * 0.7
        : settings.density;
  return { count, sizeFactor, shapes: settings.shapes, colors };
}

const HEX_COLOR = /^#[0-9A-F]{6}$/i;
const MAX_SAVED_COLORS = 100;

function parseColors(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  return value
    .filter((c): c is string => typeof c === "string" && HEX_COLOR.test(c))
    .map((c) => c.toUpperCase())
    .slice(0, MAX_SAVED_COLORS);
}

/** Copies valid booleans from `value` over `base`. */
function parseShapes(value: unknown, base: ShapesState): ShapesState {
  const shapes = { ...base };
  if (value && typeof value === "object") {
    const saved = value as Record<string, unknown>;
    for (const key of Object.keys(shapes) as (keyof ShapesState)[]) {
      if (typeof saved[key] === "boolean") shapes[key] = saved[key];
    }
  }
  return shapes;
}

/**
 * Reads settings saved by an earlier session. Anything missing or invalid
 * (e.g. from an older plugin version) falls back to the default for that
 * field. Returns null if nothing usable was saved.
 */
export function parseSavedSettings(value: unknown): SavedSettings | null {
  if (!value || typeof value !== "object") return null;
  const saved = value as Record<string, unknown>;

  const density =
    typeof saved.density === "number" &&
    saved.density >= MIN_DENSITY &&
    saved.density <= MAX_DENSITY
      ? Math.round(saved.density)
      : DEFAULT_SETTINGS.density;

  return {
    density,
    size: isSize(saved.size) ? saved.size : DEFAULT_SETTINGS.size,
    shapes: parseShapes(saved.shapes, DEFAULT_SETTINGS.shapes),
    colors: parseColors(saved.colors) ?? [],
  };
}

/**
 * Reads the generate request stored on a Confetti layer, for "Regenerate".
 * Returns null if it's missing or not valid.
 */
export function parseGenerateData(value: unknown): GenerateData | null {
  if (!value || typeof value !== "object") return null;
  const saved = value as Record<string, unknown>;
  if (
    typeof saved.count !== "number" ||
    !(saved.count > 0 && saved.count <= MAX_DENSITY * 2) ||
    typeof saved.sizeFactor !== "number" ||
    !(saved.sizeFactor > 0 && saved.sizeFactor <= 10)
  ) {
    return null;
  }
  const noShapes = {
    rectangles: false,
    ellipses: false,
    polygons: false,
    stars: false,
  };
  return {
    count: saved.count,
    sizeFactor: saved.sizeFactor,
    shapes: parseShapes(saved.shapes, noShapes),
    colors: parseColors(saved.colors) ?? undefined,
  };
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "auto" || value === "light" || value === "dark";
}
