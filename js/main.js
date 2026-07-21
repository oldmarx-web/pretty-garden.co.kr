/* 작은정원 — 폴라로이드 정원
   photos.json을 읽어 폴라로이드 월을 그립니다.
   사진이 없으면 '빈자리' 프레임을 보여줍니다. */

const WALL = document.getElementById('wall');

// 빈자리 프레임의 비율 (가로/세로/정방형 섞임)
const EMPTY_RATIOS = ['4/5', '3/2', '1/1', '4/5', '3/2', '4/5', '1/1', '3/2', '4/5'];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

function tapeClass(i) {
  return i % 3 === 0 ? ' tape' : (i % 3 === 1 ? ' tape-corner' : '');
}

function photoHTML(p, i) {
  const no = esc(p.no || String(i + 1).padStart(3, '0'));
  const cap = esc(p.cap || '');
  return `
  <figure class="pol${tapeClass(i)}" data-no="${no}" data-cap="${cap}" data-src="${esc(p.src)}"
    data-text="${esc(p.text || '')}" data-date="${esc(p.date || '')}">
    <img src="${esc(p.src)}" alt="${cap || '작은정원 사진'}" loading="lazy">
    <figcaption class="cap"><span class="no">No.${no}</span>${cap}</figcaption>
  </figure>`;
}

function emptyHTML(i) {
  const no = String(i + 1).padStart(3, '0');
  return `
  <figure class="pol empty${tapeClass(i)}">
    <div class="slot" style="aspect-ratio:${EMPTY_RATIOS[i % EMPTY_RATIOS.length]};">
      <span>사진이 놓일 자리<br>No.${no}</span>
    </div>
    <figcaption class="cap"><span class="no">No.${no}</span>&nbsp;</figcaption>
  </figure>`;
}

function render(photos) {
  let html = '';
  if (photos.length === 0) {
    // 아직 사진이 없는 정원 — 빈자리 9곳
    for (let i = 0; i < 9; i++) {
      html += emptyHTML(i);
    }
  } else {
    photos.forEach((p, i) => {
      html += photoHTML(p, i);
    });
    // 다음 사진을 기다리는 빈자리 하나
    html += emptyHTML(photos.length);
  }
  WALL.innerHTML = html;
  bindLightbox();
}

function bindLightbox() {
  const lb = document.getElementById('lb');
  const lbCard = document.getElementById('lbCard');
  document.querySelectorAll('.pol:not(.empty)').forEach((p) => {
    p.addEventListener('click', () => {
      lbCard.innerHTML = '';
      // 사진
      const photoWrap = document.createElement('div');
      photoWrap.className = 'lb-photo';
      const img = document.createElement('img');
      img.src = p.dataset.src;
      img.alt = p.dataset.cap || '';
      photoWrap.appendChild(img);
      lbCard.appendChild(photoWrap);
      // 글이 앉는 자리
      const textWrap = document.createElement('div');
      textWrap.className = 'lb-text';
      const no = document.createElement('div');
      no.className = 't-no';
      no.textContent = p.dataset.no ? 'No.' + p.dataset.no : '';
      const cap = document.createElement('div');
      cap.className = 't-cap';
      cap.textContent = p.dataset.cap || '';
      const body = document.createElement('div');
      body.className = 't-body';
      body.textContent = p.dataset.text || '';
      const date = document.createElement('div');
      date.className = 't-date';
      date.textContent = p.dataset.date || '';
      textWrap.append(no, cap, body, date);
      lbCard.appendChild(textWrap);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  document.getElementById('lbClose').onclick = closeLb;
  lb.onclick = (e) => { if (e.target === lb) closeLb(); };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
}

// photos.json 로드 (최신 글이 위로 오도록 역순 정렬)
fetch('photos.json', { cache: 'no-store' })
  .then((r) => (r.ok ? r.json() : { photos: [] }))
  .catch(() => ({ photos: [] }))
  .then((data) => {
    const photos = (data.photos || []).slice().reverse();
    render(photos);
  });

// music toggle (장식)
document.getElementById('music').addEventListener('click', function () {
  this.classList.toggle('playing');
});
