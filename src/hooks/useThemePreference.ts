import { useEffect, useLayoutEffect, useState } from "react";
import type { ThemePreference } from "../types";
import { postToPlugin, usePluginMessage } from "./usePluginMessages";

const ORDER: ThemePreference[] = ["auto", "light", "dark"];

// With `themeColors: true` in figma.showUI, Figma puts a "figma-light" or
// "figma-dark" class on <html> and updates it live when the user switches
// themes.
function readFigmaTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("figma-dark")
    ? "dark"
    : "light";
}

/**
 * Theme for the plugin UI. "auto" follows Figma; "light" and "dark"
 * override it. The choice is saved per user via figma.clientStorage, since
 * localStorage isn't reliable inside Figma plugins.
 */
export function useThemePreference() {
  const [preference, setPreference] = useState<ThemePreference>("auto");
  const [figmaTheme, setFigmaTheme] = useState(readFigmaTheme);

  usePluginMessage((message) => {
    if (message.type === "theme") setPreference(message.theme);
  });

  useEffect(() => {
    postToPlugin({ type: "load-theme" });

    const observer = new MutationObserver(() =>
      setFigmaTheme(readFigmaTheme()),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const theme = preference === "auto" ? figmaTheme : preference;

  // Layout effect so the first paint already uses the right theme
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length];
    setPreference(next);
    postToPlugin({ type: "save-theme", theme: next });
  };

  return { preference, cycle };
}
