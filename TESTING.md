# yjsprompt — Testing Guide

This guide walks through loading, configuring, and verifying the yjsprompt
Chrome extension end-to-end.

---

## 1. Load the extension as unpacked

1. Open Chrome and navigate to `chrome://extensions`.
2. Toggle **Developer mode** on (top-right).
3. Click **Load unpacked**.
4. Select the `yjsprompt/` folder (the directory that contains
   `manifest.json`).
5. Confirm the extension card shows **yjsprompt 1.0.0** with no red error
   banner. The toolbar should now show a small dark icon with a pink bolt.

If the card shows an error:

- Re-check that you selected the folder containing `manifest.json` (not its
  parent and not a sub-folder).
- Click **Errors** on the card to see the message, then re-load with the
  circular reload arrow after fixing.

> Pin the extension via the puzzle-piece menu in the Chrome toolbar so the
> icon is always visible.

---

## 2. Get an OpenAI API key

1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) and
   sign in (create an account if you do not have one).
2. Click **Create new secret key**, give it a name like `yjsprompt dev`, and
   copy the value. It usually begins with `sk-...`.
3. Make sure the project has billing or trial credit attached, otherwise
   requests can return `401` or `403`.

> Treat the key as a password. It is stored only on this device via
> `chrome.storage.local` and is sent only to `api.openai.com`.

---

## 3. Step-by-step test of the full generate flow

1. Click the yjsprompt toolbar icon to open the side panel.
2. Click the gear icon (top right of the panel) to open Settings.
3. Paste your `sk-...` key into the field and click **Save**. You should
   see a green "Saved!" confirmation appear and disappear.
4. Click the gear icon again to close Settings.
5. Pick a mode from the dropdown — start with **Coding**.
6. In the textarea, type:
   `help me fix a bug in my python code that crashes when the file is empty`.
7. Watch the character counter update live (e.g. `74 / 1000`).
8. Click **Generate Prompt**. The button should switch to `Generating...`
   and disable itself.
9. Within a few seconds the output box should populate with a polished,
   structured prompt that:
   - opens with a role assignment such as "Act as a senior Python engineer..."
   - restates the bug-fix goal with specifics
   - asks for runnable code with error handling
   - specifies output format
10. Click **📋 Copy**. The button should flash `✓ Copied!` for two seconds.
11. Paste into any text field to confirm the copy worked.

### Edge cases to verify

- Empty input → click **Generate Prompt** → input shakes and shows
  `"Please write something first."`
- No API key configured → click **Generate Prompt** → Settings panel slides
  open with `"Add your OpenAI API key to get started."`.
- Type past 900 characters → counter turns red.
- Switch to **Brainstorming** mode and re-generate — the prompt structure
  should change to ask for a numbered list of ideas.
- Click **Copy** while output is empty → button shows `Nothing to copy yet`.

---

## 4. Verify storage is working

1. Open `chrome://extensions`, click **Service worker** under the yjsprompt
   card to open DevTools for the background.
2. In the DevTools **Console** tab, run:

   ```js
   chrome.storage.local.get(null, (items) => console.log(items));
   ```

3. You should see something like:

   ```js
   {
     yjsprompt_api_key: "sk-...",
     yjsprompt_mode: "coding"
   }
   ```

4. Reload the side panel — the saved mode should still be selected and the
   key field should still be populated (masked as dots).
5. To clear stored data during testing:

   ```js
   chrome.storage.local.clear();
   ```

---

## 5. Cross-site smoke test

The side panel runs in extension context, so it should work everywhere.
Confirm by opening it on:

- `https://chat.openai.com`
- `https://claude.ai`
- `https://gemini.google.com`
- `https://www.perplexity.ai`

For each: open the side panel, generate a prompt, paste it into the host
site's input. The generated prompt should be ready to send as-is.

---

## 6. Common errors and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| `Invalid API key. Double-check the key in Settings.` (HTTP 401) | Wrong key, deleted key, or wrong project | Re-copy from platform.openai.com and click Save again. |
| `Rate limit reached.` (HTTP 429) | Too many requests in a short window | Wait 30–60 seconds and try again. |
| `Network error reaching the OpenAI API.` | Offline or corporate firewall blocking `api.openai.com` | Check connection / VPN. Try another network. |
| Side panel does not open when icon is clicked | Side panel API not registered | Reload the extension on `chrome://extensions` and try again. |
| `OpenAI's servers had a problem.` (HTTP 5xx) | OpenAI-side outage | Check [https://status.openai.com](https://status.openai.com) and retry. |
| Output is blank but no error shown | API returned only non-text blocks | Reduce input length and retry; if persistent, file an issue. |
| CORS error in the panel DevTools console | Extension host permission missing or stale extension load | Confirm `manifest.json` includes `https://api.openai.com/*`, then reload the extension. |
| Copy button does nothing | Clipboard permission blocked by site | The fallback `execCommand` path should still work; otherwise select the output text manually and copy. |

---

## 7. Debugging tips

- **Side panel console**: right-click inside the panel → **Inspect**. The
  panel's own DevTools opens with logs from `panel.js`.
- **Background console**: from `chrome://extensions`, click
  **Service worker** under the yjsprompt card.
- **Force a clean state**: `chrome.storage.local.clear()` in the background
  service worker console, then reload the panel.
- **Quick reload after edits**: on `chrome://extensions` click the circular
  reload arrow on the yjsprompt card after editing any file.
