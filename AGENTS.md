# AGENTS.md — Digital Transformation Handbook for Health Product Catalogue

This is a **folio**: the content repository. The authoring platform —
skills, schemas, MCP tools, the publication pipeline — is
folio-assistant, **remote-mounted** at the repository root from the SHAs pinned in
`index.lock.json` (`who-iris/`, `smart-base/`, `folio-assistant-core/`, `cat-harness/`,
`cat-harness-tools/`, `fhir-harness/`, `bootstrap/`, `bootstrap-tools/`; all
gitignored). The session-start hook mounts them; by hand:
`bun run cat-harness-tools/scripts/remote-mount.ts`. The pins are dth-sc's (from dth-hrh), so
the handbooks run on the same layers.

This file is the **agent-generic** source of truth, read natively by Claude
Code, Gemini CLI, Antigravity, Cursor and Copilot. `CLAUDE.md` and
`GEMINI.md` are thin stubs pointing here.

> **Content lives here; formalism lives in the platform.** If you are about to
> add a schema, a validator, a QA criterion or a skill, it belongs in
> folio-assistant, not in this repo. If you are about to add a chapter, a
> recommendation or a table, it belongs here.

## This document

The **WHO Digital transformation handbook for health product catalogue**
(2025, ISBN 9789240116191, CC BY-NC-SA 3.0 IGO), on its way from an L1
document (smart-base document kind `dth`) to an **L2 DTH on smart-ra and
dth-sc**: its narrative uses and is validated against the glossaries, and
its narrative links to the ArchiMate model in litlfred/smart-ra. The plan is
[`docs/workplan.md`](docs/workplan.md), tracked in litlfred/dth-pc#2.

**This repository depends on dth-sc** (owner, 2026-10-31): supply chain
terms (traceability, the foundational components, order and warehouse
management) and the DHSC architecture view live there; link to them, never
redefine them. **smart-pcmt is downstream of this repository**: its logical
models and SKOS terms align to the concepts defined here.

| what | where | how it is made |
|---|---|---|
| the working document | `folio/dth-pc/` | seeded once from the L1 entry `who-iris/library/9789240116191-eng` by `scripts/folio/seed_from_l1.py`, one prose block per PDF page, by the handbook's contents-page outline and step headings; **edited by hand from then on**: never re-run it without `--force`, which discards edits |
| the product catalogue glossary | `glossary/dth-pc.glossary.json` (SKOS, `folio-glossary/v1`) | by hand; each term quotes the handbook with its L1 page |
| the source, frozen | `who-iris/library/9789240116191-eng` (mounted) | never edited here |
| the plan | `docs/workplan.md` | copy of the approved workplan |

**KG concepts are Capitalized** (owner, 2026-10-31): Product Master Data,
Generic Product, Trade Item, Regulated Trade Item, National Product
Catalogue. A plain-English use stays lower case.

## What goes where (the split rule)

| goes in | what |
|---|---|
| **smart-ra** | the shared glossary (general digital terms: registry, interoperability, open standards, …); every ArchiMate element and view, including the National Product Catalogue view |
| **dth-sc** | supply chain terms and the DHSC architecture framework view, which the National Product Catalogue view refines |
| **here** | the narrative folio; the product catalogue terms (`glossary/`); the information model of Fig 8–9 (classification, Generic Product, Trade Item, Regulated Trade Item) as table and diagram blocks; the links from blocks to smart-ra and dth-sc concepts and ArchiMate elements |
| **smart-pcmt** (downstream) | the PCMT tool's own logical models and terms, aligned to the concepts here |
| **the platform** | the L2 DTH document kind, the cross-instance glossary validator, the ArchiMate-link QA check |

**Where this handbook disagrees with smart-ra** (a definition, an element),
do not change either side: raise an issue on litlfred/smart-ra and record
both as alternatives with sources. None is chosen. This handbook's are in
litlfred/smart-ra#142.

