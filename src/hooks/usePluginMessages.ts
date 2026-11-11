import { useEffect, useRef } from "react";
import type { PluginToUiMessage, UiToPluginMessage } from "../types";

/** Sends a typed message from the UI iframe to the plugin code. */
export function postToPlugin(message: UiToPluginMessage) {
  parent.postMessage({ pluginMessage: message }, "*");
}

/** Calls `handler` for every message the plugin code sends to the UI. */
export function usePluginMessage(
  handler: (message: PluginToUiMessage) => void,
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const message = event.data?.pluginMessage;
      if (message && typeof message.type === "string") {
        handlerRef.current(message as PluginToUiMessage);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
}
