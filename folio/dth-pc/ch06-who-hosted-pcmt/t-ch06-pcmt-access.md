*WHO-hosted PCMT catalogue structure and user-group access permissions*

| Component in WHO-hosted PCMT (WHO INFRASTRUCTURE) | Attributes / Scope | Users & Data Flow |
| --- | --- | --- |
| **GLOBAL CATALOGUE** | • Global identifier<br>• Unit of use<br>• Pharmaceutical information dosage form, route of administration, strength etc.<br>• Trade item information<br>• Manufacturer, country of origin, shelf life etc. | Common product information derived by Country Catalogues |
| **COUNTRY CATALOGUE A** | • Country identifiers<br>• Country specific product information. E.g., registration number | Accessed by **Country A Users**; derives common product information from the Global Catalogue |
| **COUNTRY CATALOGUE B** | • Country identifiers<br>• Country specific product information. E.g., registration number | Accessed by **Country B Users**; derives common product information from the Global Catalogue |

### Catalogue user-group permissions

| Catalogue | Managed by | Category | View permission | Edit permission | Own (approve/reject) permission |
| --- | --- | --- | --- | --- | --- |
| **Global Catalogue** | `WHOGroup` | `Catalogues → WHO` | All users | `WHOGroup` | `WHOGroup` |
| **Country A Catalogue** | `CAGroup` | `Catalogues → CA` | `CAGroup` | `CAGroup` | `CAGroup` |
| **Country B Catalogue** | `CBGroup` | `Catalogues → CB` | `CBGroup` | `CBGroup` | `CBGroup` |
