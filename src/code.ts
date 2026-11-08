import type { GenerateData, UiToPluginMessage } from "./types";

figma.showUI(__html__, { width: 270, height: 540 });

// Palette used by "Generate with random colors"
const RANDOM_COLORS: RGB[] = [
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
const OPACITY_STEPS = [0.35, 0.45, 0.6, 0.65, 0.75, 0.85, 0.9, 1];

const NEW_FRAME_SIZE = 500;

type ContainerNode = SceneNode & ChildrenMixin;
type ConfettiNode = RectangleNode | EllipseNode | PolygonNode | StarNode;

interface ShapeSpec {
  isEnabled: (data: GenerateData) => boolean;
  create: () => ConfettiNode;
  /** Width and height, given the target's longer and shorter side (already scaled by size). */
  size: (longSide: number, shortSide: number) => [number, number];
  rotate: boolean;
}

const SHAPES: ShapeSpec[] = [
  {
    isEnabled: (data) => data.RecValue,
    create: () => figma.createRectangle(),
    size: (long, short) => [
      randFloat(long * 0.007, long * 0.04),
      randFloat(short * 0.01, short * 0.02),
    ],
    rotate: true,
  },
  {
    isEnabled: (data) => data.EllValue,
    create: () => figma.createEllipse(),
    size: (long) => square(randFloat(long * 0.005, long * 0.015)),
    rotate: false,
  },
  {
    isEnabled: (data) => data.PolyValue,
    create: () => {
      const polygon = figma.createPolygon();
      polygon.pointCount = randInt(3, 6);
      return polygon;
    },
    size: (long) => square(randFloat(long * 0.01, long * 0.02)),
    rotate: true,
  },
  {
    isEnabled: (data) => data.StarValue,
    create: () => {
      const star = figma.createStar();
      star.pointCount = randInt(4, 6);
      return star;
    },
    size: (long) => square(randFloat(long * 0.01, long * 0.02)),
    rotate: true,
  },
];

figma.ui.onmessage = (msg: UiToPluginMessage) => {
  if (msg.type === "get-theme") {
    figma.ui.postMessage({
      type: "theme-changed",
      theme: figma.editorType === "figma" ? "light" : "dark",
    });
    return;
  }

  try {
    if (msg.type === "generate-random") {
      generate(msg.data, RANDOM_COLORS);
    } else if (msg.type === "generate-selection") {
      const colors = msg.data.inputColors
        .map(hexToRgb)
        .filter((c): c is RGB => c !== null);
      generate(msg.data, colors);
    }
  } catch (error) {
    console.error(error);
    const reason = error instanceof Error ? error.message : String(error);
    figma.notify(`Couldn't add confetti: ${reason}`, { error: true });
  }
};

function generate(data: GenerateData, colors: RGB[]) {
  const shapes = SHAPES.filter((shape) => shape.isEnabled(data));
  if (shapes.length === 0) {
    figma.notify("Please select shapes to generate confetti", {
      timeout: 1200,
    });
    return;
  }
  if (colors.length === 0) {
    figma.notify("Please add at least one color", { timeout: 1200 });
    return;
  }

  const selection = figma.currentPage.selection;
  const targets = selection.filter(canHoldConfetti);
  const skipped = selection.length - targets.length;

  // Nothing usable selected: make a new frame in view and fill that instead
  let createdFrame: FrameNode | null = null;
  if (targets.length === 0) {
    createdFrame = createConfettiFrame();
    targets.push(createdFrame);
  }

  for (const target of targets) {
    addConfetti(target, data, shapes, colors);
  }

  if (createdFrame) {
    figma.viewport.scrollAndZoomIntoView([createdFrame]);
  }

  if (createdFrame && selection.length > 0) {
    figma.notify(
      "The selected layers can't hold confetti, so it was added to a new frame"
    );
  } else if (skipped > 0) {
    figma.notify(
      `Skipped ${skipped} selected ${
        skipped === 1 ? "layer" : "layers"
      } that can't hold confetti`
    );
  }
}

/**
 * True for nodes that confetti can be appended to. Instances (and anything
 * inside them) and component sets reject new children, and adding shapes to a
 * boolean group would change its result.
 */
function canHoldConfetti(node: SceneNode): node is ContainerNode {
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

function createConfettiFrame(): FrameNode {
  const frame = figma.createFrame();
  frame.name = "Confetti Frame";
  frame.resize(NEW_FRAME_SIZE, NEW_FRAME_SIZE);
  const center = figma.viewport.center;
  frame.x = Math.round(center.x - NEW_FRAME_SIZE / 2);
  frame.y = Math.round(center.y - NEW_FRAME_SIZE / 2);
  return frame;
}

function addConfetti(
  target: ContainerNode,
  data: GenerateData,
  shapes: ShapeSpec[],
  colors: RGB[]
) {
  const { width, height } = target;
  const longSide = Math.max(width, height) * data.sizeFactor;
  const shortSide = Math.min(width, height) * data.sizeFactor;
  const countPerShape = Math.ceil(data.sliderInput / shapes.length);

  // Children of a group are positioned in the group's parent's coordinates,
  // so offset by the group's position. Frames and sections have their own.
  const origin =
    target.type === "GROUP" ? { x: target.x, y: target.y } : { x: 0, y: 0 };

  // In auto layout frames, children must opt out of the layout flow,
  // otherwise Figma stacks them and ignores x/y.
  const usesAutoLayout =
    "layoutMode" in target && target.layoutMode !== "NONE";

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

      target.appendChild(node);
      if (usesAutoLayout) {
        node.layoutPositioning = "ABSOLUTE";
      }
      node.x = origin.x + randInt(0, width);
      node.y = origin.y + randInt(0, height);
    }
  }
}

/** Random integer in [min, max], inclusive. */
function randInt(min: number, max: number): number {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/** Random float in [min, max). */
function randFloat(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function square(side: number): [number, number] {
  return [side, side];
}

/** Rounds to one decimal place and keeps the size Figma's resize() accepts. */
function clampSize(value: number): number {
  return Math.max(0.1, Math.round(value * 10) / 10);
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Converts "#RRGGBB" to Figma's 0–1 RGB, or null if the string is invalid. */
function hexToRgb(hex: string): RGB | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? {
        r: parseInt(match[1], 16) / 255,
        g: parseInt(match[2], 16) / 255,
        b: parseInt(match[3], 16) / 255,
      }
    : null;
}
