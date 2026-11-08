import * as React from "react";
import { useFigmaTheme } from "../hooks/useFigmaTheme";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useFigmaTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
