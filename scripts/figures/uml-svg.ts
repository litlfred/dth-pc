/**
 * Draw a UML class or object diagram from FHIR logical models and their instances.
 *
 * A `uml-view/v1` file under `figure-data/uml/` names the smart-pcmt logical
 * models (class diagram, by canonical URL) or example instances (object
 * diagram, by id) it draws, and where each box sits. The models stay in
 * smart-pcmt: `pcmt-models.ts` fetches and compiles the pinned commit that
 * `figure-data/pcmt-models.json` names, and nothing of them is copied here. Everything else comes
 * from the models: class names, attributes with their types and multiplicities,
 * backbone elements as composed part classes, references between drawn classes
 * as navigable associations, and, for objects, the slot values and links of
 * each instance. Nothing about a model is typed into the view.
 *
 * Box positions are layout data in the view, chosen to keep the handbook
 * figure's arrangement; no auto-layout tool places them.
 *
 *   bun run scripts/figures/uml-svg.ts            # write every UML SVG
 *   bun run scripts/figures/uml-svg.ts --check    # fail when one is stale
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";
import { loadPcmtModels, type PcmtModels } from "./pcmt-models";

const ROOT = resolve(import.meta.dir, "../..");
const VIEWS = join(ROOT, "figure-data/uml");
const MEDIA = join(ROOT, "folio/dth-pc/media");
const DAR = "http://hl7.org/fhir/StructureDefinition/data-absent-reason";

// ---------------------------------------------------------------- the view schema

const Point = z.tuple([z.number(), z.number()]);
const Placed = { x: z.number(), y: z.number(), width: z.number().positive().optional() };

export const UmlView = z
  .object({
    $schema: z.literal("uml-view/v1"),
    id: z.string().regex(/^[a-z0-9-]+$/),
    figure: z.string(),
    kind: z.enum(["class", "object"]),
    title: z.string(),
    source: z
      .object({ publication: z.string(), page: z.number().int(), section: z.string(), crop: z.string() })
      .strict(),
    canvas: z.object({ width: z.number().positive(), height: z.number().positive() }).strict(),
    /** class: one box per logical model, by canonical URL, with the handbook's name for the class it carries. */
    classes: z
      .array(z.object({ model: z.string().url(), handbookName: z.string().optional(), concept: z.string().url().optional(), ...Placed }).strict())
      .default([]),
    /** class: where a backbone element's part class sits, by element id. Unplaced parts are listed inline. */
    parts: z.array(z.object({ element: z.string(), ...Placed }).strict()).default([]),
    /** object: one box per example instance, by id. */
    objects: z.array(z.object({ instance: z.string(), ...Placed }).strict()).default([]),
    /** object: top-level elements left out of every slot list (e.g. the source note in description). */
    omit: z.array(z.string()).default([]),
    /** Waypoints for an edge, by its key: an element id (class) or `<instance>#<n>` (object link n). */
    routes: z.record(z.string(), z.object({ via: z.array(Point).default([]), label: Point.optional() }).strict()).default({}),
    notes: z.array(z.object({ text: z.string(), ...Placed }).strict()).default([]),
  })
  .strict();
export type UmlView = z.infer<typeof UmlView>;

// ---------------------------------------------------------------- style

