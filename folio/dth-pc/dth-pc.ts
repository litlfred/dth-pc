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
    status: "seeded from L1; linked to dth-pc, dth-sc and dpi-h-ra glossaries, dpi-h-ra ArchiMate 0.3.0-draft.1 views and elements, and PC-8 roles, BPMN 2.0 processes and DMN 1.3 decision tables (PC-4, PC-6, PC-8)",
    figureViews: [
      { figure: "Figure 2", block: "folio/dth-pc/introduction/p-introduction-page-011.md", model: "0.3.0-draft.1", view: "id-02175c6feb9155618981ff120f954420", viewName: "National Product Catalogue (DTH PC Fig. 2, Ch. 2-3)" },
      { figure: "Figure 3", block: "folio/dth-pc/introduction/p-introduction-page-012.md", model: "0.3.0-draft.1", view: "id-2d524cffba25509e82684f47d624cc42", viewName: "Health Supply Chain Partners and Processes (DTH SC Figs. 1-3)" },
      { figure: "Figure 7", block: "folio/dth-pc/introduction/p-introduction-page-016.md", model: "0.3.0-draft.1", view: "id-92267636cc42566ca5d2cff0e81be8c9", viewName: "DHSC Architecture Framework (DTH SC Fig. 14)" },
      { figure: "Figure 8", block: "folio/dth-pc/ch02-data-management-governance/p-ch02-page-028.md", model: "0.3.0-draft.1", view: "id-053fa0e33f6b5b0bb218195486c05160", viewName: "Product Master Data Information Model (DTH PC Figs. 8-9)" },
      { figure: "Figure 9", block: "folio/dth-pc/ch02-data-management-governance/p-ch02-page-029.md", model: "0.3.0-draft.1", view: "id-053fa0e33f6b5b0bb218195486c05160", viewName: "Product Master Data Information Model (DTH PC Figs. 8-9)" },
    ],
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
