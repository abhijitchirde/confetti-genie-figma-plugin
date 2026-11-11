// A minimal in-memory stand-in for the parts of the Figma plugin API that
// the confetti code uses. Nodes are plain objects; only behaviour the code
// relies on (parenting, resize limits, auto layout reflows) is modelled.

export interface FakeNode {
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  parent: FakeNode | null;
  children: FakeNode[];
  layoutMode?: string;
  layoutPositioning?: string;
  constraints?: { horizontal: string; vertical: string };
  fills?: unknown[];
  clipsContent?: boolean;
  pointCount?: number;
  /** Times this auto layout frame had to reflow because a child was added */
  reflows: number;
  resize(width: number, height: number): void;
  appendChild?(child: FakeNode): void;
  setPluginData(key: string, value: string): void;
  getPluginData(key: string): string;
}

const CONTAINER_TYPES = [
  "FRAME",
  "GROUP",
  "SECTION",
  "COMPONENT",
  "COMPONENT_SET",
  "INSTANCE",
  "BOOLEAN_OPERATION",
];

export function makeNode(
  type: string,
  props: Partial<FakeNode> = {},
): FakeNode {
  const pluginData: Record<string, string> = {};
  const node: FakeNode = {
    type,
    name: type,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0,
    parent: null,
    children: [],
    reflows: 0,
    resize(width, height) {
      if (width < 0.01 || height < 0.01) {
        throw new Error(`Invalid size ${width}x${height}`);
      }
      this.width = width;
      this.height = height;
    },
    setPluginData(key, value) {
      pluginData[key] = value;
    },
    getPluginData(key) {
      return pluginData[key] ?? "";
    },
    ...props,
  };
  if (CONTAINER_TYPES.includes(type)) {
    node.appendChild = function (child) {
      if (this.type === "INSTANCE") {
        throw new Error("Cannot move node. New parent is an instance");
      }
      if (child.parent) {
        const siblings = child.parent.children;
        siblings.splice(siblings.indexOf(child), 1);
      }
      child.parent = this;
      this.children.push(child);
      if (this.layoutMode && this.layoutMode !== "NONE") this.reflows++;
    };
  }
  return node;
}

/** Adds `child` to `parent` without going through any checks. */
export function attach(parent: FakeNode, child: FakeNode): FakeNode {
  child.parent = parent;
  parent.children.push(child);
  return child;
}

export function createFakeFigma() {
  const page = makeNode("PAGE");
  page.appendChild = function (child) {
    child.parent = this;
    this.children.push(child);
  };
  const state = {
    page,
    selection: [] as FakeNode[],
    scrolledTo: [] as FakeNode[][],
  };

  const create =
    (type: string, props: Partial<FakeNode> = {}) =>
    () => {
      const node = makeNode(type, props);
      return node;
    };

  const figma = {
    currentPage: {
      get selection() {
        return state.selection;
      },
      set selection(nodes: FakeNode[]) {
        state.selection = nodes;
      },
    },
    viewport: {
      center: { x: 1000, y: 2000 },
      scrollAndZoomIntoView(nodes: FakeNode[]) {
        state.scrolledTo.push(nodes);
      },
    },
    createFrame() {
      // Figma adds new frames to the current page; they start white and
      // clip their content
      const frame = makeNode("FRAME", {
        layoutMode: "NONE",
        fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }],
        clipsContent: true,
      });
      page.appendChild!(frame);
      return frame;
    },
    createRectangle: create("RECTANGLE"),
    createEllipse: create("ELLIPSE"),
    createPolygon: create("POLYGON"),
    createStar: create("STAR"),
  };

  return { figma, state };
}

/** Installs a fresh fake as the global `figma` and returns its state. */
export function installFakeFigma() {
  const fake = createFakeFigma();
  (globalThis as unknown as { figma: unknown }).figma = fake.figma;
  return fake.state;
}

/** Casts fake nodes for passing into code typed against the real API. */
export function asScene(node: FakeNode): SceneNode {
  return node as unknown as SceneNode;
}
