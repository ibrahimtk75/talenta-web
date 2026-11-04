// Vercel serverless function (when deploying the product-scanner folder to Vercel).
// Set ANTHROPIC_API_KEY in Vercel → Project → Settings → Environment Variables.
import { analyzeProduct, toHttpError } from "../server/analyze.mjs";

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    res.status(200).json(await analyzeProduct(body ?? {}));
  } catch (err) {
    const { status, message } = toHttpError(err);
    res.status(status).json({ error: message });
  }
}
