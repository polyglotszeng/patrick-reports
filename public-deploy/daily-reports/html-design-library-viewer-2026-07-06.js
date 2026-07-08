/* html-design-library-viewer.js — search + filter + sort logic v2
 * Extracted from inline script (07-06 v1 → v2 refactor per PITFALL "JS inline > 60 lines should be split")
 * Deps: <input id="q">, <div id="filterbar">, <div id="sortbar">, <div id="empty">
 *        section.layer table tr rows
 */
(function(){
  // === 1. Annotate each <tr> with category + license + content flags ===
  const rows = document.querySelectorAll('section.layer table tr');
  let stats = {L1:0,L2:0,L3:0,L4:0,L5:0,MIT:0,CC:0,FREE:0,PAID:0,AI:0,MOTION:0};
  rows.forEach((tr, i) => {
    if (i === 0) return;
    const section = tr.closest('section.layer');
    const secId = section ? section.id : '';
    const cats = [];
    if (secId === 'layer1') cats.push('L1');
    else if (secId === 'layer2') cats.push('L2');
    else if (secId === 'layer3') cats.push('L3');
    else if (secId === 'layer4') cats.push('L4');
    else if (secId === 'layer5') cats.push('L5');
    const txt = tr.textContent.toLowerCase();
    if (txt.includes('mit')) cats.push('MIT');
    if (txt.includes('cc ') || txt.includes('cc by') || txt.includes('creative commons')) cats.push('CC');
    if (txt.includes('free')) cats.push('FREE');
    if (txt.includes('$') || txt.includes('paid') || txt.includes('commercial') || txt.includes('credits') || txt.includes('tier')) cats.push('PAID');
    if (txt.includes('v0') || txt.includes('bolt') || txt.includes('replit') || txt.includes('lovable')) cats.push('AI');
    if (txt.includes('lottie') || txt.includes('rive') || txt.includes('motion') || txt.includes('framer') || txt.includes('animation')) cats.push('MOTION');
    tr.dataset.cats = cats.join(',');
    tr.dataset.search = tr.textContent.toLowerCase();
    tr.dataset.name = (tr.querySelector('.site') ? tr.querySelector('.site').textContent : tr.textContent.split('\n')[0]).toLowerCase();
    cats.forEach(c => { if (stats[c] !== undefined) stats[c]++; });
  });

  // === 2. Populate filter chip counts ===
  const total = Array.from(rows).filter((_,i) => i>0).length;
  const nAll = document.getElementById('n-all');
  if (nAll) nAll.textContent = `(${total})`;
  ['L1','L2','L3','L4','L5','MIT','CC','FREE','PAID','AI','MOTION'].forEach(c => {
    const el = document.querySelector(`.filterchip[data-cat="${c}"] .n`);
    if (el) el.textContent = stats[c] ? `(${stats[c]})` : '';
  });

  // === 3. State ===
  const q = document.getElementById('q');
  const empty = document.getElementById('empty');
  let activeCat = 'all';
  let activeSort = 'default';

  function apply() {
    const term = (q ? q.value : '').trim().toLowerCase();
    let visible = 0;
    rows.forEach((tr, i) => {
      if (i === 0) return;
      const matchSearch = !term || (tr.dataset.search || '').includes(term);
      const cats = (tr.dataset.cats || '').split(',');
      const matchCat = activeCat === 'all' || cats.includes(activeCat);
      const show = matchSearch && matchCat;
      tr.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (empty) empty.classList.toggle('show', visible === 0);
    document.querySelectorAll('section.layer').forEach(sec => {
      const secRows = Array.from(sec.querySelectorAll('table tr')).slice(1);
      const any = secRows.some(r => r.style.display !== 'none');
      sec.style.display = any ? '' : 'none';
    });
  }

  // === 4. Sort logic (new in v2) ===
  function applySort() {
    if (activeSort === 'default') {
      // Restore original DOM order
      document.querySelectorAll('section.layer table').forEach(table => {
        const tbody = table.tBodies[0] || table;
        const sorted = Array.from(tbody.querySelectorAll('tr')).slice(1)
          .sort((a, b) => (parseInt(a.dataset.origIdx) || 0) - (parseInt(b.dataset.origIdx) || 0));
        sorted.forEach(r => tbody.appendChild(r));
      });
      return;
    }
    document.querySelectorAll('section.layer table').forEach(table => {
      const tbody = table.tBodies[0] || table;
      const dataRows = Array.from(tbody.querySelectorAll('tr')).slice(1);
      dataRows.sort((a, b) => {
        if (activeSort === 'name') {
          return (a.dataset.name || '').localeCompare(b.dataset.name || '');
        }
        if (activeSort === 'mit-first') {
          const aM = (a.dataset.cats || '').includes('MIT') ? 0 : 1;
          const bM = (b.dataset.cats || '').includes('MIT') ? 0 : 1;
          if (aM !== bM) return aM - bM;
          return (a.dataset.name || '').localeCompare(b.dataset.name || '');
        }
        if (activeSort === 'free-first') {
          const aF = (a.dataset.cats || '').includes('FREE') ? 0 : 1;
          const bF = (b.dataset.cats || '').includes('FREE') ? 0 : 1;
          if (aF !== bF) return aF - bF;
          return (a.dataset.name || '').localeCompare(b.dataset.name || '');
        }
        return 0;
      });
      dataRows.forEach(r => tbody.appendChild(r));
    });
  }

  // Save original index for default sort
  rows.forEach((tr, i) => { if (i > 0) tr.dataset.origIdx = i; });

  // === 5. Wire up events ===
  const filterbar = document.getElementById('filterbar');
  if (filterbar) {
    filterbar.addEventListener('click', e => {
      const chip = e.target.closest('.filterchip');
      if (!chip) return;
      filterbar.querySelectorAll('.filterchip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCat = chip.dataset.cat;
      apply();
    });
  }

  const sortbar = document.getElementById('sortbar');
  if (sortbar) {
    sortbar.addEventListener('click', e => {
      const chip = e.target.closest('.sortchip');
      if (!chip) return;
      sortbar.querySelectorAll('.sortchip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeSort = chip.dataset.sort;
      applySort();
    });
  }

  if (q) q.addEventListener('input', apply);

  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== q) {
      e.preventDefault();
      if (q) q.focus();
    } else if (e.key === 'Escape' && document.activeElement === q) {
      q.value = '';
      apply();
      q.blur();
    }
  });

  apply();
})();
