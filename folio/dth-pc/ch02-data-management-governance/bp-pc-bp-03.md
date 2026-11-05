**Process ID:** `PC-BP-03` | **BPMN 2.0 Diagram:** `processes/PC-BP-03.bpmn` | **Source:** `who-iris/library/9789240116191-eng` (page-026, page-040)

![PC-BP-03: Add or update a product record, with approval](media/bp-pc-bp-03.svg)

**Lanes (Roles):**

- **Data Steward (PC-R-03)** (`PC-R-03`): Oversees data entry, validation, and correction processes (p.26, 40)
- **Data Owner (PC-R-01)** (`PC-R-01`): Approves changes to Product Master Data and ensures compliance (p.26, 40)
- **Data Custodian (PC-R-02)** (`PC-R-02`): Implements rules and standards, ensuring data is stored, protected, and operationally available (p.26)

**Process Steps:**

1. **Submit and validate product record addition or update** — Ch 2 (p.26) & Ch 4 Step 2 (p.40): Data Steward collects, validates, and submits new or updated Product Master Data record according to NPC SOPs.
2. **Review and approve Product Master Data change** — Ch 2 (p.26) & Ch 4 Step 2 (p.40): Data Owner reviews and approves changes to the Product Master Data through the NPC approval workflow (no conditional rules stated in handbook; single approval task per workplan §2e).
3. **Apply approved change and publish in National Product Catalogue** — Ch 2 (p.26): Data Custodian applies approved record update in the NPC with access control, audit, and backup protections.

**Inputs and Outputs (Data Objects):**

- Candidate Product Master Data addition or update (Input, p.26, 40)
- Approved Product Master Data record in NPC (Output, p.26, 40)
