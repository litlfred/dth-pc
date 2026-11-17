/**
 * The smart-pcmt logical models and example instances, read where they live.
 *
 * The models stay in smart-pcmt (owner, 2026-11-17: "i want the LM to stay in
 * PCMT but be referred to by dth-pc"). This folio commits no copy of them:
 * `figure-data/pcmt-models.json` names the repository and the commit, and this
 * module fetches that commit into `build/pcmt-models/<commit>/` (gitignored),
 * compiles it with sushi, and hands out the compiled StructureDefinitions by
 * canonical URL and the example instances by id. A second run reuses the build.
 *
 * The commit is pinned, so `uml-svg.ts --check` judges the committed SVGs
 * against exactly the models they were drawn from; moving to newer models is a
 * change to `pcmt-models.json`, reviewed like any other.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";

const ROOT = resolve(import.meta.dir, "../..");
const REF = join(ROOT, "figure-data/pcmt-models.json");

export const PcmtModelsRef = z
  .object({
    $comment: z.string().optional(),
    repository: z.string().url(),
    /** Repositories that also hold the commit, tried in order when the first cannot serve it. */
    mirrors: z.array(z.string().url()).default([]),
    commit: z.string().regex(/^[0-9a-f]{40}$/),
    /** The IG's canonical, which every model URL starts with. */
    canonical: z.string().url(),
    sushi: z.string(),
    /** How the IG is named on a diagram. */
    label: z.string(),
  })
  .strict();
export type PcmtModelsRef = z.infer<typeof PcmtModelsRef>;

export interface PcmtModels {
  ref: PcmtModelsRef;
  /** A compiled StructureDefinition by canonical URL. */
  structureDefinition(url: string): Record<string, unknown>;
  /** A compiled example instance by its id. */
  instance(id: string): Record<string, unknown>;
  /** Where a model's FSH is, for links: the repository at the pinned commit. */
  sourceUrl(path: string): string;
}

function git(cwd: string, ...args: string[]): void {
  execFileSync("git", args, { cwd, stdio: ["ignore", "ignore", "pipe"] });
}

function fetchCommit(ref: PcmtModelsRef, dir: string): void {
  mkdirSync(dir, { recursive: true });
  git(dir, "init", "-q");
  for (const repo of [ref.repository, ...ref.mirrors]) {
    try {
      git(dir, "fetch", "-q", "--depth", "1", `${repo}.git`, ref.commit);
      git(dir, "checkout", "-q", "FETCH_HEAD");
      return;
    } catch {
      // the next mirror
    }
  }
  throw new Error(`smart-pcmt commit ${ref.commit} is in none of ${[ref.repository, ...ref.mirrors].join(", ")}`);
}

function compile(ref: PcmtModelsRef, dir: string): void {
  const onPath = (() => {
    try {
      return execFileSync("sushi", ["-v"], { encoding: "utf8" }).includes(`v${ref.sushi}`);
    } catch {
      return false;
    }
  })();
  const [cmd, args] = onPath ? ["sushi", ["build", "."]] : ["bunx", [`fsh-sushi@${ref.sushi}`, "build", "."]];
  execFileSync(cmd, args, { cwd: dir, stdio: ["ignore", "ignore", "inherit"] });
}

export function loadPcmtModels(refFile: string = REF): PcmtModels {
  const ref = PcmtModelsRef.parse(JSON.parse(readFileSync(refFile, "utf8")));
  const dir = join(ROOT, "build/pcmt-models", ref.commit);
  const resources = join(dir, "fsh-generated/resources");
  if (!existsSync(resources)) {
    rmSync(dir, { recursive: true, force: true });
    fetchCommit(ref, dir);
    compile(ref, dir);
  }
  const files = readdirSync(resources);
  const byUrl = new Map<string, string>();
  for (const f of files.filter((f) => f.startsWith("StructureDefinition-"))) {
    const sd = JSON.parse(readFileSync(join(resources, f), "utf8")) as { url: string };
    byUrl.set(sd.url, f);
  }
  return {
    ref,
    structureDefinition(url) {
      const f = byUrl.get(url);
      if (!f) throw new Error(`smart-pcmt@${ref.commit.slice(0, 7)} has no StructureDefinition ${url}`);
      return JSON.parse(readFileSync(join(resources, f), "utf8"));
    },
    instance(id) {
      const f = files.find((f) => f === `Binary-${id}.json` || f.endsWith(`-${id}.json`));
      if (!f) throw new Error(`smart-pcmt@${ref.commit.slice(0, 7)} has no example instance ${id}`);
      return JSON.parse(readFileSync(join(resources, f), "utf8"));
    },
    sourceUrl(path) {
      return `${ref.repository}/blob/${ref.commit}/${path}`;
    },
  };
}
