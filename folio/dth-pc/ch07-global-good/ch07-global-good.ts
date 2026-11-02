import { chapter, section } from "../../schema/builders";

export default chapter({
  number: 7,
  title: "Chapter 7. Sharing product master data as a global good",
  label: "chap:ch07-global-good",
  sections: [
    section({
      title: "Sharing product master data as a global good",
      label: "sec:ch07-sharing-product-master-data-as-a-global",
      blocks: ["p-ch07-page-049", "p-ch07-page-050", "f-ch07-fig-15", "t-ch07-global-good-flow"],
    }),
    section({
      title: "Global Product Catalogue sharing process (PC-BP-10)",
      label: "sec:ch07-process",
      blocks: ["bp-pc-bp-10"],
    }),
  ],
});
