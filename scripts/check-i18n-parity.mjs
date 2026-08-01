#!/usr/bin/env node
// 多言語対応（G-7-2）の整合性リンタ。
// 同じ文言を複数箇所に手書きしないというAGENTS.mdの結合ルールに従い、翻訳文言は
// site/assets/js/i18n-data.mjs の1箇所に集約している。このスクリプトは:
//   1. 全言語（LANGUAGESで宣言された言語）が、日本語(ja)と同じキー集合を持つこと
//   2. どのキーも値が空文字でないこと
//   3. index.html が参照する data-i18n / data-i18n-placeholder / data-i18n-aria-label /
//      data-i18n-alt / data-i18n-template のキーが、すべて辞書に実在すること（逆に辞書にあって
//      HTMLで未使用のキーも報告する。孤立キーの放置を防ぐ）
//   4. LANGUAGES に無い I18N の言語（誰にも選ばれない死んだデータ）と、LANGUAGE_LABELS の欠落
//      （言語セレクトが空欄の選択肢を出す事故）を検出すること
// を機械で強制する。値そのものの翻訳品質までは判定しない。

import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SITE = join(ROOT, "site");

async function main() {
  const { LANGUAGES, LANGUAGE_LABELS, I18N } = await import(
    pathToFileURL(join(SITE, "assets", "js", "i18n-data.mjs")).href
  );

  const violations = [];

  if (!LANGUAGES.includes("ja")) {
    violations.push("LANGUAGES に 'ja' が含まれていません（原文の基準言語）");
  }

  const baseKeys = new Set(Object.keys(I18N.ja || {}));
  if (baseKeys.size === 0) {
    violations.push("I18N.ja にキーが1つもありません");
  }

  const undeclared = Object.keys(I18N).filter((l) => !LANGUAGES.includes(l));
  if (undeclared.length > 0) {
    violations.push(
      `I18N にあるが LANGUAGES で宣言されていない言語（誰にも選ばれない死んだデータ）: ${undeclared.join(", ")}`,
    );
  }

  for (const lang of LANGUAGES) {
    const label = LANGUAGE_LABELS?.[lang];
    if (typeof label !== "string" || label.trim() === "") {
      violations.push(`LANGUAGE_LABELS.${lang} が空、または未定義です`);
    }
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

main().catch((error) => {
  console.error("✗ 多言語対応の整合性: 検査自体が失敗しました");
  console.error(error);
  process.exit(1);
});
