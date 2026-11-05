import { chapter, section } from "../../schema/builders";

export default chapter({
  number: 2,
  title: "Chapter 2. Instituting data management and governance policies",
  label: "chap:ch02-data-management-governance",
  sections: [
    section({
      title: "Step 1. Define product master data management procedures",
      label: "sec:ch02-step-1-define-product-master-data-manage",
      blocks: ["p-ch02-page-025", "p-ch02-page-026", "t-ch02-step-1"],
    }),
    section({
      title: "Step 2. Define coding scheme, data definitions and structures",
      label: "sec:ch02-step-2-define-coding-scheme-data-definit",
      blocks: [
        "p-ch02-page-027",
        "t-ch02-step-2",
        "p-ch02-page-028",
        "f-ch02-fig-8",
        "t-ch02-fig-8-linkage",
        "p-ch02-page-029",
        "f-ch02-fig-9",
        "t-ch02-fig-9-information-model",
        "p-ch02-page-030",
        "f-ch02-fig-10",
        "f-ch02-fig-11",
        "t-ch02-fig-11-packaging-variations",
        "f-ch02-fig-12",
        "t-ch02-fig-12-fhir-packaging",
      ],
    }),
    section({
      title: "Step 3. Define data use policies and data sharing mechanisms",
      label: "sec:ch02-step-3-define-data-use-policies-and-data",
      blocks: ["p-ch02-page-031", "t-ch02-step-3"],
    }),
    section({
      title: "Step 4. Institutionalise product master data governance policies and procedures",
      label: "sec:ch02-step-4-institutionalise-product-master-d",
      blocks: ["p-ch02-page-032", "t-ch02-step-4"],
    }),
    section({
      title: "Step 5. Define short- and long-term strategies to source standardized product master data",
      label: "sec:ch02-step-5-define-short-and-long-term-strate",
      blocks: ["p-ch02-page-033", "t-ch02-step-5"],
    }),
    section({
      title: "Data governance roles and processes (PC-R-01..04, PC-BP-02..03)",
      label: "sec:ch02-roles-and-processes",
      blocks: ["pers-pc-r-01", "pers-pc-r-02", "pers-pc-r-03", "pers-pc-r-04", "bp-pc-bp-02", "bp-pc-bp-03"],
    }),
  ],
});
