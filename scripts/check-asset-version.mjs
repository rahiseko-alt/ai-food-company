#!/usr/bin/env node
// キャッシュバスティングの一貫性リンタ。
// site/_headers は /assets/* を1年 immutable キャッシュにしている。中身だけ差し替えて
// ファイル名（クエリ含む）を変えないと、既にキャッシュ済みの訪問者には新しい版が一生届かない
// （2026-07-31 発覚: site.css を書き換えたのに参照が無版のままで、上部バーが消えたまま戻らない
// 事故になった。docs/failures.md 参照）。
//
// このスクリプトは「ビルド無しの静的サイト」向けの手動バージョニング規約を機械で強制する：
//   - index.html が読み込む assets/css/*.css・assets/js/*.mjs は必ず ?v=<値> を持つ
//   - assets/js/*.mjs 同士の相対 import も必ず同じ ?v=<値> を持つ
//   - 参照されている ?v= の値は、リポジトリ全体で単一（差し替えたら全部まとめて上げる）
// 値そのものの中身は問わない（日付でも連番でもよい）。揃っているかだけを見る。

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(__dirname, "..", "site");

function extractVersion(ref) {
  const m = ref.match(/\?v=([^&"'#]+)/);
  return m ? m[1] : null;
}

function main() {
  const found = []; // { where, ref, version }

  const html = readFileSync(join(SITE, "index.html"), "utf8");
  for (const m of html.matchAll(/(?:href|src)="(assets\/(?:css|js)\/[^"]+)"/g)) {
    found.push({ where: "index.html", ref: m[1], version: extractVersion(m[1]) });
  }

  const jsDir = join(SITE, "assets", "js");
  for (const name of readdirSync(jsDir)) {
    if (!name.endsWith(".mjs")) continue;
    const text = readFileSync(join(jsDir, name), "utf8");
    for (const m of text.matchAll(/from\s+['"](\.\/[^'"]+\.mjs(?:\?[^'"]*)?)['"]/g)) {
      found.push({ where: `assets/js/${name}`, ref: m[1], version: extractVersion(m[1]) });
    }
  }

  if (found.length === 0) {
    console.error("✗ アセットバージョン整合性: index.html / assets/js の参照が1件も見つかりません");
    process.exit(1);
  }

  const violations = [];
  for (const f of found) {
    if (!f.version) {
      violations.push(`${f.where} の参照 "${f.ref}" に ?v=<版> がありません`);
    }
  }

  const versions = new Set(found.map((f) => f.version).filter(Boolean));
  if (versions.size > 1) {
    violations.push(
      `?v= の値が揃っていません（${[...versions].join(" / ")}）。差し替えたファイルだけでなく、` +
        `index.html の参照と assets/js の import 文すべてを同じ値に上げること`,
    );
  }

  if (violations.length > 0) {
    console.error("✗ アセットバージョン整合性: 不正を検出");
    for (const v of violations) console.error("  - " + v);
    process.exit(1);
  }

  console.log(
    `✓ アセットバージョン整合性: OK（参照 ${found.length} 件、版 "${[...versions][0]}" で統一）`,
  );
}

main();
