import { useEffect, useLayoutEffect, useState } from "react";

type Theme = "light" | "dark";

// With `themeColors: true` in figma.showUI, Figma puts a "figma-light" or
// "figma-dark" class on <html> and updates it live when the user switches
// themes. We read that class and expose it as data-theme for ui.css.
function readFigmaTheme(): Theme {
  return document.documentElement.classList.contains("figma-dark")
    ? "dark"
    : "light";
}

export function useFigmaTheme() {
  const [figmaTheme, setFigmaTheme] = useState<Theme>(readFigmaTheme);
  // Manual choice from the toggle; lasts until Figma's theme changes or the
  // plugin closes.
  const [override, setOverride] = useState<Theme | null>(null);
  const theme = override ?? figmaTheme;

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setFigmaTheme(readFigmaTheme());
      setOverride(null);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Layout effect so the first paint already uses the right theme
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setOverride(theme === "dark" ? "light" : "dark");

  return { theme, isDark: theme === "dark", toggleTheme };
}
