#!/usr/bin/env python3
"""Seed the working document folio from the handbook's L1 entry.

Usage:
    python3 -I scripts/folio/seed_from_l1.py [<l1-entry-dir>] [--force]

The L1 entry is who-iris/library/9789240116191-eng (mounted at who-iris/).
It is split by PDF page and has no outline (toc_source: none), so this
script carries the handbook's own outline, read from its contents page
(PDF page 4), and puts each page into the section that starts on or before
it. Printed page N is PDF page N + 9 from the Introduction on. Sections
follow the handbook's numbered steps.

Writes folio/dth-pc/: the document manifest, one directory per chapter,
and one prose block (a .ts manifest and a .md body) per PDF page. Each block
records the L1 page it came from in `meta.source`.

This is a ONE-TIME SEED. After it, the folio is the working document and is
edited by hand. The script refuses to overwrite folio/dth-pc/ unless --force
is given, and --force discards hand edits.

Adapted from dth-sc's seed script (litlfred/dth-sc scripts/folio/), which
dth-pc depends on. What it does not do yet (docs/workplan.md, PC-1 and
PC-5): the step tables (INPUTS / STEPS / RESOURCES / OUTPUTS / RISKS /
MITIGATION) arrive as flattened text and are rebuilt by hand as `table`
blocks; figures are not yet placed; no block links to the glossary or to
smart-ra ArchiMate elements yet.
"""

import json
import re
import shutil
import sys
from pathlib import Path

DOC = "dth-pc"
FOLIO = Path("folio") / DOC
L1_ID = "9789240116191-eng"
DEFAULT_L1 = Path("who-iris/library") / L1_ID
TITLE = "Digital Transformation Handbook for Health Product Catalogue"
ISBN = "9789240116191"
YEAR = "2025"

# The outline, from the contents page (PDF 4) and the step headings. Each
# chapter lists its sections as (title, first PDF page). A page belongs to
# the last section that starts on or before it. Pages 1-4 (cover, blank,
# imprint, contents) are left out.
OUTLINE = [
    ("front-matter", "Front matter", None, [
        ("Acknowledgements", 5),
        ("Abbreviations", 6),
        ("Glossary", 8),
    ]),
    ("introduction", "Introduction", None, [
        ("What is Product Master Data?", 10),
        ("Why is Product Master Data important?", 11),
        ("Digital implementation investment guide (DIIG)", 12),
        ("SMART Guidelines", 14),
        ("Digital health supply chain (DHSC) architectural components", 16),
        ("How to use this handbook; how it was developed", 17),
        ("Target users; when to use this handbook", 18),
    ]),
    ("ch01-regulatory-policies", "Chapter 1. Establishing regulatory policies to promote product master data standardization", 1, [
        ("Step 1. Identify necessary regulatory policies and legislations", 20),
        ("Step 2. Develop the identified regulatory policies and legislations; Step 3. Coordinate reviews and approvals", 22),
        ("Step 4. Publish and enforce the approved regulatory policies", 23),
    ]),
    ("ch02-data-management-governance", "Chapter 2. Instituting data management and governance policies", 2, [
        ("Step 1. Define product master data management procedures", 24),
        ("Step 2. Define coding scheme, data definitions and structures", 27),
        ("Step 3. Define data use policies and data sharing mechanisms", 31),
        ("Step 4. Institutionalise product master data governance policies and procedures", 32),
        ("Step 5. Define short- and long-term strategies to source standardized product master data", 33),
    ]),
    ("ch03-technology", "Chapter 3. Deploying appropriate technology to manage product master data", 3, [
        ("Step 1. Define system requirements for the NPC tool", 34),
        ("Step 2. Identify technology options; Step 3. Prepare an implementation plan", 36),
        ("Step 4. Design, develop and deploy the NPC tool", 37),
    ]),
    ("ch04-managing-change", "Chapter 4. Managing change to institutionalize standardized product master data", 4, [
        ("Step 1. Develop a change management plan to institutionalise use of NPC", 38),
        ("Step 2. Define SOPs to collect, organize and manage product master data", 40),
    ]),
    ("ch05-capacity", "Chapter 5. Building capacity to sustainably manage NPC", 5, [
        ("Step 1. Identify human resource capacity needs to support NPC", 42),
        ("Step 2. Onboard and assign individuals; Step 3. Knowledge management plan", 44),
    ]),
    ("ch06-who-hosted-pcmt", "Chapter 6. Leveraging the WHO-hosted PCMT", 6, [
        ("Leveraging the WHO-hosted PCMT", 45),
        ("Catalogue setup and access", 47),
    ]),
    ("ch07-global-good", "Chapter 7. Sharing product master data as a global good", 7, [
        ("Sharing product master data as a global good", 48),
    ]),
    ("ch08-country-experiences", "Chapter 8. Sharing implementation experiences", 8, [
        ("Rwanda", 51),
        ("Zambia", 53),
        ("Nigeria", 54),
    ]),
    ("references", "References", None, [
        ("References", 55),
    ]),
    ("annexes", "Annexes", None, [
        ("Annex 1. Principles for Digital Development", 56),
        ("Annex 2. Additional roles for NPC implementation", 57),
    ]),
]
LAST_PAGE = 61  # 62 is the back cover

