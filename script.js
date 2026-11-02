(() => {
  const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/T6KVDDQNTV';

  // Яндекс Метрика: поставьте номер счётчика вместо 0 после его создания
  const YM_ID = 0;
  function loadMetrica() {
    if (!YM_ID || window.ym) return;
    (function (m, e, t, r, i, k, a) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); }; m[i].l = 1 * new Date(); k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a); })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    window.ym(YM_ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });
  }
  let cookieChoice = null;
  try { cookieChoice = localStorage.getItem('rp_cookie'); } catch (_) {}
  if (cookieChoice === 'all') loadMetrica();
  if (!cookieChoice) {
    const bar = document.createElement('div');
    bar.className = 'cookie';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Использование cookie');
    bar.innerHTML = '<p>Мы используем cookie, чтобы сайт работал, и сервис статистики «Яндекс Метрика», чтобы понимать, что улучшить. Подробнее в <a href="/privacy.html">политике конфиденциальности</a>.</p>' +
      '<div class="cookie__actions"><button type="button" class="btn btn--primary" data-c="all">Принять</button>' +
      '<button type="button" class="btn btn--ghost" data-c="necessary">Только необходимые</button></div>';
    document.body.appendChild(bar);
    bar.addEventListener('click', e => {
      const c = e.target?.dataset?.c;
      if (!c) return;
      try { localStorage.setItem('rp_cookie', c); } catch (_) {}
      if (c === 'all') loadMetrica();
      bar.remove();
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const header = document.getElementById('header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('is-open');
    nav.classList.remove('is-open');
  }));

  const sel = document.getElementById('f-service');
  document.querySelectorAll('[data-service]').forEach(b => b.addEventListener('click', () => {
    if (!sel) return;
    [...sel.options].forEach(o => { if (o.text === b.dataset.service) sel.value = o.value || o.text; });
  }));

  const form = document.getElementById('leadForm');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    const payload = {};
    new FormData(form).forEach((v, k) => { payload[k] = v; });
    if (payload._gotcha) return;
    if (!payload.consent) {
      alert('Отметьте согласие на обработку персональных данных');
      return;
    }
    delete payload.consent;
    if (!payload.name || !payload.contact) {
      alert('Заполните имя и контакт для связи');
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Отправляем...';
    try {
      const resp = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      btn.textContent = 'Заявка отправлена ✓';
      form.reset();
    } catch (err) {
      console.error(err);
      btn.textContent = 'Ошибка, попробуйте ещё раз';
    } finally {
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    });
  });

  const targets = document.querySelectorAll('.adv, .step, .tariff, .case, .contact-card, .faq__item, .form, .hero__card, .note');
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  targets.forEach(el => io.observe(el));
})();
