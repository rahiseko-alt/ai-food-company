import { OPENING_CONFIG } from './config.mjs?v=2026-08-01b';
import { ContactController } from './contact-controller.mjs?v=2026-08-01b';
import { HashNavigation } from './hash-navigation.mjs?v=2026-08-01b';
import { LanguageController } from './language-controller.mjs?v=2026-08-01b';
import { LottieLoader } from './lottie-loader.mjs?v=2026-08-01b';
import { OpeningController } from './opening-controller.mjs?v=2026-08-01b';
import { ScrollScene } from './scroll-scene.mjs?v=2026-08-01b';

const root = document.querySelector('[data-hero="root"]');

if (root) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new ScrollScene(root, { reducedMotion });
  const loader = new LottieLoader({
    container: root.querySelector('[data-hero="lottie"]'),
    hero: root.querySelector('[data-hero="hero"]'),
    config: OPENING_CONFIG.lottie,
  });
  const opening = new OpeningController(root, {
    config: OPENING_CONFIG,
    loader,
    scene,
  });
  const contact = new ContactController(root.querySelector('[data-hero="contactform"]'));
  const hashNavigation = new HashNavigation();
  const language = new LanguageController(root);

  contact.start();
  hashNavigation.start();
  opening.start();
  language.start();

  window.koseFoodAi = Object.freeze({ opening, contact, hashNavigation, language });
}
