#!/usr/bin/env python3
"""Draft an dth-pc-as-drawn-figure/v1 data file from a figure's vector drawing in its source PDF.

The figure is read where the publication draws it: every path, with its fill and
stroke, every clip path, and every text line, with its font size, weight, colour
and baseline. Coordinates are PDF points relative to the clip's top-left corner, so
the redraw keeps the original's layout box for box. Embedded raster images are not
traced; they are recorded as ``image`` items that point at the crop, so a reviewer
sees what was left out.

This draft is then curated by hand (links to glossary terms, dropped bleed); it is
run once per figure, never over a curated file without ``--force``.

usage: python3 -I scripts/figures/extract_as_drawn.py <figures.json> <fig> [--force]
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[2]


def hexcolor(c):
    if c is None:
        return None
    r, g, b = (max(0, min(255, round(v * 255))) for v in c[:3])
    return f"#{r:02x}{g:02x}{b:02x}"


def num(v: float) -> float:
    return round(v, 2)


def path_d(items, ox: float, oy: float) -> str:
    out: list[str] = []
    cur = None
    for it in items:
        op = it[0]
        if op == "re":
            r = it[1]
            out.append(f"M{num(r.x0-ox)} {num(r.y0-oy)}H{num(r.x1-ox)}V{num(r.y1-oy)}H{num(r.x0-ox)}Z")
            cur = None
            continue
        if op == "qu":
            q = it[1]
            pts = [q.ul, q.ur, q.lr, q.ll]
            out.append("M" + "L".join(f"{num(p.x-ox)} {num(p.y-oy)}" for p in pts) + "Z")
            cur = None
            continue
        p0 = it[1]
        if cur is None or abs(cur.x - p0.x) > 0.01 or abs(cur.y - p0.y) > 0.01:
            out.append(f"M{num(p0.x-ox)} {num(p0.y-oy)}")
        if op == "l":
            p1 = it[2]
            out.append(f"L{num(p1.x-ox)} {num(p1.y-oy)}")
            cur = p1
        elif op == "c":
            c1, c2, p1 = it[2], it[3], it[4]
            out.append(
                f"C{num(c1.x-ox)} {num(c1.y-oy)} {num(c2.x-ox)} {num(c2.y-oy)} {num(p1.x-ox)} {num(p1.y-oy)}"
            )
            cur = p1
    return "".join(out)


def spancolor(span):
    return hexcolor(pymupdf.sRGB_to_pdf(span["color"]))


def is_bold(span) -> bool:
    f = span["font"].lower()
    return bool(span["flags"] & 16) or any(w in f for w in ("bold", "black", "semibold", "heavy"))


def is_italic(span) -> bool:
    return bool(span["flags"] & 2) or "italic" in span["font"].lower() or "-it" in span["font"].lower()


def extract(spec: dict) -> dict:
    doc = pymupdf.open(ROOT / spec["pdf"])
    page = doc[spec["page"] - 1]
    clip = pymupdf.Rect(spec["clip"])
    ox, oy = clip.x0, clip.y0
    drop = [pymupdf.Rect(r) for r in spec.get("dropText", [])]
    drop_paths = [pymupdf.Rect(r) for r in spec.get("dropPaths", [])]

    clips: list[dict] = []
    items: list[dict] = []
    stack: list[tuple[int, str, object]] = []
    for d in page.get_drawings(extended=True):
        lvl = d.get("level", 0)
        while stack and stack[-1][0] >= lvl:
            stack.pop()
        kind = d["type"]
        if kind == "group":
            if (d.get("opacity") or 1) < 0.999:
                stack.append((lvl, "group", d["opacity"]))
            continue
        if kind == "clip":
            cid = f"c{len(clips)}"
            clips.append({"id": cid, "d": path_d(d["items"], ox, oy), "evenOdd": bool(d.get("even_odd"))})
            stack.append((lvl, "clip", cid))
            continue
        r = pymupdf.Rect(d["rect"])
        if r.is_empty and r.width == 0 and r.height == 0:
            continue
        if not (r + (-1, -1, 1, 1)).intersects(clip):
            continue
        if any(dp.contains(r) for dp in drop_paths):
            continue
        it: dict = {"kind": "path", "d": path_d(d["items"], ox, oy)}
        if "f" in kind and d.get("fill") is not None:
            it["fill"] = hexcolor(d["fill"])
            if d.get("fill_opacity", 1) < 1:
                it["fillOpacity"] = num(d["fill_opacity"])
            if d.get("even_odd"):
                it["evenOdd"] = True
        if "s" in kind and d.get("color") is not None:
            it["stroke"] = hexcolor(d["color"])
            it["strokeWidth"] = num(d.get("width") or 1)
            if d.get("stroke_opacity", 1) < 1:
                it["strokeOpacity"] = num(d["stroke_opacity"])
            dashes = d.get("dashes")
            if dashes and dashes.strip() not in ("[] 0", "[]0", ""):
                arr = dashes.split("]")[0].strip("[ ").split()
                if arr:
                    it["dash"] = [num(float(x)) for x in arr]
            if d.get("lineCap"):
                cap = d["lineCap"][0] if isinstance(d["lineCap"], (list, tuple)) else d["lineCap"]
                if cap:
                    it["lineCap"] = ["butt", "round", "square"][int(cap)]
            if d.get("lineJoin"):
                it["lineJoin"] = ["miter", "round", "bevel"][int(d["lineJoin"])]
        if "fill" not in it and "stroke" not in it:
            continue
        active = [v for _, k, v in stack if k == "clip"]
        if active:
            it["clip"] = active
        alpha = math.prod(v for _, k, v in stack if k == "group")
        if alpha < 0.999:
            it["opacity"] = num(alpha)
        items.append(it)

    for info in page.get_image_info(xrefs=True):
        b = pymupdf.Rect(info["bbox"])
        if b.intersects(clip):
            items.append({
                "kind": "image",
                "x": num(b.x0 - ox), "y": num(b.y0 - oy), "width": num(b.width), "height": num(b.height),
                "note": "embedded raster image in the source PDF; not traced",
            })

    for block in page.get_text("rawdict", clip=clip)["blocks"]:
        for line in block.get("lines", []):
            spans = []
            for sp in line["spans"]:
                chars = sp["chars"]
                spans.append({**sp, "text": "".join(c["c"] for c in chars)})
            spans = [sp for sp in spans if sp["text"].strip()]
            if not spans:
                continue
            lb = pymupdf.Rect(line["bbox"])
            if not clip.contains(pymupdf.Rect(lb.x0 + 0.5, lb.y0 + 0.5, lb.x1 - 0.5, lb.y1 - 0.5)):
                continue
            if any(r.contains(lb.tl + (1, 1)) for r in drop):
                continue
            dx, dy = line["dir"]
            angle = 0 if abs(dy) < 1e-3 else num(math.degrees(math.atan2(dy, dx)))
            first = spans[0]
            ink = [c for sp in spans for c in sp["chars"] if c["c"].strip()]
            x, y = ink[0]["origin"]
            if angle == 0:
                width = ink[-1]["bbox"][2] - ink[0]["bbox"][0]
            else:
                width = abs(ink[-1]["bbox"][1] - ink[0]["bbox"][3])
            spans[0] = {**first, "text": first["text"].lstrip()}
            first = spans[0]
            runs = []
            for sp in spans:
                run = {"text": sp["text"].replace("\t", " ")}
                if is_bold(sp) != is_bold(first):
                    run["weight"] = 700 if is_bold(sp) else 400
                if spancolor(sp) != spancolor(first):
                    run["fill"] = spancolor(sp)
                if is_italic(sp) and not is_italic(first):
                    run["italic"] = True
                runs.append(run)
            runs[-1]["text"] = runs[-1]["text"].rstrip()
            text = "".join(r["text"] for r in runs)
            it = {
                "kind": "text",
                "x": num(x - ox), "y": num(y - oy),
                "size": num(first["size"]),
                "weight": 700 if is_bold(first) else 400,
                "fill": spancolor(first),
                "text": text,
                "width": num(width),
            }
            if is_italic(first):
                it["italic"] = True
            if angle:
                it["rotate"] = angle
            if len(runs) > 1 and any(len(r) > 1 for r in runs):
                it["runs"] = runs
            items.append(it)

    return {
        "clips": clips,
        "canvas": {"width": num(clip.width), "height": num(clip.height)},
        "items": items,
    }


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 2
    specs = json.loads(Path(argv[0]).read_text())
    spec = specs["figures"][argv[1]]
    spec = {**specs["defaults"], **spec}
    out = ROOT / spec["out"]
    if out.exists() and "--force" not in argv:
        print(f"{out} exists and is curated; pass --force to overwrite it", file=sys.stderr)
        return 1
    drawn = extract(spec)
    data = {
        "$schema": "dth-pc-as-drawn-figure/v1",
        "id": spec["id"],
        "figure": argv[1],
        "title": spec["title"],
        "source": {
            "publication": spec["publication"],
            "pdf": spec["pdf"],
            "page": spec["page"],
            "section": spec.get("section"),
            "crop": spec["crop"],
            "clip": spec["clip"],
            "units": "pt",
            "method": "vector transcription of the publication's own drawing (PyMuPDF), curated by hand",
        },
        "canvas": drawn["canvas"],
        "fonts": spec.get("fonts"),
        "clips": drawn["clips"],
        "items": drawn["items"],
    }
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n")
    print(f"wrote {out.relative_to(ROOT)}: {len(drawn['items'])} items, {len(drawn['clips'])} clips")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
