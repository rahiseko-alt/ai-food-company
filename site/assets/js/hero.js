/* =========================================================================
   Kose Food AI — オープニング制御

   GSAP 3.13.0 マスタータイムライン + lottie-web 5.12.2（GSAP がフレームを
   スクラブする方式）。描画は原典 hero.json / hero-sp.json そのものなので
   絵は完全一致し、GSAP 側が再生位置・割り込み・DOM 演出を統括する。

   原典 home.min.js 復元の制御ロジック:
     schedule(elapsed=0){ tA = max(0, 10000 - 1000*elapsed); tB = tA + 1000; }
     SKIP: goToAndPlay(11 / getDuration(false) * getDuration(true)) + schedule(11)
           => tA=0（即 .loading） / tB=1000（1.0s 後 .loaded）

   実測タイミング（Lottie キーフレーム直読 / 29.97fps・361frames）:
     0.167-1.435s  1枚目の筆文字   上段→下段のワイプ
     3.07s         赤い刷毛の幕 1回目
     4.371-5.539s  2枚目の筆文字（赤地に白抜き）
     7.17s         赤い刷毛の幕 2回目
     8.008/8.289/8.570/8.851s  コメントカード4枚  各367ms
     8.809-10.377s 3枚目の筆文字
     10.000s       .loading（マーキーIN／SKIP消灯）
     11.000s       .loaded（ヘッダー・SCROLL フェードイン／スクロール解禁）
   ========================================================================= */