const STYLE = {
  font: "'Source Sans 3', 'Source Sans Pro', 'Segoe UI', Helvetica, Arial, sans-serif",
  size: 11,
  line: 15,
  pad: 8,
  head: "#1f2a52",
  fill: "#a0d5ec",
  partFill: "#d3ebf6",
  objFill: "#ffffff",
  stroke: "#1f2a52",
  muted: "#4a5578",
  bg: "#ffffff",
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const n = (v: number) => String(Math.round(v * 100) / 100);
/** A conservative width for a label, so boxes are wide enough in any sans font. */
const textW = (s: string, size = STYLE.size, bold = false) => s.length * size * (bold ? 0.6 : 0.54);

// ---------------------------------------------------------------- reading models

interface Element {
  id: string;
  min?: number;
  max?: string;
  type?: Array<{ code: string; targetProfile?: string[] }>;
}
interface SD {
  url: string;
  name: string;
  title?: string;
  differential: { element: Element[] };
}

const mult = (e: Element) => {
  const lo = e.min ?? 0;
  const hi = e.max ?? "*";
  return lo === Number(hi) ? `${lo}` : `${lo}..${hi}`;
};
const tail = (url: string) => url.split("/").pop() ?? url;

function typeLabel(e: Element): string {
  const ts = e.type ?? [];
  if (ts.length > 3) return `${ts.slice(0, 2).map((t) => t.code).join(" | ")} | … (${ts.length} types)`;
  return ts
    .map((t) => (t.code === "Reference" ? `Reference(${(t.targetProfile ?? []).map(tail).join(" | ")})` : t.code))
    .join(" | ");
}

// ---------------------------------------------------------------- boxes

interface Box {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  svg: string[];
}

function drawBox(
  key: string,
  x: number,
  y: number,
  minW: number | undefined,
  header: Array<{ text: string; bold?: boolean; italic?: boolean; underline?: boolean; size?: number; href?: string }>,
  rows: Array<{ text: string; title?: string; depth?: number }>,
  fill: string,
): Box {
  const w = Math.max(
    minW ?? 0,
    ...header.map((h) => textW(h.text, h.size ?? STYLE.size, h.bold) + 2 * STYLE.pad),
    ...rows.map((r) => textW(r.text) + 2 * STYLE.pad + (r.depth ?? 0) * 14),
  );
  const headH = header.length * STYLE.line + STYLE.pad;
  const bodyH = Math.max(1, rows.length) * STYLE.line + STYLE.pad;
  const h = headH + bodyH;
  const svg: string[] = [];
  svg.push(`<g id="${esc(key)}">`);
  svg.push(`<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${fill}" stroke="${STYLE.stroke}" stroke-width="1"/>`);
  svg.push(`<line x1="${n(x)}" y1="${n(y + headH)}" x2="${n(x + w)}" y2="${n(y + headH)}" stroke="${STYLE.stroke}" stroke-width="1"/>`);
  header.forEach((hd, i) => {
    const ty = y + STYLE.pad / 2 + (i + 1) * STYLE.line - 4;
    const t = `<text x="${n(x + w / 2)}" y="${n(ty)}" text-anchor="middle" font-size="${hd.size ?? STYLE.size}"${hd.bold ? ' font-weight="700"' : ""}${hd.italic ? ' font-style="italic"' : ""}${hd.underline ? ' text-decoration="underline"' : ""} fill="${STYLE.head}">${esc(hd.text)}</text>`;
    svg.push(hd.href ? `<a href="${esc(hd.href)}" target="_top">${t}</a>` : t);
  });
  rows.forEach((r, i) => {
    const ty = y + headH + STYLE.pad / 2 + (i + 1) * STYLE.line - 4;
    svg.push(
      `<text x="${n(x + STYLE.pad + (r.depth ?? 0) * 14)}" y="${n(ty)}" font-size="${STYLE.size}" fill="${STYLE.head}">${r.title ? `<title>${esc(r.title)}</title>` : ""}${esc(r.text)}</text>`,
    );
  });
  svg.push("</g>");
  return { key, x, y, w, h, svg };
}

// ---------------------------------------------------------------- edges

const centre = (b: Box): [number, number] => [b.x + b.w / 2, b.y + b.h / 2];

/** Where the segment from inside a box towards `to` leaves the box. */
function exitPoint(b: Box, to: [number, number]): [number, number] {
  const [cx, cy] = centre(b);
  const dx = to[0] - cx;
  const dy = to[1] - cy;
  if (dx === 0 && dy === 0) return [cx, cy];
  const sx = dx === 0 ? Infinity : b.w / 2 / Math.abs(dx);
  const sy = dy === 0 ? Infinity : b.h / 2 / Math.abs(dy);
  const s = Math.min(sx, sy);
  return [cx + dx * s, cy + dy * s];
}

/**
 * Where an edge meets a box. With waypoints the edge is orthogonal: a waypoint
 * above or below the box meets it vertically at the waypoint's x, one beside it
 * horizontally at the waypoint's y. Without, the edge runs centre to centre.
 */
function anchor(b: Box, toward: [number, number], orthogonal: boolean): [number, number] {
  if (!orthogonal) return exitPoint(b, toward);
  const [x, y] = toward;
  if (x >= b.x && x <= b.x + b.w) return [x, y < b.y ? b.y : b.y + b.h];
  if (y >= b.y && y <= b.y + b.h) return [x < b.x ? b.x : b.x + b.w, y];
  return exitPoint(b, toward);
}

type EndMark = "none" | "arrow" | "diamond";

function drawEdge(
  from: Box,
  to: Box,
  via: Array<[number, number]>,
  start: EndMark,
  end: EndMark,
  labels: { near: string; far: string; middle?: string },
  labelAt?: [number, number],
): string[] {
  const first = via[0] ?? centre(to);
  const last = via[via.length - 1] ?? centre(from);
  const pts: Array<[number, number]> = [anchor(from, first, via.length > 0), ...via, anchor(to, last, via.length > 0)];
  const svg: string[] = [];
  svg.push(
    `<polyline points="${pts.map((p) => `${n(p[0])},${n(p[1])}`).join(" ")}" fill="none" stroke="${STYLE.stroke}" stroke-width="1"/>`,
  );
  const mark = (tip: [number, number], back: [number, number], kind: EndMark) => {
    if (kind === "none") return;
    const ang = Math.atan2(tip[1] - back[1], tip[0] - back[0]);
    const rot = (dx: number, dy: number): string =>
      `${n(tip[0] + dx * Math.cos(ang) - dy * Math.sin(ang))},${n(tip[1] + dx * Math.sin(ang) + dy * Math.cos(ang))}`;
    if (kind === "arrow")
      svg.push(`<polyline points="${rot(-9, -4.5)} ${rot(0, 0)} ${rot(-9, 4.5)}" fill="none" stroke="${STYLE.stroke}" stroke-width="1"/>`);
    else svg.push(`<polygon points="${rot(0, 0)} ${rot(-7, -4)} ${rot(-14, 0)} ${rot(-7, 4)}" fill="${STYLE.stroke}"/>`);
  };
  mark(pts[0], pts[1], start);
  mark(pts[pts.length - 1], pts[pts.length - 2], end);
  /** An end's role and multiplicity, beside the line and clear of the box it meets. */
  const lbl = (tip: [number, number], back: [number, number], text: string) => {
    if (!text) return;
    const len = Math.hypot(back[0] - tip[0], back[1] - tip[1]) || 1;
    const dx = (back[0] - tip[0]) / len;
    const dy = (back[1] - tip[1]) / len;
    let x: number;
    let y: number;
    let anchor: string;
    if (Math.abs(dx) > Math.abs(dy)) {
      x = tip[0] + dx * 8;
      y = tip[1] - 5;
      anchor = dx > 0 ? "start" : "end";
    } else {
      x = tip[0] + 5;
      y = tip[1] + dy * 12 + (dy > 0 ? 4 : 0);
      anchor = "start";
    }
    svg.push(`<text x="${n(x)}" y="${n(y)}" font-size="${STYLE.size - 1}" fill="${STYLE.muted}" text-anchor="${anchor}">${esc(text)}</text>`);
  };
  lbl(pts[0], pts[1], labels.near);
  lbl(pts[pts.length - 1], pts[pts.length - 2], labels.far);
  if (labels.middle) {
    const mid = labelAt ?? [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2 - 4];
    labels.middle.split("\n").forEach((line, i) =>
      svg.push(
        `<text x="${n(mid[0])}" y="${n(mid[1] + i * (STYLE.line - 3))}" font-size="${STYLE.size - 1}" fill="${STYLE.muted}" text-anchor="middle">${esc(line)}</text>`,
      ),
    );
  }
  return svg;
}

// ---------------------------------------------------------------- class diagrams

function classDiagram(view: UmlView, models: PcmtModels): string[] {
  const sds = view.classes.map((c) => ({ c, sd: models.structureDefinition(c.model) as unknown as SD }));
  const drawn = new Map(sds.map((s) => [s.sd.url, s.sd.name]));
  const boxes = new Map<string, Box>();
  const out: string[] = [];
  const edges: string[] = [];
  const placedParts = new Map(view.parts.map((p) => [p.element, p]));
  const pending: Array<() => void> = [];

  const refTargets = (e: Element) =>
    (e.type ?? []).flatMap((t) => (t.code === "Reference" ? (t.targetProfile ?? []).filter((p) => drawn.has(p)) : []));

  for (const { c, sd } of sds) {
    const els = sd.differential.element.filter((e) => e.id !== sd.name);
    const children = (parent: string) => els.filter((e) => e.id.startsWith(parent + ".") && !e.id.slice(parent.length + 1).includes("."));
    const isBackbone = (e: Element) => e.type?.some((t) => t.code === "BackboneElement");

    // An element becomes an attribute row unless it is a placed part or a reference to a drawn class.
    const rowsFor = (parent: string, depth: number): Array<{ text: string; title?: string; depth?: number }> =>
      children(parent).flatMap((e) => {
        const name = e.id.slice(parent.length + 1);
        if (isBackbone(e)) {
          if (placedParts.has(e.id)) return [];
          return [{ text: `${name} [${mult(e)}]`, depth }, ...rowsFor(e.id, depth + 1)];
        }
        if (refTargets(e).length && placedParts.has(parent)) return [];
        if (refTargets(e).length && parent === sd.name) return [];
        const full = typeLabel(e);
        return [{ text: `${name} : ${full} [${mult(e)}]`, title: (e.type ?? []).map((t) => t.code).join(" | "), depth }];
      });

    const header = [
      { text: "«logical model»", size: STYLE.size - 1, italic: true },
      { text: sd.name, bold: true, size: STYLE.size + 1, href: sd.url },
      { text: `${models.ref.label}${c.handbookName ? ` · handbook: ${c.handbookName}` : ""}`, size: STYLE.size - 2 },
    ];
    const box = drawBox(sd.url, c.x, c.y, c.width, header, rowsFor(sd.name, 0), STYLE.fill);
    boxes.set(sd.url, box);
    out.push(...box.svg);

    for (const e of els) {
      if (isBackbone(e) && placedParts.has(e.id)) {
        const p = placedParts.get(e.id)!;
        const part = drawBox(
          e.id,
          p.x,
          p.y,
          p.width,
          [{ text: e.id, bold: true }],
          rowsFor(e.id, 0),
          STYLE.partFill,
        );
        boxes.set(e.id, part);
        out.push(...part.svg);
        const owner = e.id.slice(0, e.id.lastIndexOf("."));
        pending.push(() => {
          const r = view.routes[e.id];
          edges.push(
            ...drawEdge(boxes.get(owner === sd.name ? sd.url : owner)!, part, r?.via ?? [], "diamond", "none", { near: "", far: `${e.id.split(".").pop()} ${mult(e)}` }, r?.label),
          );
        });
      }
      for (const target of refTargets(e)) {
        const owner = e.id.slice(0, e.id.lastIndexOf("."));
        pending.push(() => {
          const from = boxes.get(owner === sd.name ? sd.url : owner);
          const to = boxes.get(target);
          if (!from || !to) return;
          const r = view.routes[e.id];
          edges.push(...drawEdge(from, to, r?.via ?? [], "none", "arrow", { near: "", far: `${e.id.split(".").pop()} ${mult(e)}` }, r?.label));
        });
      }
    }
  }
  for (const p of pending) p();
  return [...edges, ...out];
}

// ---------------------------------------------------------------- object diagrams

function fmt(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v !== "object") return typeof v === "string" ? `"${v}"` : String(v);
  const o = v as Record<string, unknown>;
  const ext = (o.extension as Array<{ url: string; valueCode?: string }> | undefined)?.find((e) => e.url === DAR);
  if (ext) return `⟨absent: ${ext.valueCode}⟩`;
  if ("value" in o && typeof o.value !== "object") {
    const unit = (o.unit as string) ?? (o.code as string);
    const qual = o.system === "https://www.gs1.org/gtin" ? " (GTIN)" : o.type ? ` (${(o.type as { text?: string }).text})` : "";
    return `${fmt(o.value)}${unit && typeof o.value === "number" ? ` ${unit}` : ""}${qual}`;
  }
  if ("text" in o) return `"${o.text}"`;
  if ("display" in o) return `"${o.display}"`;
  if ("coding" in o) return (o.coding as Array<{ code: string }>).map((c) => c.code).join(", ");
  if ("code" in o) return String(o.code);
  return "";
}

