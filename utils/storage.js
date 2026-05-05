// yjsprompt storage helpers

const KEY_MODE = "yjsprompt_mode";
const LEGACY_KEY_MODE = "promptlift_mode";
const DEFAULT_MODE = "general";

const getLocal = (keys) =>
  new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (items) => {
      const err = chrome.runtime.lastError;
      if (err) {
        reject(new Error(err.message));
        return;
      }
      resolve(items);
    });
  });

const setLocal = (items) =>
  new Promise((resolve, reject) => {
    chrome.storage.local.set(items, () => {
      const err = chrome.runtime.lastError;
      if (err) {
        reject(new Error(err.message));
        return;
      }
      resolve();
    });
  });

export async function saveMode(mode) {
  if (typeof mode !== "string" || mode.length === 0) {
    throw new Error("Mode must be a non-empty string");
  }
  await setLocal({ [KEY_MODE]: mode });
}

export async function getMode() {
  const items = await getLocal([KEY_MODE, LEGACY_KEY_MODE]);
  const value = items[KEY_MODE] || items[LEGACY_KEY_MODE];
  if (!items[KEY_MODE] && typeof value === "string" && value.length > 0) {
    await saveMode(value);
  }
  return typeof value === "string" && value.length > 0 ? value : DEFAULT_MODE;
}
