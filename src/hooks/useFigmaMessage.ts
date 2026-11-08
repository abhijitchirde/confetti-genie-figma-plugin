import type { UiToPluginMessage } from "../types";

/** Sends a typed message from the UI iframe to the plugin code. */
export function postToPlugin(message: UiToPluginMessage) {
  parent.postMessage({ pluginMessage: message }, "*");
}

export function useFigmaMessage() {
  return { sendMessage: postToPlugin };
}
