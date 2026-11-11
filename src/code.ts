import type { UiToPluginMessage } from "./types";
import { describeOutcome, generate } from "./plugin/generate";

figma.showUI(__html__, { width: 270, height: 540, themeColors: true });

figma.ui.onmessage = (msg: UiToPluginMessage) => {
  if (msg.type === "generate") {
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
};
