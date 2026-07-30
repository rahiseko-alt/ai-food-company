import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

test("the root package is pinned to the static-site toolchain", () => {
  const packageJson = readJson("package.json");

  assert.equal(packageJson.name, "kose-food-ai-hp");
  assert.equal(packageJson.packageManager, "pnpm@10.33.0");
  assert.equal(packageJson.engines.node, "22.x");
  assert.equal(packageJson.scripts.build, undefined);
});

test("removed template and workspace paths do not return", () => {
  const removedDirectories = [
    "apps/",
    "packages/",
    "presets/",
  ];
  const removedFiles = [
    "pnpm-workspace.yaml",
    "tsconfig.base.json",
    "scripts/build-site-single.py",
    "scripts/setup.sh",
    ".github/workflows/auto-merge.yml",
  ];

  for (const path of removedDirectories) {
    const present = execFileSync("git", ["ls-files", "--", path], { encoding: "utf8" })
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .filter(existsSync);
    assert.deepEqual(present, [], `${path} must not contain tracked files`);
  }

  for (const path of removedFiles) {
    assert.equal(existsSync(path), false, `${path} must remain removed`);
  }
});

test("deployment documentation separates the repository and Pages names", () => {
  const deploy = readFileSync("docs/site/DEPLOY.md", "utf8");

  assert.match(deploy, /rahiseko-alt\/kose-food-ai-hp/);
  assert.match(deploy, /Cloudflare Pages.+`ai-food-company`/s);
  assert.doesNotMatch(deploy, /rahiseko-alt\/ai-food-company/);
});
