// figma.clientStorage keys, saved per user on their device
export const SETTINGS_KEY = "settings";
export const THEME_KEY = "themePreference";

// Storage failures only lose remembered preferences, so they're logged but
// not shown to the user

export async function loadStored(key: string): Promise<unknown> {
  try {
    return await figma.clientStorage.getAsync(key);
  } catch (error) {
    console.warn(`Couldn't load ${key}`, error);
    return undefined;
  }
}

export async function store(key: string, value: unknown): Promise<void> {
  try {
    await figma.clientStorage.setAsync(key, value);
  } catch (error) {
    console.warn(`Couldn't save ${key}`, error);
  }
}
