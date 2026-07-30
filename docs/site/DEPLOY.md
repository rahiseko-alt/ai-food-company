# 公開手順（Cloudflare Pages）

- **公開先** … `https://food.kouheikosehira.com/`
- **GitHub** … `rahiseko-alt/kose-food-ai-hp`
- **Cloudflare Pages のプロジェクト名** … `ai-food-company`
- **リポジトリ内の場所** … 配信するファイルは **`site/`** に置いてある
  （`site/index.html` ＋ `site/assets/` ＋ `site/_headers`）。`site/` の外にあるものは公開されない。
- **配信するもの** … `site/` の静的ファイル一式。ビルドや単一HTMLへの変換は行わない

## 調べて確定していること（2026-07-30 時点のDNS実測）

| 項目 | 状態 |
|---|---|
| `kouheikosehira.com` のネームサーバー | **Cloudflare**（`anton.ns.cloudflare.com` / `becky.ns.cloudflare.com`） |
| apex と `www` | ともに `76.76.21.21` ＝ **Vercel**。既存サイトが載っているので触らない |
| メール | **Google Workspace**（MX `aspmx.l.google.com` ほか、SPFあり）。**MXは絶対に触らない** |
| `food.kouheikosehira.com` | **未使用**（NXDOMAIN）。ここに載せれば既存サイトもメールも無傷 |

DNSがすでに Cloudflare なので、サブドメインのレコードは Pages 側から自動で作られる。
手でDNSを編集する必要はない。

---

## 1. GitHub に置く

Cloudflare Pages は GitHub リポジトリを見て自動公開する。

配信ファイルは `rahiseko-alt/kose-food-ai-hp` の `site/` に入っている。
プルリクエストを `main` にマージした時点で、この手順に進める状態になる。

```sh
git push -u origin <作業ブランチ>
# → GitHub でプルリクエストを作り、CI（ci-green）が緑になったらマージする
```

---

## 2. Cloudflare Pages の接続を確認する

1. <https://dash.cloudflare.com/> にログイン（`kouheikosehira.com` があるアカウント）
2. **Workers & Pages → `ai-food-company`** を開く
3. Git接続先が `rahiseko-alt/kose-food-ai-hp` であることを確認する
4. ビルド設定を次の値にする（ビルド不要の静的サイト）

   | 項目 | 値 |
   |---|---|
   | Framework preset | None |
   | Build command | （空欄） |
   | Build output directory | **`site`** ← ここだけ空欄ではなく指定する |
   | Root directory | （空欄） |
   | Production branch | `main` |

   ⚠ **Build output directory を `site` にすること**。`/`（リポジトリ直下）にすると
   リポジトリ内の運用ファイル（`AGENTS.md` や `docs/`）まで配信されてしまう。

5. **Save and Deploy** 後、PagesのURLで実機表示を一度確認する

---

## 3. サブドメインを繋ぐ

1. Pages のプロジェクト → **Custom domains → Set up a domain**
2. `food.kouheikosehira.com` を入力
3. 同一アカウントにゾーンがあるので、確認画面で承認すると **CNAMEが自動で作られる**
4. HTTPS証明書も自動発行。反映は数分〜最大1時間

apex と `www` のレコードには触らないこと（Vercelの既存サイトが落ちる）。
MXレコードにも触らないこと（`info@` のメールが止まる）。

---

## 4. フォームを有効化する（公開直後に1回だけ）

送信先は **FormSubmit**（登録不要）で `info@kouheikosehira.com` に配線済み。

```html
data-endpoint="https://formsubmit.co/ajax/info@kouheikosehira.com"
action="https://formsubmit.co/info@kouheikosehira.com"
```

**初回だけ有効化が必要**：公開後に自分でフォームを1回送信すると
`info@kouheikosehira.com` に確認メールが届く。その中のリンクを押すと以後は
通常どおり届く。押すまでは送信内容がメールになりません。

送られる項目：

| name | 内容 |
|---|---|
| `store` | 店名 / 会社名（必須） |
| `name` | お名前（必須） |
| `contact` | 連絡先（必須） |
| `detail` | いま困っていること（任意） |

### アドレスを隠したい場合

いまはHTMLに `info@kouheikosehira.com` が書かれているので、スパム収集に拾われる。
有効化後、FormSubmit の管理画面で発行される別名エンドポイント
（`https://formsubmit.co/el/xxxxxx` の形）に差し替えれば隠せる。
`data-endpoint` は `https://formsubmit.co/ajax/el/xxxxxx` になる。

管理画面や送信履歴が欲しいなら Formspree（無料枠 月50件）に替えてもよい。
`index.html` の2箇所のURLを差し替えるだけで動く。

---

## 5. 公開前に直す仮の文言

公開すると以下はすべて「お店の約束」として読まれる。`index.html` を検索して直すこと。

（以下の「場所」は `site/index.html` の中）

| 現在の文言 | 場所 |
|---|---|
| 初回相談は無料 | 相談セクションの定義リスト |
| 営業日24時間以内（返信） | 同上 |
| オンライン30分／来店・訪問（岐阜・愛知） | 同上 |
| オンライン30分／来店も可・岐阜県内は訪問可 | Menu 内 CTA の脇 |
| 概算費用、使える補助金までその場でお答えします | Menu 内 CTA の本文 |
| お急ぎの場合はお電話でも受け付けます（平日10:00–18:00） | フォーム下 |

未対応：

- 上部バーの「お問合せ ›」とナビ（ホーム／よくある質問）は**リンクしていない**。
  `#contact` へ繋ぐか、項目を削るか決める
- OG画像（SNSでシェアされたときの画像、1200×630）が未支給。
  用意できれば `site/index.html` の `og:image` を追加する

---

## 6. 公開後の更新

```sh
git add -A && git commit -m "..." && git push
# → Cloudflare Pages が自動で再公開
```

`assets/` は1年キャッシュの設定（`_headers`）なので、画像や Lottie を差し替えたときは
Pages の **Deployments → Manage → Purge cache** を実行するか、ファイル名を変える。

---

## 7. 公開できたことを機械で確かめる

自己申告ではなく外部事実で確かめる。GitHub の **Actions → prod-smoke → Run workflow** を実行する。
中でやっているのは3つで、いずれも実機（GitHub Actions）から本番URLとDNSを叩いている。

| 検査 | 内容 |
|---|---|
| prod 200 + marker | `https://food.kouheikosehira.com` が 200 で、本文に `Kose Food AI` を含む |
| 公開アセット | CSS / ES Modules / Lottie / 壁紙が本番で 200 |
| フォーム導線 | 問い合わせ欄と送信フォームが公開HTMLに存在する |
| DNS 無傷 | apex の A レコードが生きていて、MX が Google Workspace のまま |

緑になった **run の URL** を `docs/roadmap.html` の該当 criteria の `evidence` に貼る。
（`prod-smoke` は手動実行のみ。公開前に自動で回すと必ず赤くなるため）
