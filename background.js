// yjsprompt background service worker
// Handles side panel registration and toolbar action behavior.

const setOpenOnActionClick = async () => {
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } catch (err) {
    console.error("[yjsprompt] Failed to set side panel behavior:", err);
  }
};

chrome.runtime.onInstalled.addListener(async () => {
  await setOpenOnActionClick();
});

chrome.runtime.onStartup.addListener(async () => {
  await setOpenOnActionClick();
});