(function () {
  'use strict';

  /* --- 調整用のつまみ（プロトタイプの Tweaks 相当） --------------------- */
  var CONFIG = {
    showSkip: true,          // 右下の SKIP ボタンを出すか
    showScrollHint: true,    // 右下の SCROLL 誘導を出すか
    openingSpeed: 1,         // オープニングの再生速度（1 = 12.045s）
    lottie: {
      pc: 'assets/lottie/hero.json',
      sp: 'assets/lottie/hero-sp.json',
      breakpoint: 767        // これ以下の幅で SP 用に切り替え
    }
  };

  /* LOADED = バーが降りきってスクロールを解禁する時刻 */
  var T = { LOADING: 10, LOADED: 11.7, TRANSIT: 0.4 };

  /* 本体UIへの移行の拍。上部バー・マーキー・カード4枚を同じ開始時刻・同じ尺・
     同じイージングで動かし、動き始めと動き終わりを視覚的に揃える。 */
  var CUE = 10.6, DUR = 1.1, EASE = 'power3.out';

  function HeroOpening(root, config) {
    this.root = root;
    this.config = config;
    this.tl = null;
    this.anim = null;
    this.spins = [];
    this.skipped = false;
    this.built = false;
    this.locked = false;
    this.detailOpen = false;
  }

  HeroOpening.prototype.q = function (name) {
    return Array.prototype.slice.call(this.root.querySelectorAll('[data-hero="' + name + '"]'));
  };

  HeroOpening.prototype.start = function () {
    var self = this;
    this.waitFor(function () { return window.gsap && window.lottie; }).then(function () { self.boot(); });
  };

  HeroOpening.prototype.waitFor = function (test) {
    return new Promise(function (resolve) {
      var tick = function () { test() ? resolve() : setTimeout(tick, 30); };
      tick();
    });
  };

  /* --- 無限マーキー : loop_1st(animation-delay -48s) / loop_2nd, 96s linear --- */
  HeroOpening.prototype.marquee = function (root, dir) {
    if (!root) return;
    var slides = root.querySelectorAll('[data-hero="slide"]');
    var a = slides[0], b = slides[1];
    if (!a || !b) return;
    /* スライド2枚を1つの帯として等速で送る。幅 W の2枚が並ぶので
       leftward は 0 → -100%、rightward は -100% → 0 で常に画面を覆う。 */
    var left = (dir || 1) > 0;
    var t = gsap.fromTo([a, b],
      { xPercent: left ? 0 : -100 },
      { xPercent: left ? -100 : 0, duration: 96, ease: 'none', repeat: -1 });
    t.progress(0.5);   // 原典 animation-delay: -48s
    this.spins.push(t);
  };

  /* --- @keyframes hero_scroll 2s cubic-bezier(.5,-.1,.5,1) infinite --- */
  HeroOpening.prototype.scrollBar = function () {
    var bar = this.q('scrollbar')[0];
    if (!bar) return;
    var ease = window.CustomEase ? 'scrollEase' : 'power1.inOut';
    var tl = gsap.timeline({ repeat: -1 })
      .set(bar, { transformOrigin: '0% 100%', scaleY: 1 })
      .to(bar, { scaleY: 0, duration: 1, ease: ease })
      .set(bar, { transformOrigin: '0% 0%' })
      .to(bar, { scaleY: 1, duration: 1, ease: ease });
    this.spins.push(tl);
  };

  /* --- スクロール連動：ズームしながらホワイトアウト ---
     iOS Safari は高速スクロール中に window.scrollY の更新が止まるため
     滑走路の getBoundingClientRect を rAF で読む。scrollY は使わない。 */
  HeroOpening.prototype.initScrollout = function () {
    var self = this;
    var runway = this.q('runway')[0], hero = this.q('hero')[0];
    var veil = this.q('whiteout')[0], hail = this.q('greeting')[0], flash = this.q('flash')[0];
    if (!runway || !hero || !veil) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var raf = 0, lastP = -1;

    /* margin-top: -100svh で runway 末尾に重ねてあるので、p=1 で
       ちょうど画面最上部に来る。以後は p 駆動でクロスフェードさせる。 */
    var menu = this.q('menu')[0] || null;
    if (menu) {
      menu.style.opacity = '0';
      menu.style.transformOrigin = '50% 0';
      menu.style.willChange = 'opacity, transform';
    }

    /* 区間 [a,b] を 0→1 に正規化 */
    var seg = function (p, a, b) { return Math.min(1, Math.max(0, (p - a) / (b - a))); };
    var smooth = function (v) { return v * v * (3 - 2 * v); };

    var apply = function (p) {
      if (p === lastP) return;
      lastP = p;

      /* 第1幕 0–0.1667 : ヒーローがズームしながら幕が上がる */
      hero.style.transform = 'scale(' + (1 + seg(p, 0, 0.1667) * 0.42).toFixed(4) + ')';
      veil.style.opacity = smooth(seg(p, 0.0143, 0.1524)).toFixed(4);

      /* 第2幕：ズームイン(0.1667-0.2381) → ステイ(0.2381-0.56) → ズームアウト(0.56-0.74)。
         お品書きの登場(0.62-0.86)と重ねてクロスさせ、紙だけの空白区間を作らない。 */
      if (hail) {
        var inn = smooth(seg(p, 0.1667, 0.2381));
        var out = smooth(seg(p, 0.56, 0.74));
        hail.style.opacity = (inn * (1 - out)).toFixed(4);
        /* 「ズームアウト」＝手前に迫って抜けていく。退場は縮小ではなく拡大 */
        hail.style.transform = 'scale(' + (0.72 + inn * 0.28 + out * 1.3).toFixed(4) + ')';
      }
      if (flash) flash.style.opacity = '0';
      if (menu) {
        var m = smooth(seg(p, 0.62, 0.86));
        menu.style.opacity = m.toFixed(4);
        menu.style.transform = 'translateY(' + ((1 - m) * 40).toFixed(2) + 'px) scale(' + (0.985 + m * 0.015).toFixed(4) + ')';
      }
    };

    var read = function () {
      raf = 0;
      var r = runway.getBoundingClientRect();
      var span = r.height - window.innerHeight;
      var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
      apply(reduced ? (p > 0.05 ? 1 : 0) : p);
    };
    /* rAF がコールバックされないまま落ちると raf が真で固まり、以降の
       scroll が二度と read() を起こせなくなる（実機で高負荷時に再現）。
       rAF に加えて必ずタイムアウトの保険を並走させ、どちらか早い方で解除する。 */
    var schedule = function () {
      if (raf) return;
      raf = requestAnimationFrame(read);
      setTimeout(function () { if (raf) { cancelAnimationFrame(raf); read(); } }, 220);
    };
    this.onVis = function () { if (raf) cancelAnimationFrame(raf); raf = 0; read(); };
    document.addEventListener('visibilitychange', this.onVis);

    this.onScrollout = schedule;
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    /* 画面外に出た瞬間も1回だけ読む。読まないと最後の値で凍り、
       お品書きが opacity 0 のまま白紙で残る */
    if (window.IntersectionObserver) {
      this.io = new IntersectionObserver(function () { read(); }, { threshold: 0 });
      this.io.observe(runway);
    }
    read();
    void self;
  };

  /* --- お品書きの品名 → 全画面の詳細。委任なので項目を増やしても効く --- */
  HeroOpening.prototype.initMenu = function () {
    var self = this;
    var root = this.root;
    var view = this.q('detail')[0];
    if (!root || !view) return;
    var panels = Array.prototype.slice.call(view.querySelectorAll('[data-detail]'));

    var open = function (key) {
      panels.forEach(function (p) { p.classList.toggle('is-active', p.dataset.detail === key); });
      view.classList.add('is-open');
      view.scrollTop = 0;
      self.detailOpen = true;
      var close = view.querySelector('[data-hero="detailclose"]');
      if (close) close.focus();
    };
    var close = function () {
      view.classList.remove('is-open');
      self.detailOpen = false;
    };

    this.onMenuClick = function (e) {
      var hit = e.target.closest('[data-menu]');
      if (hit) { open(hit.dataset.menu); return; }
      if (e.target.closest('[data-hero="detailclose"]')) close();
    };
    this.onMenuKey = function (e) { if (e.key === 'Escape' && self.detailOpen) close(); };
    root.addEventListener('click', this.onMenuClick);
    document.addEventListener('keydown', this.onMenuKey);
  };

  HeroOpening.prototype.boot = function () {
    var self = this;
    if (window.CustomEase) {
      CustomEase.create('cssEaseOut', 'M0,0 C0,0 0.58,1 1,1');            // CSS ease-out
      CustomEase.create('scrollEase', 'M0,0 C0.5,-0.1 0.5,1 1,1');        // hero_scroll
    }

    /* つまみで切った要素は DOM から外す（q() が空配列を返すので以降は無害） */
    if (!this.config.showSkip) this.q('skip').forEach(function (el) { el.remove(); });
    if (!this.config.showScrollHint) this.q('scroll').forEach(function (el) { el.remove(); });

    var skipButton = this.q('skipbutton')[0];
    if (skipButton) {
      this.onSkipClick = function () { self.onSkip(); };
      skipButton.addEventListener('click', this.onSkipClick);
    }

    this.lock();
    this.initScrollout();
    this.initMenu();

    /* Lottie のテキストレイヤーは実フォントで採寸されるので先に読み終える */
    var sp = window.innerWidth <= this.config.lottie.breakpoint;

    /* 単一HTML版はデータを埋め込んで渡してくる（fetch しないので file:// でも動く） */
    var embedded = window.__HERO_LOTTIE__;
    if (embedded) {
      var data = embedded.get(sp);
      if (data && data.layers) { this.mountLottie(data); return; }
      this.showMissing('埋め込みの Lottie データを解釈できません');
      return;
    }

    var file = sp ? this.config.lottie.sp : this.config.lottie.pc;

    fetch(file, { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.layers) throw new Error('Lottie JSON として解釈できません');
        self.mountLottie(data);
      })
      .catch(function (e) { self.showMissing(file + ' → ' + e.message); });
  };

  HeroOpening.prototype.showMissing = function (detail) {
    var box = this.q('missing')[0];
    if (box) box.classList.add('is-visible');
    var d = this.q('missingdetail')[0];
    if (d) d.textContent = detail;
    this.unlock();
  };

  HeroOpening.prototype.mountLottie = function (data) {
    var self = this;
    var box = this.q('lottie')[0];
    var hero = this.q('hero')[0];
    var anim = lottie.loadAnimation({
      container: box, renderer: 'svg', loop: false, autoplay: false, animationData: data
    });
    this.anim = anim;

    /* 原典: ratio = animationData.h / animationData.w で .is-tall 判定 */
    var ratio = (data.w && data.h) ? data.h / data.w : null;
    this.onResize = function () {
      if (!ratio || !hero || !box) return;
      var tall = hero.clientHeight / hero.clientWidth > ratio;
      box.style.top = tall ? 'auto' : '50%';
      box.style.bottom = tall ? '0' : 'auto';
      box.style.transform = tall ? 'translateX(-50%)' : 'translate(-50%, -50%)';
    };
    window.addEventListener('resize', this.onResize);
    this.onResize();

    /* animationData 直渡しだと DOMLoaded が addEventListener より前に
       発火し得るので、両方から一度だけ組む */
    var start = function () { if (self.built) return; self.built = true; self.buildTimeline(); };
    anim.addEventListener('DOMLoaded', start);
    if (anim.isLoaded) start(); else setTimeout(start, 1200);
  };

  HeroOpening.prototype.buildTimeline = function () {
    var self = this;
    var anim = this.anim;
    var duration = anim.getDuration(false);          // 12.045378...s
    var totalFrames = anim.totalFrames;              // 361

    gsap.set(this.q('loop01'), { y: 0, yPercent: -100 });
    gsap.set(this.q('loop02'), { y: 0, yPercent: 100 });
    anim.goToAndStop(0, true);

    /* GSAP が書き込んだ瞬間に描画するセッター。seek()/pause(t) は
       コールバックを抑制するが値の書き込みは行うので、これなら常に追従する。 */
    var frame = -1;
    var proxy = {};
    Object.defineProperty(proxy, 'f', {
      get: function () { return frame < 0 ? 0 : frame; },
      set: function (v) {
        if (v === frame) return;
        frame = v;
        anim.goToAndStop(v, true);
        if (self.tl) self.sync(self.tl.time());
      }
    });

    var tl = gsap.timeline({ paused: true, onUpdate: function () { self.sync(tl.time()); } });
    this.tl = tl;

    /* --- Lottie 本体を GSAP が等速スクラブ（原典と同じ 12.045s） --- */
    tl.to(proxy, { f: totalFrames - 1, duration: duration, ease: 'none' }, 0);

    /* --- SKIP は拍の前に退場させる --- */
    tl.to(this.q('skip'), { opacity: 0, duration: 0.5, ease: 'cssEaseOut' }, CUE - 0.6);

    /* --- 上部バー（画面外・上から下へ）。中身も一緒に降りてくる --- */
    var bar = this.q('header')[0];
    if (bar) {
      tl.fromTo(bar,
        { opacity: 1, yPercent: -100 },
        { yPercent: 0, duration: DUR, ease: EASE }, CUE);
      tl.fromTo(Array.prototype.slice.call(bar.children),
        { yPercent: -80, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: DUR, ease: EASE }, CUE);
    }

    /* --- 上下の横スクロール文字 --- */
    tl.to(this.q('loop01'), { yPercent: 0, duration: DUR, ease: EASE }, CUE);
    tl.to(this.q('loop02'), { yPercent: 0, duration: DUR, ease: EASE }, CUE);

    /* --- コメントカード4枚。ずらさず同時に立ち上げる --- */
    this.q('card').forEach(function (el) {
      var rot = parseFloat(el.dataset.rot) || 0;
      tl.fromTo(el,
        { opacity: 0, yPercent: 44, scale: 0.94, rotation: rot * 0.2 },
        { opacity: 1, yPercent: 0, scale: 1, rotation: rot, duration: DUR, ease: EASE }, CUE);
    });

    /* --- SCROLL 誘導は拍が終わってから --- */
    tl.to(this.q('scroll'), { opacity: 1, duration: 0.5, ease: 'cssEaseOut' }, CUE + DUR + 0.25)
      .set({}, {}, Math.max(duration, CUE + DUR + 0.9));

    /* 無限ループはマスタータイムラインと同じ生存期間で持つ
       （boot() 側で作ると作り直し時に kill されたまま残らない） */
    this.spins.forEach(function (t) { t.kill(); });
    this.spins = [];
    this.marquee(this.q('loop01')[0], -1);   // 原典 .loop-rgt = 逆方向
    this.marquee(this.q('loop02')[0], 1);
    this.scrollBar();

    tl.timeScale(this.config.openingSpeed);
    this.sync(0);
    tl.play(0);
  };

  /* クラス状態相当のフラグは現在時刻から同期する（seek は onUpdate を抑制） */
  HeroOpening.prototype.sync = function (t) {
    var loading = t >= T.LOADING;
    var loaded = t >= T.LOADED;
    var skip = this.q('skip')[0];
    if (skip) skip.style.pointerEvents = loading ? 'none' : 'auto';
    var header = this.q('header')[0];
    if (header) header.style.pointerEvents = loaded ? 'auto' : 'none';
    if (loaded && this.locked) this.unlock();
  };

  /* スクロールコンテナは html なので body の overflow では止まらない。
     html 側を止め、リロード時のスクロール復元も無効化して必ず先頭から始める。 */
  HeroOpening.prototype.lock = function () {
    var self = this;
    this.locked = true;
    this.prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    if ('scrollRestoration' in history) {
      this.prevRestore = history.scrollRestoration;
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    /* 復元は load 後にも走るので数フレーム押し戻す */
    var n = 0;
    var pin = function () {
      if (!self.locked || n++ > 30) return;
      if (window.scrollY !== 0) window.scrollTo(0, 0);
      requestAnimationFrame(pin);
    };
    requestAnimationFrame(pin);
    /* rAF が止まる環境ではイントロが進まず unlock が来ない。
       固定したまま操作不能になるのを防ぐ実時間の保険。 */
    clearTimeout(this.lockTimer);
    this.lockTimer = setTimeout(function () {
      if (!self.locked) return;
      /* 演出が途中のまま無言で解禁されないよう、SKIP相当で終端まで確定させる */
      if (self.tl && !self.skipped) {
        self.skipped = true;
        /* seek は同期描画されるので rAF 不要。終端まで飛ばして最終状態を確定させる */
        self.tl.pause();
        self.tl.seek(self.tl.totalDuration());
        self.sync(self.tl.time());
      }
      self.unlock();
      /* 演出全体（tl の長さ）+ 余裕 を上限にする。固定13秒だと
         演出が長い場合に途中で強制終了してしまう。 */
    }, Math.max(13000, (this.tl ? this.tl.totalDuration() : T.LOADED) * 1000 + 1500));
  };

  HeroOpening.prototype.unlock = function () {
    this.locked = false;
    clearTimeout(this.lockTimer);
    document.documentElement.style.overflow = this.prevOverflow || '';
    if ('scrollRestoration' in history && this.prevRestore) history.scrollRestoration = this.prevRestore;
  };

  HeroOpening.prototype.onSkip = function () {
    var self = this;
    if (this.skipped || !this.tl) return;
    this.skipped = true;
    this.tl.seek(T.LOADING);
    this.sync(this.tl.time());
    this.tl.play();
    /* rAF が間引かれる実機では play() が進まず .loaded に到達しないため、
       進行しなければ終端へ同期seekして状態を確定させる */
    var t0 = this.tl.time();
    clearTimeout(this.skipGuard);
    this.skipGuard = setTimeout(function () {
      if (!self.tl || self.tl.time() > t0 + 0.05) return;
      self.tl.pause();
      self.tl.seek(self.tl.totalDuration());
      self.sync(self.tl.time());
    }, 700);
  };

  HeroOpening.prototype.destroy = function () {
    if (this.tl) this.tl.kill();
    if (this.anim) this.anim.destroy();
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.onScrollout) {
      window.removeEventListener('scroll', this.onScrollout);
      window.removeEventListener('resize', this.onScrollout);
    }
    if (this.io) { this.io.disconnect(); this.io = null; }
    if (this.onVis) document.removeEventListener('visibilitychange', this.onVis);
    if (this.onMenuKey) document.removeEventListener('keydown', this.onMenuKey);
    clearTimeout(this.lockTimer);
    clearTimeout(this.skipGuard);
    if (this.onMenuClick) this.root.removeEventListener('click', this.onMenuClick);
    this.spins.forEach(function (t) { t.kill(); });
    this.unlock();
  };

  /* --- 起動 ------------------------------------------------------------- */
  function init() {
    var root = document.querySelector('[data-hero="root"]');
    if (!root) return;
    var hero = new HeroOpening(root, CONFIG);
    window.heroOpening = hero;   // つまみをコンソールから触れるように
    hero.start();
    /* 戻る操作で bfcache から復帰したときに html の overflow が
       hidden のまま残らないようにする */
    window.addEventListener('pagehide', function () { hero.unlock(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