/** The instance an association points at, or null when it names one only by display. */
function refOf(a: Record<string, unknown>): string | null {
  const ref = (a.product as { reference?: string } | undefined)?.reference;
  return ref ? tail(ref) : null;
}

function slots(inst: Record<string, unknown>, omit: string[], linked: Set<number>): string[] {
  const rows: string[] = [];
  for (const [k, v] of Object.entries(inst)) {
    if (k === "resourceType" || omit.includes(k)) continue;
    const vals = Array.isArray(v) ? v : [v];
    vals.forEach((item, i) => {
      const nm = Array.isArray(v) && vals.length > 1 ? `${k}[${i}]` : k;
      if (k === "associatedProduct") {
        if (linked.has(i)) return;
        const a = item as Record<string, unknown>;
        const prod = a.product as { identifier?: unknown } | undefined;
        const target = refOf(a) ?? (prod?.identifier ? `identifier ${fmt(prod.identifier)}` : fmt(prod));
        rows.push(`${nm} = ${target} × ${fmt(a.quantity)}`);
        return;
      }
      if (k === "name") {
        const nmObj = item as { value: string; nameType: string };
        rows.push(`${nm} = "${nmObj.value}"`);
        return;
      }
      if (item && typeof item === "object" && !("value" in item) && !("text" in item) && !("display" in item) && !("coding" in item) && !("extension" in item)) {
        for (const [k2, v2] of Object.entries(item)) rows.push(`${nm}.${k2} = ${fmt(v2)}`);
        return;
      }
      rows.push(`${nm} = ${fmt(item)}`);
    });
  }
  return rows;
}

