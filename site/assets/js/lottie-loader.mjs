function withTimeout(promise, timeoutMs, message) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = window.setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]).finally(() => window.clearTimeout(timer));
}

export class LottieLoader {
  constructor({ container, hero, config, lottieApi = window.lottie, fetchApi = window.fetch.bind(window) }) {
    this.container = container;
    this.hero = hero;
    this.config = config;
    this.lottieApi = lottieApi;
    this.fetchApi = fetchApi;
    this.animation = null;
    this.mobile = null;
    this.progress = 0;
    this.loadToken = 0;
    this.fetchController = null;
  }

  isMobile(width = window.innerWidth) {
    return width <= this.config.breakpoint;
  }

  async fetchData(mobile) {
    this.fetchController?.abort();
    const controller = new AbortController();
    this.fetchController = controller;
    const timer = window.setTimeout(() => controller.abort(), this.config.fetchTimeoutMs);
    const path = mobile ? this.config.mobile : this.config.desktop;

    try {
      const response = await this.fetchApi(path, {
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Lottie HTTP ${response.status}`);
      const data = await response.json();
      if (!data?.layers || !data.w || !data.h) throw new Error('Lottie JSON is invalid');
      return data;
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new Error('Lottie loading timed out', { cause: error });
      }
      throw error;
    } finally {
      window.clearTimeout(timer);
      if (this.fetchController === controller) this.fetchController = null;
    }
  }

  async mountForWidth(width, progress = this.progress) {
    if (!this.lottieApi || !this.container) throw new Error('lottie-web is unavailable');
    const token = ++this.loadToken;
    const mobile = this.isMobile(width);
    const data = await this.fetchData(mobile);
    if (token !== this.loadToken) return false;

    // lottie-web の destroy() は「自分のコンテナを丸ごと空にする」実装なので、
    // 新旧が同じコンテナに同居した状態で古い方を destroy すると、
    // 直前に描いた新しい SVG まで巻き込んで消える（＝差し替え後にヒーローが空になる）。
    // 必ず「古いものを片付けてから新しいものを描く」順序にする。
    this.animation?.destroy();
    this.animation = null;
    this.mobile = null;

    const next = this.lottieApi.loadAnimation({
      container: this.container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: data,
    });

    try {
      await withTimeout(new Promise((resolve) => {
        if (next.isLoaded) {
          resolve();
          return;
        }
        next.addEventListener('DOMLoaded', resolve);
      }), 3000, 'Lottie rendering timed out');
    } catch (error) {
      next.destroy();
      throw error;
    }

    if (token !== this.loadToken) {
      next.destroy();
      return false;
    }

    this.animation = next;
    this.mobile = mobile;
    this.data = data;
    this.layout();
    this.goToProgress(progress);
    return true;
  }

  async switchForWidth(width) {
    const mobile = this.isMobile(width);
    if (mobile === this.mobile) {
      this.loadToken += 1;
      this.fetchController?.abort();
      this.fetchController = null;
      this.layout();
      return false;
    }
    return this.mountForWidth(width, this.progress);
  }

  layout() {
    if (!this.data || !this.hero || !this.container) return;
    const animationRatio = this.data.h / this.data.w;
    const tall = this.hero.clientHeight / this.hero.clientWidth > animationRatio;
    this.container.style.top = tall ? 'auto' : '50%';
    this.container.style.bottom = tall ? '0' : 'auto';
    this.container.style.transform = tall ? 'translateX(-50%)' : 'translate(-50%, -50%)';
  }

  goToProgress(progress) {
    this.progress = Math.max(0, Math.min(1, Number(progress) || 0));
    if (!this.animation) return;
    const lastFrame = Math.max(0, this.animation.totalFrames - 1);
    this.animation.goToAndStop(lastFrame * this.progress, true);
  }

  get duration() {
    return this.animation?.getDuration(false) || 12.045;
  }

  destroy() {
    this.loadToken += 1;
    this.fetchController?.abort();
    this.fetchController = null;
    this.animation?.destroy();
    this.animation = null;
    // 幅の記憶も捨てる。残すと switchForWidth が「同じ幅だから何もしない」と誤判定し、
    // 破棄したまま二度と描き直せなくなる。
    this.mobile = null;
  }
}
