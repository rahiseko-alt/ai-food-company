const clamp = (value) => Math.min(1, Math.max(0, value));
const segment = (progress, start, end) => clamp((progress - start) / (end - start));
const smooth = (value) => value * value * (3 - 2 * value);

export class ScrollScene {
  constructor(root, { reducedMotion = false } = {}) {
    this.runway = root.querySelector('[data-hero="runway"]');
    this.hero = root.querySelector('[data-hero="hero"]');
    this.whiteout = root.querySelector('[data-hero="whiteout"]');
    this.greeting = root.querySelector('[data-hero="greeting"]');
    this.reducedMotion = reducedMotion;
    this.frame = 0;
    this.lastProgress = -1;
    this.schedule = this.schedule.bind(this);
    this.read = this.read.bind(this);
  }

  start() {
    if (!this.runway || !this.hero || !this.whiteout || this.reducedMotion) return;
    window.addEventListener('scroll', this.schedule, { passive: true });
    window.addEventListener('resize', this.schedule);
    document.addEventListener('visibilitychange', this.schedule);
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(this.schedule, { threshold: 0 });
      this.observer.observe(this.runway);
    }
    this.read();
  }

  schedule() {
    if (this.frame) return;
    this.frame = window.requestAnimationFrame(this.read);
  }

  read() {
    this.frame = 0;
    const bounds = this.runway.getBoundingClientRect();
    const span = bounds.height - window.innerHeight;
    const progress = span > 0 ? clamp(-bounds.top / span) : 1;
    if (progress === this.lastProgress) return;
    this.lastProgress = progress;

    this.hero.style.transform = `scale(${(1 + segment(progress, 0, 0.1667) * 0.42).toFixed(4)})`;
    this.whiteout.style.opacity = smooth(segment(progress, 0.0143, 0.1524)).toFixed(4);

    if (this.greeting) {
      const enter = smooth(segment(progress, 0.1667, 0.2381));
      const leave = smooth(segment(progress, 0.56, 0.74));
      this.greeting.style.opacity = (enter * (1 - leave)).toFixed(4);
      this.greeting.style.transform = `scale(${(0.72 + enter * 0.28 + leave * 1.3).toFixed(4)})`;
    }
  }

  destroy() {
    if (this.frame) window.cancelAnimationFrame(this.frame);
    this.frame = 0;
    window.removeEventListener('scroll', this.schedule);
    window.removeEventListener('resize', this.schedule);
    document.removeEventListener('visibilitychange', this.schedule);
    this.observer?.disconnect();
  }
}
