*Fig. 9. Relationship between Generic Product, Trade Item and Regulated Trade Item (minimum attributes, cardinalities and HL7 FHIR R5 mappings)*

The attributes and cardinalities of the three classes are drawn in Fig. 9 from the smart-pcmt logical models; this table keeps only the HL7 FHIR R5 mapping.

### HL7 FHIR R5 resource and element mapping (Fig. 9)

| Product Master Data Entity | Attribute | Cardinality | HL7 FHIR R5 Resource & Element Mapping |
| --- | --- | --- | --- |
| **Generic Product** (`1` → `0..*` Trade Item) | `identifier` | `0..*` | `MedicationKnowledge.identifier` / `InventoryItem.identifier` (generic product / National Product Code, e.g. `MR001`) |
| **Generic Product** | `status` | `1..1` | `MedicationKnowledge.status` / `InventoryItem.status` |
| **Generic Product** | `name` (`nameType` `1..1`, `nameValue` `1..1`) | `1..*` | `MedicationKnowledge.name` / `InventoryItem.name` (`nameType`, `name`) |
| **Generic Product** | `description` | `0..1` | `InventoryItem.description.description` |
| **Generic Product** | `classification` | `0..*` | `MedicationKnowledge.medicineClassification` / `InventoryItem.category` (ATC/DDD, ICD-11, ICHI, UNSPSC, GMDN) |
| **Generic Product** | `unitOfUse` | `1..1` | `InventoryItem.baseUnit` / `MedicationKnowledge.definitional.dosage` (Unit of Use) |
| **Generic Product** | `dosageForm` | `0..1` | `MedicationKnowledge.definitional.doseForm` |
| **Generic Product** | `strength` | `0..1` | `MedicationKnowledge.definitional.ingredient.strength[x]` |
| **Generic Product** | `routeOfAdministration` | `0..*` | `MedicationKnowledge.definitional.intendedRoute` |
| **Generic Product** | `manufacturer` | `0..1` | `MedicationKnowledge.sponsor` (`Reference(Organization)`) |
| **Generic Product** | `countryOfOrigin` | `0..1` | `InventoryItem.characteristic` (`countryOfOrigin`) |
| **Generic Product** | `shelfLife` | `0..1` | `MedicationKnowledge.storageGuideline` / `InventoryItem.characteristic` (`shelfLife`) |
| **Generic Product** | `doseQuantity` | `0..1` | `MedicationKnowledge.definitional.dosage.dosage.doseAndRate.dose[x]` |
| **Generic Product** | `attribute` (`type` `1..1`, `value[x]` `1..1`) | `0..*` | `InventoryItem.characteristic` (`characteristicType`, `value[x]`) / `ClinicalUseDefinition` |
| **Generic Product** | `associatedProduct` (`product` `1..1`, `relationship` `1..*`, `quantity` `1..1`) | `0..*` | `MedicationKnowledge.associatedMedication` / `InventoryItem.association` (`associationType`, `relatedItem`, `quantity`) |
| **Trade Item** (`1` → `0..*` Regulated Trade Item) | `identifier` | `1..*` | `InventoryItem.identifier` / `MedicationKnowledge.packaging.code` (GTIN or Country Trade Item Identifier) |
| **Trade Item** | `status` | `1..1` | `InventoryItem.status` |
| **Trade Item** | `tradeItemName` (`nameType` `1..1`, `name` `1..1`) | `0..*` | `InventoryItem.name` (`nameType`, `name`) |
| **Trade Item** | `description` | `0..1` | `InventoryItem.description.description` |
| **Trade Item** | `classification` | `0..*` | `InventoryItem.category` |
| **Trade Item** | `manufacturer` | `0..1` | `InventoryItem.responsibleOrganization` (`Reference(Organization)`) |
| **Trade Item** | `countryOfOrigin` | `1..1` | `InventoryItem.characteristic` (`countryOfOrigin`) |
| **Trade Item** | `shelfLife` | `0..1` | `InventoryItem.characteristic` (`shelfLife`) |
| **Trade Item** | `associatedGenericProduct` (`genericProduct` `1..1`, `quantity` `1..1`) | `0..*` | `InventoryItem.association` (`relatedItem` → Generic Product `InventoryItem` / `MedicationKnowledge`, `quantity`) |
| **Trade Item** | `contains` (`tradeItem` `1..1`, `quantity` `1..1`) | `0..*` | `InventoryItem.association` (`relatedItem` → child packaged `InventoryItem`, `quantity`: Packaging Hierarchy) |
| **Trade Item** | `attribute` (`type` `1..1`, `value[x]` `1..1`) | `0..*` | `InventoryItem.characteristic` (`characteristicType`, `value[x]`) |
| **Regulated Trade Item** | `identifier` | `1..*` | `RegulatedAuthorization.identifier` (market authorization / product registration number) |
| **Regulated Trade Item** | `status` | `1..1` | `RegulatedAuthorization.status` |
| **Regulated Trade Item** | `jurisdiction` | `1..*` | `RegulatedAuthorization.region` (`CodeableConcept`) |
| **Regulated Trade Item** | `authorisationHolder` | `1..1` | `RegulatedAuthorization.holder` (`Reference(Organization)`) |
| **Regulated Trade Item** | `validityPeriod` | `0..1` | `RegulatedAuthorization.validityPeriod` (`Period`) |
| **Regulated Trade Item** | `authorisedTradeItem` | `1..1` | `RegulatedAuthorization.subject` (`Reference(MedicationKnowledge | InventoryItem)`) |
| **Regulated Trade Item** | `attribute` (`type` `1..1`, `value[x]` `1..1`) | `0..*` | `RegulatedAuthorization.case` / `ClinicalUseDefinition` |
| **Regulated Trade Item** | `associatedProduct` (`product` `1..1`, `relationship` `1..*`, `quantity` `1..1`) | `0..*` | `InventoryItem.association`