function objectDiagram(view: UmlView, models: PcmtModels): string[] {
  const insts = view.objects.map((o) => ({ o, id: o.instance, data: models.instance(o.instance) }));
  const ids = new Set(insts.map((i) => i.id));
  const boxes = new Map<string, Box>();
  const out: string[] = [];
  const edges: string[] = [];
  for (const { o, id, data } of insts) {
    const assoc = (data.associatedProduct as Array<Record<string, unknown>> | undefined) ?? [];
    const linked = new Set(assoc.flatMap((a, i) => (ids.has(refOf(a) ?? "") ? [i] : [])));
    const cls = tail(String(data.resourceType));
    const box = drawBox(
      id,
      o.x,
      o.y,
      o.width,
      [{ text: `${id} : ${cls}`, bold: true, underline: true, href: `${data.resourceType}` }],
      slots(data, view.omit, linked).map((text) => ({ text })),
      STYLE.objFill,
    );
    boxes.set(id, box);
    out.push(...box.svg);
  }
  for (const { id, data } of insts) {
    const assoc = (data.associatedProduct as Array<Record<string, unknown>> | undefined) ?? [];
    assoc.forEach((a, i) => {
      const target = refOf(a);
      if (!target || !ids.has(target)) return;
      const rel = ((a.relationship as Array<{ code: string }>) ?? []).map((r) => r.code).join(", ");
      const r = view.routes[`${id}#${i}`];
      edges.push(
        ...drawEdge(boxes.get(id)!, boxes.get(target)!, r?.via ?? [], "none", "arrow", {
          near: "",
          far: "",
          middle: `associatedProduct\n${rel} × ${fmt(a.quantity)}`,
        }, r?.label),
      );
    });
  }
  return [...edges, ...out];
}

