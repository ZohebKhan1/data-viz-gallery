// Minimal gallery logic
(async function() {
  const grid = document.getElementById('grid');
  const filters = document.getElementById('filters');
  const search = document.getElementById('search');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalMedia = document.getElementById('modal-media');
  const downloadLink = document.getElementById('downloadLink');
  const copyLink = document.getElementById('copyLink');
  const openNew = document.getElementById('openNew');
  const themeToggle = document.getElementById('themeToggle');
  
  let items = [];
  try {
    const res = await fetch('gallery.json');
    items = await res.json();
  } catch (e) {
    console.error('Failed to load gallery.json', e);
  }

  // Build tag list
  const allTags = new Set();
  items.forEach(it => (it.tags || []).forEach(t => allTags.add(t)));
  const activeTags = new Set();
  for (const tag of Array.from(allTags).sort((a,b) => a.localeCompare(b))) {
    const lbl = document.createElement('label');
    lbl.className = 'filter-chip';
    lbl.innerHTML = `<input type="checkbox" value="${tag}"><span>#${tag}</span>`;
    lbl.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'input') return;
      const input = lbl.querySelector('input');
      input.checked = !input.checked;
      if (input.checked) { activeTags.add(tag); lbl.classList.add('active'); }
      else { activeTags.delete(tag); lbl.classList.remove('active'); }
      render();
    });
    filters.appendChild(lbl);
  }

  search.addEventListener('input', () => render());
  themeToggle.addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = cur;
    try { localStorage.setItem('theme', cur); } catch {}
  });

  function cardTemplate(item) {
    const tagHtml = (item.tags || []).map(t => `<span class="tag">#${t}</span>`).join('');
    return `
      <article class="card" data-file="${item.file}" data-title="${item.title}" data-tags="${(item.tags||[]).join(',')}">
        <div class="thumb"><img src="svgs/${item.file}" alt="${item.title} thumbnail"></div>
        <div class="meta">
          <h3>${item.title}</h3>
          <p>${item.description || ''}</p>
          <div class="tags">${tagHtml}</div>
        </div>
      </article>
    `;
  }

  function matches(item) {
    const q = search.value.trim().toLowerCase();
    const tagOk = activeTags.size === 0 || (item.tags || []).some(t => activeTags.has(t));
    const text = (item.title + ' ' + (item.tags||[]).join(' ') + ' ' + (item.description||'')).toLowerCase();
    const queryOk = !q || text.includes(q);
    return tagOk && queryOk;
  }

  function render() {
    grid.setAttribute('aria-busy', 'true');
    const html = items.filter(matches).map(cardTemplate).join('');
    grid.innerHTML = html || '<p class="muted">No results.</p>';
    Array.from(grid.querySelectorAll('.card')).forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.file));
    });
    grid.removeAttribute('aria-busy');
  }

  function openModal(file) {
    const item = items.find(i => i.file === file);
    if (!item) return;
    modalTitle.textContent = item.title;
    modalDesc.textContent = item.description || '';
    modalMedia.innerHTML = ''; // Clear
    const img = document.createElement('img');
    img.src = `svgs/${item.file}`;
    img.alt = item.title;
    modalMedia.appendChild(img);
    const rawUrl = `svgs/${item.file}`;
    downloadLink.href = rawUrl;
    openNew.onclick = () => window.open(rawUrl, '_blank', 'noopener');
    copyLink.onclick = async () => {
      const url = `${location.origin}${location.pathname.replace(/\/[^/]*$/, '/') }svgs/${item.file}`;
      try { await navigator.clipboard.writeText(url); copyLink.textContent = 'Copied!'; setTimeout(()=> copyLink.textContent='Copy Link', 1500); } catch {}
    };
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  modal.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  render();
})();