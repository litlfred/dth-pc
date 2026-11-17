import { figure } from "../../schema/builders";

export default figure({
  label: "fig:cover",
  file: "media/cover.svg",
  caption: "Cover of the WHO publication this folio transcribes: Digital transformation handbook for health product catalogue. Geneva: World Health Organization; 2025. ISBN 978-92-4-011619-1",
  page: 1,
  // declared-path-literal: L1 provenance anchor in who-iris (the cited cover of the source publication)
  meta: {"title": "Cover", "source": {"library": "9789240116191-eng", "file": "who-iris/library/9789240116191-eng/cover.png", "page": 1, "method": "cited", "generator": "scripts/figures/cover.py", "citation": "Digital transformation handbook for health product catalogue. Geneva: World Health Organization; 2025. ISBN 978-92-4-011619-1. Licence: CC BY-NC-SA 3.0 IGO.", "decision": "owner card 2026-11-17 (covers for the dth-* folios, B): the original cover, unchanged and cited, as in dth-phc#62"}},
});
