**Process ID:** `PC-BP-04` | **BPMN 2.0 Diagram:** `processes/PC-BP-04.bpmn` | **Source:** `who-iris/library/9789240116191-eng` (page-039, page-040)

![PC-BP-04: Assign a Country Trade Item Identifier and move to GTIN](media/bp-pc-bp-04.svg)

**Lanes (Roles):**

- **Catalogue Manager (PC-R-05)** (`PC-R-05`): Manages product records and Country Trade Item Identifier attribute in NPC (p.39-40, 43)
- **Manufacturer / Distributor (PC-R-07)** (`PC-R-07`): Subscribes for and assigns globally unique trade item numbers (GTINs) to Trade Items (p.39-40)

**Process Steps:**

1. **Register Trade Item and evaluate GTIN availability (PC-DT-01)** — Ch 4 (p.39, Fig. 13): Evaluate decision table PC-DT-01 — if GTIN is available, default Country Trade Item Identifier to the GTIN; if absent, generate and maintain a local identifier.
2. **Subscribe for and issue GTIN for Trade Item** — Ch 4 (p.39-40, Fig. 13): Manufacturer subscribes for a GS1 GTIN and provides the assigned GTIN for the Trade Item (and child packaging levels).
3. **Replace local identifier with GTIN in Country Trade Item Identifier (PC-DT-01)** — Ch 4 (p.39-40, Fig. 13): Replace the temporary local identifier in Country Trade Item Identifier with the newly assigned GTIN while preserving cross-reference mapping for historical transactions.

**Inputs and Outputs (Data Objects):**

- Trade Item record (with or without GTIN, p.39-40)
- Country Trade Item Identifier attribute (Fig. 13, p.40)
