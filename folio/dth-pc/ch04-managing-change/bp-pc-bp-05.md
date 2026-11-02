**Process ID:** `PC-BP-05` | **BPMN 2.0 Diagram:** `processes/PC-BP-05.bpmn` | **Source:** `who-iris/library/9789240116191-eng` (page-031, page-039)

![PC-BP-05: Distribute Product Master Data to downstream systems on add or update](media/bp-pc-bp-05.svg)

**Lanes (Roles):**

- **Catalogue Manager / NPC (PC-R-05)** (`PC-R-05`): Publishes Product Master Data additions and updates from the NPC (p.39)
- **Consuming Supply Chain Systems (eLMIS, WMS, Procurement, OMS)** (`consuming-systems`): Downstream health and supply chain information systems receiving standardized Product Master Data via DPI-F Information Mediator (p.16, 31, 39)

**Process Steps:**

1. **Trigger Product Master Data exchange event on add or update** — Ch 4 Step 1 (p.39): Emit Product Master Data exchange event from NPC when a product record is added or updated.
2. **Route standardized Product Master Data through Information Mediator** — Intro (p.16), Ch 2 Step 3 (p.31) & Ch 4 Step 1 (p.39): Distribute standardized Product Master Data attributes according to data sharing agreements and security protocols.
3. **Receive, store, and use standardized Product Master Data in transactions** — Ch 4 Step 1 (p.39): Consuming systems (eLMIS, WMS, procurement, OMS, dispensing) ingest standardized Product Master Data and reference uniform identifiers across forecasting, procurement, inventory, shipping, dispensing, and traceability.

**Inputs and Outputs (Data Objects):**

- Standardized Product Master Data update payload (p.39)
- Data sharing policies and exchange protocols (p.31, 39)
