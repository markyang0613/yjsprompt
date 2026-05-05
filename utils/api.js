// yjsprompt API client — calls the proxy server, never OpenAI directly

import { getSystemPrompt } from "./prompts.js";

const ENDPOINT = "https://yjsprompt-api.vercel.app/api/generate";

const friendlyErrorForStatus = (status, fallback) => {
  switch (status) {
    case 400:
      return "Bad request — the input could not be processed. Try shortening or rephrasing it.";
    case 403:
      return "Access denied by the server.";
    case 404:
      return "The API endpoint could not be found. The extension may need an update.";
    case 413:
      return "Input is too long. Trim it down and try again.";
    case 429:
      return "Rate limit reached. Wait a moment and try again.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "The server had a problem. Please try again in a minute.";
    default:
      return fallback || `Request failed (HTTP ${status}).`;
  }
};

const extractApiErrorMessage = (payload) => {
  if (!payload) return null;
  if (typeof payload === "string") return payload;
  if (payload.error) {
    if (typeof payload.error === "string") return payload.error;
    if (typeof payload.error.message === "string") return payload.error.message;
  }
  if (typeof payload.message === "string") return payload.message;
  return null;
};

export async function generateOptimizedPrompt(rawInput, mode) {
  if (typeof rawInput !== "string" || rawInput.trim().length === 0) {
    throw new Error("Please write something first.");
  }

  const systemPrompt = getSystemPrompt(mode);

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        input: rawInput,
        systemPrompt,
      }),
    });
  } catch {
    throw new Error(
      "Network error reaching the server. Check your internet connection and try again."
    );
  }

  let payload = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  } else {
    try {
      const text = await response.text();
      payload = text || null;
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const apiMessage = extractApiErrorMessage(payload);
    const friendly = friendlyErrorForStatus(response.status, apiMessage);
    const finalMessage =
      apiMessage && response.status >= 500 ? friendly : apiMessage || friendly;
    throw new Error(finalMessage);
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Unexpected response from server.");
  }

  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const outputItems = Array.isArray(payload.output) ? payload.output : [];
  const textParts = outputItems
    .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
    .filter((part) => part && typeof part.text === "string")
    .map((part) => part.text.trim())
    .filter(Boolean);

  if (textParts.length === 0) {
    throw new Error("Server returned no text content.");
  }

  return textParts.join("\n\n").trim();
}
