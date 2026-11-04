import type { Shot } from "./types";

/** Resize + JPEG-compress a photo on the phone before upload (fast + cheap; ~1568px is enough for label text). */
export async function fileToShot(file: File, maxSide = 1568, quality = 0.85): Promise<Shot> {
  const bitmap = await loadImage(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  const preview = canvas.toDataURL("image/jpeg", quality);
  return { mediaType: "image/jpeg", data: preview.split(",")[1], preview };
}

/** Small thumbnail for history (keeps localStorage small). */
export async function makeThumb(dataUrl: string, side = 160): Promise<string> {
  const img = await loadImage(dataUrl);
  const scale = side / Math.max(img.width, img.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.7);
}

function loadImage(src: File | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = typeof src === "string" ? src : URL.createObjectURL(src);
    img.onload = () => {
      if (typeof src !== "string") URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => reject(new Error("Could not read this image."));
    img.src = url;
  });
}
