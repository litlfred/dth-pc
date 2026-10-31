**Decision ID:** `PC-DT-01` | **DMN 1.3 File:** `processes/decisions/PC-DT-01.dmn` | **Source:** `who-iris/library/9789240116191-eng` (page-039, page-040, Fig. 13)

**Used by process:** `PC-BP-04` (Assign a Country Trade Item Identifier and move to GTIN)

| Rule | `gtinStatus` | `hasExistingLocalId` | `identifierKind` | `transitionAction` |
|---|---|---|---|---|
| 1 | `"assigned"` | `false` | `"GTIN"` | `"Default Country Trade Item Identifier to the assigned GTIN"` |
| 2 | `"assigned"` | `true` | `"GTIN"` | `"Replace local identifier in Country Trade Item Identifier with the assigned GTIN and retain local-to-GTIN cross-reference"` |
| 3 | `"not assigned"` | `-` | `"Local identifier"` | `"Generate and maintain a local identifier in Country Trade Item Identifier until a GTIN is assigned"` |
| 4 | `"unknown"` | `-` | `"unknown"` | `"Not determined: GTIN status not known"` |
