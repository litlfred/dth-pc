import { chapter, section } from "../../schema/builders";

export default chapter({
  title: "Introduction",
  label: "chap:introduction",
  sections: [
    section({
      title: "What is Product Master Data?",
      label: "sec:introduction-what-is-product-master-data",
      blocks: ["p-introduction-page-010"],
    }),
    section({
      title: "Why is Product Master Data important?",
      label: "sec:introduction-why-is-product-master-data-important",
      blocks: ["p-introduction-page-011"],
    }),
    section({
      title: "Digital implementation investment guide (DIIG)",
      label: "sec:introduction-digital-implementation-investment-guide",
      blocks: ["p-introduction-page-012", "p-introduction-page-013"],
    }),
    section({
      title: "SMART Guidelines",
      label: "sec:introduction-smart-guidelines",
      blocks: ["p-introduction-page-014", "p-introduction-page-015"],
    }),
    section({
      title: "Digital health supply chain (DHSC) architectural components",
      label: "sec:introduction-digital-health-supply-chain-dhsc-archite",
      blocks: ["p-introduction-page-016"],
    }),
    section({
      title: "How to use this handbook; how it was developed",
      label: "sec:introduction-how-to-use-this-handbook-how-it-was-deve",
      blocks: ["p-introduction-page-017"],
    }),
    section({
      title: "Target users; when to use this handbook",
      label: "sec:introduction-target-users-when-to-use-this-handbook",
      blocks: ["p-introduction-page-018", "p-introduction-page-019"],
    }),
  ],
});