**No empirical claims in formal content.** Country figures (Chapter 8:
product counts, GTIN counts, dates), WHODrug coverage, working-group sizes
and the "available in 2026" date stay as cited source text. They never
become glossary definitions, model relationships or goals. Chapter 8 blocks
carry `meta.sourceOnly`.

**Never push to or open PRs on WorldHealthOrganization/dth-pc.** This
repository is its fork; work happens here.

## Content type: `document`

A **document** folio: structured prose — policy guidance, a standard, a
report, a handbook. No Lean formalization, and no TeX installation required to
publish.

**Block kinds you may use:** `prose`, `example`, `remark`, `algorithm`,
`simulator`, `equation`, `diagram`, `table`, `figure`.

**Kinds you may NOT use:** `definition`, `theorem`, `lemma`,
`proposition`, `corollary`, `conjecture`, `proof`. Those are the paper
profile — their assertion is a formal mathematical claim backed by a `.lean`
sibling, and this folio has no toolchain to check one. `content_validate`
enforces this on every run.

Reaching for `theorem` to carry a recommendation is the common mistake. Load
the `normative-statements` skill instead.

## Layout

```
folio/dth-pc/          the document
  dth-pc.ts             its manifest — chapters, in reading order
  <chapter>/<chapter>.ts   a chapter manifest — sections, in reading order
  <chapter>/<root>.ts      a block manifest
  <chapter>/<root>.md      that block's prose
folio/schema/            re-export shim for the platform's builders
test/results/block-qa/     QA verdicts, one per block, mirroring folio/ (machine-written working copy — published to qa-reports)
test/attestations/        reviewer judgements and baseline attestations (committed on main)
uploads/                   source PDFs, for offline citation verification
./              the platform
beans/                    the work plan (mounted from its declared branch)
todos/                    people's outstanding items (mounted likewise)
```

## Commands

```sh
bun run ./cat-harness-tools/src/index.ts --stdio --repo .   # the MCP server
bun run ./cat-harness-tools/src/index.ts --check-deps       # what's installed
bun run ./cat-harness-tools/content/pipeline/qa-sweep.ts folio  # QA every block
```

## QA — every block is checked from the first commit

`qa-sweep` runs every criterion a script can check against each block, and
writes one verdict file per block under `test/results/block-qa/`. Derived QA
verdicts live on the orphan `qa-reports` branch (published by CI), rather than
being committed to `main`. Judgements stay on `main` in `test/attestations/`.
The working copy under `test/results/` is machine-written.

`.github/workflows/qa-sweep.yml`
runs the full sweep in CI, and `qa-sweep-nightly.yml` refreshes stale verdicts;
both are dispatch-only until you enable their triggers. Criteria that need an
agent's judgement (voice, exposition, adversarial review) are not run by the
sweep; they stay unaudited until an agent records them.

## Work plan — use `beans`

`beans/` and `todos/` are this folio's STATE. Where each is kept is declared
in `dth-pc.json` — by default on its own branch,
`cat/dth-pc/beans` and `cat/dth-pc/todos`, mounted at those paths by the
session-start hook (`state:mount`) and never committed to `main`. Either way
the plan survives a fresh container and a sibling session sees it. Claim before
you work; never resolve a sibling's bean.

```sh
./cat-harness-tools/scripts/install-beans.sh
beans list
beans create "<title>"
beans <id> --status in-progress
```

**Check before you create** — `beans create` is not idempotent and dedupes on
nothing, so re-entering a step duplicates the plan rather than no-op'ing.

## The skills are in the platform, not here

Ask for them by name and the agent loads them over MCP (`skill_fetch`):

| Package | What |
|---|---|
| `folio-core` | content-agnostic: bean coordination, editorial review, QA |
| `folio-document-adapter` | `document-authoring`, `document-structure`, `normative-statements`, `document-publishing` |

Do not copy a skill body into this repo. It will drift, and the platform's copy
is the one every other folio is reading.
