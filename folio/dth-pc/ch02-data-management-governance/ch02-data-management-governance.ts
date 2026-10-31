import { chapter, section } from "../../schema/builders";

export default chapter({
  number: 2,
  title: "Chapter 2. Instituting data management and governance policies",
  label: "chap:ch02-data-management-governance",
  sections: [
    section({
      title: "Step 1. Define product master data management procedures",
      label: "sec:ch02-step-1-define-product-master-data-manage",
      blocks: ["p-ch02-page-025", "p-ch02-page-026"],
    }),
    section({
      title: "Step 2. Define coding scheme, data definitions and structures",
      label: "sec:ch02-step-2-define-coding-scheme-data-definit",
      blocks: ["p-ch02-page-027", "p-ch02-page-028", "p-ch02-page-029", "p-ch02-page-030"],
    }),
    section({
      title: "Step 3. Define data use policies and data sharing mechanisms",
      label: "sec:ch02-step-3-define-data-use-policies-and-data",
      blocks: ["p-ch02-page-031"],
    }),
    section({
      title: "Step 4. Institutionalise product master data governance policies and procedures",
      label: "sec:ch02-step-4-institutionalise-product-master-d",
      blocks: ["p-ch02-page-032"],
    }),
    section({
      title: "Step 5. Define short- and long-term strategies to source standardized product master data",
      label: "sec:ch02-step-5-define-short-and-long-term-strate",
      blocks: ["p-ch02-page-033"],
    }),
  ],
});
