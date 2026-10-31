import { chapter, section } from "../../schema/builders";

export default chapter({
  number: 1,
  title: "Chapter 1. Establishing regulatory policies to promote product master data standardization",
  label: "chap:ch01-regulatory-policies",
  sections: [
    section({
      title: "Step 1. Identify necessary regulatory policies and legislations",
      label: "sec:ch01-step-1-identify-necessary-regulatory-pol",
      blocks: ["p-ch01-page-021", "t-ch01-step-1"],
    }),
    section({
      title: "Step 2. Develop the identified regulatory policies and legislations; Step 3. Coordinate reviews and approvals",
      label: "sec:ch01-step-2-develop-the-identified-regulatory",
      blocks: ["p-ch01-page-022", "t-ch01-step-2", "t-ch01-step-3"],
    }),
    section({
      title: "Step 4. Publish and enforce the approved regulatory policies",
      label: "sec:ch01-step-4-publish-and-enforce-the-approved",
      blocks: ["p-ch01-page-023", "t-ch01-step-4"],
    }),
    section({
      title: "Regulatory roles and process (PC-R-06..08, PC-BP-01)",
      label: "sec:ch01-roles-and-process",
      blocks: ["pers-pc-r-06", "pers-pc-r-07", "pers-pc-r-08", "bp-pc-bp-01"],
    }),
  ],
});
