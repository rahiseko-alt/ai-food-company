import { LANGUAGES, LANGUAGE_LABELS, I18N } from './i18n-data.mjs?v=2026-08-01b';

const STORAGE_KEY = 'kfa:lang';
const DEFAULT_LANG = 'ja';
const ATTR_BINDINGS = [
  ['data-i18n-placeholder', 'placeholder'],
  ['data-i18n-aria-label', 'aria-label'],
  ['data-i18n-alt', 'alt'],
];

// ヘッダーの言語切替UIと、ページ内 [data-i18n] 要素の文言差し替えを担当する独立モジュール。
// オープニング／スクロール演出（opening-controller.mjs, scroll-scene.mjs）の
// 状態・タイマー・DOM移動量には一切依存しない（AGENTS.mdの結合ルール）。
export class LanguageController {
  constructor(root) {
    this.root = root;
    this.mount = root.querySelector('[data-hero="langswitch"]');
    this.select = null;
    this.onChange = this.onChange.bind(this);
  }

  start() {
    if (!this.mount) return;
    this.select = document.createElement('select');
    this.select.className = 'header__lang-select';
    for (const code of LANGUAGES) {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = LANGUAGE_LABELS[code];
      this.select.appendChild(option);
    }
    this.mount.appendChild(this.select);
    this.select.addEventListener('change', this.onChange);

    const initial = this.detectInitialLanguage();
    this.select.value = initial;
    this.apply(initial);
  }

  detectInitialLanguage() {
    let stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage が使えない環境（プライベートモード等）では未検出扱いにする
    }
    if (stored && LANGUAGES.includes(stored)) return stored;

    const browserLangs = navigator.languages || [navigator.language || DEFAULT_LANG];
    for (const raw of browserLangs) {
      const short = raw.slice(0, 2).toLowerCase();
      if (LANGUAGES.includes(short)) return short;
    }
    return DEFAULT_LANG;
  }

  onChange() {
    this.apply(this.select.value);
    try {
      window.localStorage.setItem(STORAGE_KEY, this.select.value);
    } catch {
      // localStorage が使えない環境（プライベートモード等）でも切替自体は続行する
    }
  }

  apply(lang) {
    const dict = I18N[lang] || I18N[DEFAULT_LANG];
    document.documentElement.lang = lang;

    if (this.select) {
      this.select.setAttribute('aria-label', dict['lang.label']);
    }

    for (const el of this.root.querySelectorAll('[data-i18n]')) {
      const key = el.getAttribute('data-i18n');
      const value = dict[key];
      if (value == null) continue;
      setTextWithLineBreaks(el, value);
    }

    for (const [dataAttr, targetAttr] of ATTR_BINDINGS) {
      for (const el of this.root.querySelectorAll(`[${dataAttr}]`)) {
        const value = dict[el.getAttribute(dataAttr)];
        if (value != null) el.setAttribute(targetAttr, value);
      }
    }

    for (const tpl of this.root.querySelectorAll('template[data-i18n-template]')) {
      const key = tpl.getAttribute('data-i18n-template');
      const value = dict[key];
      if (value == null) continue;
      tpl.content.textContent = '';
      setTextWithLineBreaks(tpl.content, value);
    }
  }

  destroy() {
    this.select?.removeEventListener('change', this.onChange);
    this.select?.remove();
    this.select = null;
  }
}

function setTextWithLineBreaks(container, value) {
  container.textContent = '';
  const lines = value.split('\n');
  lines.forEach((line, index) => {
    if (index > 0) container.appendChild(document.createElement('br'));
    container.appendChild(document.createTextNode(line));
  });
}
