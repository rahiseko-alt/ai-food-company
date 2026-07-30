# Kose Food AI 開発ルール

このリポジトリは `https://food.kouheikosehira.com/` で公開する静的サイト専用です。
Next.js アプリや再利用テンプレートではありません。

## 正とする場所

- 公開物は `site/` だけです。Cloudflare Pages の出力先も `site` です。
- 作業前の受入条件と進捗の正は `docs/roadmap.html` です。
- 公開手順は `docs/site/DEPLOY.md`、日常の変更手順は
  `docs/site/MAINTENANCE.md` を参照します。
- 過去の失敗は `docs/failures.md` に追記し、既存記録を消しません。

## 変更してよい場所

- 画面、文言、画像、演出、フォーム: `site/`
- 品質検査と補助スクリプト: `scripts/`、`tests/`、ルートの設定ファイル
- 運用資料: `docs/site/`
- CI: `.github/workflows/`

未確定の料金、対応地域、返信時間、補助金、連絡方法などを推測で確定しないでください。

## 結合を増やさない

- 入口は `site/assets/js/main.mjs` の1つにします。機能は独立した ES Module に分けます。
- オープニング、Lottie読込、スクロール演出、メニュー詳細、フォーム送信の状態を
  互いのDOM移動量やタイマーに依存させません。
- 本文、お品書き、フォームをオープニングやスクロール演出の `transform` 対象にしません。
- CSSで通常フローを成立させ、JavaScriptが失敗しても本文と問い合わせ導線を表示します。
- 同じ文言やメニュー情報を複数箇所へ手書きしません。
- 例外的な数値、セレクター、URLは各機能の設定へ集約し、別機能から上書きしません。

## 必須チェック

Node.js 22 と pnpm 10.33.0 を使用します。ビルド処理はありません。

```sh
pnpm install --frozen-lockfile
pnpm run verify:references
pnpm run verify:lottie
pnpm run lint
pnpm run test:unit
pnpm run test:e2e
pnpm run test:a11y
pnpm run audit
pnpm run verify:roadmap
```

検査を省略した場合や実行できなかった場合は、完了報告に理由を明記します。テストを通すために
検査を無効化したり、空のテストや `echo` だけのスクリプトを置いたりしません。

## Git と公開

- ユーザーの未コミット変更を消したり、無関係なファイルを整形したりしません。
- 公開、push、PR作成は明示されたときだけ行います。
- Cloudflare Pages の実プロジェクト名は `ai-food-company` です。GitHub リポジトリ名は
  `rahiseko-alt/kose-food-ai-hp` であり、両者を混同しません。
- apex、`www`、Google Workspace のMXレコードは変更しません。
