*Fig. 12. Mapping across product packaging hierarchy using HL7 FHIR InventoryItem resource*

| FHIR `InventoryItem` record | Packaging level | `identifier` | Elements & `quantity` | Associated target |
| --- | --- | --- | --- | --- |
| **GENERIC PRODUCT** | Generic product (unit of use) | `MR001` | `description`, `name`, `characteristic`, `association` | Associates to **TRADE ITEM (MFR A)** (`17801415202675`) and **TRADE ITEM (MFR B) Tertiary (Pallet)** (`18901415202906`) |
| **TRADE ITEM (MFR A)** | Trade item | `17801415202675` | `description`, `name`, `characteristic`, `association` | Linked from **GENERIC PRODUCT** (`MR001`) |
| **TRADE ITEM (MFR B)** | Tertiary (Pallet) | `18901415202906` | `description`, `name`, `characteristic`, `association` | Associates to **TRADE ITEM (MFR B) Tertiary (Case)** (`08901415202908`) |
| **TRADE ITEM (MFR B)** | Tertiary (Case) | `08901415202908` | `description`, `name`, `characteristic`, `association`, `quantity 100` | Associates to **TRADE ITEM (MFR B) Secondary (Inner pack)** (`08901415202910`) |
| **TRADE ITEM (MFR B)** | Secondary (Inner pack) | `08901415202910` | `description`, `name`, `characteristic`, `association`, `quantity 50` | Innermost packaged trade item in MFR B hierarchy |
