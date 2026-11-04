export interface ProductInfo {
  is_product: boolean;
  product_name: string;
  brand: string;
  category: string;
  confidence: "high" | "medium" | "low";
  summary: string;
  manufacturer: string;
  country_of_origin: string;
  barcode: string;
  net_quantity: string;
  price_mrp: string;
  packaging: { type: string; material: string; recyclable: string; size_estimate: string; symbols: string[] };
  ingredients_or_materials: string[];
  nutrition: { name: string; value: string }[];
  usage_instructions: string;
  storage: string;
  warnings: string[];
  certifications: string[];
  dates: { manufactured: string; expiry: string; batch: string };
  key_features: string[];
  text_on_pack: string;
  tips: string[];
}

export interface Shot {
  mediaType: string;
  data: string; // base64 without prefix
  preview: string; // data URL
}

export interface HistoryItem {
  id: string;
  at: number;
  thumb: string;
  info: ProductInfo;
}
