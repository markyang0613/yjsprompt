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

export async function generateOptimizedPrompt(rawInput, mode) {
  if (typeof rawInput !== "string" || rawInput.trim().length === 0) {
    throw new Error("Please write something first.");
  }

  const systemPrompt = getSystemPrompt(mode);

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input: rawInput, systemPrompt }),
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
