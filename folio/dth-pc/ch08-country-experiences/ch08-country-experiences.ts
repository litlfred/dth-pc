import { chapter, section } from "../../schema/builders";

export default chapter({
  number: 8,
  title: "Chapter 8. Sharing implementation experiences",
  label: "chap:ch08-country-experiences",
  sections: [
    section({
      title: "Rwanda",
      label: "sec:ch08-rwanda",
      blocks: ["p-ch08-page-052", "t-ch08-rwanda"],
    }),
    section({
      title: "Zambia",
      label: "sec:ch08-zambia",
      blocks: ["p-ch08-page-053", "t-ch08-zambia"],
    }),
    section({
      title: "Nigeria",
      label: "sec:ch08-nigeria",
      blocks: ["p-ch08-page-054", "t-ch08-nigeria"],
    }),
  ],
});
