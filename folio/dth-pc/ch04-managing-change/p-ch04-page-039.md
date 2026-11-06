Change management is essential to ensure that operational processes, systems, and people transition to using standardized master data without disrupting existing operations. Effective change management enables the successful adoption and use of updated master data structures, processes, and associated system enhancements. Without a comprehensive change management plan, transitions can be unpredictable and may result in increased cost, effort, delays, and rework. This chapter outlines the steps required to develop appropriate change management procedures to institutionalize the use of standardized product master data, processes, and tools.

### Best practices

When global identifiers such as GTINs are not available—e.g., if a manufacturer has not yet subscribed for a GTIN—it is recommended to use a local identifier for trade items. These local identifiers can later be mapped to GTINs once they become available.

In the example below, GTINs are mapped to a local identifier attribute called Country Trade Item Identifier. This attribute is designed to default to GTINs when they are available. In the absence of GTINs, the attribute generates and maintains a local identifier, which can be replaced with a GTIN once it is assigned to the trade item.
