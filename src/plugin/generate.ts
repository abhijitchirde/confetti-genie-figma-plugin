import type { GenerateData, ShapesState } from "../types";
import { clampSize, hexToRgb, pick, randFloat, randInt } from "./utils";

// Palette used when the UI doesn't send colors ("Generate with random colors")
export const RANDOM_COLORS: RGB[] = [
  { r: 0.01, g: 0.64, b: 0.96 },
  { r: 0.605, g: 0.96, b: 0.99 },
  { r: 0.789, g: 0.99, b: 0.746 },
  { r: 0.863, g: 0.738, b: 0.98 },
  { r: 0.99, g: 0.621, b: 0.109 },
  { r: 0.617, g: 0.93, b: 0.102 },
  { r: 0.46, g: 0.374, b: 0.996 },
  { r: 1, g: 0.13, b: 0.985 },
  { r: 0.964, g: 0.144, b: 0.519 },
  { r: 0.281, g: 0.046, b: 0.656 },
  { r: 0.296, g: 0.785, b: 0.937 },
  { r: 0.96, g: 0.277, b: 0.129 },
  { r: 1, g: 0.93, b: 0.21 },
  { r: 0.73, g: 0.242, b: 0.011 },
];

// A few distinct opacity steps give depth without too much variation
export const OPACITY_STEPS = [0.35, 0.45, 0.6, 0.65, 0.75, 0.85, 0.9, 1];

export const NEW_FRAME_SIZE = 500;

// Plugin data key marking frames that hold only confetti made by this plugin
const CONFETTI_LAYER_KEY = "confettiLayer";

type ContainerNode = SceneNode & ChildrenMixin;
type ConfettiNode = RectangleNode | EllipseNode | PolygonNode | StarNode;

interface ShapeSpec {
  key: keyof ShapesState;
  create: () => ConfettiNode;
  /** Width and height, given the target's longer and shorter side (already scaled by size). */
  size: (longSide: number, shortSide: number) => [number, number];
  rotate: boolean;
}

const SHAPES: ShapeSpec[] = [
  {
    key: "rectangles",
    create: () => figma.createRectangle(),
    size: (long, short) => [
      randFloat(long * 0.007, long * 0.04),
      randFloat(short * 0.01, short * 0.02),
    ],
    rotate: true,
  },
  {
    key: "ellipses",
    create: () => figma.createEllipse(),
    size: (long) => square(randFloat(long * 0.005, long * 0.015)),
    rotate: false,
  },
  {
    key: "polygons",
    create: () => {
      const polygon = figma.createPolygon();
      polygon.pointCount = randInt(3, 6);
      return polygon;
    },
    size: (long) => square(randFloat(long * 0.01, long * 0.02)),
    rotate: true,
  },
  {
    key: "stars",
    create: () => {
      const star = figma.createStar();
      star.pointCount = randInt(4, 6);
      return star;
    },
    size: (long) => square(randFloat(long * 0.01, long * 0.02)),
    rotate: true,
  },
];

export type GenerateOutcome =
  | { ok: false; message: string }
  | {
      ok: true;
      /** Total pieces added across all targets */
      pieces: number;
      /** Number of targets confetti was added to */
      targets: number;
      /** Selected layers that couldn't hold confetti */
      skipped: number;
      /** A new frame was created because nothing usable was selected */
      newFrame: boolean;
    };

/**
 * Adds confetti to every selected layer that can hold it, or to a new frame
 * if there is none, then selects the result.
 */
