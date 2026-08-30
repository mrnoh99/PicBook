// PicBook - 아이를 위한 색칠공부 앱
const VIEWBOX = '0 0 500 400';

const COLORS = [
  { name: '빨강', hex: '#ef4444' },
  { name: '주황', hex: '#f97316' },
  { name: '노랑', hex: '#facc15' },
  { name: '연두', hex: '#84cc16' },
  { name: '초록', hex: '#22c55e' },
  { name: '하늘', hex: '#38bdf8' },
  { name: '파랑', hex: '#3b82f6' },
  { name: '보라', hex: '#a855f7' },
  { name: '분홍', hex: '#ec4899' },
  { name: '갈색', hex: '#a16207' },
  { name: '검정', hex: '#3a3a3a' },
  { name: '하양', hex: '#ffffff' }
];

let currentColor = COLORS[0].hex;

function storageKey(id) {
  return 'picbook-colors-' + id;
}

function loadColors(id) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(id)) || '{}');
  } catch (e) {
    return {};
  }
}

function saveColors(id, data) {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(data));
  } catch (e) {
    // 저장 공간이 없어도 앱은 계속 동작해야 한다
  }
}

function router() {
  const hash = location.hash || '#/';
  const m = hash.match(/^#\/color\/([a-z]+)/);
  if (m && PICTURES.some((p) => p.id === m[1])) {
    renderColorPage(m[1]);
  } else {
    renderHome();
  }
  window.scrollTo(0, 0);
}

function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="home">
      <h1>🎨 해성 해준의 색칠공부</h1>
      <p class="subtitle">그림을 골라서 예쁘게 색칠해보세요!</p>
      <div class="grid">
        ${PICTURES.map(
          (p) => `
          <a class="card" href="#/color/${p.id}">
            <div class="thumb"><svg viewBox="${VIEWBOX}">${p.svg}</svg></div>
            <div class="label">
              <span class="label-ko">${p.emoji} ${p.name}</span>
              <span class="label-en">${p.nameEn}</span>
            </div>
          </a>
        `
        ).join('')}
      </div>
    </div>
  `;
}

function renderColorPage(id) {
  const idx = PICTURES.findIndex((p) => p.id === id);
  const pic = PICTURES[idx];
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="colorview">
      <div class="topbar">
        <a class="btn round" href="#/" aria-label="홈으로">🏠</a>
        <div class="title">
          <span class="title-ko">${pic.emoji} ${pic.name}</span>
          <span class="title-en">${pic.nameEn}</span>
        </div>
        <button class="btn round" id="resetBtn" aria-label="다시 칠하기">↺</button>
      </div>
      <div class="stage">
        <button class="nav prev" id="prevBtn" aria-label="이전 그림">◀</button>
        <div class="canvas-wrap">
          <svg id="pic" viewBox="${VIEWBOX}">
            <rect class="region bg-region" data-name="배경" x="0" y="0" width="500" height="400" rx="16" ry="16"/>
            ${pic.svg}
          </svg>
        </div>
        <button class="nav next" id="nextBtn" aria-label="다음 그림">▶</button>
      </div>
      <div class="palette" id="palette">
        ${COLORS.map(
          (c) =>
            `<button class="swatch" data-color="${c.hex}" style="--c:${c.hex}" aria-label="${c.name}"></button>`
        ).join('')}
      </div>
      <div class="toast" id="toast">🎉 잘했어요!</div>
    </div>
  `;

  const svg = document.getElementById('pic');
  const regions = svg.querySelectorAll('.region');
  const saved = loadColors(id);
  regions.forEach((r) => {
    const name = r.dataset.name;
    if (saved[name]) r.style.fill = saved[name];
  });

  const palette = document.getElementById('palette');
  const firstSwatch = palette.querySelector('.swatch');
  firstSwatch.classList.add('active');
  currentColor = firstSwatch.dataset.color;

  palette.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.swatch');
    if (!btn) return;
    palette.querySelectorAll('.swatch').forEach((s) => s.classList.remove('active'));
    btn.classList.add('active');
    currentColor = btn.dataset.color;
  });

  svg.addEventListener('pointerdown', (e) => {
    const target = e.target.closest('.region');
    if (!target) return;
    target.style.fill = currentColor;
    const data = loadColors(id);
    data[target.dataset.name] = currentColor;
    saveColors(id, data);
    checkComplete(svg);
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    regions.forEach((r) => (r.style.fill = ''));
    saveColors(id, {});
  });

  document.getElementById('prevBtn').addEventListener('click', () => {
    const p = PICTURES[(idx - 1 + PICTURES.length) % PICTURES.length];
    location.hash = '#/color/' + p.id;
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    const p = PICTURES[(idx + 1) % PICTURES.length];
    location.hash = '#/color/' + p.id;
  });
}

function checkComplete(svg) {
  const regions = [...svg.querySelectorAll('.region')];
  const allColored = regions.every((r) => r.style.fill && r.style.fill !== '');
  if (allColored) {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
