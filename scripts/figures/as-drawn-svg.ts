/**
 * Draw an `dth-pc-as-drawn-figure/v1` data file as SVG.
 *
 * Each figure's data under `figure-data/` is drawn to `folio/dth-pc/media/<name>.svg`,
 * where `<name>` is the data file's own name plus `-as-drawn`. Labels are SVG `<text>` and keep the
 * source's width (`textLength`), so the layout holds whatever font the reader has.
 * A label with an `href` is a link.
 *
 *   bun run scripts/figures/as-drawn-svg.ts            # write every SVG
 *   bun run scripts/figures/as-drawn-svg.ts --check    # fail when a committed SVG is stale
 *   bun run scripts/figures/as-drawn-svg.ts figure-data/fig-1-product-master-data.json
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { AsDrawnFigure, type AsDrawnFigure as Fig } from "./as-drawn-figure";

const ROOT = resolve(import.meta.dir, "../..");
const DATA = join(ROOT, "figure-data");
const MEDIA = join(ROOT, "folio/dth-pc/media");
/** Pixels per source point in the SVG's intrinsic size. */
const SCALE = 2;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const n = (v: number) => String(Math.round(v * 100) / 100);

function attrs(o: Record<string, string | number | undefined>): string {
  return Object.entries(o)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => ` ${k}="${typeof v === "number" ? n(v) : esc(v as string)}"`)
    .join("");
}

export function drawSvg(fig: Fig): string {
  const { width, height } = fig.canvas;
  const pre = fig.id;
  const family = fig.fonts?.family ?? "sans-serif";
  const out: string[] = [];
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${n(width * SCALE)}" height="${n(height * SCALE)}" viewBox="0 0 ${n(width)} ${n(height)}" role="img" aria-labelledby="${pre}-title" font-family="${esc(family)}">`,
  );
  out.push(`<title id="${pre}-title">Fig. ${esc(fig.figure)}: ${esc(fig.title)}</title>`);
  out.push(
    `<desc>Redrawn as drawn from ${esc(fig.source.publication)}, page ${fig.source.page}${fig.source.section ? `, ${esc(fig.source.section)}` : ""}. Generated from its dth-pc-as-drawn-figure/v1 data (${esc(fig.id)}) by scripts/figures/as-drawn-svg.ts; do not edit.</desc>`,
  );
  if (fig.clips.length) {
    out.push("<defs>");
    for (const c of fig.clips)
      out.push(
        `<clipPath id="${pre}-${c.id}"><path d="${c.d}"${c.evenOdd ? ' clip-rule="evenodd"' : ""}/></clipPath>`,
      );
    out.push("</defs>");
  }

  let open: string[] = [];
  const setClips = (want: string[]) => {
    let common = 0;
    while (common < open.length && common < want.length && open[common] === want[common]) common++;
    while (open.length > common) {
      out.push("</g>");
      open.pop();
    }
    for (const c of want.slice(common)) {
      out.push(`<g clip-path="url(#${pre}-${c})">`);
      open.push(c);
    }
  };

  for (const it of fig.items) {
    if (it.kind === "path") {
      setClips(it.clip ?? []);
      const el = `<path${attrs({
        d: it.d,
        fill: it.fill ?? "none",
        "fill-opacity": it.fillOpacity,
        "fill-rule": it.evenOdd ? "evenodd" : undefined,
        stroke: it.stroke,
        "stroke-width": it.stroke ? it.strokeWidth : undefined,
        "stroke-opacity": it.strokeOpacity,
        "stroke-dasharray": it.dash?.length ? it.dash.map(n).join(" ") : undefined,
        "stroke-linecap": it.lineCap,
        "stroke-linejoin": it.lineJoin,
        opacity: it.opacity,
      })}${it.title ? `><title>${esc(it.title)}</title></path>` : "/>"}`;
      out.push(it.href ? `<a href="${esc(it.href)}" target="_top">${el}</a>` : el);
      continue;
    }
    setClips([]);
    if (it.kind === "image") {
      out.push(
        `<rect${attrs({ x: it.x, y: it.y, width: it.width, height: it.height, fill: "#d9dce1" })}><title>${esc(it.note)}</title></rect>`,
      );
      continue;
    }
    const body = it.runs
      ? it.runs
          .map(
            (r) =>
              `<tspan${attrs({ "font-weight": r.weight, fill: r.fill, "font-style": r.italic ? "italic" : undefined })}>${esc(r.text)}</tspan>`,
          )
          .join("")
      : esc(it.text);
    const el = `<text${attrs({
      x: it.x,
      y: it.y,
      "font-size": it.size,
      "font-weight": it.weight === 400 ? undefined : it.weight,
      "font-style": it.italic ? "italic" : undefined,
      fill: it.fill,
      textLength: it.width,
      lengthAdjust: "spacingAndGlyphs",
      transform: it.rotate ? `rotate(${n(it.rotate)} ${n(it.x)} ${n(it.y)})` : undefined,
    })}>${body}</text>`;
    out.push(it.href ? `<a href="${esc(it.href)}" target="_top">${el}</a>` : el);
  }
  setClips([]);
  out.push("</svg>");
  return out.join("\n") + "\n";
}

export function outputFor(dataFile: string): string {
  return join(MEDIA, basename(dataFile).replace(/\.json$/, "-as-drawn.svg"));
}

export function load(dataFile: string): Fig {
  const parsed = AsDrawnFigure.safeParse(JSON.parse(readFileSync(dataFile, "utf8")));
  if (!parsed.success) {
    throw new Error(`${dataFile}: not dth-pc-as-drawn-figure/v1\n${parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n")}`);
  }
  return parsed.data;
}

function dataFiles(): string[] {
  return readdirSync(DATA)
    .filter((f) => /^fig-.*\.json$/.test(f))
    .sort()
    .map((f) => join(DATA, f));
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const files = args.filter((a) => !a.startsWith("--")).map((a) => resolve(a));
  let stale = 0;
  for (const file of files.length ? files : dataFiles()) {
    const svg = drawSvg(load(file));
    const target = outputFor(file);
    const rel = target.slice(ROOT.length + 1);
    if (check) {
      if (!existsSync(target) || readFileSync(target, "utf8") !== svg) {
        console.error(`stale: ${rel} differs from what ${basename(file)} draws`);
        stale++;
      }
    } else {
      writeFileSync(target, svg);
      console.log(`wrote ${rel}`);
    }
  }
  if (check) {
    if (stale) {
      console.error(`${stale} as-drawn SVG(s) stale; run bun run scripts/figures/as-drawn-svg.ts`);
      process.exit(1);
    }
    console.log("as-drawn SVGs match their data");
  }
}
