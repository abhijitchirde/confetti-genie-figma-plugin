import { beforeEach, describe, expect, it } from "vitest";
import {
  canHoldConfetti,
  describeOutcome,
  generate,
  NEW_FRAME_SIZE,
  RANDOM_COLORS,
  type GenerateOutcome,
} from "../src/plugin/generate";
import type { GenerateData } from "../src/types";
import {
  asScene,
  attach,
  installFakeFigma,
  makeNode,
  type FakeNode,
} from "./fakeFigma";

const ALL_SHAPES = {
  rectangles: true,
  ellipses: true,
  polygons: true,
  stars: true,
};

function data(overrides: Partial<GenerateData> = {}): GenerateData {
  return { count: 40, sizeFactor: 1.4, shapes: ALL_SHAPES, ...overrides };
}

function okOutcome(outcome: GenerateOutcome) {
  if (!outcome.ok) throw new Error(`Expected success: ${outcome.message}`);
  return outcome;
}

function frame(props: Partial<FakeNode> = {}): FakeNode {
  const node = makeNode("FRAME", { layoutMode: "NONE", ...props });
  attach(state.page, node);
  return node;
}

/** The single "Confetti" layer the plugin added to a target. */
function confettiLayerOf(target: FakeNode): FakeNode {
  const layers = target.children.filter((c) => c.name === "Confetti");
  expect(layers).toHaveLength(1);
  return layers[0];
}

let state: ReturnType<typeof installFakeFigma>;

beforeEach(() => {
  state = installFakeFigma();
});

describe("generate into a frame", () => {
  it("puts all pieces in one transparent Confetti layer covering the frame", () => {
    const target = frame({ width: 300, height: 200 });
    attach(target, makeNode("TEXT"));
    state.selection = [target];

    const outcome = okOutcome(generate(data()));

    expect(target.children).toHaveLength(2);
    const layer = confettiLayerOf(target);
    expect(layer).toMatchObject({
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      fills: [],
      clipsContent: false,
      constraints: { horizontal: "STRETCH", vertical: "STRETCH" },
    });
    expect(layer.children).toHaveLength(40);
    expect(outcome).toMatchObject({ pieces: 40, targets: 1, skipped: 0 });
  });

  it("scatters pieces within the area and lets them scale with the layer", () => {
    const target = frame({ width: 300, height: 200 });
    state.selection = [target];
    generate(data());

    for (const piece of confettiLayerOf(target).children) {
      expect(piece.x).toBeGreaterThanOrEqual(0);
      expect(piece.x).toBeLessThanOrEqual(300);
      expect(piece.y).toBeGreaterThanOrEqual(0);
      expect(piece.y).toBeLessThanOrEqual(200);
      expect(piece.constraints).toEqual({
        horizontal: "SCALE",
        vertical: "SCALE",
      });
    }
  });

  it("splits the count evenly across the chosen shapes, rounding up", () => {
    const target = frame();
    state.selection = [target];
    generate(
      data({
        count: 25,
        shapes: { ...ALL_SHAPES, polygons: false, stars: false },
      }),
    );

    const types = confettiLayerOf(target).children.map((c) => c.type);
    expect(types.filter((t) => t === "RECTANGLE")).toHaveLength(13);
    expect(types.filter((t) => t === "ELLIPSE")).toHaveLength(13);
    expect(types).toHaveLength(26);
  });

  it("reports how many pieces were added", () => {
    const targets = [frame(), frame()];
    state.selection = targets;
    expect(describeOutcome(generate(data()))).toBe(
      "Added 80 confetti pieces to 2 layers",
    );

    state.selection = [targets[0]];
    expect(describeOutcome(generate(data()))).toBe("Added 40 confetti pieces");

    state.selection = [];
    expect(describeOutcome(generate(data()))).toBe(
      "Added 40 confetti pieces to a new frame",
    );
  });

  it("selects the new Confetti layer", () => {
    const target = frame();
    state.selection = [target];
    generate(data());
    expect(state.selection).toEqual([confettiLayerOf(target)]);
  });
});

describe("generate into special containers", () => {
  it("keeps the layer out of auto layout and reflows the parent once", () => {
    const target = frame({ layoutMode: "VERTICAL", width: 300, height: 200 });
    state.selection = [target];
    generate(data());

    const layer = confettiLayerOf(target);
    expect(layer.layoutPositioning).toBe("ABSOLUTE");
    expect(layer.children).toHaveLength(40);
    expect(target.reflows).toBe(1);
  });

  it("places the layer at a group's position", () => {
    const outer = frame({ width: 2000, height: 2000 });
    const group = attach(
      outer,
      makeNode("GROUP", { x: 800, y: 900, width: 100, height: 50 }),
    );
    state.selection = [group];
    generate(data());

    expect(confettiLayerOf(group)).toMatchObject({
      x: 800,
      y: 900,
      width: 100,
      height: 50,
    });
  });

  it("adds to a selected Confetti layer instead of nesting a new one", () => {
    const target = frame();
    state.selection = [target];
    generate(data());
    const layer = confettiLayerOf(target);

    generate(data()); // the layer is now the selection
    expect(confettiLayerOf(target)).toBe(layer);
    expect(layer.children).toHaveLength(80);
    expect(layer.children.every((c) => c.type !== "FRAME")).toBe(true);
  });
});

