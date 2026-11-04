// Tiny zero-dependency Node server: POST /api/analyze + serves the built app from ./dist.
// Run:  ANTHROPIC_API_KEY=sk-ant-... node server/index.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeProduct, toHttpError } from "./analyze.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(here, "../dist");
const PORT = Number(process.env.PORT) || 8787;
const MAX_BODY = 20 * 1024 * 1024; // 20 MB

// Load .env if present (no dotenv dependency).
const envFile = path.resolve(here, "../.env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".ico": "image/x-icon",
};

function send(res, status, body, type = "application/json") {
  res.writeHead(status, { "Content-Type": type });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error("Photos too large"), { status: 413 })); req.destroy(); }
      else chunks.push(c);
    });
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); }
      catch { reject(Object.assign(new Error("Invalid JSON"), { status: 400 })); }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/analyze") {
    if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
    try {
      const body = await readJson(req);
      const result = await analyzeProduct(body);
      return send(res, 200, result);
    } catch (err) {
      if (err.status === 413 || (err.status === 400 && err.message === "Invalid JSON")) {
        return send(res, err.status, { error: err.message });
      }
      const { status, message } = toHttpError(err);
      return send(res, status, { error: message });
    }
  }

  if (url.pathname === "/api/health") return send(res, 200, { ok: true });

  // Static files (SPA fallback to index.html)
  let file = path.join(DIST, decodeURIComponent(url.pathname));
  if (!file.startsWith(DIST)) return send(res, 403, "Forbidden", "text/plain");
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, "index.html");
  if (!fs.existsSync(file)) return send(res, 404, "Run `npm run build` first.", "text/plain");
  send(res, 200, fs.readFileSync(file), MIME[path.extname(file)] || "application/octet-stream");
});

server.listen(PORT, () => {
  console.log(`Product Lens API on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) console.warn("⚠ ANTHROPIC_API_KEY is not set — scans will fail.");
});