export function generate(data: GenerateData): GenerateOutcome {
  const shapes = SHAPES.filter((shape) => data.shapes[shape.key]);
  if (shapes.length === 0) {
    return { ok: false, message: "Please select shapes to generate confetti" };
  }

  const colors = data.colors
    ? data.colors.map(hexToRgb).filter((c): c is RGB => c !== null)
    : RANDOM_COLORS;
  if (colors.length === 0) {
    return { ok: false, message: "Please add at least one color" };
  }

  const countPerShape = Math.ceil(data.count / shapes.length);
  const selection = figma.currentPage.selection;
  const targets = selection.filter(canHoldConfetti);
  const skipped = selection.length - targets.length;

  let results: FrameNode[];
  let newFrame: FrameNode | null = null;
  if (targets.length > 0) {
    results = targets.map((target) => {
      if (isConfettiLayer(target)) {
        // Generating again with a confetti layer selected adds more to it,
        // rather than nesting another layer inside
        fillWithConfetti(target, target.width, target.height);
        return target;
      }
      return addConfettiLayer(target);
    });
  } else {
    // Nothing usable selected: make a new frame in view. It only holds
    // confetti, so the pieces go straight in without an extra layer.
    newFrame = createConfettiFrame();
    fillWithConfetti(newFrame, newFrame.width, newFrame.height);
    results = [newFrame];
  }

  // Select the new confetti so it can be moved or deleted straight away
  figma.currentPage.selection = results;
  if (newFrame) {
    figma.viewport.scrollAndZoomIntoView([newFrame]);
  }

  return {
    ok: true,
    pieces: countPerShape * shapes.length * results.length,
    targets: results.length,
    skipped,
    newFrame: newFrame !== null,
  };

  /** Scatters confetti over a width × height area of the given frame. */
  function fillWithConfetti(frame: FrameNode, width: number, height: number) {
    const longSide = Math.max(width, height) * data.sizeFactor;
    const shortSide = Math.min(width, height) * data.sizeFactor;

    for (const shape of shapes) {
      for (let i = 0; i < countPerShape; i++) {
        const node = shape.create();
        const [w, h] = shape.size(longSide, shortSide);
        node.resize(clampSize(w), clampSize(h));
        node.fills = [
          {
            type: "SOLID",
            color: pick(colors),
            opacity: pick(OPACITY_STEPS),
          },
        ];
        if (shape.rotate) {
          node.rotation = randFloat(-180, 180);
        }

        frame.appendChild(node);
        node.x = randInt(0, width);
        node.y = randInt(0, height);
        // Spread out proportionally when the frame is resized
        node.constraints = { horizontal: "SCALE", vertical: "SCALE" };
      }
    }
  }

  /**
   * Adds a transparent "Confetti" frame covering the target, filled with
   * confetti, so all pieces sit in one layer instead of being scattered among
   * the target's own children.
   */
  function addConfettiLayer(target: ContainerNode): FrameNode {
    const { width, height } = target;

    // Children of a group are positioned in the group's parent's coordinates,
    // so offset by the group's position. Frames and sections have their own.
    const origin =
      target.type === "GROUP" ? { x: target.x, y: target.y } : { x: 0, y: 0 };

    const layer = figma.createFrame();
    layer.name = "Confetti";
    layer.setPluginData(CONFETTI_LAYER_KEY, "true");
    layer.fills = [];
    layer.clipsContent = false;
    layer.resize(clampSize(width), clampSize(height));

    // Fill the layer before inserting it, so an auto layout target only has
    // to reflow once instead of once per piece.
    fillWithConfetti(layer, width, height);

    target.appendChild(layer);
    // In auto layout, opt out of the layout flow, or Figma would place the
    // layer as the next item and ignore x/y.
    if ("layoutMode" in target && target.layoutMode !== "NONE") {
      layer.layoutPositioning = "ABSOLUTE";
    }
    layer.x = origin.x;
    layer.y = origin.y;
    // Resize along with the target; the pieces scale inside it.
    layer.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };

    return layer;
  }
}

/** The notification to show for an outcome, or null for none. */
export function describeOutcome(outcome: GenerateOutcome): string | null {
  if (!outcome.ok) return outcome.message;
  if (outcome.newFrame && outcome.skipped > 0) {
    return "The selected layers can't hold confetti, so it was added to a new frame";
  }
  if (outcome.skipped > 0) {
    return `Skipped ${plural(outcome.skipped, "selected layer")} that can't hold confetti`;
  }
  return null;
}

/**
 * True for nodes that confetti can be appended to. Instances (and anything
 * inside them) and component sets reject new children, and adding shapes to a
 * boolean group would change its result.
 */
export function canHoldConfetti(node: SceneNode): node is ContainerNode {
  if (!("appendChild" in node)) return false;
  if (
    node.type === "INSTANCE" ||
    node.type === "COMPONENT_SET" ||
    node.type === "BOOLEAN_OPERATION"
  ) {
    return false;
  }
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === "INSTANCE") return false;
  }
  return true;
}

function isConfettiLayer(node: SceneNode): node is FrameNode {
  return (
    node.type === "FRAME" && node.getPluginData(CONFETTI_LAYER_KEY) === "true"
  );
}

function createConfettiFrame(): FrameNode {
  const frame = figma.createFrame();
  frame.name = "Confetti Frame";
  frame.setPluginData(CONFETTI_LAYER_KEY, "true");
  frame.resize(NEW_FRAME_SIZE, NEW_FRAME_SIZE);
  const center = figma.viewport.center;
  frame.x = Math.round(center.x - NEW_FRAME_SIZE / 2);
  frame.y = Math.round(center.y - NEW_FRAME_SIZE / 2);
  return frame;
}

function square(side: number): [number, number] {
  return [side, side];
}

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
