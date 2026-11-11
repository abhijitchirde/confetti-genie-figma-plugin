import * as React from "react";
import { useThemePreference } from "../hooks/useThemePreference";
import type { ThemePreference } from "../types";

const ICON: Record<ThemePreference, string> = {
  auto: "🌗",
  light: "☀️",
  dark: "🌙",
};
const LABEL: Record<ThemePreference, string> = {
  auto: "Auto (follows Figma)",
  light: "Light",
  dark: "Dark",
};
const NEXT: Record<ThemePreference, ThemePreference> = {
  auto: "light",
  light: "dark",
  dark: "auto",
};

export default function ThemeToggle() {
  const { preference, cycle } = useThemePreference();
  const title = `Theme: ${LABEL[preference]}. Click for ${LABEL[NEXT[preference]]}`;

  return (
    <button
      type="button"
      onClick={cycle}
      className="theme-toggle"
      title={title}
      aria-label={title}
    >
      {ICON[preference]}
    </button>
  );
}
