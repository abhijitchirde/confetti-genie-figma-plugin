// Running Confetti Genie from Quick Actions with parameters (press Tab after
// the plugin name), without opening the plugin window.

import {
  DEFAULT_SETTINGS,
  DENSITY_LEVELS,
  densityForLevel,
  isDensityLevel,
  isSize,
  parseSavedSettings,
  SIZES,
  toGenerateData,
} from "../settings";
import { describeOutcome, generate } from "./generate";
import { loadStored, SETTINGS_KEY } from "./storage";

type Suggestion = { name: string; data: string };

const DENSITY_SUGGESTIONS: Suggestion[] = DENSITY_LEVELS.map(({ level }) => ({
  name: capitalize(level),
  data: level,
}));

const SIZE_SUGGESTIONS: Suggestion[] = SIZES.map((size) => ({
  name: capitalize(size),
  data: size,
}));

/** Fills in the suggestion list as the user types each parameter. */
export async function handleParameterInput({
  key,
  query,
  result,
}: ParameterInputEvent) {
  const suggestions =
    key === "density"
      ? DENSITY_SUGGESTIONS
      : key === "size"
        ? SIZE_SUGGESTIONS
        : key === "colors"
          ? await colorSuggestions()
          : [];
  const q = query.trim().toLowerCase();
  result.setSuggestions(
    suggestions.filter((s) => s.name.toLowerCase().startsWith(q)),
  );
}

async function colorSuggestions(): Promise<Suggestion[]> {
  const saved = parseSavedSettings(await loadStored(SETTINGS_KEY));
  const count = saved?.colors.length ?? 0;
  const suggestions = [{ name: "Random colors", data: "random" }];
  if (count > 0) {
    suggestions.push({ name: `My colors (${count})`, data: "mine" });
  }
  return suggestions;
}

/**
 * Generates confetti from Quick Actions parameters. Anything not given
 * (size, shapes) comes from the settings last used in the plugin window;
 * colors default to random. Returns the message to show.
 */
export async function runWithParameters(
  parameters: ParameterValues,
): Promise<string> {
  const saved =
    parseSavedSettings(await loadStored(SETTINGS_KEY)) ?? DEFAULT_SETTINGS;

  const density = isDensityLevel(parameters.density)
    ? densityForLevel(parameters.density)
    : saved.density;
  const size = isSize(parameters.size) ? parameters.size : saved.size;

  const useMyColors = parameters.colors === "mine";
  if (useMyColors && saved.colors.length === 0) {
    return "No saved colors yet. Add some in the plugin window first";
  }

  const data = toGenerateData(
    { density, size, shapes: saved.shapes },
    useMyColors ? saved.colors : undefined,
  );
  return describeOutcome(generate(data));
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
