import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { LANGUAGES, I18N } from '../../site/assets/js/i18n-data.mjs';

const useFocusedProject = (testInfo, project = 'mobile-390') => {
  const covered = Array.isArray(project) ? project : [project];
  test.skip(!covered.includes(testInfo.project.name), `Covered in ${covered.join(' / ')}`);
};

test('responsive layout keeps content in normal flow', async ({ page }) => {
  await page.goto('/#top');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'ready');

  const layout = await page.evaluate(() => {
    const menu = document.querySelector('.menu');
    const menuInner = document.querySelector('.menu__inner');
    const runway = document.querySelector('.runway');
    const clippedText = Array.from(document.querySelectorAll('h1, h2, h3, p, button, a'))
      .filter((element) => element.scrollWidth > element.clientWidth + 1)
      .map((element) => element.textContent.trim().slice(0, 50));

    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      menuTransform: getComputedStyle(menu).transform,
      menuInnerTransform: getComputedStyle(menuInner).transform,
      menuOffsetTop: menu.offsetTop,
      runwayBottom: runway.offsetTop + runway.offsetHeight,
      clippedText,
    };
  });

  expect(layout.overflow).toBeLessThanOrEqual(1);
  expect(layout.menuTransform).toBe('none');
  expect(layout.menuInnerTransform).toBe('none');
  expect(layout.menuOffsetTop).toBeGreaterThanOrEqual(layout.runwayBottom);
  expect(layout.clippedText).toEqual([]);

  const transforms = [];
  for (const ratio of [0, 0.5, 1]) {
    await page.evaluate((position) => {
      const maximum = document.documentElement.scrollHeight - innerHeight;
      scrollTo(0, maximum * position);
    }, ratio);
    await page.waitForTimeout(50);
    transforms.push(await page.evaluate(() => ({
      menu: getComputedStyle(document.querySelector('.menu')).transform,
      inner: getComputedStyle(document.querySelector('.menu__inner')).transform,
    })));
  }
  expect(transforms).toEqual([
    { menu: 'none', inner: 'none' },
    { menu: 'none', inner: 'none' },
    { menu: 'none', inner: 'none' },
  ]);
});

// G-5-3 の verify は「PC/SP の elementFromPoint と Tab 移動」を求めているので、
// スマホ幅だけでなくPC幅でも実行する。
test('SKIP is frontmost, idempotent, and unlocks scrolling', async ({ page }, testInfo) => {
  useFocusedProject(testInfo, ['mobile-390', 'desktop-1024']);
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'playing');

  const frontmost = await page.locator('[data-hero="skipbutton"]').evaluate((button) => {
    const bounds = button.getBoundingClientRect();
    const top = document.elementFromPoint(
      bounds.left + bounds.width / 2,
      bounds.top + bounds.height / 2,
    );
    return top === button || button.contains(top);
  });
  expect(frontmost).toBe(true);
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-hero="skipbutton"]')).toBeFocused();

  await page.evaluate(() => {
    const skip = document.querySelector('[data-hero="skipbutton"]');
    skip.click();
    skip.click();
    skip.click();
  });
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'ready');
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).overflow))
    .not.toBe('hidden');
});

test('SKIP immediately releases a slow loading state', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  await page.route('**/assets/lottie/hero-sp.json', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 4_000));
    await route.continue().catch(() => {});
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'loading');
  await page.locator('[data-hero="skipbutton"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'ready');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow))
    .not.toBe('hidden');
  const before = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.marquee__slide')).transform);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() =>
    getComputedStyle(document.querySelector('.marquee__slide')).transform)).not.toBe(before);
});

test('the regular opening reaches ready and cleans up its lock', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  test.setTimeout(25_000);
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'playing');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'ready', {
    timeout: 16_000,
  });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow))
    .not.toBe('hidden');
});