# Chapter divider pages: title only, no content. Skipped.
DIVIDERS = {20, 24, 34, 38, 42, 45, 48, 51}

# Chapter 8 is country reporting: kept as cited source text, never formalized.
SOURCE_ONLY = {"ch08-country-experiences"}

# Running headers repeat a chapter title (p.50 carries Chapter 1's by mistake),
# with the page number on its own line.
HEADERS = {re.sub(r"\W+", " ", t.split(". ", 1)[-1]).strip().lower()
           for _, t, _, _ in OUTLINE} | {
    "introduction", "annexes", "annex 1", "annex 2", "references",
    "acknowledgements", "abbreviations", "glossary",
    "leveraging the who hosted pcmt", "sharing implementation experiences",
    "managing change to institutionalize standardized product master data"}
NAV_TABS = set()


class _Footer:
    @staticmethod
    def match(t):
        if re.fullmatch(r"(?:[ivx]+|\d{1,3})", t):
            return True
        k = re.sub(r"\W+", " ", re.sub(r"^\s*\d{1,3}\s+|\s+\d{1,3}\s*$", "", t)).strip().lower()
        return k in HEADERS


FOOTER = _Footer()


def slug(s, n=40):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower().replace("'", "")).strip("-")
    return s[:n].rstrip("-")


def page_text(l1, n):
    """The body text of PDF page n, without front matter, tabs or footer."""
    p = l1 / "sections" / f"page-{n:03d}.md"
    raw = p.read_text(encoding="utf-8")
    parts = raw.split("---\n", 2)
    body = parts[2] if len(parts) == 3 else raw
    if "_(no text on this page)_" in body:
        return ""
    lines = []
    for line in body.splitlines():
        t = re.sub(r"[\x00-\x08\x0b-\x1f]", "", line).strip()  # the PDF leaves backspaces after page numbers
        if not t or t in NAV_TABS or FOOTER.match(t):
            continue
        lines.append(t.replace("\t", " "))
    text = " ".join(lines)
    text = re.sub(r"\s+", " ", text)
    # Bullet markers the PDF uses: • (list), - (sub-list after a bullet).
    text = re.sub(r"\s*•\s*", "\n- ", text)
    return text.strip() + "\n"


def ts_str(s):
    return json.dumps(s, ensure_ascii=False)


