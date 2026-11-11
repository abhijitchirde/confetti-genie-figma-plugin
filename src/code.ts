import type { UiToPluginMessage } from "./types";
import { describeOutcome, generate } from "./plugin/generate";

figma.showUI(__html__, { width: 270, height: 540, themeColors: true });

figma.ui.onmessage = (msg: UiToPluginMessage) => {
  if (msg.type === "generate") {
    try {
      const outcome = generate(msg.data);
      const message = describeOutcome(outcome);
      if (message) {
        figma.notify(message, outcome.ok ? undefined : { timeout: 1200 });
      }
    } catch (error) {
      console.error(error);
      const reason = error instanceof Error ? error.message : String(error);
      figma.notify(`Couldn't add confetti: ${reason}`, { error: true });
    }
  }
};
