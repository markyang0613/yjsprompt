// yjsprompt side panel logic

import { generateOptimizedPrompt } from "../utils/api.js";
import { saveMode, getMode } from "../utils/storage.js";

const MAX_INPUT = 1000;
const WARN_THRESHOLD = 900;

const els = {
  modeSelect: document.getElementById("modeSelect"),
  rawInput: document.getElementById("rawInput"),
  charCount: document.getElementById("charCount"),
  inputError: document.getElementById("inputError"),
  outputError: document.getElementById("outputError"),
  generateButton: document.getElementById("generateButton"),
  output: document.getElementById("output"),
  copyButton: document.getElementById("copyButton"),
  copyButtonLabel: document.getElementById("copyButtonLabel"),
};

let isGenerating = false;
let copyResetTimer = null;

// ---------- Init ------------------------------------------------------- */

(async function init() {
  try {
    const savedMode = await getMode();
    if (savedMode && [...els.modeSelect.options].some((o) => o.value === savedMode)) {
      els.modeSelect.value = savedMode;
    }
    updateCharCount();
  } catch {
    // non-critical
  }

  bindEvents();
})();

function bindEvents() {
  els.modeSelect.addEventListener("change", handleModeChange);
  els.rawInput.addEventListener("input", () => {
    clearInputError();
    updateCharCount();
  });
  els.generateButton.addEventListener("click", handleGenerate);
  els.copyButton.addEventListener("click", handleCopy);
}

// ---------- Mode ------------------------------------------------------- */

async function handleModeChange() {
  try {
    await saveMode(els.modeSelect.value);
  } catch {
    // non-critical
  }
}

// ---------- Input UX --------------------------------------------------- */

function updateCharCount() {
  const len = els.rawInput.value.length;
  els.charCount.textContent = `${len} / ${MAX_INPUT}`;
  els.charCount.classList.toggle("is-warning", len >= WARN_THRESHOLD);
}

function clearInputError() {
  els.inputError.textContent = "";
  els.rawInput.classList.remove("shake");
}

function setInputError(msg) {
  els.inputError.textContent = msg;
  els.rawInput.classList.remove("shake");
  void els.rawInput.offsetWidth;
  els.rawInput.classList.add("shake");
}

function clearOutputError() {
  els.outputError.textContent = "";
}

function setOutputError(msg) {
  els.outputError.textContent = msg;
}

// ---------- Generate flow --------------------------------------------- */

async function handleGenerate() {
  if (isGenerating) return;

  clearInputError();
  clearOutputError();

  const raw = els.rawInput.value.trim();
  if (!raw) {
    setInputError("Please write something first.");
    els.rawInput.focus();
    return;
  }

  setLoading(true);

  try {
    const optimized = await generateOptimizedPrompt(raw, els.modeSelect.value);
    els.output.value = optimized;
    els.copyButton.disabled = false;
    resetCopyButton();
    requestAnimationFrame(() => {
      els.output.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  } catch (err) {
    const message =
      err && typeof err.message === "string"
        ? err.message
        : "Something went wrong. Please try again.";
    setOutputError(message);
  } finally {
    setLoading(false);
  }
}

function setLoading(loading) {
  isGenerating = loading;
  els.generateButton.disabled = loading;
  els.generateButton.classList.toggle("is-loading", loading);
  els.generateButton.textContent = loading ? "Generating..." : "Generate Prompt";
}

// ---------- Copy ------------------------------------------------------- */

async function handleCopy() {
  const value = els.output.value;
  if (!value) {
    flashCopyButton("Nothing to copy yet");
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    flashCopyButton("✓ Copied!", true);
  } catch {
    try {
      els.output.removeAttribute("readonly");
      els.output.select();
      const ok = document.execCommand("copy");
      els.output.setAttribute("readonly", "");
      window.getSelection()?.removeAllRanges();
      flashCopyButton(ok ? "✓ Copied!" : "Copy failed", ok);
    } catch {
      flashCopyButton("Copy failed");
    }
  }
}

function flashCopyButton(label, success = false) {
  if (copyResetTimer) clearTimeout(copyResetTimer);
  els.copyButtonLabel.textContent = label;
  els.copyButton.classList.toggle("is-success", success);
  copyResetTimer = setTimeout(resetCopyButton, 2000);
}

function resetCopyButton() {
  if (copyResetTimer) {
    clearTimeout(copyResetTimer);
    copyResetTimer = null;
  }
  els.copyButtonLabel.textContent = "📋 Copy";
  els.copyButton.classList.remove("is-success");
}
