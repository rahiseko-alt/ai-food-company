# Kose Food AI — オープニング＋お品書き＋相談フォーム

Claude Design のプロトタイプ（`Sanso Hero Opening.dc.html`）を本番用の静的サイトとして
実装したもの。配信ファイル一式は リポジトリの **`site/`** に置いてある。

公開手順は [`DEPLOY.md`](./DEPLOY.md) を参照。

## ローカルで開く

Lottieを取得するため **`file://` では動かない**（HTTP 配信が必須）。

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

ブラウザで <http://127.0.0.1:4173/> を開く。

## スタック（この案件の確定事項）

| 項目 | 値 |
|---|---|
| ホスティング | Cloudflare Pages（Build output directory = `site`） |
| 言語 / ランタイム | 素の HTML / CSS / JavaScript（公開ビルドなし。品質検査は Node 22） |
| フレームワーク | 無し。アニメーションのみ GSAP 3.13.0 ＋ lottie-web 5.12.2（CDN ではなく同梱） |
| パッケージ管理 | pnpm 10.33.0（品質ツールのみ。公開時のJS依存は同梱） |
| DB / 認証 | 無し |
| フォーム送信 | FormSubmit（外部サービス。送信先 `info@kouheikosehira.com`） |
| DNS | Cloudflare（`kouheikosehira.com`）。apex/www は Vercel の既存サイト、MX は Google Workspace |
| CI | GitHub Actions。lint、単体、Playwright、axe、監査、契約検査と、手動の本番スモーク |
| Lint / テスト | ESLint、Stylelint、HTML Validate、Node test、Playwright、axe-core |

## 構成

| パス | 中身 |
|---|---|
| `site/index.html` | 全画面（ヒーロー／お品書き／詳細ダイアログ／相談フォーム） |
| `site/assets/css/site.css` | スタイルと明示的なレスポンシブ指定 |
| `site/assets/js/main.mjs` | ブラウザ側の小さな起動入口 |
| `site/assets/js/*.mjs` | オープニング、Lottie、スクロール、詳細、フォームの独立機能 |
| `site/assets/lottie/` | `hero.json`（PC）/ `hero-sp.json`（SP）。767px 境界で切替 |
| `site/assets/art/` | 壁紙 `paper.png`、「いらっしゃいませ！」`greeting-ink.png` |
| `site/assets/vendor/` | GSAP 3.13.0 / CustomEase / lottie-web 5.12.2（CDN ではなく同梱） |
| `site/_headers` | Cloudflare Pages のキャッシュ／セキュリティヘッダー設定 |
| `scripts/check-site-assets.mjs` | `site/` の内部参照リンタ（CI が実行。リンク切れ＝本番404 を機械で弾く） |
| `scripts/check-lottie-contract.mjs` | スマホLottieの固定位置を守る契約検査 |

日常の変更箇所は [`MAINTENANCE.md`](./MAINTENANCE.md) を参照。

## 変更したときのチェック

`check` には Playwright と axe が含まれる。初回だけブラウザ本体の導入が要る
（入れずに走らせると、検査が始まる前に落ちる）。

```sh
pnpm exec playwright install chromium
pnpm run check
```

同じ検査を CI（`.github/workflows/ci.yml`）でも実行する。
