// utils/api.js
// All communication with the Express backend lives here.
// The Vite proxy forwards /api/* → http://localhost:3001/api/*
// so no hardcoded base URL is needed in dev.

const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || `Request failed (${res.status})`);
  }

  return json.data;
}

/**
 * Step 1 — Extract item info from a URL.
 * @param {string} url
 * @returns {{ rawName: string, type: string, basePrice: number }}
 */
export async function extractItem(url) {
  return request("/extract", { url });
}

/**
 * Step 3 — Compare prices across platforms.
 * @param {string} itemName  (AI-cleaned name from step 2)
 * @param {string} type      "food" | "ride" | "product"
 * @param {number} basePrice
 * @returns {{ platforms: Array, cheapestId: string, maxSavings: number }}
 */
export async function comparePrices(itemName, type, basePrice) {
  return request("/compare", { itemName, type, basePrice });
}
