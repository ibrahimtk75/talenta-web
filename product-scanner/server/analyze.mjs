// Core logic: send product photo(s) to Claude (vision) and get structured product details back.
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const str = { type: "string" };
const strArr = { type: "array", items: { type: "string" } };

// JSON schema for the structured response. Every field is required; unknown values come back as "" or [].
export const PRODUCT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "is_product", "product_name", "brand", "category", "confidence", "summary",
    "manufacturer", "country_of_origin", "barcode", "net_quantity", "price_mrp",
    "packaging", "ingredients_or_materials", "nutrition", "usage_instructions",
    "storage", "warnings", "certifications", "dates", "key_features",
    "text_on_pack", "tips",
  ],
  properties: {
    is_product: { type: "boolean" },
    product_name: str,
    brand: str,
    category: str,
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    summary: str,
    manufacturer: str,
    country_of_origin: str,
    barcode: str,
    net_quantity: str,
    price_mrp: str,
    packaging: {
      type: "object",
      additionalProperties: false,
      required: ["type", "material", "recyclable", "size_estimate", "symbols"],
      properties: {
        type: str,
        material: str,
        recyclable: str,
        size_estimate: str,
        symbols: strArr,
      },
    },
    ingredients_or_materials: strArr,
    nutrition: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "value"],
        properties: { name: str, value: str },
      },
    },
    usage_instructions: str,
    storage: str,
    warnings: strArr,
    certifications: strArr,
    dates: {
      type: "object",
      additionalProperties: false,
      required: ["manufactured", "expiry", "batch"],
      properties: { manufactured: str, expiry: str, batch: str },
    },
    key_features: strArr,
    text_on_pack: str,
    tips: strArr,
  },
};

const SYSTEM = `You are a product-identification expert inside a mobile app. The user photographs any product
(food, cosmetics, medicine, electronics, household items, clothing, tools, etc.) — often its packaging or label.

Return complete, accurate details:
- Read every visible word on the pack (labels, fine print, barcode digits, MRP, dates, batch, FSSAI/ISI/CE marks, recycling symbols).
- Identify the product, brand and category; use your general knowledge of the product to fill in typical facts
  (what it is, uses, common ingredients/materials) but never invent label-specific facts such as prices,
  dates, batch numbers or barcodes that are not visible — leave those as "".
- Packaging: describe pack type (bottle, pouch, box, blister…), material (PET, HDPE, glass, aluminium, carton…),
  recyclability, an approximate size, and any symbols seen.
- confidence = how sure you are of the identification. If the image is not a product, set is_product=false
  and explain in summary.
- Put short, practical advice for the buyer in tips (e.g. check expiry, allergens, safe disposal).
Use "" or [] for anything unknown.`;

const LANG = {
  en: "Write all text values in English.",
  ml: "Write all text values in Malayalam (മലയാളം), but keep brand names, numbers, units and codes as printed.",
  hi: "Write all text values in Hindi, but keep brand names, numbers, units and codes as printed.",
  ar: "Write all text values in Arabic, but keep brand names, numbers, units and codes as printed.",
};

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/**
 * @param {{images: {mediaType: string, data: string}[], language?: string, note?: string}} input
 */
export async function analyzeProduct({ images, language = "en", note = "" }) {
  if (!Array.isArray(images) || images.length === 0) throw new HttpError(400, "Add at least one photo.");
  if (images.length > 4) throw new HttpError(400, "Maximum 4 photos per scan.");
  for (const img of images) {
    if (!ALLOWED_TYPES.has(img?.mediaType) || typeof img?.data !== "string") {
      throw new HttpError(400, "Unsupported image format.");
    }
  }

  const content = [
    ...images.map((img) => ({
      type: "image",
      source: { type: "base64", media_type: img.mediaType, data: img.data },
    })),
    {
      type: "text",
      text:
        `These ${images.length} photo(s) show the same product (different sides of it). Give me its full details.\n` +
        (LANG[language] ?? LANG.en) +
        (note ? `\nExtra note from the user: ${String(note).slice(0, 500)}` : ""),
    },
  ];

  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: PRODUCT_SCHEMA },
    },
    system: SYSTEM,
    messages: [{ role: "user", content }],
  });

  if (response.stop_reason === "refusal") {
    throw new HttpError(422, "This image could not be analysed. Try a different photo.");
  }
  if (response.stop_reason === "max_tokens") {
    throw new HttpError(502, "The response was cut off. Please try again.");
  }
  const text = response.content.find((b) => b.type === "text")?.text;
  if (!text) throw new HttpError(502, "Empty response from AI.");
  return JSON.parse(text);
}

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** Map any thrown error to {status, message} for the HTTP layer. */
export function toHttpError(err) {
  if (err instanceof HttpError) return { status: err.status, message: err.message };
  if (err instanceof Anthropic.RateLimitError) return { status: 429, message: "Too many scans right now — try again in a minute." };
  if (err instanceof Anthropic.AuthenticationError) return { status: 500, message: "Server API key is missing or invalid." };
  if (err instanceof Anthropic.BadRequestError) return { status: 400, message: "The photo could not be processed. Try a smaller/clearer image." };
  if (err instanceof Anthropic.APIError) return { status: 502, message: "AI service error. Please retry." };
  console.error(err);
  return { status: 500, message: "Something went wrong." };
}
