import { OPENING_CONFIG } from './config.mjs?v=2026-07-31';
import { ContactController } from './contact-controller.mjs?v=2026-07-31';
import { HashNavigation } from './hash-navigation.mjs?v=2026-07-31';
import { LottieLoader } from './lottie-loader.mjs?v=2026-07-31';
import { MenuDialog } from './menu-dialog.mjs?v=2026-07-31';
import { OpeningController } from './opening-controller.mjs?v=2026-07-31';
import { ScrollScene } from './scroll-scene.mjs?v=2026-07-31';

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
  const menu = new MenuDialog(root);
  const contact = new ContactController(root.querySelector('[data-hero="contactform"]'));
  const hashNavigation = new HashNavigation();

  menu.start();
  contact.start();
  hashNavigation.start();
  opening.start();

  window.koseFoodAi = Object.freeze({ opening, menu, contact, hashNavigation });
}
