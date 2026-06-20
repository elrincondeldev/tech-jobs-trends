/**
 * Dev-only script: hardcoded API key (per request).
 * Usage:
 *   node src/scripts/generateImage.mjs "A cute cat astronaut" --aspect 16:9 --n 2 --seed 123
 */
import process from "node:process";

const API_KEY =
  "sk-cp-tdoMmVYW-JzFgMXdH6OiMzwR3JSY_QGxc6eY-GcrdYxS4FEHR-Ej4-XUlLY_YGQGp1fUXh9T6vVs7xTAo1Iopm9yumSFuagoNKzy7d0GgkxtBsv9XhS-Djg";
const ENDPOINT = "https://api.minimax.io/v1/image_generation";

function usage() {
  const cmd = "node src/scripts/generateImage.mjs";
  console.error(
    [
      "Missing prompt.",
      "",
      "Usage:",
      `  ${cmd} "<prompt>" [--aspect 1:1|16:9|4:3|3:2|2:3|3:4|9:16|21:9] [--n 1..9] [--seed <int>]`,
      "",
      "Example:",
      `  ${cmd} "A minimal paper-style dashboard screenshot" --aspect 16:9`,
    ].join("\n"),
  );
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const positionals = [];
  /** @type {Record<string, string>} */
  const flags = {};

  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const value = args[i + 1];
      if (!value || value.startsWith("--")) {
        flags[key] = "true";
      } else {
        flags[key] = value;
        i += 1;
      }
    } else {
      positionals.push(a);
    }
  }

  return { positionals, flags };
}

function clampInt(n, { min, max, fallback }) {
  if (!Number.isFinite(n)) return fallback;
  const v = Math.trunc(n);
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

function extractUrls(json) {
  /** @type {string[]} */
  const urls = [];

  const pushMaybe = (v) => {
    if (typeof v === "string" && v.trim()) urls.push(v);
  };

  // Common shapes (be liberal in what we accept)
  // - { data: { images: [{ url }] } }
  // - { images: [{ url }] }
  // - { data: { output: [ { url } ] } }
  // - { output: [ { url } ] }
  // - { data: { url: "..." } }
  // - { url: "..." }
  const candidates = [
    json?.data?.images,
    json?.images,
    json?.data?.output,
    json?.output,
    json?.data?.urls,
    json?.urls,
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) {
      for (const item of c) {
        pushMaybe(item?.url);
        pushMaybe(item?.image_url);
        pushMaybe(item?.output_url);
        pushMaybe(item);
      }
    }
  }

  pushMaybe(json?.data?.url);
  pushMaybe(json?.url);

  // Dedupe
  return [...new Set(urls)];
}

async function main() {
  const { positionals, flags } = parseArgs(process.argv);
  const prompt = positionals.join(" ").trim();

  if (!prompt) {
    usage();
    process.exitCode = 1;
    return;
  }

  const aspect_ratio = flags.aspect ?? "1:1";
  const n = clampInt(Number(flags.n ?? 1), { min: 1, max: 9, fallback: 1 });
  const seed = flags.seed != null ? Number(flags.seed) : undefined;

  const body = {
    model: "image-01",
    prompt,
    response_format: "url",
    aspect_ratio,
    n,
    ...(Number.isFinite(seed) ? { seed: Math.trunc(seed) } : {}),
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`Request failed: ${res.status} ${res.statusText}`);
    if (text) console.error(text);
    process.exitCode = 1;
    return;
  }

  const json = await res.json();
  const urls = extractUrls(json);

  if (urls.length === 0) {
    console.error("No image URL found in response. Raw JSON:");
    console.error(JSON.stringify(json, null, 2));
    process.exitCode = 1;
    return;
  }

  for (const url of urls) console.log(url);
}

await main();
