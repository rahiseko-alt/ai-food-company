/* =========================================================================
   相談フォームの送信。

   送信先は index.html の <form data-endpoint="..."> に入れる（Formspree など
   メール転送サービスのURL）。空のままなら送信せず、その旨をお客様に伝える。
   黙って捨てるのが最悪なので、そこだけは必ず表に出す。
   ========================================================================= */
(function () {
  'use strict';

  var MSG = {
    required: 'ご入力ください。',
    sending: '送信中…',
    ok: '送信しました。折り返しご連絡します。',
    ng: '送信できませんでした。通信状況をご確認のうえ、もう一度お試しください。',
    unconfigured: 'ただいまフォームからのお問い合わせを受け付けておりません。お電話にてご連絡ください。'
  };

  function init() {
    var form = document.querySelector('[data-hero="contactform"]');
    if (!form) return;

    var endpoint = (form.dataset.endpoint || form.getAttribute('action') || '').trim();
    var status = form.querySelector('[data-form="status"]');
    var button = form.querySelector('.form__submit');
    var fields = Array.prototype.slice.call(form.querySelectorAll('[required]'));

    if (!endpoint) {
      console.warn('[contact] 送信先が未設定です。index.html の <form data-endpoint="..."> にURLを入れてください。');
    }

    var say = function (text, tone) {
      if (!status) return;
      status.textContent = text;
      status.hidden = false;
      if (tone) status.setAttribute('data-tone', tone);
      else status.removeAttribute('data-tone');
    };

    var showError = function (el, text) {
      var box = form.querySelector('[data-error-for="' + el.name + '"]');
      if (box) { box.textContent = text || ''; box.hidden = !text; }
      if (text) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
      if (box) el.setAttribute('aria-describedby', 'err-' + el.name);
      if (box) box.id = 'err-' + el.name;
    };

    /* 入力し直したら、その欄のエラーだけ消す */
    fields.forEach(function (el) {
      el.addEventListener('input', function () {
        if (el.value.trim()) showError(el, '');
      });
    });

    var validate = function () {
      var bad = null;
      fields.forEach(function (el) {
        if (el.value.trim()) { showError(el, ''); return; }
        showError(el, MSG.required);
        if (!bad) bad = el;
      });
      return bad;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var bad = validate();
      if (bad) { bad.focus(); say('', null); status.hidden = true; return; }

      if (!endpoint) { say(MSG.unconfigured, 'ng'); return; }

      var label = button ? button.textContent : '';
      if (button) {
        button.setAttribute('aria-disabled', 'true');
        button.textContent = MSG.sending;
      }
      say(MSG.sending, null);

      fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          say(MSG.ok, 'ok');
          form.reset();
          fields.forEach(function (el) { showError(el, ''); });
        })
        .catch(function () { say(MSG.ng, 'ng'); })
        .then(function () {
          if (button) {
            button.removeAttribute('aria-disabled');
            button.textContent = label;
          }
        });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
