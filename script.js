/* NASTEEL landing · vanilla JS
   Хуки аналитики (GA4 / Яндекс.Метрика подключаются позже, на этапе деплоя):
   window.onLeadSubmit(data), onPhoneClick(), onWhatsAppClick(), onSpecRequest(category), onCatalogDownload()
*/
(function () {
  'use strict';

  /* ================= Analytics stubs ================= */
  window.onLeadSubmit = window.onLeadSubmit || function (data) {
    console.log('[lead] submit', data);
  };
  window.onPhoneClick = window.onPhoneClick || function () {
    console.log('[lead] phone click');
  };
  window.onWhatsAppClick = window.onWhatsAppClick || function (place) {
    console.log('[lead] whatsapp click', place || '');
  };
  window.onSpecRequest = window.onSpecRequest || function (category) {
    console.log('[lead] spec request', category || '');
  };
  window.onCatalogDownload = window.onCatalogDownload || function (doc) {
    console.log('[lead] doc/catalog download', doc || '');
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= Header ================= */
  var header = document.getElementById('siteHeader');
  var onScroll = function () {
    header.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('burger');
  var nav = document.getElementById('mainNav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      closeDropdowns();
    }
  });

  /* ================= Выпадающее меню «Каталог» ================= */
  function closeDropdowns(except) {
    document.querySelectorAll('.nav-dd.open, .nav-sub.open').forEach(function (el) {
      if (except && (el === except || el.contains(except))) return;
      el.classList.remove('open');
      var b = el.querySelector('.nav-dd-btn, .nav-sub-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  document.querySelectorAll('.nav-dd-btn, .nav-sub-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var wrap = btn.parentElement;
      var open = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) closeDropdowns(wrap);
      else wrap.querySelectorAll('.open').forEach(function (el) {
        el.classList.remove('open');
        var b = el.querySelector('[aria-expanded]');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-dd')) closeDropdowns();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDropdowns();
  });

  /* ================= WhatsApp-ссылки с названием товара ================= */
  document.querySelectorAll('[data-wa-product]').forEach(function (a) {
    var msg = 'Здравствуйте! Пишу с сайта nasteel.kz. Интересует: ' +
      a.getAttribute('data-wa-product') + '. Подскажите, пожалуйста, цену и сроки.';
    a.setAttribute('href', 'https://wa.me/77005450520?text=' + encodeURIComponent(msg));
  });

  /* ================= Мультилендинг: подмена H1 по ?key= ================= */
  var KEY_MAP = {
    'стеллажи': {
      h1: 'Стеллажи от казахстанского завода-производителя NASTEEL',
      sub: 'Полочные, паллетные, консольные и мезонинные стеллажи с нагрузкой от 100 кг до 20 000 кг. ГОСТ, СТ-KZ, монтаж по всему Казахстану.'
    },
    'паллетные-стеллажи': {
      h1: 'Паллетные стеллажи от завода NASTEEL с монтажом по Казахстану',
      sub: 'Проект склада, производство и монтаж фронтальных паллетных стеллажей. Нагрузки до 20 000 кг на секцию, сертификат СТ-KZ.'
    },
    'полочные-стеллажи': {
      h1: 'Полочные и среднегрузовые стеллажи от завода NASTEEL',
      sub: 'Серийное производство полочных стеллажей под ваши размеры и нагрузки. ГОСТ, СТ-KZ, доставка по всему Казахстану.'
    },
    'консольные-стеллажи': {
      h1: 'Консольные стеллажи для длинномерных грузов от завода NASTEEL',
      sub: 'Проектирование и производство консольных стеллажей под металлопрокат, трубы и пиломатериалы. Монтаж по всему Казахстану.'
    },
    'мезонин': {
      h1: 'Мезонинные стеллажные системы от завода NASTEEL',
      sub: 'Многоярусные мезонины: проект, расчёт нагрузок, производство и монтаж под ключ по всему Казахстану.'
    },
    'сейфы': {
      h1: 'Сейфы от казахстанского завода-производителя NASTEEL',
      sub: 'Взломостойкие, оружейные, офисные и депозитные сейфы по ГОСТ и СТ-KZ. Заводская гарантия, доставка по Казахстану.'
    },
    'оружейные-сейфы': {
      h1: 'Оружейные сейфы и шкафы от завода NASTEEL',
      sub: 'Сертифицированные оружейные сейфы казахстанского производства. ГОСТ, СТ-KZ, заводская гарантия.'
    },
    'металлическая-мебель': {
      h1: 'Металлическая мебель от казахстанского завода NASTEEL',
      sub: 'Архивные шкафы, картотеки, локеры, верстаки и тумбы серийно и под заказ. ГОСТ, СТ-KZ, доставка по Казахстану.'
    },
    'локеры': {
      h1: 'Локеры и шкафы для раздевалок от завода NASTEEL',
      sub: 'Серийное производство локеров под ваш проект: размеры, цвета RAL, замки любого типа. СТ-KZ, монтаж по Казахстану.'
    },
    'архивные-шкафы': {
      h1: 'Архивные шкафы и картотеки от завода NASTEEL',
      sub: 'Металлические архивные шкафы под документы любого формата. Серийное производство, ГОСТ, СТ-KZ.'
    },
    'банковское-оборудование': {
      h1: 'Банковское оборудование от казахстанского завода NASTEEL',
      sub: 'Бронированные двери, кассовые узлы и депозитные шкафы для банков. Опыт оснащения Halyk Bank, ForteBank, ATF Bank.'
    },
    'бронедвери': {
      h1: 'Бронированные банковские двери от завода NASTEEL',
      sub: 'Проектирование, производство и монтаж бронированных дверей для хранилищ и кассовых узлов. ГОСТ, СТ-KZ.'
    },
    'кассовые-узлы': {
      h1: 'Оборудование кассовых узлов от завода NASTEEL',
      sub: 'Кассовые узлы, передаточные лотки и защитные конструкции для банков и ломбардов. Производство по ГОСТ и СТ-KZ.'
    },
    'депозитарные-ячейки': {
      h1: 'Депозитарные ячейки от казахстанского завода NASTEEL',
      sub: 'Модульные блоки депозитарных ячеек для банков: производство, комплектация замками, монтаж в хранилище.'
    },
    'нестандарт': {
      h1: 'Нестандартные металлоизделия по вашим чертежам | NASTEEL',
      sub: 'Изготовим конструкции любой сложности по чертежам заказчика. Собственное КБ, лазерная резка, роботизированная сварка.'
    },
    'металлоизделия': {
      h1: 'Металлоизделия на заказ от казахстанского завода NASTEEL',
      sub: 'Полный цикл: проектирование, лазерная резка, гибка, сварка, порошковая покраска. ГОСТ, СТ-KZ, доставка по РК.'
    }
  };

  try {
    var params = new URLSearchParams(window.location.search);
    var rawKey = params.get('key');
    if (rawKey) {
      var key = decodeURIComponent(rawKey).toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
      var entry = KEY_MAP[key];
      if (entry) {
        document.getElementById('mainH1').textContent = entry.h1;
        document.getElementById('mainSub').textContent = entry.sub;
      }
    }
  } catch (e) { /* URL API недоступен: оставляем основной H1 */ }

  /* ================= Reveal on scroll ================= */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ================= Counters ================= */
  var fmt = function (n) {
    return n.toLocaleString('ru-RU').replace(/ /g, ' ');
  };
  var animateCounter = function (el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    if (reduceMotion) { el.textContent = fmt(target); return; }
    var dur = 1600;
    var start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  var counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCounter(en.target);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { animateCounter(el); });
  }

  /* ================= Каталог: запрос спецификации ================= */
  var categorySelect = document.getElementById('fCategory');
  document.querySelectorAll('.spec-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-category') || '';
      if (categorySelect) {
        for (var i = 0; i < categorySelect.options.length; i++) {
          if (categorySelect.options[i].text === cat) {
            categorySelect.selectedIndex = i;
            break;
          }
        }
      }
      window.onSpecRequest(cat);
      var target = document.getElementById('raschet');
      if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ================= Делегированный трекинг кликов ================= */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    var kind = el.getAttribute('data-track');
    if (kind === 'phone') window.onPhoneClick();
    else if (kind === 'whatsapp') window.onWhatsAppClick(el.getAttribute('data-wa') || '');
    else if (kind === 'doc') {
      e.preventDefault(); /* PDF-заглушки: реальные файлы добавим позже */
      window.onCatalogDownload(el.getAttribute('data-doc') || '');
      alert('Документ готовим к публикации. Запросите PDF у менеджера в WhatsApp или по телефону, вышлем сразу.');
    }
  });

  /* ================= Форма ================= */
  var form = document.getElementById('leadForm');
  var fileInput = document.getElementById('fFile');
  var fileName = document.getElementById('fileName');
  var success = document.getElementById('formSuccess');
  var waFallback = document.getElementById('waFallback');

  if (fileInput) {
    fileInput.addEventListener('change', function () {
      fileName.textContent = fileInput.files.length
        ? 'Файл: ' + fileInput.files[0].name
        : 'DWG, DXF или PDF, до 20 МБ';
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('fName').value.trim();
      var phone = document.getElementById('fPhone').value.trim();
      if (!name || !phone) {
        (!name ? document.getElementById('fName') : document.getElementById('fPhone')).focus();
        return;
      }
      var data = {
        name: name,
        company: document.getElementById('fCompany').value.trim(),
        phone: phone,
        category: categorySelect ? categorySelect.value : '',
        comment: document.getElementById('fComment').value.trim(),
        file: fileInput && fileInput.files.length ? fileInput.files[0].name : ''
      };

      window.onLeadSubmit(data);

      /* WhatsApp-фолбэк с предзаполненным текстом заявки */
      var lines = [
        'Здравствуйте! Заявка с сайта nasteel.kz',
        'Имя: ' + data.name,
        data.company ? 'Компания: ' + data.company : '',
        'Телефон: ' + data.phone,
        data.category ? 'Категория: ' + data.category : '',
        data.comment ? 'Комментарий: ' + data.comment : '',
        data.file ? 'Чертёж (дошлю файлом): ' + data.file : ''
      ].filter(Boolean);
      waFallback.href = 'https://wa.me/77005450520?text=' + encodeURIComponent(lines.join('\n'));

      form.querySelectorAll('.form-row, label, .form-submit, .form-note').forEach(function (el) {
        el.style.display = 'none';
      });
      success.hidden = false;
      success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  }
})();

/* ===== Лайтбокс сертификатов ===== */
(function () {
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.cert-thumb'));
  var lb = document.getElementById('certLb');
  if (!thumbs.length || !lb) return;
  var img = lb.querySelector('.cert-lb__img');
  var srcs = thumbs.map(function (t) { return t.getAttribute('data-full'); });
  var idx = 0;
  function show(i) {
    idx = (i + srcs.length) % srcs.length;
    img.src = srcs[idx];
    lb.removeAttribute('hidden');
    requestAnimationFrame(function () { lb.classList.add('open'); });
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    lb.setAttribute('hidden', '');
    img.src = '';
    document.body.style.overflow = '';
  }
  thumbs.forEach(function (t, i) { t.addEventListener('click', function () { show(i); }); });
  lb.querySelector('.cert-lb__close').addEventListener('click', close);
  lb.querySelector('.cert-lb__prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  lb.querySelector('.cert-lb__next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hasAttribute('hidden')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
})();
