import { paper, chapterRef } from "../schema/builders";

/**
 * Digital Transformation Handbook for Health Product Catalogue
 *
 * The document manifest. `chapters` is an ORDERED list: its order is the
 * reading order, and it is the only place that order is recorded.
 *
 * Seeded from the L1 entry who-iris/library/9789240116191-eng by
 * scripts/folio/seed_from_l1.py; edited by hand from then on.
 */
export default paper({
  title: "Digital Transformation Handbook for Health Product Catalogue",
  authors: ["World Health Organization"],
  date: "2025",
  meta: {
    documentKind: "smart-base:dth",
    level: "L1",
    targetLevel: "L2",
    isbn: "9789240116191",
    source: { library: "9789240116191-eng", repository: "litlfred/who-iris" },
    licence: "CC BY-NC-SA 3.0 IGO",
    status: "seeded from L1; not yet linked to the glossary or ArchiMate",
  },
  chapters: [
    chapterRef({ dir: "front-matter" }),
    chapterRef({ dir: "introduction" }),
    chapterRef({ dir: "ch01-regulatory-policies" }),
    chapterRef({ dir: "ch02-data-management-governance" }),
    chapterRef({ dir: "ch03-technology" }),
    chapterRef({ dir: "ch04-managing-change" }),
    chapterRef({ dir: "ch05-capacity" }),
    chapterRef({ dir: "ch06-who-hosted-pcmt" }),
    chapterRef({ dir: "ch07-global-good" }),
    chapterRef({ dir: "ch08-country-experiences" }),
    chapterRef({ dir: "references" }),
    chapterRef({ dir: "annexes" }),
  ],
});
