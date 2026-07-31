export class MenuDialog {
  constructor(root) {
    this.root = root;
    this.dialog = root.querySelector('[data-hero="detail"]');
    this.closeButton = this.dialog?.querySelector('[data-hero="detailclose"]');
    this.onClick = this.onClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  start() {
    if (!this.dialog) return;
    this.root.addEventListener('click', this.onClick);
    this.dialog.addEventListener('close', this.onClose);
    document.addEventListener('keydown', this.onKeyDown);
  }

  onClick(event) {
    const trigger = event.target.closest('[data-menu]');
    if (trigger) {
      const item = trigger.closest('.menu__item');
      const template = item?.querySelector('[data-menu-detail]');
      this.dialog.querySelector('[data-detail-title]').textContent =
        trigger.querySelector('.menu__row-name')?.textContent.trim() || '';
      this.dialog.querySelector('[data-detail-term]').textContent =
        trigger.querySelector('.menu__row-term')?.textContent.trim() || '';
      this.dialog.querySelector('[data-detail-body]').textContent =
        template?.content.textContent.trim() || '';
      this.returnFocus = trigger;
      document.documentElement.classList.add('is-dialog-open');
      this.dialog.showModal();
      this.dialog.scrollTop = 0;
      this.closeButton?.focus();
      return;
    }

    if (event.target.closest('[data-hero="detailclose"]')) this.dialog.close();
  }

  onClose() {
    document.documentElement.classList.remove('is-dialog-open');
    this.returnFocus?.focus();
  }

  onKeyDown(event) {
    if (!this.dialog?.open) return;

    if (event.key === 'Tab') {
      const focusable = Array.from(this.dialog.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (focusable.length === 1 ||
          (event.shiftKey && document.activeElement === first) ||
          (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.dialog.close();
    }
  }

  destroy() {
    this.root.removeEventListener('click', this.onClick);
    this.dialog?.removeEventListener('close', this.onClose);
    document.removeEventListener('keydown', this.onKeyDown);
    if (this.dialog?.open) this.dialog.close();
  }
}
