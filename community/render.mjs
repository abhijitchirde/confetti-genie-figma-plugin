// Renders the community assets (icons, overview sheet, cover) to PNG with headless Edge/Chrome.
//
//   npm run build                       # the cover embeds the real plugin UI from dist/
//   npm run community                   # icons, cover and slides (with icon option 4, the chosen one)
//   npm run community -- --icon 3       # cover and slides with another icon option
//   npm run community -- --icons-only   # just the icons and the overview sheet
//
// Set EDGE_PATH (or CHROME_PATH) if your browser isn't found automatically.
// Fonts load from Google Fonts, so this needs an internet connection.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, "src");
const out = path.join(here, "exports");
const iconArg = process.argv.indexOf("--icon");
const icon = iconArg !== -1 ? Number(process.argv[iconArg + 1]) : 4;
const iconsOnly = process.argv.includes("--icons-only");

const candidates = [
  process.env.EDGE_PATH,
  process.env.CHROME_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const browser = candidates.find((p) => fs.existsSync(p));
if (!browser) {
  console.error("No Edge/Chrome found. Set EDGE_PATH or CHROME_PATH.");
  process.exit(1);
}
if (!iconsOnly && !fs.existsSync(path.join(here, "..", "dist", "ui.html"))) {
  console.error(
    "dist/ui.html is missing. Run `npm run build` at the repo root first.",
  );
  process.exit(1);
}

const profile = fs.mkdtempSync(
  path.join(os.tmpdir(), "confetti-genie-render-"),
);

function shot(page, query, width, height, file) {
  const url =
    pathToFileURL(path.join(src, page)).href + "?" + new URLSearchParams(query);
  const target = path.join(out, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  execFileSync(
    browser,
    [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--allow-file-access-from-files",
      `--user-data-dir=${profile}`,
      `--window-size=${width},${height}`,
      "--virtual-time-budget=15000",
      `--screenshot=${target}`,
      url,
    ],
    { stdio: "ignore" },
  );
  console.log("✓", path.relative(here, target));
}

const icons = {
  1: "burst",
  2: "genie-lamp",
  3: "selected-frame",
  4: "shape-set",
};
for (const [id, name] of Object.entries(icons)) {
  shot(
    "icon.html",
    { option: id, size: 128 },
    128,
    128,
    `icons/icon-${id}-${name}-128.png`,
  );
  shot(
    "icon.html",
    { option: id, size: 512 },
    512,
    512,
    `icons/icon-${id}-${name}-512.png`,
  );
}
shot("icons.html", {}, 1920, 1080, "icons/icon-options-overview.png");

if (!iconsOnly) {
  shot("cover.html", { icon }, 1920, 960, "cover-1920x960.png");
  for (const n of [1, 2, 3, 4]) {
    shot(
      "slides.html",
      { slide: n, icon },
      1920,
      1080,
      `slide-${n}-1920x1080.png`,
    );
  }
}

fs.rmSync(profile, { recursive: true, force: true });
console.log(
  iconsOnly
    ? "Done (icons only)."
    : `Done (cover and slides use icon option ${icon}).`,
);
