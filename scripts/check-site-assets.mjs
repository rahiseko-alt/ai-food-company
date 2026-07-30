#!/usr/bin/env node
// 静的サイト（site/）の内部参照リンタ。
// 公開ディレクトリの中で「参照しているのに実在しないファイル」を機械で弾く。
// Cloudflare Pages はビルドを挟まないので、参照ミスはそのまま本番の 404 になる。
// 対象＝ index.html の href/src、CSS の url()、JS 内の 'assets/...' 文字列。
// 外部URL（http(s):）・data: URI・ページ内アンカー（#）は対象外。

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, posix } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(__dirname, "..", "site");

/** site/ 配下の全ファイルを相対パスで列挙する。 */
function listFiles(dir, base = dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) listFiles(full, base, out);
    else out.push(posix.normalize(full.slice(base.length + 1).split("\\").join("/")));
  }
  return out;
}

const isExternal = (ref) =>
  /^(https?:)?\/\//.test(ref) || /^(data|mailto|tel):/.test(ref) || ref.startsWith("#");

/** 参照文字列を site/ 起点の相対パスへ正規化する（クエリ・フラグメントは落とす）。 */
function normalize(ref, fromFile) {
  const clean = ref.split("#")[0].split("?")[0];
  if (clean === "") return null;
  if (clean.startsWith("/")) return posix.normalize(clean.slice(1));
  return posix.normalize(posix.join(posix.dirname(fromFile), clean));
}

function collect(file, text, patterns) {
  const refs = [];
  for (const re of patterns) {
    for (const m of text.matchAll(re)) {
      const ref = m[1];
      if (!ref || isExternal(ref)) continue;
      refs.push({ ref, from: file });
    }
  }
  return refs;
}

function main() {
  if (!existsSync(SITE)) {
    console.error("✗ site/ が存在しません（公開ディレクトリが無い）");
    process.exit(1);
  }

  const files = new Set(listFiles(SITE));
  const violations = [];

  // 公開ディレクトリの最低限の体裁。
  for (const required of ["index.html", "_headers"]) {
    if (!files.has(required)) violations.push(`site/${required} がありません（公開に必須）`);
  }

  const refs = [];
  for (const file of files) {
    if (/\.(html|css|js)$/.test(file)) {
      const text = readFileSync(join(SITE, file), "utf8");
      if (file.endsWith(".html")) {
        refs.push(
          ...collect(file, text, [/(?:href|src)="([^"]*)"/g, /(?:href|src)='([^']*)'/g]),
        );
      } else if (file.endsWith(".css")) {
        refs.push(...collect(file, text, [/url\(\s*['"]?([^'")]+)['"]?\s*\)/g]));
      } else {
        // JS はクォートされた 'assets/...' 文字列だけを見る（動的組み立ては対象外）。
        // fetch のパスは JS ファイルではなく「読み込んだページ」からの相対なので、
        // 解決の起点は site/ 直下（index.html）に固定する。
        refs.push(
          ...collect(file, text, [/['"](assets\/[^'"]+)['"]/g]).map((r) => ({
            ...r,
            base: "index.html",
          })),
        );
      }
    }
  }

  for (const { ref, from, base } of refs) {
    const target = normalize(ref, base ?? from);
    if (target === null) continue;
    if (!files.has(target)) {
      violations.push(`site/${from} が参照する "${ref}" が存在しません（本番で404になる）`);
    }
  }

  if (violations.length > 0) {
    console.error("✗ site 内部参照リンタ: 不正を検出");
    for (const v of violations) console.error("  - " + v);
    process.exit(1);
  }

  console.log(
    `✓ site 内部参照リンタ: OK（ファイル ${files.size} 件 / 内部参照 ${refs.length} 件、リンク切れなし）`,
  );
}

main();