describe("selections that can't hold confetti", () => {
  it("skips instances, their contents, component sets and boolean groups", () => {
    const instance = attach(state.page, makeNode("INSTANCE"));
    const insideInstance = attach(instance, makeNode("FRAME"));
    const componentSet = attach(state.page, makeNode("COMPONENT_SET"));
    const booleanGroup = attach(state.page, makeNode("BOOLEAN_OPERATION"));
    const target = frame();
    state.selection = [
      instance,
      insideInstance,
      componentSet,
      booleanGroup,
      target,
    ];

    const outcome = okOutcome(generate(data()));

    expect(outcome).toMatchObject({ targets: 1, skipped: 4, newFrame: false });
    expect(confettiLayerOf(target).children).toHaveLength(40);
    expect(instance.children).toEqual([insideInstance]);
    expect(describeOutcome(outcome)).toBe(
      "Added 40 confetti pieces · skipped 4 layers that can't hold confetti",
    );
  });

  it("creates a new frame in view when nothing usable is selected", () => {
    const text = attach(state.page, makeNode("TEXT"));
    state.selection = [text];

    const outcome = okOutcome(generate(data()));

    const newFrame = state.selection[0];
    expect(newFrame).toMatchObject({
      name: "Confetti Frame",
      width: NEW_FRAME_SIZE,
      height: NEW_FRAME_SIZE,
      x: 1000 - NEW_FRAME_SIZE / 2,
      y: 2000 - NEW_FRAME_SIZE / 2,
    });
    // Pieces go straight into the new frame, with no extra layer
    expect(newFrame.children).toHaveLength(40);
    expect(newFrame.children.every((c) => c.type !== "FRAME")).toBe(true);
    expect(state.scrolledTo).toEqual([[newFrame]]);
    expect(outcome).toMatchObject({ newFrame: true, skipped: 1 });
    expect(describeOutcome(outcome)).toBe(
      "The selected layers can't hold confetti, so 40 confetti pieces were added to a new frame",
    );
  });

  it("adds to the created frame when generating again", () => {
    state.selection = [];
    generate(data());
    const newFrame = state.selection[0];
    generate(data());

    expect(state.selection).toEqual([newFrame]);
    expect(newFrame.children).toHaveLength(80);
    expect(
      state.page.children.filter((c) => c.name === "Confetti Frame"),
    ).toHaveLength(1);
  });

  it("identifies containers that can hold confetti", () => {
    expect(canHoldConfetti(asScene(makeNode("FRAME")))).toBe(true);
    expect(canHoldConfetti(asScene(makeNode("GROUP")))).toBe(true);
    expect(canHoldConfetti(asScene(makeNode("SECTION")))).toBe(true);
    expect(canHoldConfetti(asScene(makeNode("TEXT")))).toBe(false);
    expect(canHoldConfetti(asScene(makeNode("RECTANGLE")))).toBe(false);
  });
});

describe("colors", () => {
  function fillColors(target: FakeNode) {
    return confettiLayerOf(target).children.map(
      (c) => (c.fills![0] as { color: RGB }).color,
    );
  }

  it("uses only the chosen colors", () => {
    const target = frame();
    state.selection = [target];
    generate(data({ colors: ["#FF0000", "#0000FF"] }));

    for (const color of fillColors(target)) {
      expect([
        { r: 1, g: 0, b: 0 },
        { r: 0, g: 0, b: 1 },
      ]).toContainEqual(color);
    }
  });

  it("uses the random palette when no colors are sent", () => {
    const target = frame();
    state.selection = [target];
    generate(data());

    for (const color of fillColors(target)) {
      expect(RANDOM_COLORS).toContainEqual(color);
    }
  });
});

describe("invalid requests", () => {
  it("rejects a request with no shapes", () => {
    state.selection = [frame()];
    const outcome = generate(
      data({
        shapes: {
          rectangles: false,
          ellipses: false,
          polygons: false,
          stars: false,
        },
      }),
    );
    expect(outcome.ok).toBe(false);
    expect(describeOutcome(outcome)).toMatch(/select shapes/);
  });

  it("rejects a request whose colors are all invalid", () => {
    state.selection = [frame()];
    const outcome = generate(data({ colors: ["nope"] }));
    expect(outcome.ok).toBe(false);
    expect(describeOutcome(outcome)).toMatch(/at least one color/);
  });

  it("handles tiny targets without invalid sizes", () => {
    const tiny = frame({ width: 2, height: 0.5 });
    state.selection = [tiny];
    expect(() => generate(data({ sizeFactor: 0.5 }))).not.toThrow();
    expect(confettiLayerOf(tiny).children).toHaveLength(40);
  });
});
