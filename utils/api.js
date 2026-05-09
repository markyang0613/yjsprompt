// yjsprompt API client — calls the proxy server

import { getSystemPrompt } from "./prompts.js";

const ENDPOINT = "https://yjsprompt-api.vercel.app/api/generate";

const friendlyErrorForStatus = (status) => {
  switch (status) {
    case 400: return "Bad request — try shortening or rephrasing your input.";
    case 403: return "Access denied by the server.";
    case 404: return "API endpoint not found. The extension may need an update.";
    case 413: return "Input is too long. Trim it down and try again.";
    case 429: return "Rate limit reached. Wait a moment and try again.";
    case 500:
    case 502:
    case 503:
    case 504: return "The server had a problem. Please try again in a minute.";
    default:  return `Request failed (HTTP ${status}).`;
  }
};

function getLanguageHint(rawInput) {
  const hangulCount = (rawInput.match(/[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/g) || []).length;
  const kanaCount = (rawInput.match(/[\u3040-\u30ff]/g) || []).length;
  const hanCount = (rawInput.match(/[\u3400-\u9fff]/g) || []).length;

  if (hangulCount > 0 && hangulCount >= kanaCount && hangulCount >= hanCount) {
    return "Korean. Use natural Korean written primarily in Hangul. Do not use Chinese characters/Hanja or Japanese characters unless they appear in the user's request.";
  }

  if (kanaCount > 0 && kanaCount >= hangulCount && kanaCount >= hanCount) {
    return "Japanese. Use natural Japanese. Do not use Korean Hangul or unrelated Chinese-only wording unless it appears in the user's request.";
  }

  if (hanCount > 0) {
    return "Chinese. Use natural Chinese. Do not use Korean Hangul or Japanese kana unless they appear in the user's request.";
  }

  return "Infer from the request. Use the same primary language as the user's request.";
}

function buildLanguageAwareInput(rawInput) {
  const languageHint = getLanguageHint(rawInput);

  return `
Rewrite the following request into an optimized prompt.

Language requirement:
- Detected/requested language: ${languageHint}
- Detect the primary language of the request.
- Return the optimized prompt in that same language.
- Translate all generic prompt-engineering text, including role, instructions,
  headings, constraints, and output-format labels, into that language.
- Use English only when the request is primarily English, explicitly asks for
  English, or contains technical terms that should naturally remain in English.
- Do not use unrelated languages or scripts.

Request:
${rawInput}
`.trim();
}

export async function generateOptimizedPrompt(rawInput, mode) {
  if (typeof rawInput !== "string" || rawInput.trim().length === 0) {
    throw new Error("Please write something first.");
  }

  const systemPrompt = getSystemPrompt(mode);
  const input = buildLanguageAwareInput(rawInput.trim());

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input, systemPrompt }),
    });
  } catch {
    throw new Error(
      "Network error reaching the server. Check your internet connection and try again."
    );
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Unexpected response from server.");
  }

  if (!response.ok) {
    const message =
      (payload && typeof payload.error === "string" && payload.error) ||
      friendlyErrorForStatus(response.status);
    throw new Error(message);
  }

  if (!payload || typeof payload.text !== "string" || !payload.text.trim()) {
    throw new Error("Server returned no text content.");
  }

  return payload.text.trim();
}
