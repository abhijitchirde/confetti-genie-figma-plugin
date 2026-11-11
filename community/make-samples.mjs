// Writes community/src/samples.js: confetti made by the plugin's own generate() code, used
// by the cover and slides so the images never show hand-placed shapes.
//
//   node community/make-samples.mjs
//
// Transpiles the plugin's generation code and the test fake of the Figma API (no type
// check) into a temp folder, generates confetti into frames, and saves every piece's
// type, position, size, rotation and fill. Run it again for a fresh layout.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const require = createRequire(import.meta.url);
const ts = require(path.join(root, "node_modules", "typescript"));

const ALL_SHAPES = {
  rectangles: true,
  ellipses: true,
  polygons: true,
  stars: true,
};

// Each sample: a frame size, the settings used, and whether to use the settings' colors
// (otherwise the plugin's random palette). Density values sit in the middle of the named
// bands (minimal 57, festive 112, party 166, bash 220, blast 274).
const SPECS = {
  // Cover: the plugin window beside it shows these same settings and colors
  cover: {
    width: 640,
    height: 600,
    settings: {
      density: 200,
      size: "medium",
      shapes: ALL_SHAPES,
      colors: ["#FF5F6D", "#FFC145", "#765FFE", "#03A3F5", "#4ADE80"],
    },
    useColors: true,
  },
  // Slide 1: density and size
  // (Small pieces on a 480 px frame are only a pixel or two, so the light end uses Medium)
  minimalMedium: {
    width: 480,
    height: 440,
    settings: { density: 57, size: "medium", shapes: ALL_SHAPES, colors: [] },
  },
  partyMedium: {
    width: 480,
    height: 440,
    settings: { density: 166, size: "medium", shapes: ALL_SHAPES, colors: [] },
  },
  blastLarge: {
    width: 480,
    height: 440,
    settings: { density: 274, size: "large", shapes: ALL_SHAPES, colors: [] },
  },
  // Slide 2: your colors (with a shape subset) vs the random palette
  brand: {
    width: 740,
    height: 470,
    settings: {
      density: 166,
      size: "medium",
      shapes: {
        rectangles: true,
        ellipses: false,
        polygons: false,
        stars: true,
      },
      colors: ["#1D4ED8", "#60A5FA", "#FBBF24"],
    },
    useColors: true,
  },
  random: {
    width: 740,
    height: 470,
    settings: { density: 166, size: "medium", shapes: ALL_SHAPES, colors: [] },
  },
  // Slide 3: one tidy layer
  launch: {
    width: 700,
    height: 500,
    settings: { density: 166, size: "medium", shapes: ALL_SHAPES, colors: [] },
  },
};

const FILES = [
  "src/plugin/generate.ts",
  "src/plugin/utils.ts",
  "src/settings.ts",
  "tests/fakeFigma.ts",
];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "confetti-genie-samples-"));
for (const file of FILES) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const target = path.join(tmp, file.replace(/\.ts$/, ".js"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, outputText);
}

const { installFakeFigma, makeNode, attach } = require(
  path.join(tmp, "tests/fakeFigma.js"),
);
const { generate, RANDOM_COLORS } = require(
  path.join(tmp, "src/plugin/generate.js"),
);
const { toGenerateData } = require(path.join(tmp, "src/settings.js"));

const round = (n) => Math.round(n * 10) / 10;
const toHex = ({ r, g, b }) =>
  "#" +
  [r, g, b]
    .map((v) =>
      Math.round(v * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase();

function makeSample({ width, height, settings, useColors }) {
  const state = installFakeFigma();
  const frame = attach(
    state.page,
    makeNode("FRAME", { layoutMode: "NONE", width, height }),
  );
  state.selection = [frame];
  const outcome = generate(
    toGenerateData(settings, useColors ? settings.colors : undefined),
  );
  if (!outcome.ok) throw new Error(outcome.message);

  const layer = frame.children.find((c) => c.name === "Confetti");
  const pieces = layer.children.map((p) => ({
    type: p.type,
    x: round(p.x),
    y: round(p.y),
    w: round(p.width),
    h: round(p.height),
    rotation: round(p.rotation),
    points: p.pointCount,
    color: toHex(p.fills[0].color),
    opacity: p.fills[0].opacity,
  }));
  return { width, height, settings, useColors: !!useColors, pieces };
}

const samples = Object.fromEntries(
  Object.entries(SPECS).map(([key, spec]) => [key, makeSample(spec)]),
);
samples.randomPalette = RANDOM_COLORS.map(toHex);

// One piece per line keeps the file readable and diffs small
const json = JSON.stringify(samples).split('{"type"').join('\n  {"type"');
fs.writeFileSync(
  path.join(here, "src", "samples.js"),
  "// Generated by community/make-samples.mjs from the plugin's real generate() code. Don't edit.\n" +
    "window.SAMPLES = " +
    json +
    ";\n",
);
fs.rmSync(tmp, { recursive: true, force: true });

for (const [key, sample] of Object.entries(samples)) {
  if (sample.pieces)
    console.log(
      `✓ ${key}: ${sample.pieces.length} pieces in ${sample.width}×${sample.height}`,
    );
}
