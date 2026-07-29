/* phono·graph — 폴라로이드 월
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

function photoHTML(p, i, size) {
  const no = esc(p.no || String(i + 1).padStart(3, '0'));
  return `
  <figure class="pol ${size}${tapeClass(i)}" data-no="${no}" data-src="${esc(p.src)}"
    data-text="${esc(p.text || '')}" data-date="${esc(p.date || '')}">
    <img src="${esc(p.src)}" alt="phono·graph No.${no}" loading="lazy">
    <figcaption class="cap"><span class="no">No.${no}</span></figcaption>
  </figure>`;
}

function emptyHTML(i, size) {
  const no = String(i + 1).padStart(3, '0');
  const ratio = size === 'hero' ? '3/2' : '1/1';
  return `
  <figure class="pol ${size} empty${tapeClass(i)}">
    <div class="slot" style="aspect-ratio:${ratio};">
      <span>사진이 놓일 자리<br>No.${no}</span>
    </div>
    <figcaption class="cap"><span class="no">No.${no}</span>&nbsp;</figcaption>
  </figure>`;
}

function render(photos) {
  // 최신 한 장은 크게, 지난 사진들은 아래 작게 (클릭하면 커집니다)
  let html = '';
  if (photos.length === 0) {
    html = emptyHTML(0, 'hero');
  } else {
    html = photoHTML(photos[0], 0, 'hero');
    html += '<div class="past">';
    photos.slice(1).forEach((p, i) => {
      html += photoHTML(p, i + 1, 'mini');
    });
    // 다음 사진을 기다리는 빈자리 하나
    html += emptyHTML(photos.length, 'mini');
    html += '</div>';
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
      img.alt = 'phono·graph';
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
      cap.textContent = 'phono·graph';  // 모든 사진의 제목
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
