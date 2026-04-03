// utils/claudeApi.js
// Uses the Anthropic Messages API to clean and normalise an item name
// extracted from a URL.  Requires VITE_ANTHROPIC_API_KEY in .env
//
// FUTURE UPGRADE: Move this call server-side (backend/utils/aiNormalizer.js)
// so the API key is never exposed in the browser bundle.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

/**
 * Ask Claude to return a clean 2-5 word product/food name from a messy URL.
 * Falls back to `rawName` silently if the API call fails for any reason.
 *
 * @param {string} rawName   Rough name extracted from the URL path
 * @param {string} url       Original URL for extra context
 * @returns {Promise<string>}
 */
export async function normalizeItemName(rawName, url) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  // Graceful fallback when no key is configured
  if (!apiKey || apiKey.startsWith("sk-ant-xxx")) {
    return toTitleCase(rawName);
  }

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 60,
        messages: [{
          role:    "user",
          content: `Extract a clean, short product or food name (2-5 words maximum) from the URL below.
Return ONLY the name — no punctuation, no explanation, no quotes.

URL:      ${url}
Raw hint: ${rawName}`,
        }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text?.trim().replace(/^["']|["']$/g, "");
    return text && text.length > 1 && text.length < 80 ? text : toTitleCase(rawName);
  } catch {
    // Network error, rate limit, invalid key, etc. — keep the app working.
    return toTitleCase(rawName);
  }
}

function toTitleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}