// ---------------------------------------------------------------- the SVG

export function drawUml(view: UmlView, models: PcmtModels): string {
  const body = view.kind === "class" ? classDiagram(view, models) : objectDiagram(view, models);
  const { width, height } = view.canvas;
  const notes = view.notes.map(
    (t) => `<text x="${n(t.x)}" y="${n(t.y)}" font-size="${STYLE.size - 1}" fill="${STYLE.muted}" font-style="italic">${esc(t.text)}</text>`,
  );
  return (
    [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${n(width)}" height="${n(height)}" viewBox="0 0 ${n(width)} ${n(height)}" role="img" aria-labelledby="${view.id}-title" font-family="${esc(STYLE.font)}">`,
      `<title id="${view.id}-title">Fig. ${esc(view.figure)}: ${esc(view.title)} (UML ${view.kind} diagram)</title>`,
      `<desc>UML ${view.kind} diagram generated by scripts/figures/uml-svg.ts from figure-data/uml/${view.id}.json and the smart-pcmt models it names (${esc(models.ref.repository)} at ${models.ref.commit.slice(0, 7)}); the handbook draws this figure on page ${view.source.page} (${esc(view.source.section)}). Do not edit.</desc>`,
      `<rect width="${n(width)}" height="${n(height)}" fill="${STYLE.bg}"/>`,
      ...body,
      ...notes,
      "</svg>",
    ].join("\n") + "\n"
  );
}

export function loadView(file: string): UmlView {
  const parsed = UmlView.safeParse(JSON.parse(readFileSync(file, "utf8")));
  if (!parsed.success)
    throw new Error(`${file}: not uml-view/v1\n${parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n")}`);
  return parsed.data;
}

if (import.meta.main) {
  const check = process.argv.includes("--check");
  let stale = 0;
  const models = loadPcmtModels();
  for (const f of readdirSync(VIEWS).filter((f) => f.endsWith(".json")).sort()) {
    const file = join(VIEWS, f);
    const svg = drawUml(loadView(file), models);
    const target = join(MEDIA, f.replace(/\.json$/, ".svg"));
    const rel = target.slice(ROOT.length + 1);
    if (check) {
      if (!existsSync(target) || readFileSync(target, "utf8") !== svg) {
        console.error(`stale: ${rel}`);
        stale++;
      }
    } else {
      writeFileSync(target, svg);
      console.log(`wrote ${rel}`);
    }
  }
  if (check) {
    if (stale) process.exit(1);
    console.log("UML SVGs match their views and models");
  }
}