def main(argv):
    force = "--force" in argv
    args = [a for a in argv if not a.startswith("--")]
    l1 = Path(args[0]) if args else DEFAULT_L1
    if not (l1 / "sections").is_dir():
        sys.exit(f"no L1 entry at {l1} (mount who-iris first)")
    if FOLIO.exists() and not force:
        sys.exit(f"{FOLIO} exists; refusing to overwrite hand edits (use --force)")
    for ch_dir, _, _, _ in OUTLINE:
        if (FOLIO / ch_dir).exists():
            shutil.rmtree(FOLIO / ch_dir)
    FOLIO.mkdir(parents=True, exist_ok=True)

    starts = [(first, ci, si) for ci, (_, _, _, secs) in enumerate(OUTLINE)
              for si, (_, first) in enumerate(secs)]
    starts.sort()
    pages = {}
    for k, (first, ci, si) in enumerate(starts):
        end = starts[k + 1][0] - 1 if k + 1 < len(starts) else LAST_PAGE
        for n in range(first, end + 1):
            pages.setdefault((ci, si), []).append(n)

    chapter_refs = []
    for ci, (ch_dir, ch_title, number, secs) in enumerate(OUTLINE):
        d = FOLIO / ch_dir
        d.mkdir(parents=True)
        sections_ts = []
        for si, (sec_title, _) in enumerate(secs):
            blocks = []
            for n in pages.get((ci, si), []):
                text = "" if n in DIVIDERS else page_text(l1, n)
                if not text:
                    continue
                root = f"p-{ch_dir.split('-')[0]}-page-{n:03d}"
                meta = {
                    "title": sec_title,
                    "source": {
                        "library": L1_ID,
                        "section": f"page-{n:03d}",
                        "file": f"who-iris/library/{L1_ID}/sections/page-{n:03d}.md",
                        "pdfPage": n,
                        "method": "l1-outline-seed",
                    },
                }
                if ch_dir in SOURCE_ONLY:
                    meta["sourceOnly"] = "country reporting: cited source text, not formal content"
                (d / f"{root}.md").write_text(text, encoding="utf-8")
                (d / f"{root}.ts").write_text(
                    'import { prose } from "../../schema/builders";\n\n'
                    "export default prose({\n"
                    f"  label: {ts_str('prose:' + root[2:])},\n"
                    "  uses: [],\n"
                    f"  meta: {json.dumps(meta, ensure_ascii=False)},\n"
                    "});\n", encoding="utf-8")
                blocks.append(root)
            if not blocks:
                continue
            sections_ts.append(
                "    section({\n"
                f"      title: {ts_str(sec_title)},\n"
                f"      label: {ts_str('sec:' + ch_dir.split('-')[0] + '-' + slug(sec_title))},\n"
                f"      blocks: [{', '.join(ts_str(b) for b in blocks)}],\n"
                "    }),")
        num = f"  number: {number},\n" if number else ""
        (d / f"{ch_dir}.ts").write_text(
            'import { chapter, section } from "../../schema/builders";\n\n'
            "export default chapter({\n"
            f"{num}"
            f"  title: {ts_str(ch_title)},\n"
            f"  label: {ts_str('chap:' + ch_dir)},\n"
            "  sections: [\n" + "\n".join(sections_ts) + "\n  ],\n"
            "});\n", encoding="utf-8")
        chapter_refs.append(f'    chapterRef({{ dir: "{ch_dir}" }}),')

    (FOLIO / f"{DOC}.ts").write_text(
        'import { paper, chapterRef } from "../schema/builders";\n\n'
        "/**\n"
        f" * {TITLE}\n"
        " *\n"
        " * The document manifest. `chapters` is an ORDERED list: its order is the\n"
        " * reading order, and it is the only place that order is recorded.\n"
        " *\n"
        f" * Seeded from the L1 entry who-iris/library/{L1_ID} by\n"
        " * scripts/folio/seed_from_l1.py; edited by hand from then on.\n"
        " */\n"
        "export default paper({\n"
        f"  title: {ts_str(TITLE)},\n"
        '  authors: ["World Health Organization"],\n'
        f'  date: "{YEAR}",\n'
        "  meta: {\n"
        '    documentKind: "smart-base:dth",\n'
        '    level: "L1",\n'
        '    targetLevel: "L2",\n'
        f'    isbn: "{ISBN}",\n'
        f'    source: {{ library: "{L1_ID}", repository: "litlfred/who-iris" }},\n'
        '    licence: "CC BY-NC-SA 3.0 IGO",\n'
        '    status: "seeded from L1; not yet linked to the glossary or ArchiMate",\n'
        "  },\n"
        "  chapters: [\n" + "\n".join(chapter_refs) + "\n  ],\n"
        "});\n", encoding="utf-8")
    print(f"wrote {FOLIO}: {len(chapter_refs)} chapters, "
          f"{sum(1 for _ in FOLIO.rglob('p-*.md'))} blocks")


if __name__ == "__main__":
    main(sys.argv[1:])
