// 多言語対応（G-7）の翻訳データ正本。
// 対応言語: ja(日本語・原文) / en(英語) / zh(中国語簡体字) / ne(ネパール語) / vi(ベトナム語) / th(タイ語)
//
// 各言語オブジェクトは同じキー集合を持たなければならない（scripts/check-i18n-parity.mjs が機械強制）。
// 改行を含む文言は "\n" で表し、language-controller.mjs 側で <br> に変換する。
//
// 翻訳品質について: en/zh は高い確信度。ne/vi/th は機械翻訳相当の下訳であり、
// ネイティブチェックを経ていない（docs/roadmap.html の meta.goalgate.amendments 2026-07-31
// unresolved 参照）。公開前に可能な範囲でネイティブ確認を挟むことを推奨する。

export const LANGUAGES = ['ja', 'en', 'zh', 'ne', 'vi', 'th'];

export const LANGUAGE_LABELS = {
  ja: '日本語',
  en: 'English',
  zh: '中文',
  ne: 'नेपाली',
  vi: 'Tiếng Việt',
  th: 'ภาษาไทย',
};

export const I18N = {
  ja: {
    'nav.home': 'ホーム',
    'header.cta': 'お問合せ ›',
    'lang.label': '言語',

    'hero.card1_quote': 'レジ締めが\n30分早く終わる',
    'hero.card1_role': 'ホール／3年目',
    'hero.card2_quote': '発注の迷いが\nなくなった',
    'hero.card2_role': '店長／7年目',
    'hero.card3_quote': '休みの予定が\n立てられる',
    'hero.card3_role': 'キッチン／2年目',
    'hero.brand_sub': 'RESTAURANT DX',
    'hero.scroll': 'SCROLL',
    'hero.skip': 'SKIP',
    'hero.greeting_alt': 'いらっしゃいませ！',

    'menu.eyebrow': '飲食専門のAI顧問',
    'menu.title': '人を増やす前に、\n人がやらなくていい仕事を減らす。',
    'menu.lead': '人手不足の深刻さは飲食が全業種でも最上位、2025年の飲食店の倒産は900件を超えて過去最多。募集を出し続けるより、シフト・発注・電話・口コミといった「毎日必ず発生する事務」を先に外すほうが早く効きます。ツールを売って終わりにはしません。現場に入って優先順位を決め、設定まで済ませ、翌月から数字で確かめます。',
    'menu.profile': '飲食の現場に20年。そのうえで、AIの設定まで自分でやります。',

    'menu.item1.name': '現場診断',
    'menu.item1.desc': '一日ぶん張り付いて、時間とお金がどこで漏れているかを店ごとに洗い出す。',
    'menu.item1.term': '3日',
    'menu.item1.detail': '厨房とホールに立ち、実際の動きを見る。POSの履歴、シフト表、発注書を預かって数字にする。何が詰まっているかを紙1枚にして返す。',

    'menu.item2.name': '業務の棚卸し',
    'menu.item2.desc': '人がやらなくていい仕事と、人がやるべき仕事を仕分ける。ここが効き方を決める。',
    'menu.item2.term': '1週',
    'menu.item2.detail': '毎日の作業を全部書き出し、人がやるべきものと機械に渡せるものに分ける。渡せるものだけを次の工程に送る。',

    'menu.item3.name': 'AIシフト作成',
    'menu.item3.desc': '客数予測と希望シフトから原案を生成。月20時間かかっていた作業を1時間に。',
    'menu.item3.term': '2週',
    'menu.item3.detail': '希望休、スキル、売上予測を入れると原案が出る。店長は直すだけ。作成にかけていた時間がほぼ消える。',

    'menu.item4.name': 'AI需要予測と発注',
    'menu.item4.desc': '曜日・天気・予約から必要量を出す。廃棄と欠品を、勘ではなく数字で減らす。',
    'menu.item4.term': '3週',
    'menu.item4.detail': '天気、曜日、近隣の催事、過去の実績から翌日の客数を出す。発注量が自動で決まるので、迷いと廃棄が同時に減る。',

    'menu.item5.name': 'セルフオーダー導入',
    'menu.item5.desc': '注文取りをお客様側に渡し、ホール一人分の手を接客と仕込みに戻す。',
    'menu.item5.term': '2週',
    'menu.item5.detail': '注文を客席に渡す。ホールは料理を運び、話をすることに時間を戻せる。伝票の打ち間違いもなくなる。',

    'menu.item6.name': '電話予約のAI代行',
    'menu.item6.desc': '営業中の電話で接客が止まらない。取りこぼした予約も一次対応で拾う。',
    'menu.item6.term': '1週',
    'menu.item6.detail': '営業中の電話を機械が受ける。空席を見て予約を確定し、台帳に書き込む。手が止まらない。',

    'menu.item7.name': '口コミ返信の自動化',
    'menu.item7.desc': '返信の下書きを当日中に用意。評価は放置した分だけ落ちる。',
    'menu.item7.term': '5日',
    'menu.item7.detail': '投稿を拾って下書きを作る。店の言葉づかいを覚えさせるので、そのまま出せる文が上がってくる。',

    'menu.item8.name': '月次の数字報告会',
    'menu.item8.desc': '入れた仕組みが回っているかを毎月見て、外すもの・足すものを決める。',
    'menu.item8.term': '毎月',
    'menu.item8.detail': '入れて終わりにしない。毎月、効いた数字と効かなかった数字を並べて次の一手を決める。',

    'menu.callout_title': 'どれから手をつけるべきかは、店を見ないと決められません。',
    'menu.callout_body': '30分の相談で、いまの人件費率とロス、いちばん時間を食っている作業を伺って、効く順番をその場でお答えします。相談だけで終わっても構いません。',
    'menu.callout_cta': '無料で相談する ›',
    'menu.callout_note': 'オンライン30分',
    'menu.source': '出典：帝国データバンク「人手不足に対する企業の動向調査」、東京商工リサーチ／帝国データバンク 2025年 飲食店倒産集計。期間・効果は導入店での目安で、店舗規模と現状により変わります。',

    'contact.title': 'まず30分、店の話を聞かせてください。',
    'contact.lead': 'その場でお答えするのは2つです。いま何にいちばん時間とお金が漏れているか、どの順番で手をつけると早いか。売り込みはしません。相談だけで終わって構いません。',
    'contact.dl_method_label': '相談方法',
    'contact.dl_method_value': 'オンライン30分',
    'contact.dl_cost_label': '費用',
    'contact.dl_cost_value': '初回相談は無料',
    'contact.dl_reply_label': '返信',
    'contact.dl_reply_value': '営業日24時間以内',
    'contact.language_note': 'ご相談後のやり取り（お電話・お打ち合わせ）は日本語で行います。',

    'form.store_label': '店名 / 会社名',
    'form.store_placeholder': '例：山荘ぎふ',
    'form.name_label': 'お名前',
    'form.name_placeholder': '例：山田 太郎',
    'form.contact_label': '連絡先（メール または 電話）',
    'form.contact_placeholder': '例：080-0000-0000',
    'form.detail_label': 'いま困っていること（任意）',
    'form.detail_placeholder': '例：シフト作成に毎月20時間かかっている／食材ロスが減らない',
    'form.submit': '無料相談を申し込む ›',
    'form.note': 'お急ぎの場合はお電話でも受け付けます（毎日10:00–22:00）。',

  },

  en: {
    'nav.home': 'Home',
    'header.cta': 'Contact ›',
    'lang.label': 'Language',

    'hero.card1_quote': 'Register closing now\nfinishes 30 minutes earlier',
    'hero.card1_role': 'Floor staff, 3rd year',
    'hero.card2_quote': 'No more second-guessing\non ordering',
    'hero.card2_role': 'Manager, 7th year',
    'hero.card3_quote': 'I can actually plan\nmy days off now',
    'hero.card3_role': 'Kitchen, 2nd year',
    'hero.brand_sub': 'RESTAURANT DX',
    'hero.scroll': 'SCROLL',
    'hero.skip': 'SKIP',
    'hero.greeting_alt': 'Welcome!',

    'menu.eyebrow': 'AI Advisor for Restaurants',
    'menu.title': 'Before hiring more people,\ncut the work people shouldn’t have to do.',
    'menu.lead': 'Restaurants face the worst labor shortage of any industry, and restaurant bankruptcies in Japan topped 900 in 2025, a record high. Rather than keep posting job ads, it is faster to first remove the paperwork that happens every single day — shifts, ordering, phone calls, review replies. We don’t just sell a tool and walk away. We go on-site, decide the priority order, finish the setup, and check the numbers again the following month.',
    'menu.profile': 'Twenty years working in restaurants. That is why I set the AI up myself, on site.',

    'menu.item1.name': 'On-site Diagnosis',
    'menu.item1.desc': 'We spend a full day on the floor to find exactly where time and money are leaking, store by store.',
    'menu.item1.term': '3 days',
    'menu.item1.detail': 'We stand in the kitchen and on the floor and watch how things actually move. We take your POS history, shift schedules, and order sheets and turn them into numbers. What’s clogged comes back to you as one page.',

    'menu.item2.name': 'Task Inventory',
    'menu.item2.desc': 'We sort work that people don’t need to do from work only people should do. This decides how well everything else works.',
    'menu.item2.term': '1 week',
    'menu.item2.detail': 'We write out every daily task and split it into what a person must do and what can be handed to a machine. Only what can be handed off moves to the next step.',

    'menu.item3.name': 'AI Shift Scheduling',
    'menu.item3.desc': 'A draft schedule generated from customer forecasts and staff preferences. A 20-hour-a-month job becomes 1 hour.',
    'menu.item3.term': '2 weeks',
    'menu.item3.detail': 'Enter time-off requests, skills, and sales forecasts, and a draft comes out. The manager only has to correct it. The time spent building it from scratch almost disappears.',

    'menu.item4.name': 'AI Demand Forecast & Ordering',
    'menu.item4.desc': 'Order quantities calculated from day of week, weather, and reservations — cutting waste and stockouts with numbers instead of guesswork.',
    'menu.item4.term': '3 weeks',
    'menu.item4.detail': 'Tomorrow’s customer count is calculated from weather, day of week, nearby events, and past results. Order quantities are set automatically, cutting both hesitation and waste at once.',

    'menu.item5.name': 'Self-Order Rollout',
    'menu.item5.desc': 'Order-taking moves to the customer’s own device, giving the floor staff one more pair of hands for service and prep.',
    'menu.item5.term': '2 weeks',
    'menu.item5.detail': 'Orders go straight to the table. Floor staff get their time back for carrying food and talking with guests. Order-slip mistakes also disappear.',

    'menu.item6.name': 'AI Phone & Reservation Handling',
    'menu.item6.desc': 'Service on the floor doesn’t stop for a ringing phone during service. Missed calls still get a first response and are caught.',
    'menu.item6.term': '1 week',
    'menu.item6.detail': 'The system answers calls during service, checks availability, confirms the reservation, and logs it. Nobody has to stop what they’re doing.',

    'menu.item7.name': 'Automated Review Replies',
    'menu.item7.desc': 'Reply drafts are ready the same day. Ratings only fall the longer you leave a review unanswered.',
    'menu.item7.term': '5 days',
    'menu.item7.detail': 'The system picks up new reviews and drafts a reply. It learns your store’s tone of voice, so the draft comes out ready to post as-is.',

    'menu.item8.name': 'Monthly Numbers Review',
    'menu.item8.desc': 'A monthly check-in on whether what we set up is actually working, deciding what to drop and what to add.',
    'menu.item8.term': 'monthly',
    'menu.item8.detail': 'We don’t stop once it’s installed. Every month we line up what worked and what didn’t, and decide the next move together.',

    'menu.callout_title': 'We can’t tell you where to start without seeing your store first.',
    'menu.callout_body': 'In a 30-minute conversation we’ll ask about your current labor-cost ratio, losses, and the task eating the most time, and answer on the spot what order to tackle things in. It’s fine if it ends with just a conversation.',
    'menu.callout_cta': 'Talk to us, free ›',
    'menu.callout_note': '30 min online',
    'menu.source': 'Sources: Teikoku Databank “Survey on Corporate Trends Regarding Labor Shortages,” Tokyo Shoko Research / Teikoku Databank 2025 restaurant bankruptcy figures. Timeframes and results are rough guides from stores we’ve worked with and vary by store size and current situation.',

    'contact.title': 'First, give us 30 minutes to hear about your store.',
    'contact.lead': 'We’ll answer two things on the spot: where you’re losing the most time and money right now, and what order to tackle things in for the fastest result. No sales pitch — it’s fine if it ends with just a conversation.',
    'contact.dl_method_label': 'Format',
    'contact.dl_method_value': '30 min online',
    'contact.dl_cost_label': 'Cost',
    'contact.dl_cost_value': 'Free for the first consultation',
    'contact.dl_reply_label': 'Reply time',
    'contact.dl_reply_value': 'Within 24 hours on business days',
    'contact.language_note': 'Follow-up after your inquiry (phone calls, meetings) will be conducted in Japanese.',

    'form.store_label': 'Store / Company name',
    'form.store_placeholder': 'e.g. Sanso Gifu',
    'form.name_label': 'Your name',
    'form.name_placeholder': 'e.g. Taro Yamada',
    'form.contact_label': 'Contact (email or phone)',
    'form.contact_placeholder': 'e.g. 080-0000-0000',
    'form.detail_label': 'What’s troubling you right now (optional)',
    'form.detail_placeholder': 'e.g. Shift scheduling takes 20 hours every month / food loss won’t go down',
    'form.submit': 'Request a free consultation ›',
    'form.note': 'If it’s urgent, we also take calls (daily 10:00–22:00).',

  },

  zh: {
    'nav.home': '首页',
    'header.cta': '联系我们 ›',
    'lang.label': '语言',

    'hero.card1_quote': '结账时间\n提前了30分钟',
    'hero.card1_role': '外场／第3年',
    'hero.card2_quote': '订货不再\n犹豫不决',
    'hero.card2_role': '店长／第7年',
    'hero.card3_quote': '终于能\n安排休假了',
    'hero.card3_role': '厨房／第2年',
    'hero.brand_sub': 'RESTAURANT DX',
    'hero.scroll': 'SCROLL',
    'hero.skip': 'SKIP',
    'hero.greeting_alt': '欢迎光临！',

    'menu.eyebrow': '餐饮专属 AI 顾问',
    'menu.title': '在增加人手之前，\n先减少不必要由人来做的工作。',
    'menu.lead': '餐饮行业的人手短缺程度在所有行业中位居前列，2025年日本餐饮店倒闭数量超过900家，创下历史新高。与其持续招聘，不如先去掉每天必然发生的琐事——排班、订货、电话应对、点评回复——见效更快。我们不是卖完工具就撒手不管，而是深入现场，决定优先顺序，完成设置，并在次月用数字进行验证。',
    'menu.profile': '在餐饮一线工作二十年。正因如此，AI 的设置也由我亲自到店完成。',

    'menu.item1.name': '现场诊断',
    'menu.item1.desc': '在店里蹲点一整天，逐店找出时间和金钱究竟漏在哪里。',
    'menu.item1.term': '3天',
    'menu.item1.detail': '站在厨房和外场，观察实际的动线。收取POS记录、排班表、订货单并数据化，把问题点整理成一页纸交还给您。',

    'menu.item2.name': '业务盘点',
    'menu.item2.desc': '把不必要由人做的工作，和必须由人做的工作区分开来。这一步决定了后续的成效。',
    'menu.item2.term': '1周',
    'menu.item2.detail': '把每天的作业全部列出来，分成"必须由人做"和"可以交给机器"两类，只把可以交出去的部分送入下一个环节。',

    'menu.item3.name': 'AI 排班生成',
    'menu.item3.desc': '根据客流预测和员工休假意愿生成排班草案。原本每月20小时的工作缩短为1小时。',
    'menu.item3.term': '2周',
    'menu.item3.detail': '输入休假意愿、技能、销售预测后即可生成草案，店长只需修改即可。原本花在制作上的时间几乎消失。',

    'menu.item4.name': 'AI 需求预测与订货',
    'menu.item4.desc': '根据星期、天气、预约情况计算所需数量，用数字而非直觉来减少报废和缺货。',
    'menu.item4.term': '3周',
    'menu.item4.detail': '根据天气、星期、周边活动、过往业绩计算次日客流。订货量自动决定，犹豫和报废同时减少。',

    'menu.item5.name': '自助点餐导入',
    'menu.item5.desc': '把点餐交给顾客自己操作，把外场一人份的人手还给接待和备餐。',
    'menu.item5.term': '2周',
    'menu.item5.detail': '点餐直接传到顾客座位。外场可以把时间用在上菜和与顾客交流上，点单录入错误也随之消失。',

    'menu.item6.name': 'AI 电话预约代接',
    'menu.item6.desc': '营业中的电话不再打断接待。错过的预约也能通过一次应答被接住。',
    'menu.item6.term': '1周',
    'menu.item6.detail': '营业时间内的电话由系统接听，确认空位后完成预约并登记入账簿，手上的工作不会被打断。',

    'menu.item7.name': '点评回复自动化',
    'menu.item7.desc': '当天即可备好回复草稿。评分只会因为放置不理而下降。',
    'menu.item7.term': '5天',
    'menu.item7.detail': '系统会抓取新的点评并生成草稿，并学习本店的用语习惯，生成的文本可以直接使用。',

    'menu.item8.name': '每月数字复盘会',
    'menu.item8.desc': '每月检查引入的机制是否在正常运转，决定要撤掉什么、增加什么。',
    'menu.item8.term': '每月',
    'menu.item8.detail': '不会做完就结束。每月把见效的数字和没见效的数字并排对比，共同决定下一步。',

    'menu.callout_title': '从哪里入手，不实地看店是无法判断的。',
    'menu.callout_body': '在30分钟的沟通中，我们会询问您目前的人工成本率、损耗，以及最占用时间的工作，并当场回答应对的优先顺序。即使只是聊聊也没关系。',
    'menu.callout_cta': '免费咨询 ›',
    'menu.callout_note': '线上30分钟',
    'menu.source': '资料来源：帝国数据银行《关于人手不足的企业动向调查》、东京商工调查／帝国数据银行 2025年餐饮店倒闭统计。所示期间与效果为已合作店铺的大致参考，会因店铺规模及现状而有所不同。',

    'contact.title': '请先给我们30分钟，听听您店里的情况。',
    'contact.lead': '我们会当场回答两件事：目前最耗费时间和金钱的地方在哪里、按什么顺序着手最快见效。不会强行推销，即使只是聊聊也没关系。',
    'contact.dl_method_label': '咨询方式',
    'contact.dl_method_value': '线上30分钟',
    'contact.dl_cost_label': '费用',
    'contact.dl_cost_value': '首次咨询免费',
    'contact.dl_reply_label': '回复时间',
    'contact.dl_reply_value': '工作日24小时以内',
    'contact.language_note': '咨询之后的沟通（电话、洽谈）将以日语进行。',

    'form.store_label': '店名／公司名',
    'form.store_placeholder': '例：山庄岐阜',
    'form.name_label': '姓名',
    'form.name_placeholder': '例：山田太郎',
    'form.contact_label': '联系方式（邮箱或电话）',
    'form.contact_placeholder': '例：080-0000-0000',
    'form.detail_label': '目前遇到的困扰（选填）',
    'form.detail_placeholder': '例：每月排班要花20小时／食材损耗降不下来',
    'form.submit': '申请免费咨询 ›',
    'form.note': '如有急事也可致电咨询（每天 10:00–22:00）。',

  },

  ne: {
    'nav.home': 'गृहपृष्ठ',
    'header.cta': 'सम्पर्क गर्नुहोस् ›',
    'lang.label': 'भाषा',

    'hero.card1_quote': 'क्यास रजिस्टर मिलाउने काम\n३० मिनेट छिटो सकिन्छ',
    'hero.card1_role': 'फ्लोर स्टाफ／३ वर्ष',
    'hero.card2_quote': 'अर्डर गर्दा अब\nअलमल हुँदैन',
    'hero.card2_role': 'म्यानेजर／७ वर्ष',
    'hero.card3_quote': 'बिदाको योजना\nबनाउन सकिन्छ',
    'hero.card3_role': 'भान्सा／२ वर्ष',
    'hero.brand_sub': 'RESTAURANT DX',
    'hero.scroll': 'SCROLL',
    'hero.skip': 'SKIP',
    'hero.greeting_alt': 'स्वागत छ!',

    'menu.eyebrow': 'रेस्टुरेन्टका लागि AI सल्लाहकार',
    'menu.title': 'थप मानिस राख्नु अघि,\nमानिसले नगर्नुपर्ने काम घटाऔं।',
    'menu.lead': 'जापानमा रेस्टुरेन्ट उद्योगमा जनशक्तिको अभाव सबैभन्दा गम्भीर छ, र २०२५ मा रेस्टुरेन्ट दिवालियापनको संख्या ९०० भन्दा बढी पुगी अहिलेसम्मकै उच्च भयो। लगातार भर्ना विज्ञापन दिनुभन्दा, सिफ्ट, अर्डर, फोन, समीक्षाको जवाफ जस्ता हरेक दिन हुने काम पहिले हटाउनु छिटो प्रभावकारी हुन्छ। हामी उपकरण मात्र बेचेर छोड्दैनौं। साइटमा गएर प्राथमिकता तय गर्छौं, सेटअप पूरा गर्छौं, र अर्को महिनादेखि नतिजा संख्यामा जाँच्छौं।',
    'menu.profile': 'रेस्टुरेन्टको फिल्डमा २० वर्ष। त्यसैले AI को सेटअप पनि म आफैं ठाउँमै गएर गर्छु।',

    'menu.item1.name': 'स्थलगत निदान',
    'menu.item1.desc': 'पूरै एक दिन साइटमा बसेर, समय र पैसा कहाँ चुहिँदैछ भनेर हरेक पसलको लागि पत्ता लगाउँछौं।',
    'menu.item1.term': '३ दिन',
    'menu.item1.detail': 'भान्सा र फ्लोरमा उभिएर वास्तविक हलचल हेर्छौं। POS इतिहास, सिफ्ट तालिका, अर्डर पत्र लिएर संख्यामा बदल्छौं। समस्या कहाँ छ भनेर एक पानामा फिर्ता दिन्छौं।',

    'menu.item2.name': 'कामको सूचीकरण',
    'menu.item2.desc': 'मानिसले नगर्नुपर्ने काम र मानिसले नै गर्नुपर्ने काम छुट्याउँछौं। यसैले नतिजा निर्धारण गर्छ।',
    'menu.item2.term': '१ हप्ता',
    'menu.item2.detail': 'दैनिक सबै काम लेखेर, मानिसले गर्नुपर्ने र मेसिनलाई दिन सकिने भनी छुट्याउँछौं। दिन सकिनेलाई मात्र अर्को चरणमा पठाउँछौं।',

    'menu.item3.name': 'AI सिफ्ट निर्माण',
    'menu.item3.desc': 'ग्राहक संख्या अनुमान र कर्मचारीको इच्छा अनुसार मस्यौदा तयार गर्छ। महिनाको २० घण्टा लाग्ने काम १ घण्टामा।',
    'menu.item3.term': '२ हप्ता',
    'menu.item3.detail': 'बिदाको इच्छा, सीप, बिक्री अनुमान राख्दा मस्यौदा तयार हुन्छ। म्यानेजरले सच्याउनु मात्र पर्छ। बनाउनमा लाग्ने समय झन्डै हराउँछ।',

    'menu.item4.name': 'AI माग अनुमान र अर्डर',
    'menu.item4.desc': 'बार, मौसम, बुकिङबाट आवश्यक मात्रा निकाल्छ। अनुमानले होइन, संख्याले फोहोर र अभाव घटाउँछ।',
    'menu.item4.term': '३ हप्ता',
    'menu.item4.detail': 'मौसम, बार, नजिकैको कार्यक्रम, विगतको नतिजाबाट भोलिको ग्राहक संख्या निकाल्छ। अर्डर मात्रा स्वतः तय हुन्छ, अलमल र फोहोर दुवै घट्छ।',

    'menu.item5.name': 'सेल्फ-अर्डर सुरुवात',
    'menu.item5.desc': 'अर्डर लिने काम ग्राहकलाई नै दिएर, फ्लोर स्टाफको एकजनाको समय सेवा र तयारीमा फर्काउँछौं।',
    'menu.item5.term': '२ हप्ता',
    'menu.item5.detail': 'अर्डर सिधै टेबलमा जान्छ। फ्लोर स्टाफले खाना लैजाने र ग्राहकसँग कुरा गर्ने समय पाउँछन्। बिल लेख्दा हुने गल्ती पनि हराउँछ।',

    'menu.item6.name': 'AI फोन बुकिङ सेवा',
    'menu.item6.desc': 'व्यापारको समयमा फोनले सेवा रोकिँदैन। छुटेको बुकिङ पनि पहिलो प्रतिक्रियाले समात्छ।',
    'menu.item6.term': '१ हप्ता',
    'menu.item6.detail': 'व्यापारको समयमा फोन मेसिनले उठाउँछ। खाली ठाउँ हेरेर बुकिङ पक्का गर्छ र दर्ता गर्छ। हात रोकिँदैन।',

    'menu.item7.name': 'समीक्षा जवाफ स्वचालन',
    'menu.item7.desc': 'जवाफको मस्यौदा त्यसै दिन तयार हुन्छ। छोडिराखेको जति मूल्यांकन घट्छ।',
    'menu.item7.term': '५ दिन',
    'menu.item7.detail': 'पोस्ट टिपेर मस्यौदा बनाउँछ। पसलको बोलीचाली सिकाइएको हुन्छ, त्यसैले तयारी नै प्रयोग गर्न मिल्ने वाक्य आउँछ।',

    'menu.item8.name': 'मासिक नतिजा समीक्षा',
    'menu.item8.desc': 'राखेको प्रणाली चलिरहेको छ कि छैन महिनैपिच्छे हेरेर, हटाउने र थप्ने कुरा तय गर्छौं।',
    'menu.item8.term': 'मासिक',
    'menu.item8.detail': 'राखेर मात्र सकिँदैन। महिनैपिच्छे प्रभावकारी र अप्रभावकारी संख्या राखेर अर्को कदम तय गर्छौं।',

    'menu.callout_title': 'कहाँबाट सुरु गर्ने भनेर पसल नहेरी भन्न सकिँदैन।',
    'menu.callout_body': '३० मिनेटको सल्लाहमा, हालको श्रम लागत दर, नोक्सान, सबैभन्दा समय खाने काम सोधेर, प्रभावकारी क्रम त्यहीँ जवाफ दिन्छौं। सल्लाह मात्रैमा सकिए पनि हुन्छ।',
    'menu.callout_cta': 'निःशुल्क सल्लाह लिनुहोस् ›',
    'menu.callout_note': 'अनलाइन ३० मिनेट',
    'menu.source': 'स्रोत: टेइकोकु डाटाब्यांक "जनशक्ति अभावसम्बन्धी उद्यम प्रवृत्ति सर्वेक्षण", टोकियो शोको रिसर्च／टेइकोकु डाटाब्यांक २०२५ रेस्टुरेन्ट दिवालियापन तथ्यांक। अवधि र नतिजा सेवा लिएका पसलहरूको अनुमानित सन्दर्भ हुन्, पसलको आकार र हालको अवस्था अनुसार फरक पर्न सक्छ।',

    'contact.title': 'पहिले ३० मिनेट, आफ्नो पसलको कुरा सुनाउनुहोस्।',
    'contact.lead': 'हामी त्यहीँ २ कुरा जवाफ दिन्छौं: अहिले सबैभन्दा बढी समय र पैसा कहाँ चुहिँदैछ, कुन क्रममा सुरु गर्दा छिटो हुन्छ। बिक्री गर्न जोड दिँदैनौं। सल्लाह मात्रैमा सकिए पनि हुन्छ।',
    'contact.dl_method_label': 'सल्लाहको तरिका',
    'contact.dl_method_value': 'अनलाइन ३० मिनेट',
    'contact.dl_cost_label': 'लागत',
    'contact.dl_cost_value': 'पहिलो सल्लाह निःशुल्क',
    'contact.dl_reply_label': 'जवाफ',
    'contact.dl_reply_value': 'कार्यदिन २४ घण्टाभित्र',
    'contact.language_note': 'सम्पर्क पछिको कुराकानी (फोन, भेटघाट) जापानी भाषामा हुनेछ।',

    'form.store_label': 'पसल／कम्पनीको नाम',
    'form.store_placeholder': 'उदाहरण: सान्सो गिफु',
    'form.name_label': 'तपाईंको नाम',
    'form.name_placeholder': 'उदाहरण: यामादा तारो',
    'form.contact_label': 'सम्पर्क (इमेल वा फोन)',
    'form.contact_placeholder': 'उदाहरण: 080-0000-0000',
    'form.detail_label': 'अहिले भइरहेको समस्या (वैकल्पिक)',
    'form.detail_placeholder': 'उदाहरण: सिफ्ट बनाउन महिनाको २० घण्टा लाग्छ／खाना खेर जाने कुरा घट्दैन',
    'form.submit': 'निःशुल्क सल्लाहको लागि अनुरोध गर्नुहोस् ›',
    'form.note': 'हतार भए फोनबाट पनि सम्पर्क गर्न सकिन्छ (हरेक दिन 10:00–22:00)।',

  },

  vi: {
    'nav.home': 'Trang chủ',
    'header.cta': 'Liên hệ ›',
    'lang.label': 'Ngôn ngữ',

    'hero.card1_quote': 'Việc chốt sổ thu ngân\nnhanh hơn 30 phút',
    'hero.card1_role': 'Phục vụ／năm thứ 3',
    'hero.card2_quote': 'Không còn phân vân\nkhi đặt hàng',
    'hero.card2_role': 'Quản lý／năm thứ 7',
    'hero.card3_quote': 'Có thể lên kế hoạch\nnghỉ ngơi',
    'hero.card3_role': 'Bếp／năm thứ 2',
    'hero.brand_sub': 'RESTAURANT DX',
    'hero.scroll': 'SCROLL',
    'hero.skip': 'SKIP',
    'hero.greeting_alt': 'Xin chào quý khách!',

    'menu.eyebrow': 'Cố vấn AI chuyên ngành nhà hàng',
    'menu.title': 'Trước khi tuyển thêm người,\nhãy giảm bớt việc mà con người không cần phải làm.',
    'menu.lead': 'Ngành nhà hàng đang thiếu nhân lực nghiêm trọng nhất trong tất cả các ngành, và số vụ phá sản nhà hàng tại Nhật năm 2025 đã vượt 900, mức cao kỷ lục. Thay vì liên tục đăng tuyển, việc loại bỏ trước những công việc lặp lại hằng ngày như xếp ca, đặt hàng, nghe điện thoại, trả lời đánh giá sẽ có hiệu quả nhanh hơn. Chúng tôi không chỉ bán công cụ rồi thôi. Chúng tôi trực tiếp có mặt tại cửa hàng, quyết định thứ tự ưu tiên, hoàn tất cài đặt, và kiểm tra lại bằng số liệu vào tháng sau.',
    'menu.profile': 'Hai mươi năm làm việc trong ngành nhà hàng. Chính vì vậy, tôi tự mình đến cửa hàng cài đặt AI.',

    'menu.item1.name': 'Chẩn đoán tại chỗ',
    'menu.item1.desc': 'Chúng tôi có mặt trọn một ngày tại cửa hàng để tìm ra chính xác thời gian và tiền bạc đang bị thất thoát ở đâu.',
    'menu.item1.term': '3 ngày',
    'menu.item1.detail': 'Chúng tôi đứng ở bếp và khu vực phục vụ để quan sát thực tế. Nhận lịch sử POS, bảng ca làm, đơn đặt hàng và chuyển thành số liệu. Vấn đề nằm ở đâu sẽ được tổng hợp lại trong một trang giấy.',

    'menu.item2.name': 'Kiểm kê công việc',
    'menu.item2.desc': 'Phân loại việc không cần con người làm và việc bắt buộc phải do con người làm. Đây là bước quyết định hiệu quả.',
    'menu.item2.term': '1 tuần',
    'menu.item2.detail': 'Liệt kê toàn bộ công việc hằng ngày, phân chia thành việc con người phải làm và việc có thể giao cho máy. Chỉ những việc có thể giao mới chuyển sang bước tiếp theo.',

    'menu.item3.name': 'Xếp ca bằng AI',
    'menu.item3.desc': 'Tạo bản nháp lịch làm việc từ dự báo lượng khách và nguyện vọng nhân viên. Việc từng mất 20 giờ/tháng nay chỉ còn 1 giờ.',
    'menu.item3.term': '2 tuần',
    'menu.item3.detail': 'Nhập nguyện vọng nghỉ, kỹ năng, dự báo doanh thu thì bản nháp sẽ ra. Quản lý chỉ cần chỉnh sửa. Thời gian bỏ ra để làm từ đầu gần như biến mất.',

    'menu.item4.name': 'Dự báo nhu cầu & đặt hàng bằng AI',
    'menu.item4.desc': 'Tính lượng cần đặt từ ngày trong tuần, thời tiết, lượng đặt bàn — giảm lãng phí và thiếu hàng bằng số liệu thay vì cảm tính.',
    'menu.item4.term': '3 tuần',
    'menu.item4.detail': 'Lượng khách ngày mai được tính từ thời tiết, ngày trong tuần, sự kiện lân cận, kết quả trước đây. Lượng đặt hàng được quyết định tự động, giảm cả sự phân vân lẫn lãng phí.',

    'menu.item5.name': 'Triển khai tự đặt món',
    'menu.item5.desc': 'Giao việc nhận order cho khách hàng tự thực hiện, trả lại một phần nhân lực phục vụ cho việc tiếp khách và chuẩn bị món.',
    'menu.item5.term': '2 tuần',
    'menu.item5.detail': 'Đơn hàng được gửi thẳng đến bàn. Nhân viên phục vụ có thêm thời gian để mang món và trò chuyện với khách. Lỗi ghi order cũng biến mất.',

    'menu.item6.name': 'AI tiếp nhận điện thoại đặt bàn',
    'menu.item6.desc': 'Điện thoại trong giờ mở cửa không làm gián đoạn việc phục vụ. Cuộc gọi bị lỡ cũng được phản hồi ban đầu và không bị bỏ sót.',
    'menu.item6.term': '1 tuần',
    'menu.item6.detail': 'Hệ thống tự động nghe điện thoại trong giờ mở cửa, kiểm tra chỗ trống, xác nhận đặt bàn và ghi vào sổ. Nhân viên không phải dừng tay.',

    'menu.item7.name': 'Tự động hoá trả lời đánh giá',
    'menu.item7.desc': 'Bản nháp trả lời được chuẩn bị ngay trong ngày. Đánh giá chỉ giảm khi bị bỏ mặc không phản hồi.',
    'menu.item7.term': '5 ngày',
    'menu.item7.detail': 'Hệ thống tự động lấy bài đánh giá mới và soạn bản nháp trả lời, đã học theo cách nói của cửa hàng nên có thể đăng ngay.',

    'menu.item8.name': 'Họp báo cáo số liệu hàng tháng',
    'menu.item8.desc': 'Kiểm tra hàng tháng xem hệ thống đã triển khai có đang vận hành tốt không, quyết định bỏ gì và thêm gì.',
    'menu.item8.term': 'hàng tháng',
    'menu.item8.detail': 'Không dừng lại sau khi lắp đặt. Mỗi tháng chúng tôi đối chiếu số liệu hiệu quả và không hiệu quả để cùng quyết định bước tiếp theo.',

    'menu.callout_title': 'Không thể biết nên bắt đầu từ đâu nếu chưa trực tiếp xem cửa hàng.',
    'menu.callout_body': 'Trong buổi trao đổi 30 phút, chúng tôi sẽ hỏi về tỷ lệ chi phí nhân sự hiện tại, thất thoát, và công việc chiếm nhiều thời gian nhất, rồi trả lời ngay tại chỗ về thứ tự ưu tiên hiệu quả. Chỉ trao đổi thôi cũng không sao.',
    'menu.callout_cta': 'Tư vấn miễn phí ›',
    'menu.callout_note': '30 phút trực tuyến',
    'menu.source': 'Nguồn: Teikoku Databank "Khảo sát xu hướng doanh nghiệp về thiếu hụt lao động", Tokyo Shoko Research／Teikoku Databank số liệu phá sản nhà hàng năm 2025. Thời gian và hiệu quả là mức tham khảo từ các cửa hàng đã áp dụng, có thể thay đổi theo quy mô và tình hình thực tế của từng cửa hàng.',

    'contact.title': 'Trước tiên, hãy dành 30 phút để chúng tôi nghe về cửa hàng của bạn.',
    'contact.lead': 'Chúng tôi sẽ trả lời ngay 2 điều: hiện tại đang thất thoát nhiều thời gian và tiền bạc nhất ở đâu, và nên bắt đầu theo thứ tự nào để nhanh có hiệu quả. Chúng tôi không chèo kéo bán hàng — chỉ trao đổi thôi cũng không sao.',
    'contact.dl_method_label': 'Hình thức',
    'contact.dl_method_value': '30 phút trực tuyến',
    'contact.dl_cost_label': 'Chi phí',
    'contact.dl_cost_value': 'Miễn phí cho buổi tư vấn đầu tiên',
    'contact.dl_reply_label': 'Phản hồi',
    'contact.dl_reply_value': 'Trong vòng 24 giờ làm việc',
    'contact.language_note': 'Sau khi liên hệ, các trao đổi tiếp theo (điện thoại, gặp mặt) sẽ được thực hiện bằng tiếng Nhật.',

    'form.store_label': 'Tên cửa hàng／công ty',
    'form.store_placeholder': 'Ví dụ: Sanso Gifu',
    'form.name_label': 'Họ tên của bạn',
    'form.name_placeholder': 'Ví dụ: Yamada Taro',
    'form.contact_label': 'Liên hệ (email hoặc điện thoại)',
    'form.contact_placeholder': 'Ví dụ: 080-0000-0000',
    'form.detail_label': 'Vấn đề bạn đang gặp phải (không bắt buộc)',
    'form.detail_placeholder': 'Ví dụ: Xếp ca mất 20 giờ mỗi tháng／hao hụt thực phẩm không giảm được',
    'form.submit': 'Đăng ký tư vấn miễn phí ›',
    'form.note': 'Nếu gấp, quý khách cũng có thể gọi điện (hàng ngày 10:00–22:00).',

  },

  th: {
    'nav.home': 'หน้าแรก',
    'header.cta': 'ติดต่อ ›',
    'lang.label': 'ภาษา',

    'hero.card1_quote': 'การปิดยอดเงินสด\nเสร็จเร็วขึ้น 30 นาที',
    'hero.card1_role': 'พนักงานเสิร์ฟ／ปีที่ 3',
    'hero.card2_quote': 'ไม่ต้องลังเล\nเรื่องการสั่งของอีกต่อไป',
    'hero.card2_role': 'ผู้จัดการ／ปีที่ 7',
    'hero.card3_quote': 'วางแผนวันหยุด\nได้แล้ว',
    'hero.card3_role': 'ครัว／ปีที่ 2',
    'hero.brand_sub': 'RESTAURANT DX',
    'hero.scroll': 'SCROLL',
    'hero.skip': 'SKIP',
    'hero.greeting_alt': 'ยินดีต้อนรับ!',

    'menu.eyebrow': 'ที่ปรึกษา AI เฉพาะทางร้านอาหาร',
    'menu.title': 'ก่อนจะเพิ่มคน\nลดงานที่ไม่จำเป็นต้องให้คนทำก่อน',
    'menu.lead': 'ธุรกิจร้านอาหารขาดแคลนแรงงานรุนแรงที่สุดในทุกอุตสาหกรรม และในปี 2025 จำนวนร้านอาหารในญี่ปุ่นที่ปิดกิจการมีมากกว่า 900 แห่ง ซึ่งสูงที่สุดเป็นประวัติการณ์ แทนที่จะประกาศรับสมัครงานต่อไปเรื่อยๆ การตัดงานประจำวันที่ต้องทำทุกวัน เช่น การจัดตารางกะ การสั่งของ รับโทรศัพท์ ตอบรีวิว ออกก่อน จะเห็นผลเร็วกว่า เราไม่ได้แค่ขายเครื่องมือแล้วจบ แต่จะลงพื้นที่จริง กำหนดลำดับความสำคัญ ติดตั้งให้เสร็จ แล้วตรวจสอบด้วยตัวเลขอีกครั้งในเดือนถัดไป',
    'menu.profile': 'ทำงานในร้านอาหารมา 20 ปี ด้วยเหตุนี้ ผมจึงลงไปตั้งค่า AI ที่ร้านด้วยตัวเอง',

    'menu.item1.name': 'วินิจฉัยหน้างาน',
    'menu.item1.desc': 'ลงพื้นที่ทั้งวัน เพื่อค้นหาว่าเวลาและเงินรั่วไหลไปที่ใดในแต่ละร้าน',
    'menu.item1.term': '3 วัน',
    'menu.item1.detail': 'ยืนสังเกตการทำงานจริงทั้งในครัวและหน้าร้าน รับประวัติ POS ตารางกะ ใบสั่งของมาทำเป็นตัวเลข แล้วสรุปปัญหาลงในกระดาษ 1 แผ่นส่งคืนให้',

    'menu.item2.name': 'สำรวจงานทั้งหมด',
    'menu.item2.desc': 'แยกงานที่ไม่จำเป็นต้องให้คนทำ ออกจากงานที่คนต้องทำ ขั้นตอนนี้เป็นตัวกำหนดผลลัพธ์',
    'menu.item2.term': '1 สัปดาห์',
    'menu.item2.detail': 'เขียนงานประจำวันทั้งหมดออกมา แยกเป็นสิ่งที่คนต้องทำกับสิ่งที่ส่งให้เครื่องจักรทำได้ ส่งเฉพาะส่วนที่ส่งได้ไปยังขั้นตอนถัดไป',

    'menu.item3.name': 'สร้างตารางกะด้วย AI',
    'menu.item3.desc': 'สร้างร่างตารางกะจากการคาดการณ์จำนวนลูกค้าและความต้องการวันหยุดของพนักงาน จากที่เคยใช้เวลา 20 ชั่วโมงต่อเดือน เหลือเพียง 1 ชั่วโมง',
    'menu.item3.term': '2 สัปดาห์',
    'menu.item3.detail': 'ใส่ความต้องการวันหยุด ทักษะ และคาดการณ์ยอดขาย ระบบจะสร้างร่างให้ ผู้จัดการเพียงแค่แก้ไข เวลาที่เคยใช้สร้างตารางแทบจะหายไป',

    'menu.item4.name': 'พยากรณ์ความต้องการและสั่งของด้วย AI',
    'menu.item4.desc': 'คำนวณปริมาณที่ต้องสั่งจากวันในสัปดาห์ สภาพอากาศ และการจอง ลดของเสียและของขาดด้วยตัวเลขแทนความรู้สึก',
    'menu.item4.term': '3 สัปดาห์',
    'menu.item4.detail': 'คำนวณจำนวนลูกค้าของวันพรุ่งนี้จากสภาพอากาศ วันในสัปดาห์ กิจกรรมใกล้เคียง และผลงานที่ผ่านมา ปริมาณการสั่งของถูกกำหนดโดยอัตโนมัติ ลดทั้งความลังเลและของเสียไปพร้อมกัน',

    'menu.item5.name': 'นำระบบสั่งอาหารด้วยตนเองมาใช้',
    'menu.item5.desc': 'ส่งมอบการรับออร์เดอร์ให้ลูกค้าทำเอง คืนแรงงานหน้าร้านให้กลับไปดูแลการต้อนรับและเตรียมอาหาร',
    'menu.item5.term': '2 สัปดาห์',
    'menu.item5.detail': 'ออร์เดอร์ส่งตรงไปยังโต๊ะ พนักงานหน้าร้านได้เวลาคืนมาสำหรับการเสิร์ฟอาหารและพูดคุยกับลูกค้า ความผิดพลาดในการจดออร์เดอร์ก็หายไปด้วย',

    'menu.item6.name': 'AI รับสายจองโต๊ะแทน',
    'menu.item6.desc': 'โทรศัพท์ระหว่างเวลาเปิดร้านจะไม่ทำให้การบริการหยุดชะงัก แม้แต่สายที่พลาดไปก็จะได้รับการตอบกลับเบื้องต้น',
    'menu.item6.term': '1 สัปดาห์',
    'menu.item6.detail': 'ระบบจะรับสายในช่วงเวลาเปิดร้าน ตรวจสอบที่ว่าง ยืนยันการจอง และบันทึกลงสมุด มือของพนักงานจะไม่หยุดทำงาน',

    'menu.item7.name': 'ตอบรีวิวอัตโนมัติ',
    'menu.item7.desc': 'ร่างคำตอบพร้อมใช้ภายในวันเดียวกัน คะแนนจะลดลงก็ต่อเมื่อปล่อยทิ้งไว้โดยไม่ตอบ',
    'menu.item7.term': '5 วัน',
    'menu.item7.detail': 'ระบบจะดึงรีวิวใหม่มาสร้างร่างคำตอบ โดยเรียนรู้น้ำเสียงการพูดของร้าน ทำให้ได้ข้อความที่พร้อมโพสต์ได้ทันที',

    'menu.item8.name': 'ประชุมรายงานตัวเลขประจำเดือน',
    'menu.item8.desc': 'ตรวจสอบทุกเดือนว่าระบบที่ติดตั้งไปทำงานได้ดีหรือไม่ แล้วตัดสินใจว่าจะตัดอะไรออกและเพิ่มอะไรเข้าไป',
    'menu.item8.term': 'ทุกเดือน',
    'menu.item8.detail': 'ไม่จบแค่ติดตั้งเสร็จ ทุกเดือนจะนำตัวเลขที่ได้ผลและไม่ได้ผลมาเทียบกัน แล้วตัดสินใจก้าวต่อไปด้วยกัน',

    'menu.callout_title': 'จะเริ่มจากส่วนไหนดี ต้องดูหน้าร้านจริงก่อนถึงจะตัดสินใจได้',
    'menu.callout_body': 'ในการพูดคุย 30 นาที เราจะสอบถามอัตราต้นทุนแรงงานปัจจุบัน ความสูญเสีย และงานที่กินเวลามากที่สุด แล้วตอบทันทีในเรื่องลำดับที่ควรเริ่มทำ แค่ปรึกษาเฉยๆ ก็ไม่เป็นไร',
    'menu.callout_cta': 'ปรึกษาฟรี ›',
    'menu.callout_note': 'ออนไลน์ 30 นาที',
    'menu.source': 'แหล่งข้อมูล: Teikoku Databank "การสำรวจแนวโน้มองค์กรเกี่ยวกับการขาดแคลนแรงงาน", Tokyo Shoko Research／Teikoku Databank สถิติการปิดกิจการร้านอาหารปี 2025 ระยะเวลาและผลลัพธ์เป็นตัวอย่างโดยประมาณจากร้านที่เคยใช้บริการ ซึ่งจะแตกต่างกันไปตามขนาดร้านและสถานการณ์ปัจจุบัน',

    'contact.title': 'ขอเวลา 30 นาทีก่อน เพื่อฟังเรื่องราวของร้านคุณ',
    'contact.lead': 'เราจะตอบ 2 เรื่องทันที คือ ตอนนี้เวลาและเงินรั่วไหลไปที่ใดมากที่สุด และควรเริ่มลำดับไหนก่อนถึงจะเห็นผลเร็ว เราไม่ยัดเยียดขายของ แค่ปรึกษาเฉยๆ ก็ไม่เป็นไร',
    'contact.dl_method_label': 'รูปแบบการปรึกษา',
    'contact.dl_method_value': 'ออนไลน์ 30 นาที',
    'contact.dl_cost_label': 'ค่าใช้จ่าย',
    'contact.dl_cost_value': 'ปรึกษาครั้งแรกฟรี',
    'contact.dl_reply_label': 'การตอบกลับ',
    'contact.dl_reply_value': 'ภายใน 24 ชั่วโมงในวันทำการ',
    'contact.language_note': 'การติดต่อหลังจากนี้ (โทรศัพท์ การพูดคุย) จะดำเนินการเป็นภาษาญี่ปุ่น',

    'form.store_label': 'ชื่อร้าน／บริษัท',
    'form.store_placeholder': 'ตัวอย่าง: Sanso Gifu',
    'form.name_label': 'ชื่อของคุณ',
    'form.name_placeholder': 'ตัวอย่าง: Yamada Taro',
    'form.contact_label': 'ช่องทางติดต่อ (อีเมลหรือโทรศัพท์)',
    'form.contact_placeholder': 'ตัวอย่าง: 080-0000-0000',
    'form.detail_label': 'ปัญหาที่กำลังเจออยู่ตอนนี้ (ไม่บังคับ)',
    'form.detail_placeholder': 'ตัวอย่าง: การจัดตารางกะใช้เวลา 20 ชั่วโมงทุกเดือน／ของเสียในวัตถุดิบไม่ลดลง',
    'form.submit': 'สมัครปรึกษาฟรี ›',
    'form.note': 'หากเร่งด่วน สามารถโทรติดต่อได้เช่นกัน (ทุกวัน 10:00–22:00)',

  },
};
