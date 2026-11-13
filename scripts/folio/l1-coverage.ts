#!/usr/bin/env bun
/**
 * scripts/folio/l1-coverage.ts — Step PC-7 of litlfred/dth-pc#2
 *
 * Audits 100% of normative marker hits (`should` / `shall` / `must` / `recommend*`
 * and `may be implemented`) across `who-iris/library/9789240116191-eng` using
 * `folio-assistant-core/scripts/l1-coverage.ts`, accounting for every sentence
 * as either `captured` in a `folio/dth-pc/` block (`t-*`, `f-*`, `pers-*`,
 * `dt-*`, `bp-*`, `p-*`) or `excluded` with an explicit reason (`editorial`
 * for front-matter licence/bibliography or `background-fact` for front-matter
 * glossary definitions, which are also structured in `tbl:glossary`) signed off
 * by `litlfred`.
 *
 * Usage:
 *   bun run scripts/folio/l1-coverage.ts           # write folio/dth-pc/l1-coverage.json + docs/l1-coverage.md
 *   bun run scripts/folio/l1-coverage.ts --check   # verify 100% accounted-for and files up to date
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  coverage,
  exitCodeFor,
  markersOf,
  sentencesOf,
  type Captured,
  type Exclusion,
  type Page,
} from "../../folio-assistant-core/scripts/l1-coverage.ts";

const ROOT = join(import.meta.dir, "../..");
const L1_DIR = join(ROOT, "who-iris/library/9789240116191-eng");
const FOLIO_DIR = join(ROOT, "folio/dth-pc");
const OUT_JSON = join(FOLIO_DIR, "l1-coverage.json");
const OUT_MD = join(ROOT, "docs/l1-coverage.md");

interface SectionMeta {
  id: string;
  title: string;
  level: number;
  page_start: number;
  page_end: number;
}

const EXCLUSIONS: (Exclusion & { note: string })[] = [
  {
    location: "p1:s4",
    reason: "editorial",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Standard WHO CC BY-NC-SA 3.0 IGO non-endorsement licence clause (front matter, PDF p. 3).",
  },
  {
    location: "p1:s6",
    reason: "editorial",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Standard Creative Commons ShareAlike adaptation licence clause (front matter, PDF p. 3).",
  },
  {
    location: "p1:s7",
    reason: "editorial",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Standard WHO translation disclaimer clause (front matter, PDF p. 3).",
  },
  {
    location: "p1:s9",
    reason: "editorial",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Standard WHO binding English authentic-edition clause for translations (front matter, PDF p. 3).",
  },
  {
    location: "p1:s10",
    reason: "editorial",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Standard WIPO mediation clause for licence disputes (front matter, PDF p. 3).",
  },
  {
    location: "p1:s16",
    reason: "editorial",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Standard WHO commercial product non-endorsement disclaimer (front matter, PDF p. 3).",
  },
  {
    location: "p1:s21",
    reason: "editorial",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Standard WHO limitation of liability disclaimer (front matter, PDF p. 3).",
  },
  {
    location: "p4:s4",
    reason: "background-fact",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Front-matter Glossary definitions of Functional requirements and Non-functional requirements (PDF p. 8; also captured verbatim in front-matter/t-front-glossary tbl:glossary).",
  },
  {
    location: "p4:s5",
    reason: "background-fact",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Front-matter Glossary explanatory sentence under Non-functional requirements (PDF p. 8; also captured verbatim in front-matter/t-front-glossary tbl:glossary).",
  },
  {
    location: "p4:s6",
    reason: "background-fact",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Front-matter Glossary illustrative example under Non-functional requirements (PDF p. 8; also captured verbatim in front-matter/t-front-glossary tbl:glossary).",
  },
  {
    location: "p4:s7",
    reason: "background-fact",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Front-matter Glossary definition of Open source software (PDF p. 8; also captured verbatim in front-matter/t-front-glossary tbl:glossary).",
  },
  {
    location: "p4:s9",
    reason: "background-fact",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Front-matter Glossary definition of SMART Guidelines (PDF p. 9; also captured verbatim in front-matter/t-front-glossary tbl:glossary).",
  },
  {
    location: "p32:s34",
    reason: "editorial",
    signedOffBy: "litlfred",
    signedOffAt: "2026-10-31",
    note: "Bibliography reference #1 title ('WHO SMART guidelines: optimising country-level use of guideline recommendations in the digital age', PDF p. 55; also present in references/p-references-page-055).",
  },
];

export function computeDthPcCoverage() {
  const structure = JSON.parse(readFileSync(join(L1_DIR, "structure.json"), "utf8")) as {
    sections: SectionMeta[];
  };

  const pages: (Page & { sectionId: string; title: string; pdfPages: [number, number] })[] =
    structure.sections.map((s, idx) => ({
      page: idx + 1,
      sectionId: s.id,
      title: s.title,
      pdfPages: [s.page_start, s.page_end],
      text: readFileSync(join(L1_DIR, "sections", `${s.id}.md`), "utf8"),
    }));

  const captured: Captured[] = [];
  const chDirs = readdirSync(FOLIO_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !["media", "references", "front-matter"].includes(d.name))
    .map((d) => d.name)
    .sort();

  const orderedFiles: { id: string; path: string }[] = [];
  for (const ch of chDirs) {
    const chDir = join(FOLIO_DIR, ch);
    const files = readdirSync(chDir)
      .filter((x) => x.endsWith(".md"))
      .sort((a, b) => {
        const isProseA = a.startsWith("p-") ? 1 : 0;
        const isProseB = b.startsWith("p-") ? 1 : 0;
        return isProseA - isProseB || a.localeCompare(b);
      });
    for (const f of files) {
      orderedFiles.push({ id: `${ch}/${f.replace(/\.md$/, "")}`, path: join(chDir, f) });
    }
  }

  for (const { id, path } of orderedFiles) {
    const txt = readFileSync(path, "utf8");
    captured.push({ id, text: txt });
    const cpIdx = txt.indexOf("After finishing the steps outlined in this chapter");
    if (cpIdx >= 0) {
      const cpSlice = txt.slice(cpIdx).split("INPUTS")[0].trim();
      captured.push({ id, text: cpSlice });
    }
    for (const s of sentencesOf(txt)) {
      if (
        s.length >= 25 &&
        markersOf(s).length > 0 &&
        !s.includes("After finishing the steps outlined in this chapter")
      ) {
        captured.push({ id, text: s });
      }
    }
    for (const line of txt.split(/\n+|\||<br>/)) {
      const rawTrim = line.trim();
      if (
        rawTrim.length >= 30 &&
        markersOf(rawTrim).length > 0 &&
        !rawTrim.includes("After finishing the steps outlined in this chapter")
      ) {
        captured.push({ id, text: rawTrim });
      }
      const clean = line.replace(/^[-*#>0-9.\s•]+/, "").trim();
      for (const sub of sentencesOf(clean)) {
        if (
          sub.length >= 30 &&
          markersOf(sub).length > 0 &&
          !sub.includes("After finishing the steps outlined in this chapter")
        ) {
          captured.push({ id, text: sub });
        }
      }
    }
  }

  const report = coverage(pages, captured, EXCLUSIONS);
  // Keep deterministic generatedAt so --check is reproducible across runs
  report.generatedAt = "2026-10-31T00:00:00.000Z";

  const noteByLoc = new Map(EXCLUSIONS.map((e) => [e.location!, e.note]));
  const enrichedSentences = report.sentences.map((s) => {
    const sec = pages[s.page - 1];
    const wordHits = s.text.match(/\b(should|shall|must|recommend\w*|may be implemented)\b/gi) ?? [];
    return {
      ...s,
      sectionId: sec.sectionId,
      sectionTitle: sec.title,
      pdfPages: sec.pdfPages,
      markerWords: wordHits,
      markerWordCount: wordHits.length,
      ...(noteByLoc.has(s.location) ? { note: noteByLoc.get(s.location) } : {}),
    };
  });

  const totalMarkerWords = enrichedSentences.reduce((acc, s) => acc + s.markerWordCount, 0);

  const jsonPayload = {
    ...report,
    entryId: "9789240116191-eng",
    issue: "litlfred/dth-pc#2 (Step PC-7)",
    totalMarkerWordHits: totalMarkerWords,
    sections: pages.map((p, idx) => ({
      sectionIndex: p.page,
      sectionId: p.sectionId,
      title: p.title,
      pdfPages: p.pdfPages,
      ...report.pages[idx],
    })),
    sentences: enrichedSentences,
  };

  const mdLines: string[] = [
    "# L1 Normative Marker Coverage Report (`dth-pc` — Step PC-7)",
    "",
    "- **L1 Source Entry:** `who-iris/library/9789240116191-eng` (*Digital transformation handbook for health product catalogue*, WHO 2025, ISBN `9789240116191`)",
    "- **Folio:** `folio/dth-pc/`",
    `- **Definition Version:** \`${report.definitionVersion}\``,
    `- **Match Method:** \`${report.matchMethod}\``,
    `- **Normative Sentences:** **${report.totals.normative}** across **34** L1 sections (**${totalMarkerWords}** individual marker word hits of \`should\` / \`shall\` / \`must\` / \`recommend*\` / \`may be implemented\`)`,
    `- **Captured in Folio Blocks:** **${report.totals.captured}** sentences (**${report.totals.capturedPct}%**)`,
    `- **Signed-off Exclusions:** **${report.totals.excluded}** sentences (**7** \`editorial\` on PDF p. 3 licence/disclaimer boilerplate, **5** \`background-fact\` in PDF pp. 8–9 front-matter Glossary [also structured verbatim in \`front-matter/t-front-glossary\` \`tbl:glossary\`], **1** \`editorial\` in PDF p. 55 References citation #1)`,
    `- **Unaccounted:** **${report.totals.unaccounted}**`,
    `- **Accounted-For Coverage:** **${report.totals.accountedForPct}%** (target: **100%**)`,
    "",
    "## Per-Section Summary",
    "",
    "| # | L1 Section ID | PDF Pages | Normative | Captured | Excluded | Unaccounted | Accounted % |",
    "| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const sec of jsonPayload.sections.filter((s) => s.normative > 0)) {
    mdLines.push(
      `| ${sec.sectionIndex} | \`${sec.sectionId}\` | pp. ${sec.pdfPages[0]}–${sec.pdfPages[1]} | ${sec.normative} | ${sec.captured} | ${sec.excluded} | ${sec.unaccounted} | ${sec.accountedForPct?.toFixed(1)}% |`
    );
  }
  mdLines.push(
    `| **Total** | **34 sections (15 with normative markers)** | **pp. 1–62** | **${report.totals.normative}** | **${report.totals.captured}** | **${report.totals.excluded}** | **${report.totals.unaccounted}** | **${report.totals.accountedForPct?.toFixed(1)}%** |`,
    "",
    "## Complete Normative Sentence & Marker Ledger",
    "",
    "| Location | L1 Section (`pdfPages`) | Markers (`hits`) | State | Target Block / Exclusion Reason (Signed Off) | Excerpt |",
    "| --- | --- | --- | --- | --- | --- |"
  );

  for (const s of enrichedSentences) {
    const target =
      s.state === "captured"
        ? `\`${s.node}\``
        : `\`${s.reason}\` (signed off by \`${s.signedOffBy}\` on \`${s.signedOffAt}\`)`;
    const excerpt = s.text.replace(/\|/g, "\\|").replace(/\s+/g, " ").slice(0, 110);
    mdLines.push(
      `| \`${s.location}\` | \`${s.sectionId}\` (pp. ${s.pdfPages[0]}–${s.pdfPages[1]}) | ${s.markers.join(", ")} (${s.markerWords.map((w) => `\`${w}\``).join(", ")}) | **${s.state}** | ${target} | ${excerpt}… |`
    );
  }

  mdLines.push("");
  return { report, jsonPayload, markdown: mdLines.join("\n") };
}

if (import.meta.main) {
  const checkOnly = process.argv.includes("--check");
  const { report, jsonPayload, markdown } = computeDthPcCoverage();
  const jsonStr = JSON.stringify(jsonPayload, null, 2) + "\n";

  if (checkOnly) {
    const code = exitCodeFor(report);
    if (code !== 0) {
      console.error(`✗ L1 coverage check failed: ${report.totals.unaccounted} unaccounted sentences, ${report.problems.length} problems`);
      process.exit(code);
    }
    const curJson = readFileSync(OUT_JSON, "utf8");
    const curMd = readFileSync(OUT_MD, "utf8");
    if (curJson !== jsonStr || curMd !== markdown) {
      console.error("✗ folio/dth-pc/l1-coverage.json or docs/l1-coverage.md is out of date; run `bun run scripts/folio/l1-coverage.ts`");
      process.exit(1);
    }
    console.log(
      `✓ L1 coverage: ${report.totals.normative} normative sentences (${jsonPayload.totalMarkerWordHits} marker hits) across 34 sections — ${report.totals.captured} captured (${report.totals.capturedPct}%), ${report.totals.excluded} excluded, ${report.totals.unaccounted} unaccounted (${report.totals.accountedForPct}% accounted-for)`
    );
    process.exit(0);
  } else {
    writeFileSync(OUT_JSON, jsonStr, "utf8");
    writeFileSync(OUT_MD, markdown, "utf8");
    console.log(
      `Wrote folio/dth-pc/l1-coverage.json and docs/l1-coverage.md (${report.totals.accountedForPct}% accounted-for: ${report.totals.captured} captured, ${report.totals.excluded} excluded, ${report.totals.unaccounted} unaccounted)`
    );
  }
}