test('final hero keeps both marquees moving and cards rotated', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  test.setTimeout(25_000);
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'playing');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'ready', {
    timeout: 16_000,
  });

  const before = await page.evaluate(() => ({
    slides: Array.from(document.querySelectorAll('.marquee__slide'))
      .map((element) => getComputedStyle(element).transform),
    marquees: Array.from(document.querySelectorAll('.marquee')).map((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        visibleHeight: Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0),
        visibility: getComputedStyle(element).visibility,
      };
    }),
    cardRotations: Array.from(document.querySelectorAll('.card')).map((element) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
      return Math.round(Math.atan2(matrix.b, matrix.a) * 180 / Math.PI);
    }),
  }));
  await page.waitForTimeout(200);
  const afterSlides = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.marquee__slide'))
      .map((element) => getComputedStyle(element).transform));

  expect(before.marquees).toEqual([
    { visibleHeight: expect.any(Number), visibility: 'visible' },
    { visibleHeight: expect.any(Number), visibility: 'visible' },
  ]);
  expect(before.marquees.every(({ visibleHeight }) => visibleHeight > 0)).toBe(true);
  expect(afterSlides).not.toEqual(before.slides);
  expect(before.cardRotations).toEqual([-4, 3, -2, 4]);
});

test('Lottie 404 falls back to readable content', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  await page.route('**/assets/lottie/hero-sp.json', (route) =>
    route.fulfill({ status: 404, body: 'not found' }));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'failed');
  await expect(page.locator('#contact')).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow))
    .not.toBe('hidden');
  const before = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.marquee__slide')).transform);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() =>
    getComputedStyle(document.querySelector('.marquee__slide')).transform)).not.toBe(before);
});

test('slow Lottie loading has a bounded failure path', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  test.setTimeout(15_000);
  await page.route('**/assets/lottie/hero-sp.json', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 9_000));
    await route.continue().catch(() => {});
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'failed', {
    timeout: 11_000,
  });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow))
    .not.toBe('hidden');
});

test('missing GSAP falls back without waiting forever', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  await page.route('**/assets/vendor/gsap.min.js', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'failed');
  await expect(page.locator('#contact')).toBeVisible();
});

// 描画されている絵の大きさ。状態フラグだけを見ると「正しい方を選んだが何も描かれていない」
// を見逃すので、必ず実物の SVG を測る。
const renderedArtwork = () => {
  const container = document.querySelector('[data-hero="lottie"]');
  const svg = container.querySelector('svg');
  const bounds = svg?.getBoundingClientRect();
  return {
    children: container.childElementCount,
    area: bounds ? Math.round(bounds.width * bounds.height) : 0,
  };
};

test('crossing the mobile breakpoint preserves Lottie progress', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'playing');
  const before = await page.evaluate(() => window.koseFoodAi.opening.loader.progress);
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect.poll(() => page.evaluate(() => window.koseFoodAi.opening.loader.mobile))
    .toBe(false);
  const after = await page.evaluate(() => window.koseFoodAi.opening.loader.progress);
  expect(after).toBeGreaterThanOrEqual(before);
});

test('crossing the breakpoint keeps the hero artwork on screen', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  test.setTimeout(40_000);
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'playing');
  await expect.poll(() => page.evaluate(renderedArtwork)).toMatchObject({ children: 1 });
  const before = await page.evaluate(renderedArtwork);
  expect(before.area).toBeGreaterThan(0);

  // 端末の回転に相当する。767px の境界をまたぐので Lottie が差し替わる
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect.poll(() => page.evaluate(() => window.koseFoodAi.opening.loader.mobile))
    .toBe(false);
  await expect.poll(() => page.evaluate(renderedArtwork)).toMatchObject({ children: 1 });
  expect((await page.evaluate(renderedArtwork)).area).toBeGreaterThan(0);

  // 戻したときも描かれたままであること
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => window.koseFoodAi.opening.loader.mobile))
    .toBe(true);
  await expect.poll(() => page.evaluate(renderedArtwork)).toMatchObject({ children: 1 });
  expect((await page.evaluate(renderedArtwork)).area).toBeGreaterThan(0);
});

test('re-mounting never leaves the hero container empty', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  await page.goto('/#top');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'ready');
  await expect.poll(() => page.evaluate(renderedArtwork)).toMatchObject({ children: 1 });

  // 同じコンテナへの載せ替えを直接叩く。旧実装はここでコンテナごと空になっていた
  const remounted = await page.evaluate(() =>
    window.koseFoodAi.opening.loader.mountForWidth(window.innerWidth, 1));
  expect(remounted).toBe(true);
  expect(await page.evaluate(renderedArtwork)).toMatchObject({ children: 1 });
  expect((await page.evaluate(renderedArtwork)).area).toBeGreaterThan(0);
});

