import { chapter, section } from "../../schema/builders";

export default chapter({
  number: 4,
  title: "Chapter 4. Managing change to institutionalize standardized product master data",
  label: "chap:ch04-managing-change",
  sections: [
    section({
      title: "Step 1. Develop a change management plan to institutionalise use of NPC",
      label: "sec:ch04-step-1-develop-a-change-management-plan",
      blocks: ["p-ch04-page-039", "t-ch04-step-1"],
    }),
    section({
      title: "Step 2. Define SOPs to collect, organize and manage product master data",
      label: "sec:ch04-step-2-define-sops-to-collect-organize-a",
      blocks: ["p-ch04-page-040", "t-ch04-step-2", "p-ch04-page-041", "f-ch04-fig-13", "t-ch04-minimum-attributes"],
    }),
    section({
      title: "Change management processes and identifier decision table (PC-BP-04, PC-BP-05, PC-BP-07, PC-DT-01)",
      label: "sec:ch04-processes-and-decisions",
      blocks: ["dt-pc-dt-01", "bp-pc-bp-04", "bp-pc-bp-05", "bp-pc-bp-07"],
    }),
  ],
});
