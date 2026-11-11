import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_SETTINGS,
  isThemePreference,
  parseSavedSettings,
} from "../src/settings";
import type { SavedSettings } from "../src/types";
import { installFakeFigma } from "./fakeFigma";

const SAVED: SavedSettings = {
  density: 200,
  size: "large",
  shapes: { rectangles: true, ellipses: false, polygons: true, stars: false },
  colors: ["#FF0000", "#00FF00"],
};

describe("parseSavedSettings", () => {
  it("returns valid settings unchanged", () => {
    expect(parseSavedSettings(SAVED)).toEqual(SAVED);
  });

  it("returns null when nothing usable was saved", () => {
    expect(parseSavedSettings(undefined)).toBeNull();
    expect(parseSavedSettings("settings")).toBeNull();
  });

  it("falls back to defaults for missing or invalid fields", () => {
    expect(
      parseSavedSettings({
        density: 9999,
        size: "huge",
        shapes: { rectangles: false, stars: "yes" },
        colors: ["#ABCDEF", "red", 42, "#12345"],
      }),
    ).toEqual({
      density: DEFAULT_SETTINGS.density,
      size: DEFAULT_SETTINGS.size,
      shapes: { ...DEFAULT_SETTINGS.shapes, rectangles: false },
      colors: ["#ABCDEF"],
    });
  });

  it("does not share the defaults object", () => {
    const parsed = parseSavedSettings({})!;
    parsed.shapes.stars = false;
    expect(DEFAULT_SETTINGS.shapes.stars).toBe(true);
  });
});

describe("isThemePreference", () => {
  it("accepts only auto, light and dark", () => {
    expect(["auto", "light", "dark"].every(isThemePreference)).toBe(true);
    expect(isThemePreference("system")).toBe(false);
    expect(isThemePreference(undefined)).toBe(false);
  });
});

describe("plugin message handlers", () => {
  let state: ReturnType<typeof installFakeFigma>;

  beforeEach(async () => {
    state = installFakeFigma();
    vi.resetModules();
    await import("../src/code"); // registers figma.ui.onmessage
  });

  it("saves settings and restores them in a later session", async () => {
    await state.sendToPlugin({ type: "save-settings", settings: SAVED });
    await state.sendToPlugin({ type: "load-settings" });
    expect(state.uiMessages).toEqual([{ type: "settings", settings: SAVED }]);
  });

  it("sends null settings on first run", async () => {
    await state.sendToPlugin({ type: "load-settings" });
    expect(state.uiMessages).toEqual([{ type: "settings", settings: null }]);
  });

  it("saves the theme choice and defaults to auto", async () => {
    await state.sendToPlugin({ type: "load-theme" });
    await state.sendToPlugin({ type: "save-theme", theme: "dark" });
    await state.sendToPlugin({ type: "load-theme" });
    expect(state.uiMessages).toEqual([
      { type: "theme", theme: "auto" },
      { type: "theme", theme: "dark" },
    ]);
  });

  it("ignores invalid theme values", async () => {
    await state.sendToPlugin({ type: "save-theme", theme: "purple" });
    expect(state.storage.size).toBe(0);
  });

  it("keeps working when storage is unavailable", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    state.storageFails = true;
    await state.sendToPlugin({ type: "save-settings", settings: SAVED });
    await state.sendToPlugin({ type: "load-settings" });
    await state.sendToPlugin({ type: "load-theme" });
    expect(state.uiMessages).toEqual([
      { type: "settings", settings: null },
      { type: "theme", theme: "auto" },
    ]);
  });

  it("shows a notification after generating", async () => {
    await state.sendToPlugin({
      type: "generate",
      data: { count: 40, sizeFactor: 1.4, shapes: SAVED.shapes },
    });
    expect(state.notifications.map((n) => n.message)).toEqual([
      "Added 40 confetti pieces to a new frame",
    ]);
  });
});
