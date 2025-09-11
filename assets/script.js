'use strict';
// Ultra-minimal gallery with categories + smooth reveals
(function() {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Guard for older browsers (very unlikely, but safe)
  var supportsIO = 'IntersectionObserver' in window;

  function addReveal(el) {
    if (!supportsIO) { el.classList.add('revealed'); return; }
    observer.observe(el);
  }

  var observer = supportsIO ? new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }) : null;

  // Reveal static sections
  Array.prototype.forEach.call(document.querySelectorAll('.reveal'), addReveal);

  // Load gallery.json and render
  fetch('gallery.json', { cache: 'no-cache' })
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(renderGallery)
    .catch(function(err) {
      var root = document.getElementById('gallery-root');
      if (root) {
        root.innerHTML = '<p class="category-desc">Could not load gallery (' + String(err.message || err) + ').</p>';
        root.removeAttribute('aria-busy');
      }
    });

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function(m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m];
    });
  }

  function renderGallery(data) {
    var root = document.getElementById('gallery-root');
    if (!root) return;
    root.setAttribute('aria-busy', 'true');
    root.innerHTML = '';

    var cats = (data && data.categories) || [];
    cats.forEach(function(cat) {
      var section = document.createElement('section');
      section.className = 'category reveal';
      section.innerHTML = ''
        + '<h3>' + escapeHtml(cat.title || '') + '</h3>'
        + (cat.description ? '<p class="category-desc">' + escapeHtml(cat.description) + '</p>' : '')
        + '<div class="figure-list"></div>';
      addReveal(section);

      var list = section.querySelector('.figure-list');
      (cat.items || []).forEach(function(item) {
        var figure = document.createElement('figure');
        figure.className = 'figure reveal';

        var media = document.createElement('div');
        media.className = 'figure-media';

        var img = document.createElement('img');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.alt = item.name || 'SVG figure';
        img.src = 'svgs/' + (item.file || '');

        media.appendChild(img);

        var cap = document.createElement('figcaption');
        cap.innerHTML = ''
          + '<h4>' + escapeHtml(item.name || '') + '</h4>'
          + (item.description ? '<p>' + escapeHtml(item.description) + '</p>' : '');

        figure.appendChild(media);
        figure.appendChild(cap);
        list.appendChild(figure);
        addReveal(figure);
      });

      root.appendChild(section);
    });

    root.removeAttribute('aria-busy');
  }
})();