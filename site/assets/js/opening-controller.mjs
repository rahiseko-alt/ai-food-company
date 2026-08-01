import { OPENING_STATES } from './config.mjs?v=2026-08-01b';

const waitForFonts = (timeoutMs) => {
  if (!document.fonts?.ready) return Promise.resolve();
  let timer;
  return Promise.race([
    document.fonts.ready,
    new Promise((resolve) => {
      timer = window.setTimeout(resolve, timeoutMs);
    }),
  ]).finally(() => window.clearTimeout(timer));
};

export class OpeningController {
  constructor(root, { config, loader, scene, gsapApi = window.gsap }) {
    this.root = root;
    this.config = config;
    this.loader = loader;
    this.scene = scene;
    this.gsap = gsapApi;
    this.state = 'idle';
    this.timeline = null;
    this.loops = [];
    this.timers = new Set();
    this.locked = false;
    this.resizeRequest = 0;
    this.resumeAfterResize = false;
    this.restoreLottieOnPageShow = false;
    this.onSkip = this.onSkip.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onVisibility = this.onVisibility.bind(this);
    this.onPageHide = this.onPageHide.bind(this);
    this.onPageShow = this.onPageShow.bind(this);
  }

  query(name) {
    return Array.from(this.root.querySelectorAll(`[data-hero="${name}"]`));
  }

  setState(next) {
    if (!OPENING_STATES.includes(next)) throw new Error(`Unknown opening state: ${next}`);
    this.state = next;
    document.documentElement.dataset.openingState = next;
  }

  shouldBypass() {
    return Boolean(window.location.hash) || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  async start() {
    this.setState('idle');
    this.scene.start();
    this.query('skipbutton')[0]?.addEventListener('click', this.onSkip);
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibility);
    window.addEventListener('pagehide', this.onPageHide);
    window.addEventListener('pageshow', this.onPageShow);

    if (this.shouldBypass()) {
      this.setState('ready');
      this.revealFinalState();
      this.startLoops();
      this.loader.mountForWidth(window.innerWidth, 1)
        .then(() => this.reconcileWidth())
        .catch(() => {});
      return;
    }

    this.setState('loading');
    const header = this.query('header')[0];
    if (header) header.inert = true;
    this.lockScroll();

    try {
      if (!this.gsap || !this.loader.lottieApi) throw new Error('Animation dependency is unavailable');
      await Promise.all([
        waitForFonts(this.config.fontTimeoutMs),
        this.loader.mountForWidth(window.innerWidth, 0),
      ]);
      if (this.state !== 'loading') return;
      await this.loader.switchForWidth(window.innerWidth);
      if (this.state !== 'loading') return;
      await this.reconcileWidth();
      if (this.state !== 'loading') return;
      this.buildTimeline();
      this.setState('playing');
      this.timeline.play(0);
    } catch (error) {
      if (this.state !== 'loading') return;
      console.error('[opening]', error);
      this.fail();
    }
  }

