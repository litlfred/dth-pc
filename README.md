# dth-pc

The WHO **Digital transformation handbook for health product catalogue** (2025, ISBN 9789240116191), as an L2 Digital Transformation Handbook on [smart-ra](https://github.com/litlfred/smart-ra) and [dth-sc](https://github.com/litlfred/dth-sc): narrative, structured step/information-model tables, figures, personas, BPMN 2.0 processes, and DMN 1.3 decision tables validated against the glossaries and linked to the DPI-H ArchiMate model.

- Working document: `folio/dth-pc/` (126 blocks: 47 prose blocks, 33 structured tables including 18 chapter step tables and HL7 FHIR R5 information-model mappings, 15 vector figures, 19 role personas, 10 BPMN 2.0 processes with rendered SVGs, and 2 DMN 1.3 decision tables), seeded from the L1 entry [`who-iris/library/9789240116191-eng`](https://github.com/litlfred/who-iris/tree/main/library/9789240116191-eng).
- Product catalogue glossary: `glossary/dth-pc.glossary.json` (16 SKOS terms linked to `dth-sc` and `dpi-h-ra`).
- L1 normative marker coverage: [`docs/l1-coverage.md`](docs/l1-coverage.md) and [`folio/dth-pc/l1-coverage.json`](folio/dth-pc/l1-coverage.json) (**100% accounted-for**: 47 normative sentences / 57 marker hits across 34 L1 sections — 34 captured, 13 signed-off exclusions, 0 unaccounted).
- Plan: [`docs/workplan.md`](docs/workplan.md) (tracked in #2).
- Agent guidance: [`AGENTS.md`](AGENTS.md).

dth-pc depends on dth-sc (supply chain terms, the DHSC architecture view). [smart-pcmt](https://github.com/litlfred/smart-pcmt) is downstream of dth-pc.

This is a fork of WorldHealthOrganization/dth-pc. Work happens here; nothing is pushed upstream without the owner's say-so.

Content © World Health Organization 2025, CC BY-NC-SA 3.0 IGO.
