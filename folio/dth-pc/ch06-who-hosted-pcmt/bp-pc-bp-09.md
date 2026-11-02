**Process ID:** `PC-BP-09` | **BPMN 2.0 Diagram:** `processes/PC-BP-09.bpmn` | **Source:** `who-iris/library/9789240116191-eng` (page-046, page-047)

![PC-BP-09: Derive a country catalogue from the Global Catalogue (associate or copy a product)](media/bp-pc-bp-09.svg)

**Lanes (Roles):**

- **WHO User Group (PC-R-09: WHOGroup)** (`PC-R-09`): Manages, edits, and owns product records in the Global Catalogue (Catalogues -> WHO, p.46-47)
- **Country User Group (PC-R-09: Country Group)** (`PC-R-09`): Views Global Catalogue and edits/owns product records in the Country Catalogue (Catalogues -> Country, p.46-47)

**Process Steps:**

1. **Maintain common product information in the Global Catalogue (PC-DT-02)** — Ch 6 (p.46-47, Fig. 14): WHOGroup publishes common product attributes in the Global Catalogue (global identifier, Unit of Use, pharmaceutical information, Trade Item information, manufacturer, country of origin, shelf life) per PC-DT-02.
2. **Associate or copy product record from Global Catalogue into Country Catalogue** — Ch 6 (p.46-47, Fig. 14): Country user selects designated Country Catalogue category and either associates a country product with a Global Catalogue product or copies Trade Item data from the Global Catalogue via manual or automated copy rules.
3. **Add country-specific product attributes and approve record (PC-DT-02)** — Ch 6 (p.46-47, Fig. 14): Country user populates country-specific attributes (country identifiers, national registration number per PC-DT-02) and approves the record in the Country Catalogue.

**Inputs and Outputs (Data Objects):**

- Global Catalogue product record (common product and Trade Item information, Fig. 14, p.46)
- Country Catalogue product record (linked/derived common attributes + country identifiers and registration number, Fig. 14, p.46)
