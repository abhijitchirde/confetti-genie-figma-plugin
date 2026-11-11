# Community page assets

Everything for the plugin's Figma Community page: icon options, cover, carousel slides and page text.

## What's here

| Path | What it is | Size |
|---|---|---|
| `exports/icons/icon-N-*-128.png` | Plugin icon, 4 options (upload the 128 px one) | 128×128 |
| `exports/icons/icon-N-*-512.png` | Same icons, large preview | 512×512 |
| `exports/icons/icon-options-overview.png` | All 4 options side by side, at 64/32/16 px on light and dark | 1920×1080 |
| `exports/cover-1920x960.png` | Community cover | 1920×960 |
| `exports/slide-1…4-1920x1080.png` | Carousel: density & size, colors, one tidy layer + regenerate, quick actions + light & dark | 1920×1080 |
| `description.md` | Tagline options and the full page description | — |
| `src/` | HTML/CSS sources for all images | — |
| `make-samples.mjs` | Regenerates `src/samples.js`: the confetti in the images, made by the plugin's own code | — |
| `render.mjs` | Re-renders every PNG with headless Edge/Chrome | — |

## Icon options

1. **Burst**: a shower of confetti on deep violet
2. **Genie lamp**: a golden lamp puffing confetti from its spout
3. **Selected frame**: a selected Figma frame filling up with confetti
4. **Shape set**: the plugin's four shapes (rectangle, ellipse, polygon, star) on a dark tile

Options 1, 2 and 4 stay readable at 16 px (Figma's smallest menu size). Option 3 fades there, especially on light backgrounds.

**Chosen: option 4 (Shape set).** The cover and slides use it.

## Re-rendering

```sh
npm run build                          # the cover and slides embed the real plugin UI from dist/
npm run community                      # icons, cover + slides with icon option 4
npm run community -- --icon 2          # …or with another icon option
npm run community -- --icons-only      # just the icons and the overview sheet
npm run community:samples              # new random confetti layouts, then render again
```

- Needs Edge or Chrome (set `EDGE_PATH` or `CHROME_PATH` if it isn't found) and an internet connection (fonts come from Google Fonts).
- The plugin windows on the cover and slide 4 are the **real plugin UI** (`dist/ui.html`) in an iframe, not mock-ups. The page answers the UI's `load-theme` and `load-settings` messages in Figma's place, to show it light or dark with the settings that made the confetti beside it.
- All confetti comes from `src/samples.js`, which `make-samples.mjs` creates by running the plugin's real `generate()` against the test fake of the Figma API. Regenerate it rather than placing shapes by hand, so the images always show real output.
