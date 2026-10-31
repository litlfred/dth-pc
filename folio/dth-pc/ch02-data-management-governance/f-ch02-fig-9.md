![Fig. 9. Relationship between generic product, trade item and regulated trade item](media/fig-9-product-classes.svg)

*Source: WHO, Digital transformation handbook for health product catalogue, 2025, Fig. 9, PDF page 29. Drawn from the smart-pcmt logical models: Generic Product is smart-pcmt `Product`, and Trade Item and Regulated Trade Item are `DthPcTradeItem` and `DthPcRegulatedTradeItem`, which carry this figure's element names and cardinalities. The original page render is `who-iris/library/9789240116191-eng/figures/vfig-p029.png`.*

Where `Product` differs from the printed Generic Product: the handbook prints `name.nameValue` where `Product` has `name.value`, and lists the elements in another order.

smart-pcmt's own authorisation model, `ProductAuthorization`, beside the handbook's Regulated Trade Item:

| Element | [DthPcRegulatedTradeItem](https://github.com/litlfred/smart-pcmt/blob/9e720db45257cc9f2206a5c97ed83e6766d08e28/input/fsh/models/dth-pc/dth-pc-fig-9.fsh) | [ProductAuthorization](https://github.com/litlfred/smart-pcmt/blob/9e720db45257cc9f2206a5c97ed83e6766d08e28/input/fsh/models/ProductAuthorization.fsh) |
| --- | --- | --- |
| `identifier` | `1..*` | — |
| `status` | `1..1` | `1..1` |
| `jurisdiction` | `1..*` | `1..*` |
| `authorisationHolder` | `1..1` | — |
| `validityPeriod` | `0..1` | `0..1` |
| `authorisedTradeItem` | `1..1` | — |
| `attribute` | `0..*` | — |
| `attribute.type` | `1..1` | — |
| `attribute.value[x]` | `1..1` | — |
| `associatedProduct` | `0..*` | — |
| `associatedProduct.product` | `1..1` | — |
| `associatedProduct.relationship` | `1..*` | — |
| `associatedProduct.quantity` | `1..1` | — |
| `number` | — | `0..1` |
| `type` | — | `1..1` |
| `holder` | — | `1..1` |
| `product` | — | `1..*` |
