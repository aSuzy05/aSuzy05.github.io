/* Portfolio Suzanne Dong — interactions.
   Volontairement minimal : aucune dépendance, fonctionne en file:// */

(function () {
  'use strict';

  /* ── Filtrage des missions par outil ──────────────────────────────── */
  var filters = document.querySelectorAll('[data-filter]');
  var rows = document.querySelectorAll('[data-tools]');

  function apply(key) {
    Array.prototype.forEach.call(rows, function (row) {
      var match = key === 'all' || row.dataset.tools.split(' ').indexOf(key) !== -1;
      row.hidden = !match;
    });
    Array.prototype.forEach.call(filters, function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.filter === key));
    });
  }

  Array.prototype.forEach.call(filters, function (btn) {
    btn.addEventListener('click', function () { apply(btn.dataset.filter); });
  });

  /* Liens outils de l'accueil : appliquent le filtre, puis l'ancre
     #missions fait défiler jusqu'à la liste */
  Array.prototype.forEach.call(document.querySelectorAll('[data-goto-filter]'), function (link) {
    link.addEventListener('click', function () { apply(link.dataset.gotoFilter); });
  });

  /* ── Thème clair / sombre ─────────────────────────────────────────── */
  /* Sans choix du visiteur, le CSS suit le réglage de l'ordinateur.
     Le bouton fixe data-theme sur <html> et le mémorise ; le petit script
     placé dans le <head> de chaque page le réapplique avant l'affichage. */
  var root = document.documentElement;
  var head = document.querySelector('.head-in');
  var nav = head && head.querySelector('.site-nav');
  if (head && nav) {
    var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
    var ICONS = {
      light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
      dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
    };
    var current = function () {
      return root.dataset.theme || (media && media.matches ? 'light' : 'dark');
    };
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-btn';

    /* Le bouton annonce le thème vers lequel il bascule */
    var render = function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      btn.innerHTML = ICONS[next] + '<span>' + (next === 'light' ? 'Clair' : 'Sombre') + '</span>';
      btn.setAttribute('aria-label', next === 'light' ? 'Passer au thème clair' : 'Passer au thème sombre');
    };

    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      render();
    });
    if (media && media.addEventListener) media.addEventListener('change', render);

    var tools = document.createElement('div');
    tools.className = 'head-tools';
    head.insertBefore(tools, nav);
    tools.appendChild(nav);
    tools.appendChild(btn);
    render();
  }

  /* ── Sommaire latéral : surligne la section courante ───────────────── */
  var links = document.querySelectorAll('.rail a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    Array.prototype.forEach.call(links, function (a) {
      byId[a.getAttribute('href').slice(1)] = a;
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = byId[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          Array.prototype.forEach.call(links, function (l) { l.style.color = ''; });
          a.style.color = 'var(--accent)';
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
})();
