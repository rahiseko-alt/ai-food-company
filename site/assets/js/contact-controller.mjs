export const CONTACT_MESSAGES = Object.freeze({
  required: 'ご入力ください。',
  contact: 'メールアドレス、または10～11桁の電話番号をご入力ください。',
  sending: '送信中…',
  ok: '送信しました。折り返しご連絡します。',
  ng: '送信できませんでした。内容を残したままにしています。もう一度お試しください。',
  timeout: '送信が時間内に完了しませんでした。通信状況をご確認のうえ、もう一度お試しください。',
  unconfigured: 'ただいまフォームからのお問い合わせを受け付けておりません。',
});

export function isValidContact(value) {
  const input = value.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const digits = input.replace(/[\s\-‐‑‒–—―ー()（）]/g, '');
  const isPhone = /^\d{10,11}$/.test(digits);
  return isEmail || isPhone;
}

export function isSuccessfulFormSubmit(payload) {
  return payload?.success === true || payload?.success === 'true';
}

export class ContactController {
  constructor(form, { fetchApi = window.fetch.bind(window), timeoutMs = 15000 } = {}) {
    this.form = form;
    this.fetchApi = fetchApi;
    this.timeoutMs = timeoutMs;
    this.status = form?.querySelector('[data-form="status"]');
    this.button = form?.querySelector('.form__submit');
    this.fields = Array.from(form?.querySelectorAll('[required]') || []);
    this.inFlight = false;
    this.onSubmit = this.onSubmit.bind(this);
    this.onInput = this.onInput.bind(this);
  }

  start() {
    if (!this.form) return;
    this.form.addEventListener('submit', this.onSubmit);
    this.form.addEventListener('input', this.onInput);
  }

  onInput(event) {
    if (!event.target.matches('[required]')) return;
    if (event.target.name === 'contact' ? isValidContact(event.target.value) : event.target.value.trim()) {
      this.showError(event.target, '');
    }
  }

  validate() {
    let firstInvalid = null;
    this.fields.forEach((field) => {
      let message = '';
      if (!field.value.trim()) message = CONTACT_MESSAGES.required;
      else if (field.name === 'contact' && !isValidContact(field.value)) message = CONTACT_MESSAGES.contact;
      this.showError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    });
    return firstInvalid;
  }

  showError(field, message) {
    const box = this.form.querySelector(`[data-error-for="${field.name}"]`);
    if (box) {
      box.id = `err-${field.name}`;
      box.textContent = message;
      box.hidden = !message;
      field.setAttribute('aria-describedby', box.id);
    }
    field.toggleAttribute('aria-invalid', Boolean(message));
  }

  say(message, tone) {
    if (!this.status) return;
    this.status.textContent = message;
    this.status.hidden = !message;
    if (tone) this.status.dataset.tone = tone;
    else delete this.status.dataset.tone;
  }

  setSending(sending) {
    this.inFlight = sending;
    if (!this.button) return;
    this.button.disabled = sending;
    this.button.textContent = sending ? CONTACT_MESSAGES.sending : this.button.dataset.label;
  }

  async onSubmit(event) {
    event.preventDefault();
    if (this.inFlight) return;

    const invalid = this.validate();
    if (invalid) {
      this.say('', null);
      invalid.focus();
      return;
    }

    const endpoint = (this.form.dataset.endpoint || '').trim();
    if (!endpoint) {
      this.say(CONTACT_MESSAGES.unconfigured, 'ng');
      return;
    }

    if (this.button && !this.button.dataset.label) this.button.dataset.label = this.button.textContent;
    this.setSending(true);
    this.say(CONTACT_MESSAGES.sending, null);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchApi(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(this.form),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (!isSuccessfulFormSubmit(payload)) throw new Error('Unexpected FormSubmit response');
      this.form.reset();
      this.fields.forEach((field) => this.showError(field, ''));
      this.say(CONTACT_MESSAGES.ok, 'ok');
    } catch (error) {
      this.say(error?.name === 'AbortError' ? CONTACT_MESSAGES.timeout : CONTACT_MESSAGES.ng, 'ng');
    } finally {
      window.clearTimeout(timer);
      this.setSending(false);
    }
  }

  destroy() {
    this.form?.removeEventListener('submit', this.onSubmit);
    this.form?.removeEventListener('input', this.onInput);
  }
}
