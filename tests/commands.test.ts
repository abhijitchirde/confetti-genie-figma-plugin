import { beforeEach, describe, expect, it, vi } from "vitest";
import { densityForLevel, toGenerateData } from "../src/settings";
import type { SavedSettings } from "../src/types";
import { attach, installFakeFigma, makeNode, type FakeNode } from "./fakeFigma";

let state: ReturnType<typeof installFakeFigma>;

beforeEach(async () => {
  state = installFakeFigma();
  vi.resetModules();
  await import("../src/code");
});

function frame(props: Partial<FakeNode> = {}): FakeNode {
  return attach(
    state.page,
    makeNode("FRAME", { layoutMode: "NONE", ...props }),
  );
}

function confettiLayerOf(target: FakeNode): FakeNode {
  const layer = target.children.find((c) => c.name === "Confetti");
  if (!layer) throw new Error("No Confetti layer");
  return layer;
}

const SAVED: SavedSettings = {
  density: 60,
  size: "small",
  shapes: { rectangles: true, ellipses: false, polygons: false, stars: false },
  colors: ["#FF0000"],
};

describe("launching", () => {
  it("opens the plugin window when run without parameters", async () => {
    await state.run();
    expect(state.uiShown).toBe(true);
    expect(state.closedWith).toBeUndefined();
  });
});

describe("Quick Actions", () => {
  it("suggests density levels, filtered by what's typed", async () => {
    expect(await state.suggest("density")).toEqual([
      { name: "Minimal", data: "minimal" },
      { name: "Festive", data: "festive" },
      { name: "Party", data: "party" },
      { name: "Bash", data: "bash" },
      { name: "Blast", data: "blast" },
    ]);
    expect(await state.suggest("density", "BL")).toEqual([
      { name: "Blast", data: "blast" },
    ]);
  });

  it("suggests sizes", async () => {
    expect(await state.suggest("size", "m")).toEqual([
      { name: "Medium", data: "medium" },
    ]);
  });

  it("offers saved colors only when there are some", async () => {
    expect(await state.suggest("colors")).toEqual([
      { name: "Random colors", data: "random" },
    ]);
    state.storage.set("settings", SAVED);
    expect(await state.suggest("colors")).toEqual([
      { name: "Random colors", data: "random" },
      { name: "My colors (1)", data: "mine" },
    ]);
  });

  it("generates without opening the window, using the chosen density", async () => {
    const target = frame();
    state.selection = [target];
    await state.run({ parameters: { density: "party" } });

    // Size and shapes default to the plugin's defaults on first use
    const expected = toGenerateData({
      density: densityForLevel("party"),
      size: "medium",
      shapes: { rectangles: true, ellipses: true, polygons: true, stars: true },
    });
    expect(state.uiShown).toBe(false);
    expect(confettiLayerOf(target).children).toHaveLength(
      Math.ceil(expected.count / 4) * 4,
    );
    expect(state.closedWith).toMatch(/^Added \d+ confetti pieces$/);
  });

  it("fills in size and shapes from the last used settings", async () => {
    state.storage.set("settings", SAVED);
    const target = frame();
    state.selection = [target];
    await state.run({ parameters: { density: "minimal" } });

    const pieces = confettiLayerOf(target).children;
    // Small size doubles the count; only rectangles are enabled
    expect(pieces).toHaveLength(densityForLevel("minimal") * 2);
    expect(pieces.every((p) => p.type === "RECTANGLE")).toBe(true);
  });

  it("uses saved colors when asked, and random colors by default", async () => {
    state.storage.set("settings", SAVED);
    const target = frame();
    state.selection = [target];
    await state.run({ parameters: { density: "minimal", colors: "mine" } });

    for (const piece of confettiLayerOf(target).children) {
      expect((piece.fills![0] as { color: RGB }).color).toEqual({
        r: 1,
        g: 0,
        b: 0,
      });
    }
  });

  it("explains when there are no saved colors", async () => {
    await state.run({ parameters: { density: "party", colors: "mine" } });
    expect(state.closedWith).toBe(
      "No saved colors yet. Add some in the plugin window first",
    );
    expect(state.page.children).toHaveLength(0);
  });
});

describe("Regenerate confetti", () => {
  it("adds the relaunch button to Confetti layers", async () => {
    await state.run();
    const target = frame();
    state.selection = [target];
    await state.sendToPlugin({
      type: "generate",
      data: toGenerateData(SAVED),
    });
    expect(confettiLayerOf(target).relaunchData).toHaveProperty("regenerate");
  });

  it("replaces the pieces using the settings the layer was made with", async () => {
    await state.run();
    const target = frame({ width: 400, height: 300 });
    state.selection = [target];
    await state.sendToPlugin({
      type: "generate",
      data: toGenerateData(SAVED, SAVED.colors),
    });
    const layer = confettiLayerOf(target);
    const before = [...layer.children];

    vi.resetModules();
    await import("../src/code");
    await state.run({ command: "regenerate" });

    expect(layer.children).toHaveLength(before.length);
    expect(layer.children.some((c) => before.includes(c))).toBe(false);
    expect(layer.children.every((c) => c.type === "RECTANGLE")).toBe(true);
    expect(state.closedWith).toBe(
      `Regenerated ${before.length} confetti pieces`,
    );
  });

  it("asks for a Confetti layer when none is selected", async () => {
    state.selection = [frame()];
    await state.run({ command: "regenerate" });
    expect(state.closedWith).toBe("Select a Confetti layer to regenerate");
  });

  it("leaves layers without saved settings alone", async () => {
    const layer = frame();
    layer.setPluginData("confettiLayer", "true");
    const piece = attach(layer, makeNode("RECTANGLE"));
    state.selection = [layer];
    await state.run({ command: "regenerate" });

    expect(layer.children).toEqual([piece]);
    expect(state.closedWith).toMatch(/no saved settings/);
  });
});
