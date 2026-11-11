import type { PluginToUiMessage, UiToPluginMessage } from "./types";
import { describeOutcome, generate } from "./plugin/generate";
import { isThemePreference, parseSavedSettings } from "./settings";

// figma.clientStorage keys, saved per user on their device
const SETTINGS_KEY = "settings";
const THEME_KEY = "themePreference";

figma.showUI(__html__, { width: 270, height: 540, themeColors: true });

figma.ui.onmessage = async (msg: UiToPluginMessage) => {
  switch (msg.type) {
    case "generate":
      runGenerate(msg);
      break;

    case "load-settings": {
      const saved = await loadStored(SETTINGS_KEY);
      post({ type: "settings", settings: parseSavedSettings(saved) });
      break;
    }

    case "save-settings": {
      const settings = parseSavedSettings(msg.settings);
      if (settings) await store(SETTINGS_KEY, settings);
      break;
    }

    case "load-theme": {
      const saved = await loadStored(THEME_KEY);
      post({ type: "theme", theme: isThemePreference(saved) ? saved : "auto" });
      break;
    }

    case "save-theme":
      if (isThemePreference(msg.theme)) await store(THEME_KEY, msg.theme);
      break;
  }
};

function runGenerate(msg: Extract<UiToPluginMessage, { type: "generate" }>) {
  try {
    const outcome = generate(msg.data);
    figma.notify(describeOutcome(outcome), {
      timeout: outcome.ok ? 2000 : 1200,
    });
  } catch (error) {
    console.error(error);
    const reason = error instanceof Error ? error.message : String(error);
    figma.notify(`Couldn't add confetti: ${reason}`, { error: true });
  }
}

function post(message: PluginToUiMessage) {
  figma.ui.postMessage(message);
}

// Storage failures only lose remembered preferences, so they're not shown
// to the user
async function loadStored(key: string): Promise<unknown> {
  try {
    return await figma.clientStorage.getAsync(key);
  } catch (error) {
    console.warn(`Couldn't load ${key}`, error);
    return undefined;
  }
}

async function store(key: string, value: unknown): Promise<void> {
  try {
    await figma.clientStorage.setAsync(key, value);
  } catch (error) {
    console.warn(`Couldn't save ${key}`, error);
  }
}
