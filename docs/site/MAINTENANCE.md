# Kose Food AI 更新ガイド

コードに詳しくなくても「どこを直し、何を確認するか」が分かるための手順です。
公開前の約束事や料金など、確定していない内容は推測で書かないでください。

## 最初にすること

1. `docs/roadmap.html` で今回の変更に対応する受入条件を確認します。
2. `pnpm run dev` を実行し、<http://127.0.0.1:4173/> を開きます。
3. 変更後にPCとスマホの両方で確認し、最後に `pnpm run check` を実行します。

初回だけ `pnpm install --frozen-lockfile` と
`pnpm exec playwright install chromium` が必要です。

## 文言を変える

触る場所は `site/index.html` です。変更したい文章を検索して、その箇所だけ直します。
同じ文章が複数見つかった場合は、表示用データが二重化していないか先に確認してください。

確認:

```sh
pnpm run lint:html
pnpm run test:e2e
```

## お品書きを変える

触る場所は `site/index.html` の `.menu__item` です。見出し、短い説明、詳細用の
隣接 `template` を1項目のまとまりとして扱います。別の場所に同じ内容を追加しません。

追加・削除後は、すべての行を順に開き、閉じるボタン、Escape、Tab移動、閉じた後の
フォーカス復帰を確認します。

## 色や余白を変える

触る場所は `site/assets/css/site.css` です。まずファイル上部のCSS変数を探します。
個別要素へ同じ色や余白を何度も直接書かず、共通値は変数を変更します。

確認:

```sh
pnpm run lint:css
pnpm run verify:asset-version
pnpm run test:e2e
```

320、390、768、1024、1440px幅で横にはみ出さず、文字や操作が重ならないことも見ます。

`site.css` の中身を1行でも変えたら、必ず「CSS/JSのキャッシュを更新する（?v=）」の手順に従います。

## 画像を変える

画像は `site/assets/art/` に置きます。既存画像を差し替える場合は同じ縦横比を保ちます。
名前を変えたら `site/index.html` または `site/assets/css/site.css` の参照も変更します。

確認:

```sh
pnpm run verify:references
```

本番では `assets/` が1年キャッシュされます（`site/_headers`）。画像は現状、下記の
バージョン機構の対象外なので、公開後に古い画像が残る場合はCloudflare Pagesのキャッシュを
消すか、ファイル名そのものを変更してください。

## CSS/JSのキャッシュを更新する（?v=）

`site/assets/css/*.css` と `site/assets/js/*.mjs` は `site/_headers` により
**1年・immutable** でキャッシュされます。中身だけ差し替えてファイル名（`?v=`込み）を
変えないと、公開前からサイトを開いていた人には新しい内容が一生届きません
（2026-07-31、これが原因で上部バーが消えたまま戻らない事故になりました。
`docs/failures.md` 参照）。

**`site/assets/css/site.css` か `site/assets/js/*.mjs` のどれか1つでも中身を変えたら、
`?v=` の値を全部まとめて同じ新しい値に上げてください。** 対象は次の全箇所です。

- `site/index.html` の `assets/css/site.css?v=...` と `assets/js/main.mjs?v=...`
- `site/assets/js/*.mjs` 同士の `import ... from './xxx.mjs?v=...'`

値は日付でも連番でもよく、揃っていることだけが重要です（例: `2026-07-31` → `2026-08-01`）。

確認:

```sh
pnpm run verify:asset-version
```

これは値が全ファイルで揃っているかだけを機械で見ます（一部だけ上げ忘れる事故を防ぎます）。
公開後は `docs/site/DEPLOY.md` の prod-smoke を手動実行し、本番の `?v=` 付きURLが
実際に200で取得できることまで確認してください。

## オープニングを変える

- PC素材: `site/assets/lottie/hero.json`
- スマホ素材: `site/assets/lottie/hero-sp.json`
- 再生と終了処理: `site/assets/js/` のopening関連モジュール
- スクロール演出: `site/assets/js/` のscroll関連モジュール

スマホの最後の筆文字は固定位置が契約です。Lottieを書き出し直した後は必ず確認します。

```sh
pnpm run verify:lottie
pnpm run test:e2e
```

本文、お品書き、フォームを演出の `transform` 対象へ追加しないでください。

## フォームを変える

項目のHTMLは `site/index.html`、送信処理は `site/assets/js/` のcontact関連モジュールです。
送信先メールアドレスやFormSubmitの設定を変える場合は、HTMLの `action` と
JavaScriptが参照する送信先が一致していることを確認します。

成功時だけ入力が消え、エラーやタイムアウト時は内容が残ることを確認してください。
実在する個人情報をテストへ書かないでください。

## 変更後の確認

```sh
pnpm run verify:references
pnpm run verify:lottie
pnpm run verify:asset-version
pnpm run lint
pnpm run test:unit
pnpm run test:e2e
pnpm run test:a11y
pnpm run audit
pnpm run verify:roadmap
```

全部まとめて実行する場合は `pnpm run check` です。失敗した検査を無効化せず、
表示や実装を直します。公開手順とDNSの注意点は `docs/site/DEPLOY.md` を参照してください。
