/**
 * Verify the generated figure SVGs for their consumer, not only their currency.
 *
 * `as-drawn-svg.ts --check` and `uml-svg.ts --check` ask whether a committed SVG
 * is what its data draws. This asks whether it is an SVG the document site can
 * show: each file must be well-formed XML whose root is `<svg>` in the SVG
 * namespace, with a `viewBox` (so it scales in `<img>` and `<object>`) and a
 * non-empty `<title>` (its accessible name). It reads every SVG the two
 * generators write: `*-as-drawn.svg` and `fig-*-uml-*.svg` in
 * `folio/dth-pc/media/`.
 *
 *   bun run scripts/figures/check-svg-output.ts
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { XMLParser, XMLValidator } from "fast-xml-parser";

const ROOT = resolve(import.meta.dir, "../..");
const MEDIA = join(ROOT, "folio/dth-pc/media");
const SVG_NS = "http://www.w3.org/2000/svg";

/** The generated figure SVGs, by the names the two generators give them. */
export function generatedSvgs(dir: string = MEDIA): string[] {
  return readdirSync(dir)
    .filter((f) => /-as-drawn\.svg$/.test(f) || /^fig-\d+-uml-.*\.svg$/.test(f))
    .sort();
}

/** What is wrong with one SVG's text, or an empty list. */
export function problems(text: string): string[] {
  const valid = XMLValidator.validate(text);
  if (valid !== true) return [`not well-formed XML: ${valid.err.msg} (line ${valid.err.line})`];
  const doc = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@" }).parse(text) as Record<string, unknown>;
  const roots = Object.keys(doc).filter((k) => !k.startsWith("?"));
  if (roots.length !== 1 || roots[0] !== "svg") return [`root element is ${roots.join(", ") || "missing"}, not <svg>`];
  const svg = doc.svg as Record<string, unknown>;
  const out: string[] = [];
  if (svg["@xmlns"] !== SVG_NS) out.push(`root <svg> is not in the SVG namespace (${String(svg["@xmlns"])})`);
  const vb = String(svg["@viewBox"] ?? "").trim().split(/[\s,]+/).map(Number);
  if (vb.length !== 4 || vb.some((v) => !Number.isFinite(v)) || vb[2]! <= 0 || vb[3]! <= 0) out.push("no usable viewBox");
  const title = svg.title as unknown;
  const titleText = typeof title === "string" ? title : (title as { "#text"?: string } | undefined)?.["#text"];
  if (!titleText || !String(titleText).trim()) out.push("no <title>");
  return out;
}

if (import.meta.main) {
  let bad = 0;
  const files = generatedSvgs();
  for (const f of files) {
    const p = problems(readFileSync(join(MEDIA, f), "utf8"));
    for (const msg of p) console.error(`✗ ${f}: ${msg}`);
    if (p.length) bad++;
  }
  if (bad) {
    console.error(`${bad} of ${files.length} generated figure SVG(s) cannot be shown as they are`);
    process.exit(1);
  }
  console.log(`✓ ${files.length} generated figure SVG(s): well-formed, root <svg>, viewBox and <title>`);
}