test('crossing the breakpoint while loading selects the current Lottie', async ({
  page,
}, testInfo) => {
  useFocusedProject(testInfo);
  await page.route('**/assets/lottie/hero-sp.json', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    await route.continue().catch(() => {});
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'loading');
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'playing', {
    timeout: 8_000,
  });
  expect(await page.evaluate(() => window.koseFoodAi.opening.loader.mobile)).toBe(false);
});

test('rapid breakpoint changes cannot leave the opening paused', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  await page.route('**/assets/lottie/hero.json', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    await route.continue().catch(() => {});
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'playing');
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.setViewportSize({ width: 390, height: 844 });

  await expect.poll(() => page.evaluate(() => ({
    mobile: window.koseFoodAi.opening.loader.mobile,
    paused: window.koseFoodAi.opening.timeline.paused(),
  }))).toEqual({ mobile: true, paused: false });
  await page.waitForTimeout(2_500);
  expect(await page.evaluate(() => ({
    mobile: window.koseFoodAi.opening.loader.mobile,
    paused: window.koseFoodAi.opening.timeline.paused(),
  }))).toEqual({ mobile: true, paused: false });
});

test('BFCache settlement keeps final Lottie artwork and unlocks', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'playing');
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
  });
  const result = await page.evaluate(() => ({
    state: document.documentElement.dataset.openingState,
    overflow: getComputedStyle(document.documentElement).overflow,
    hasAnimation: Boolean(window.koseFoodAi.opening.loader.animation),
    progress: window.koseFoodAi.opening.loader.progress,
  }));
  expect(result).toEqual({
    state: 'ready',
    overflow: 'visible',
    hasAnimation: true,
    progress: 1,
  });
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  const before = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.marquee__slide')).transform);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() =>
    getComputedStyle(document.querySelector('.marquee__slide')).transform)).not.toBe(before);
});

test('hash navigation bypasses the opening and survives reload', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  await page.goto('/#contact');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'ready');
  await expect(page.locator('#contact')).toBeInViewport();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'ready');
  await expect(page.locator('#contact')).toBeInViewport();
  await page.goto('/#top');
  await page.goBack();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('#contact')).toBeInViewport();
});

test('reduced motion removes the long runway and opening wait', async ({ page }, testInfo) => {
  useFocusedProject(testInfo);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-opening-state', 'ready');
  const result = await page.evaluate(() => ({
    runwayHeight: document.querySelector('.runway').getBoundingClientRect().height,
    viewportHeight: innerHeight,
    overflow: getComputedStyle(document.documentElement).overflow,
    skipDisplay: getComputedStyle(document.querySelector('.skip')).display,
  }));
  expect(Math.abs(result.runwayHeight - result.viewportHeight)).toBeLessThanOrEqual(1);
  expect(result.overflow).not.toBe('hidden');
  expect(result.skipDisplay).toBe('none');
});

test('language switcher renders every supported language and persists across reload', async ({ page }, testInfo) => {
  useFocusedProject(testInfo, 'desktop-1024');
  test.setTimeout(180_000); // 6言語×各言語ごとのreload（フォント再読込を伴う）は既定の30秒に大きく収まらないため延長する
  await page.goto('/#top');
  await expect(page.locator('[data-i18n="nav.home"]')).toHaveText(I18N.ja['nav.home']);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');

  // i18n-data.mjs から実際の訳文を読み、ja/en/zh/ne/vi/th 全言語の実描画・lang属性・
  // reload後の永続化を検査する（訳文をテスト側に手書きで複製しない）。
  // CodeRabbitレビュー指摘 #21 への対応：以前はja→enの2言語しか実測していなかった。
  // CodeRabbitレビュー指摘 #22 への対応：reloadの確認はループの外に1回だけ置いていたため、
  // 最後の言語（th）以外の5言語はreload後の永続化が未検証のまま合格していた。
  // reload確認を各言語のループ内に移し、全言語で実測する。
  for (const lang of LANGUAGES) {
    await page.selectOption('.header__lang-select', lang);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('[data-i18n="nav.home"]')).toHaveText(I18N[lang]['nav.home']);
    await expect(page.locator('[data-i18n="header.cta"]')).toHaveText(I18N[lang]['header.cta']);
    await expect(page.locator('[data-i18n="contact.language_note"]')).toHaveText(
      I18N[lang]['contact.language_note'],
    );

    await page.reload();
    await expect(page.locator('.header__lang-select')).toHaveValue(lang);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('[data-i18n="nav.home"]')).toHaveText(I18N[lang]['nav.home']);
  }
});

