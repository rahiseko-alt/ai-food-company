# Kose Food AI

飲食事業者向けサービス「Kose Food AI」の公式サイトです。素の HTML、CSS、JavaScript
で構成し、`site/` をそのまま Cloudflare Pages から配信します。ビルドはありません。

## はじめる

Node.js 22 と pnpm 10.33.0 を用意してください。

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

ブラウザで <http://127.0.0.1:4173/> を開きます。

## 構成

| 場所 | 役割 |
|---|---|
| `site/` | 唯一の公開対象 |
| `site/index.html` | ページ構造と文言 |
| `site/assets/css/` | 見た目とレスポンシブ指定 |
| `site/assets/js/` | ES Modulesの画面機能 |
| `site/assets/lottie/` | PC・スマホのオープニング素材 |
| `docs/site/` | 保守・公開・設計資料 |
| `scripts/` | 静的参照、Lottie、ロードマップの契約検査 |
| `tests/` | Node単体テストとPlaywright検査 |

## 品質チェック

```sh
pnpm run check
```

ブラウザを初めて使う場合だけ、先に次を実行します。

```sh
pnpm exec playwright install chromium
```

個別コマンドと変更箇所は
[`docs/site/MAINTENANCE.md`](docs/site/MAINTENANCE.md)、公開作業は
[`docs/site/DEPLOY.md`](docs/site/DEPLOY.md) を参照してください。
