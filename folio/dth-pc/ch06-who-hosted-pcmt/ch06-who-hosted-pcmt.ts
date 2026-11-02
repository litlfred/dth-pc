import { chapter, section } from "../../schema/builders";

export default chapter({
  number: 6,
  title: "Chapter 6. Leveraging the WHO-hosted PCMT",
  label: "chap:ch06-who-hosted-pcmt",
  sections: [
    section({
      title: "Leveraging the WHO-hosted PCMT",
      label: "sec:ch06-leveraging-the-who-hosted-pcmt",
      blocks: ["p-ch06-page-046", "f-ch06-fig-14"],
    }),
    section({
      title: "Catalogue setup and access",
      label: "sec:ch06-catalogue-setup-and-access",
      blocks: ["p-ch06-page-047", "t-ch06-pcmt-access"],
    }),
    section({
      title: "Catalogue user groups, attribute decision table and derivation process (PC-R-09, PC-DT-02, PC-BP-09)",
      label: "sec:ch06-roles-decisions-and-process",
      blocks: ["pers-pc-r-09", "dt-pc-dt-02", "bp-pc-bp-09"],
    }),
  ],
});
