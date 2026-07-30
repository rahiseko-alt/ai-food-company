# Kose Food AI — オープニング＋お品書き＋相談フォーム

Claude Design のプロトタイプ（`Sanso Hero Opening.dc.html`）を本番用の静的サイトとして
実装したもの。配信ファイル一式は リポジトリの **`site/`** に置いてある。

公開手順は [`DEPLOY.md`](./DEPLOY.md) を参照。

## ローカルで開く

`hero.json` を fetch するため **`file://` では動かない**（HTTP 配信が必須）。

```sh
python3 -m http.server 8777 --directory site
```

ブラウザで <http://127.0.0.1:8777/> を開く。

## スタック（この案件の確定事項）

| 項目 | 値 |
|---|---|
| ホスティング | Cloudflare Pages（Build output directory = `site`） |
| 言語 / ランタイム | 素の HTML / CSS / JavaScript（ビルドなし・Node 不要） |
| フレームワーク | 無し。アニメーションのみ GSAP 3.13.0 ＋ lottie-web 5.12.2（CDN ではなく同梱） |
| パッケージ管理 | 無し（依存を同梱しているため） |
| DB / 認証 | 無し |
| フォーム送信 | FormSubmit（外部サービス。送信先 `info@kouheikosehira.com`） |
| DNS | Cloudflare（`kouheikosehira.com`）。apex/www は Vercel の既存サイト、MX は Google Workspace |
| CI | GitHub Actions。`ci.yml` の `site` ジョブ（内部参照リンタ＋配信スモーク）と、手動実行の `prod-smoke.yml` |
| Lint / テスト | `scripts/check-site-assets.mjs`（内部参照リンタ）＋ 静的配信スモーク |

## 構成

| パス | 中身 |
|---|---|
| `site/index.html` | 全画面（ヒーロー／お品書き／詳細パネル／相談フォーム） |
| `site/assets/css/site.css` | スタイル。clamp() による流体スケーリングで PC〜SP を1系統で賄う |
| `site/assets/js/hero.js` | GSAP マスタータイムライン、Lottie スクラブ、スクロール連動、詳細パネル |
| `site/assets/js/contact.js` | 相談フォームの送信（FormSubmit へ ajax POST） |
| `site/assets/lottie/` | `hero.json`（PC）/ `hero-sp.json`（SP）。767px 境界で切替 |
| `site/assets/art/` | 壁紙 `paper.png`、「いらっしゃいませ！」`greeting-ink.png` |
| `site/assets/vendor/` | GSAP 3.13.0 / CustomEase / lottie-web 5.12.2（CDN ではなく同梱） |
| `site/_headers` | Cloudflare Pages のキャッシュ／セキュリティヘッダー設定 |
| `scripts/build-site-single.py` | 配布用に1枚の自己完結HTMLへ焼き固めるツール（公開サイトには使わない） |
| `scripts/check-site-assets.mjs` | `site/` の内部参照リンタ（CI が実行。リンク切れ＝本番404 を機械で弾く） |

## つまみ

`site/assets/js/hero.js` 冒頭の `CONFIG` で切り替える。

- `showSkip` — 右下の SKIP ボタン
- `showScrollHint` — 右下の SCROLL 誘導
- `openingSpeed` — オープニングの再生速度（1 = 12.045s）

## 変更したときのチェック

```sh
node scripts/check-site-assets.mjs             # 内部参照にリンク切れが無いか
python3 -m http.server 8777 --directory site   # 実際に配信して目で見る
```

同じ内容を CI（`.github/workflows/ci.yml` の `site` ジョブ）が機械で回している。
