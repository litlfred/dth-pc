import { chapter, section } from "../../schema/builders";

export default chapter({
  number: 3,
  title: "Chapter 3. Deploying appropriate technology to manage product master data",
  label: "chap:ch03-technology",
  sections: [
    section({
      title: "Step 1. Define system requirements for the NPC tool",
      label: "sec:ch03-step-1-define-system-requirements-for-th",
      blocks: ["p-ch03-page-035"],
    }),
    section({
      title: "Step 2. Identify technology options; Step 3. Prepare an implementation plan",
      label: "sec:ch03-step-2-identify-technology-options-step",
      blocks: ["p-ch03-page-036"],
    }),
    section({
      title: "Step 4. Design, develop and deploy the NPC tool",
      label: "sec:ch03-step-4-design-develop-and-deploy-the-npc",
      blocks: ["p-ch03-page-037"],
    }),
    section({
      title: "Technology selection, planning and deployment process (PC-BP-06)",
      label: "sec:ch03-process",
      blocks: ["bp-pc-bp-06"],
    }),
  ],
});