test('language switcher stays reachable on mobile', async ({ page }, testInfo) => {
  useFocusedProject(testInfo, 'mobile-390');
  await page.goto('/#top');
  await expect(page.locator('.header__lang-select')).toBeVisible();
  await expect(page.locator('.header__nav')).toBeHidden();
  await page.selectOption('.header__lang-select', 'en');
  await expect(page.locator('[data-i18n="header.cta"]')).toHaveText('Contact ›');
});

test('form clears fields only after confirmed FormSubmit success', async ({ page }, testInfo) => {
  useFocusedProject(testInfo, 'desktop-1024');
  let requests = 0;
  await page.route('https://formsubmit.co/ajax/**', async (route) => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 100));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: 'true' }),
    });
  });
  await page.goto('/#contact');
  await page.getByLabel('店名 / 会社名').fill('テスト店');
  await page.getByLabel('お名前').fill('山田 太郎');
  await page.getByLabel('連絡先（メール または 電話）').fill('080-1234-5678');

  await page.evaluate(() => {
    const form = document.querySelector('[data-hero="contactform"]');
    form.requestSubmit();
    form.requestSubmit();
  });
  await expect(page.locator('[data-form="status"]')).toContainText('送信しました');
  await expect(page.getByLabel('店名 / 会社名')).toHaveValue('');
  expect(requests).toBe(1);
});

test('form preserves values for HTTP and abnormal JSON failures', async ({ page }, testInfo) => {
  useFocusedProject(testInfo, 'desktop-1024');
  for (const response of [
    { status: 400, body: JSON.stringify({ success: false }) },
    { status: 500, body: JSON.stringify({ success: false }) },
    { status: 200, body: JSON.stringify({ unexpected: true }) },
  ]) {
    await page.unrouteAll();
    await page.route('https://formsubmit.co/ajax/**', (route) =>
      route.fulfill({ ...response, contentType: 'application/json' }));
    await page.goto('/#contact');
    await page.getByLabel('店名 / 会社名').fill('保持される店名');
    await page.getByLabel('お名前').fill('山田 太郎');
    await page.getByLabel('連絡先（メール または 電話）').fill('test@example.com');
    await page.locator('.form__submit').click();
    await expect(page.locator('[data-form="status"]')).toContainText('内容を残したまま');
    await expect(page.getByLabel('店名 / 会社名')).toHaveValue('保持される店名');
  }
});

test('form timeout preserves values and enables retry', async ({ page }, testInfo) => {
  useFocusedProject(testInfo, 'desktop-1024');
  await page.route('https://formsubmit.co/ajax/**', () => {});
  await page.goto('/#contact');
  await page.evaluate(() => {
    window.koseFoodAi.contact.timeoutMs = 50;
  });
  await page.getByLabel('店名 / 会社名').fill('タイムアウト店');
  await page.getByLabel('お名前').fill('山田 太郎');
  await page.getByLabel('連絡先（メール または 電話）').fill('090-1234-5678');
  await page.locator('.form__submit').click();
  await expect(page.locator('[data-form="status"]')).toContainText('時間内に完了');
  await expect(page.getByLabel('店名 / 会社名')).toHaveValue('タイムアウト店');
  await expect(page.locator('.form__submit')).toBeEnabled();
});

test('@a11y has no serious or critical axe violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#top');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const violations = results.violations.filter(({ impact }) =>
    ['critical', 'serious'].includes(impact));
  expect(violations).toEqual([]);
});
