/**
 * `dth-pc-as-drawn-figure/v1`: a figure as its publication draws it, as data.
 *
 * A figure's redraw keeps the original's layout and style (the figure-rebuild
 * skill, "The redraw keeps the original's layout"). This schema holds what is
 * drawn: a canvas in the source's units (PDF points), clip paths, and items in
 * paint order. An item is a path (fill and stroke as the source paints them), a
 * text line (its baseline, size, weight and colour, and the width it takes in the
 * source), or an embedded raster image that is not traced. A text item may carry
 * `href` and `concept`, the IRI of the glossary term or model element it names,
 * so the label links where the folio defines it.
 *
 * The data file is the one source of the SVG: `as-drawn-svg.ts` draws it, and
 * `--check` fails when a committed SVG differs from what the data draws.
 *
 * This schema is generic, not specific to this folio. It belongs in the
 * platform (folio-assistant-core), and lives here until it is upstreamed.
 */
import { z } from "zod";

const Color = z.string().regex(/^#[0-9a-f]{6}$/, "a #rrggbb colour");
const Iri = z.string().url();

export const PathItem = z
  .object({
    kind: z.literal("path"),
    d: z.string().min(1),
    fill: Color.optional(),
    fillOpacity: z.number().min(0).max(1).optional(),
    evenOdd: z.boolean().optional(),
    stroke: Color.optional(),
    strokeWidth: z.number().nonnegative().optional(),
    strokeOpacity: z.number().min(0).max(1).optional(),
    dash: z.array(z.number().nonnegative()).optional(),
    lineCap: z.enum(["butt", "round", "square"]).optional(),
    lineJoin: z.enum(["miter", "round", "bevel"]).optional(),
    clip: z.array(z.string()).optional(),
    /** The opacity of the transparency group the source paints the path in. */
    opacity: z.number().min(0).max(1).optional(),
    concept: Iri.optional(),
    href: Iri.optional(),
    title: z.string().optional(),
  })
  .strict()
  .refine((p) => p.fill !== undefined || p.stroke !== undefined, "a path is filled, stroked or both");

export const TextRun = z
  .object({
    text: z.string(),
    weight: z.number().int().optional(),
    fill: Color.optional(),
    italic: z.boolean().optional(),
  })
  .strict();

export const TextItem = z
  .object({
    kind: z.literal("text"),
    x: z.number(),
    y: z.number(),
    size: z.number().positive(),
    weight: z.number().int(),
    fill: Color,
    text: z.string().min(1),
    /** The width the line takes in the source, so the redraw keeps it whatever font the reader has. */
    width: z.number().positive(),
    italic: z.boolean().optional(),
    rotate: z.number().optional(),
    runs: z.array(TextRun).optional(),
    concept: Iri.optional(),
    href: Iri.optional(),
  })
  .strict()
  .refine((t) => !t.runs || t.runs.map((r) => r.text).join("") === t.text, "runs spell the text");

export const ImageItem = z
  .object({
    kind: z.literal("image"),
    x: z.number(),
    y: z.number(),
    width: z.number().positive(),
    height: z.number().positive(),
    note: z.string(),
  })
  .strict();

export const Item = z.union([PathItem, TextItem, ImageItem]);

export const AsDrawnFigure = z
  .object({
    $schema: z.literal("dth-pc-as-drawn-figure/v1"),
    id: z.string().regex(/^[a-z0-9-]+$/),
    figure: z.string(),
    title: z.string(),
    source: z
      .object({
        publication: z.string(),
        pdf: z.string(),
        page: z.number().int().positive(),
        section: z.string().nullable(),
        crop: z.string(),
        clip: z.tuple([z.number(), z.number(), z.number(), z.number()]),
        units: z.literal("pt"),
        method: z.string(),
      })
      .strict(),
    canvas: z.object({ width: z.number().positive(), height: z.number().positive() }).strict(),
    fonts: z.object({ family: z.string() }).strict().nullable().optional(),
    clips: z.array(z.object({ id: z.string(), d: z.string(), evenOdd: z.boolean() }).strict()),
    items: z.array(Item),
    /** Hand-curation applied to the extracted draft, said in words for a reviewer. */
    curation: z.array(z.string()).optional(),
  })
  .strict()
  .superRefine((f, ctx) => {
    const ids = new Set(f.clips.map((c) => c.id));
    f.items.forEach((it, i) => {
      if (it.kind === "path")
        for (const c of it.clip ?? [])
          if (!ids.has(c)) ctx.addIssue({ code: "custom", path: ["items", i, "clip"], message: `no clip ${c}` });
    });
  });

export type AsDrawnFigure = z.infer<typeof AsDrawnFigure>;
