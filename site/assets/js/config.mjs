export const OPENING_CONFIG = Object.freeze({
  lottie: {
    desktop: 'assets/lottie/hero.json',
    mobile: 'assets/lottie/hero-sp.json',
    breakpoint: 767,
    fetchTimeoutMs: 8000,
  },
  fontTimeoutMs: 2000,
  cue: 10.6,
  transitionDuration: 1.1,
  unlockAt: 11.7,
});

export const OPENING_STATES = Object.freeze([
  'idle',
  'loading',
  'playing',
  'skipping',
  'ready',
  'failed',
  'destroyed',
]);
