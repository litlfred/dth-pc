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
    status: "seeded from L1 (PC-1); structured step, information-model and reference tables (33 tables) and figures (15 figures, PC-5); linked to dth-pc, dth-sc and dpi-h-ra glossaries (PC-4), dpi-h-ra ArchiMate 0.3.0-draft.1 views and elements (PC-6), 100% L1 normative marker coverage (PC-7), and 19 roles, 10 BPMN 2.0 processes (with rendered SVGs) and 2 DMN 1.3 decision tables (PC-8)",
    figureViews: [
      { figure: "Figure 1", block: "folio/dth-pc/introduction/f-introduction-fig-1.md", model: "0.3.0-draft.1", view: "id-053fa0e33f6b5b0bb218195486c05160", viewName: "Product Master Data Information Model (DTH PC Figs. 8-9)" },
      { figure: "Figure 2", block: "folio/dth-pc/introduction/f-introduction-fig-2.md", model: "0.3.0-draft.1", view: "id-02175c6feb9155618981ff120f954420", viewName: "National Product Catalogue (DTH PC Fig. 2, Ch. 2-3)" },
      { figure: "Figure 3", block: "folio/dth-pc/introduction/f-introduction-fig-3.md", model: "0.3.0-draft.1", view: "id-2d524cffba25509e82684f47d624cc42", viewName: "Health Supply Chain Partners and Processes (DTH SC Figs. 1-3)" },
      { figure: "Figure 6", block: "folio/dth-pc/introduction/f-introduction-fig-6.md", model: "0.3.0-draft.1", view: "id-2d524cffba25509e82684f47d624cc42", viewName: "Health Supply Chain Partners and Processes (DTH SC Figs. 1-3)" },
      { figure: "Figure 7", block: "folio/dth-pc/introduction/f-introduction-fig-7.md", model: "0.3.0-draft.1", view: "id-92267636cc42566ca5d2cff0e81be8c9", viewName: "DHSC Architecture Framework (DTH SC Fig. 14)" },
      { figure: "Figure 8", block: "folio/dth-pc/ch02-data-management-governance/f-ch02-fig-8.md", model: "0.3.0-draft.1", view: "id-053fa0e33f6b5b0bb218195486c05160", viewName: "Product Master Data Information Model (DTH PC Figs. 8-9)" },
      { figure: "Figure 9", block: "folio/dth-pc/ch02-data-management-governance/f-ch02-fig-9.md", model: "0.3.0-draft.1", view: "id-053fa0e33f6b5b0bb218195486c05160", viewName: "Product Master Data Information Model (DTH PC Figs. 8-9)" },
      { figure: "Figure 10", block: "folio/dth-pc/ch02-data-management-governance/f-ch02-fig-10.md", model: "0.3.0-draft.1", view: "id-053fa0e33f6b5b0bb218195486c05160", viewName: "Product Master Data Information Model (DTH PC Figs. 8-9)" },
      { figure: "Figure 11", block: "folio/dth-pc/ch02-data-management-governance/f-ch02-fig-11.md", model: "0.3.0-draft.1", view: "id-053fa0e33f6b5b0bb218195486c05160", viewName: "Product Master Data Information Model (DTH PC Figs. 8-9)" },
      { figure: "Figure 12", block: "folio/dth-pc/ch02-data-management-governance/f-ch02-fig-12.md", model: "0.3.0-draft.1", view: "id-053fa0e33f6b5b0bb218195486c05160", viewName: "Product Master Data Information Model (DTH PC Figs. 8-9)" },
      { figure: "Figure 13", block: "folio/dth-pc/ch04-managing-change/f-ch04-fig-13.md", model: "0.3.0-draft.1", view: "id-02175c6feb9155618981ff120f954420", viewName: "National Product Catalogue (DTH PC Fig. 2, Ch. 2-3)" },
      { figure: "Figure 14", block: "folio/dth-pc/ch06-who-hosted-pcmt/f-ch06-fig-14.md", model: "0.3.0-draft.1", view: "id-02175c6feb9155618981ff120f954420", viewName: "National Product Catalogue (DTH PC Fig. 2, Ch. 2-3)" },
      { figure: "Figure 15", block: "folio/dth-pc/ch07-global-good/f-ch07-fig-15.md", model: "0.3.0-draft.1", view: "id-02175c6feb9155618981ff120f954420", viewName: "National Product Catalogue (DTH PC Fig. 2, Ch. 2-3)" },
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
