/** Random integer in [min, max], inclusive. */
export function randInt(min: number, max: number): number {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/** Random float in [min, max). */
export function randFloat(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Rounds to one decimal place and keeps the size Figma's resize() accepts. */
export function clampSize(value: number): number {
  return Math.max(0.1, Math.round(value * 10) / 10);
}

/** Converts "#RRGGBB" to Figma's 0–1 RGB, or null if the string is invalid. */
export function hexToRgb(hex: string): RGB | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? {
        r: parseInt(match[1], 16) / 255,
        g: parseInt(match[2], 16) / 255,
        b: parseInt(match[3], 16) / 255,
      }
    : null;
}
