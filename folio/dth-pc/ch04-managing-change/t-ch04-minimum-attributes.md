*Fig. 13. Minimum Product Master Data attributes and transitional Country Trade Item Identifier to GTIN examples*

### Generic Product minimum attributes

| National Product Code | Description | Dosage Form | Route of Administration |
| --- | --- | --- | --- |
| `NPC01101001` | Lamivudine 50 Mg tablet | TA | Oral |

### Phase 1: Trade Item using Country Trade Item Identifier (where GTIN is not yet available)

| GTIN | Country Trade Item Identifier | Child GTIN | Child SKU | Child Quantity | Quantity of Eaches | Shelf Life | Manufacturer | Country of Origin |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `58904093825793` | `58904093825793` | `58904093825700` | `58904093825700` | 100 | 3000 | 670 | MFR001 | IN |
| `58904093825700` | `58904093825700` | `58904093825600` | `58904093825600` | 10 | 3000 | 670 | MFR001 | IN |

### Phase 2: Trade Item transitioned to GTIN alongside Country Trade Item Identifier

| GTIN | Country Trade Item Identifier | Child GTIN | Child SKU | Child Quantity | Quantity of Eaches | Shelf Life | Manufacturer | Country of Origin |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | `P006008` | — | `P006009` | 120 | 7200 | 1095 | MFR002 | KE |
| — | `P006009` | — | — | 30 | 7200 | 1095 | MFR002 | KE |
