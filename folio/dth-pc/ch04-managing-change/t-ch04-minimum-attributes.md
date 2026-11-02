*Fig. 13. Minimum Product Master Data attributes and transitional Country Trade Item Identifier to GTIN examples*

| National Product Code | Description | Dosage Form | Route of Administration |
|---|---|---|---|
| [NPC01101001](https://github.com/litlfred/smart-pcmt/blob/d3608b05ee0f74d4a23d73ee339b31d6158d89b5/input/fsh/examples/dth-pc-npc-lamivudine.fsh) | Lamivudine 50 Mg tablet | TA | Oral |

| GTIN | Country Trade Item Identifier | Manufacturer | Country of Origin | Child GTIN | Child SKU | Child Quantity | Quantity of Eaches | Shelf Life |
|---|---|---|---|---|---|---|---|---|
| 58904093825793 | 58904093825793 | MFR001 | IN | 58904093825700 | 58904093825700 | 100 | 3000 | 670 |
| 58904093825700 | 58904093825700 | MFR001 | IN | 58904093825600 |  | 10 | 3000 | 670 |
|  | P006008 | MFR002 | KE |  | P006009 | 120 | 7200 | 1095 |
|  | P006009 | MFR002 | KE |  |  | 30 | 7200 | 1095 |

*Generated from the FHIR example Product instances in [smart-pcmt](https://github.com/litlfred/smart-pcmt/blob/d3608b05ee0f74d4a23d73ee339b31d6158d89b5/input/fsh/examples/dth-pc-npc-lamivudine.fsh) by [`dth_pc_figures.py`](https://github.com/litlfred/smart-pcmt/blob/d3608b05ee0f74d4a23d73ee339b31d6158d89b5/scripts/dth_pc_figures.py). Values are as printed in the handbook (PDF page 40), including where they do not multiply out. The handbook also lists 58904093825600 as a Child SKU; the instance carries it as a GTIN only.*