  buildTimeline() {
    const gsap = this.gsap;
    const cue = this.config.cue;
    const duration = this.config.transitionDuration;
    const proxy = { progress: 0 };
    const header = this.query('header')[0];

    gsap.set(header, { opacity: 1, yPercent: -100, pointerEvents: 'none' });
    gsap.set(this.query('loop01'), { y: 0, yPercent: -100 });
    gsap.set(this.query('loop02'), { y: 0, yPercent: 100 });
    gsap.set(this.query('card'), { opacity: 0 });
    gsap.set(this.query('scroll'), { opacity: 0 });
    gsap.set(this.query('skip'), { opacity: 1, pointerEvents: 'auto' });

    const timeline = gsap.timeline({
      paused: true,
      onComplete: () => this.finish(),
    });
    this.timeline = timeline;

    timeline.to(proxy, {
      progress: 1,
      duration: this.loader.duration,
      ease: 'none',
      onUpdate: () => this.loader.goToProgress(proxy.progress),
    }, 0);
    timeline.to(this.query('skip'), {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.5,
      ease: 'power3.out',
    }, cue - 0.6);

    if (header) {
      timeline.to(header, {
        yPercent: 0,
        pointerEvents: 'auto',
        duration,
        ease: 'power3.out',
      }, cue);
      timeline.fromTo(Array.from(header.children), {
        yPercent: -80,
        opacity: 0,
      }, {
        yPercent: 0,
        opacity: 1,
        duration,
        ease: 'power3.out',
      }, cue);
    }

    timeline.to(this.query('loop01'), { yPercent: 0, duration, ease: 'power3.out' }, cue);
    timeline.to(this.query('loop02'), { yPercent: 0, duration, ease: 'power3.out' }, cue);
    this.query('card').forEach((card) => {
      const rotation = Number(card.dataset.rot) || 0;
      timeline.fromTo(card, {
        opacity: 0,
        yPercent: 44,
        scale: 0.94,
        rotation: rotation * 0.2,
      }, {
        opacity: 1,
        yPercent: 0,
        scale: 1,
        rotation,
        duration,
        ease: 'power3.out',
      }, cue);
    });
    timeline.to(this.query('scroll'), { opacity: 1, duration: 0.5 }, cue + duration + 0.25);
    timeline.call(() => this.unlockScroll(), null, this.config.unlockAt);
    timeline.set({}, {}, Math.max(this.loader.duration, cue + duration + 0.9));
    this.startLoops();
  }

  startLoops() {
    const gsap = this.gsap;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!gsap || reduced || this.loops.length) return;

    [['loop01', false], ['loop02', true]].forEach(([name, left]) => {
      const slides = this.query(name)[0]?.querySelectorAll('[data-hero="slide"]');
      if (!slides?.length) return;
      const tween = gsap.fromTo(slides, {
        xPercent: left ? 0 : -100,
      }, {
        xPercent: left ? -100 : 0,
        duration: 96,
        ease: 'none',
        repeat: -1,
      });
      tween.progress(0.5);
      this.loops.push(tween);
    });

