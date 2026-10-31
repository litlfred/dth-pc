import { chapter, section } from "../../schema/builders";

export default chapter({
  title: "Front matter",
  label: "chap:front-matter",
  sections: [
    section({
      title: "Acknowledgements",
      label: "sec:front-acknowledgements",
      blocks: ["p-front-page-005"],
    }),
    section({
      title: "Abbreviations",
      label: "sec:front-abbreviations",
      blocks: ["p-front-page-006", "p-front-page-007", "t-front-abbreviations"],
    }),
    section({
      title: "Glossary",
      label: "sec:front-glossary",
      blocks: ["p-front-page-008", "p-front-page-009", "t-front-glossary"],
    }),
  ],
});
