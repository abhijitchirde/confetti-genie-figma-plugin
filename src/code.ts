import type { PluginToUiMessage, UiToPluginMessage } from "./types";
import { describeOutcome, generate, regenerate } from "./plugin/generate";
import { handleParameterInput, runWithParameters } from "./plugin/quickActions";
import { loadStored, SETTINGS_KEY, store, THEME_KEY } from "./plugin/storage";
import { isThemePreference, parseSavedSettings } from "./settings";

// Quick Actions: suggestions while the user types parameters
figma.parameters.on("input", handleParameterInput);

// Every launch: from the plugins menu (no parameters), from Quick Actions
// with parameters, or from the "Regenerate confetti" button on a layer
figma.on("run", async ({ command, parameters }: RunEvent) => {
  try {
    if (command === "regenerate") {
      figma.closePlugin(regenerate());
    } else if (parameters) {
      figma.closePlugin(await runWithParameters(parameters));
    } else {
      openUI();
    }
  } catch (error) {
    figma.closePlugin(errorMessage(error));
  }
});

function openUI() {
  figma.showUI(__html__, { width: 270, height: 540, themeColors: true });
  figma.ui.onmessage = handleUiMessage;
}

async function handleUiMessage(msg: UiToPluginMessage) {
  switch (msg.type) {
    case "generate":
      try {
        const outcome = generate(msg.data);
        figma.notify(describeOutcome(outcome), {
          timeout: outcome.ok ? 2000 : 1200,
        });
      } catch (error) {
        figma.notify(errorMessage(error), { error: true });
      }
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
}

function post(message: PluginToUiMessage) {
  figma.ui.postMessage(message);
}

function errorMessage(error: unknown): string {
  console.error(error);
  const reason = error instanceof Error ? error.message : String(error);
  return `Couldn't add confetti: ${reason}`;
}
