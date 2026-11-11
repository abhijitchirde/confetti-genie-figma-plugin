import { describe, expect, it } from "vitest";
import {
  clampSize,
  hexToRgb,
  pick,
  randFloat,
  randInt,
} from "../src/plugin/utils";

describe("randInt", () => {
  it("returns integers within the inclusive range", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 2000; i++) {
      const n = randInt(3, 6);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(6);
      seen.add(n);
    }
    expect([...seen].sort()).toEqual([3, 4, 5, 6]);
  });

  it("stays within fractional bounds", () => {
    for (let i = 0; i < 1000; i++) {
      const n = randInt(0, 99.6);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(99);
    }
  });
});

describe("randFloat", () => {
  it("returns values in [min, max)", () => {
    for (let i = 0; i < 1000; i++) {
      const n = randFloat(1.5, 2.5);
      expect(n).toBeGreaterThanOrEqual(1.5);
      expect(n).toBeLessThan(2.5);
    }
  });
});

describe("pick", () => {
  it("only returns items from the list", () => {
    const items = ["a", "b", "c"];
    for (let i = 0; i < 100; i++) expect(items).toContain(pick(items));
  });
});

describe("clampSize", () => {
  it("rounds to one decimal place", () => {
    expect(clampSize(12.345)).toBe(12.3);
    expect(clampSize(7.06)).toBe(7.1);
  });

  it("never goes below the minimum Figma accepts", () => {
    expect(clampSize(0)).toBe(0.1);
    expect(clampSize(0.04)).toBe(0.1);
  });
});

describe("hexToRgb", () => {
  it("converts hex to 0–1 RGB", () => {
    expect(hexToRgb("#FF0080")).toEqual({ r: 1, g: 0, b: 128 / 255 });
    expect(hexToRgb("00ff00")).toEqual({ r: 0, g: 1, b: 0 });
  });

  it("returns null for invalid input", () => {
    expect(hexToRgb("#FFF")).toBeNull();
    expect(hexToRgb("red")).toBeNull();
    expect(hexToRgb("")).toBeNull();
  });
});
