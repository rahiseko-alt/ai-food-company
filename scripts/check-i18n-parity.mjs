#!/usr/bin/env node
// 多言語対応（G-7-2）の整合性リンタ。
// 同じ文言を複数箇所に手書きしないというAGENTS.mdの結合ルールに従い、翻訳文言は
// site/assets/js/i18n-data.mjs の1箇所に集約している。このスクリプトは:
//   1. 全言語（LANGUAGESで宣言された言語）が、日本語(ja)と同じキー集合を持つこと
//   2. どのキーも値が空文字でないこと
//   3. index.html が参照する data-i18n / data-i18n-placeholder / data-i18n-aria-label /
//      data-i18n-alt / data-i18n-template のキーが、すべて辞書に実在すること（逆に辞書にあって
//      HTMLで未使用のキーも報告する。孤立キーの放置を防ぐ）
// を機械で強制する。値そのものの翻訳品質までは判定しない。

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SITE = join(ROOT, "site");

async function main() {
  const { LANGUAGES, I18N } = await import(
    join(SITE, "assets", "js", "i18n-data.mjs")
  );

  const violations = [];

  if (!LANGUAGES.includes("ja")) {
    violations.push("LANGUAGES に 'ja' が含まれていません（原文の基準言語）");
  }

  const baseKeys = new Set(Object.keys(I18N.ja || {}));
  if (baseKeys.size === 0) {
    violations.push("I18N.ja にキーが1つもありません");
  }

  for (const lang of LANGUAGES) {
    const dict = I18N[lang];
    if (!dict) {
      violations.push(`I18N.${lang} が定義されていません`);
      continue;
    }
    const keys = new Set(Object.keys(dict));

    const missing = [...baseKeys].filter((k) => !keys.has(k));
    const extra = [...keys].filter((k) => !baseKeys.has(k));
    if (missing.length > 0) {
      violations.push(`I18N.${lang} に不足キー: ${missing.join(", ")}`);
    }
    if (extra.length > 0) {
      violations.push(`I18N.${lang} に余剰キー（ja に無い）: ${extra.join(", ")}`);
    }

    for (const [key, value] of Object.entries(dict)) {
      if (typeof value !== "string" || value.trim() === "") {
        violations.push(`I18N.${lang}.${key} が空、または文字列ではありません`);
      }
    }
  }

  const html = readFileSync(join(SITE, "index.html"), "utf8");
  const usedKeys = new Set();
  const attrPattern = /data-i18n(?:-placeholder|-aria-label|-alt|-template)?="([^"]+)"/g;
  for (const m of html.matchAll(attrPattern)) {
    usedKeys.add(m[1]);
  }

  if (usedKeys.size === 0) {
    violations.push("index.html に data-i18n 系属性が1件も見つかりません");
  }

  const missingInDict = [...usedKeys].filter((k) => !baseKeys.has(k));
  if (missingInDict.length > 0) {
    violations.push(
      `index.html が参照しているが辞書(ja)に無いキー: ${missingInDict.join(", ")}`,
    );
  }

  const unusedInHtml = [...baseKeys].filter((k) => !usedKeys.has(k));
  // lang.label はJS側（言語セレクトのaria-label生成）でのみ使うため、HTML未使用でも許容する
  const allowedUnused = new Set(["lang.label"]);
  const trulyUnused = unusedInHtml.filter((k) => !allowedUnused.has(k));
  if (trulyUnused.length > 0) {
    violations.push(
      `辞書にあるが index.html のどこからも参照されていないキー（孤立）: ${trulyUnused.join(", ")}`,
    );
  }

  if (violations.length > 0) {
    console.error("✗ 多言語対応の整合性: 不正を検出");
    for (const v of violations) console.error("  - " + v);
    process.exit(1);
  }

  console.log(
    `✓ 多言語対応の整合性: OK（${LANGUAGES.length}言語 × ${baseKeys.size}キー、HTML参照 ${usedKeys.size}件すべて一致）`,
  );
}

main();