    const bar = this.query('scrollbar')[0];
    if (bar) {
      this.loops.push(gsap.timeline({ repeat: -1 })
        .set(bar, { transformOrigin: '0% 100%', scaleY: 1 })
        .to(bar, { scaleY: 0, duration: 1, ease: 'power1.inOut' })
        .set(bar, { transformOrigin: '0% 0%' })
        .to(bar, { scaleY: 1, duration: 1, ease: 'power1.inOut' }));
    }
  }

  onSkip() {
    if (!['playing', 'loading'].includes(this.state)) return;
    this.setState('skipping');
    this.query('skipbutton')[0]?.setAttribute('disabled', '');
    if (!this.timeline) {
      this.loader.destroy();
      this.revealFinalState();
      this.startLoops();
      this.unlockScroll();
      this.setState('ready');
      this.loader.mountForWidth(window.innerWidth, 1)
        .then(() => this.reconcileWidth())
        .catch(() => {});
      return;
    }
    this.timeline.seek(Math.min(10, this.timeline.duration()));
    this.timeline.timeScale(2);
    this.timeline.play();
    this.setTimer(() => this.finish(), 1800);
  }

  // 取りこぼしの自己修復。
  // 差し替え中は loader.animation が一時的に null になるため、その間に届いたリサイズは
  // onResize の入口のガードで捨てられる。捨てられたまま止まると、最後の幅と実際に載って
  // いる版が食い違ったままになる（例：スマホ幅なのにPC版のまま）。
  // そこで mount が確定するたびに「今の幅」と「載っている版」を突き合わせ、食い違って
  // いれば合わせ直す。合わせ直している最中にさらに幅が変わる場合に備えて数回まで繰り返し、
  // 回数で頭打ちにして無限ループを避ける。
  async reconcileWidth(request) {
    for (let pass = 0; pass < 3; pass += 1) {
      if (this.state === 'destroyed') return;
      if (!this.loader.animation) return;
      if (this.loader.isMobile(window.innerWidth) === this.loader.mobile) return;
      await this.loader.switchForWidth(window.innerWidth);
      if (request !== undefined && request !== this.resizeRequest) return;
    }
  }

  async onResize() {
    if (!this.loader.animation || this.state === 'destroyed') return;
    const request = ++this.resizeRequest;
    this.resumeAfterResize =
      this.resumeAfterResize || Boolean(this.timeline && !this.timeline.paused());
    this.timeline?.pause();
    try {
      await this.loader.switchForWidth(window.innerWidth);
    } catch (error) {
      if (request !== this.resizeRequest) return;
      console.error('[opening resize]', error);
      this.fail();
      return;
    }
    if (request !== this.resizeRequest) return;

    try {
      await this.reconcileWidth(request);
    } catch (error) {
      if (request !== this.resizeRequest) return;
      console.error('[opening resize reconcile]', error);
      this.fail();
      return;
    }
    if (request !== this.resizeRequest) return;

    const shouldResume = this.resumeAfterResize;
    this.resumeAfterResize = false;
    if (shouldResume && ['playing', 'skipping'].includes(this.state)) this.timeline.play();
  }

  onVisibility() {
    if (!this.timeline || !['playing', 'skipping'].includes(this.state)) return;
    if (document.hidden) this.timeline.pause();
    else this.timeline.play();
  }

  onPageHide(event) {
    if (event.persisted) {
      this.timeline?.kill();
      this.timeline = null;
      this.loops.forEach((loop) => loop.kill());
      this.loops = [];
      this.clearTimers();
      if (this.loader.animation) this.loader.goToProgress(1);
      else {
        this.loader.destroy();
        this.restoreLottieOnPageShow = true;
      }
      this.revealFinalState();
      this.unlockScroll();
      this.setState('ready');
      return;
    }
    this.destroy();
  }

  onPageShow(event) {
    if (!event.persisted) return;
    this.startLoops();
    if (this.restoreLottieOnPageShow) {
      this.restoreLottieOnPageShow = false;
      this.loader.mountForWidth(window.innerWidth, 1)
        .then(() => this.reconcileWidth())
        .catch(() => {});
    }
  }

  revealCards() {
    this.query('card').forEach((card) => {
      const rotation = Number(card.dataset.rot) || 0;
      if (this.gsap) {
        this.gsap.set(card, {
          opacity: 1,
          yPercent: 0,
          scale: 1,
          rotation,
        });
      } else {
        card.style.opacity = '1';
        card.style.transform = `rotate(${rotation}deg)`;
      }
    });
  }

  revealFinalState() {
    const header = this.query('header')[0];
    if (header) header.inert = false;
    this.loader.goToProgress(1);
    this.gsap?.set(this.query('header'), { clearProps: 'all' });
    this.gsap?.set(this.query('loop01'), { y: 0, yPercent: 0 });
    this.gsap?.set(this.query('loop02'), { y: 0, yPercent: 0 });
    this.revealCards();
    this.gsap?.set(this.query('scroll'), { opacity: 1 });
    this.gsap?.set(this.query('skip'), { opacity: 0, pointerEvents: 'none' });
  }

  finish() {
    if (['ready', 'failed', 'destroyed'].includes(this.state)) return;
    this.clearTimers();
    this.timeline?.timeScale(1);
    this.revealFinalState();
    this.unlockScroll();
    this.setState('ready');
  }

  fail() {
    if (this.state === 'destroyed') return;
    this.timeline?.kill();
    this.timeline = null;
    this.clearTimers();
    this.revealFinalState();
    this.startLoops();
    this.unlockScroll();
    this.setState('failed');
  }

  lockScroll() {
    if (this.locked) return;
    this.locked = true;
    this.previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
  }

  unlockScroll() {
    if (!this.locked) return;
    this.locked = false;
    document.documentElement.style.overflow = this.previousOverflow || '';
  }

  setTimer(callback, delay) {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      callback();
    }, delay);
    this.timers.add(timer);
  }

  clearTimers() {
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
  }

  destroy() {
    if (this.state === 'destroyed') return;
    this.timeline?.kill();
    this.loops.forEach((loop) => loop.kill());
    this.clearTimers();
    this.unlockScroll();
    this.scene.destroy();
    this.loader.destroy();
    this.query('skipbutton')[0]?.removeEventListener('click', this.onSkip);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibility);
    window.removeEventListener('pagehide', this.onPageHide);
    window.removeEventListener('pageshow', this.onPageShow);
    this.setState('destroyed');
  }
}
