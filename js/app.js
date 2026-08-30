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

const SVG_NS = 'http://www.w3.org/2000/svg';
const BRUSH_WIDTH = 28;

function storageKey(id) {
  return 'picbook-strokes-' + id;
}

function loadStrokes(id) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(id)) || '{}');
  } catch (e) {
    return {};
  }
}

function saveStrokes(id, svg) {
  const data = {};
  svg.querySelectorAll('.paint-group').forEach((g) => {
    const paths = [...g.children].map((p) => ({
      color: p.getAttribute('stroke'),
      d: p.getAttribute('d')
    }));
    if (paths.length) data[g.dataset.name] = paths;
  });
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(data));
  } catch (e) {
    // 저장 공간이 없어도 앱은 계속 동작해야 한다
  }
}

// 각 region 도형마다: (1) 같은 모양의 clipPath를 만들고 (2) 그 clipPath로 잘리는
// paint-group을 region 바로 앞에 끼워 넣는다. 붓 자국은 paint-group 안에 그려지므로
// region의 테두리(선) 밖으로는 절대 삐져나가지 않는다.
function setupPaintLayers(svg, pictureId) {
  const regions = svg.querySelectorAll('.region');
  regions.forEach((region, i) => {
    const clipId = `clip-${pictureId}-${i}`;
    const clipPath = document.createElementNS(SVG_NS, 'clipPath');
    clipPath.id = clipId;
    const clipShape = region.cloneNode(false);
    clipShape.removeAttribute('class');
    clipShape.removeAttribute('data-name');
    clipPath.appendChild(clipShape);
    region.parentNode.insertBefore(clipPath, region);

    const paintGroup = document.createElementNS(SVG_NS, 'g');
    paintGroup.classList.add('paint-group');
    paintGroup.dataset.name = region.dataset.name;
    paintGroup.setAttribute('clip-path', `url(#${clipId})`);
    region.parentNode.insertBefore(paintGroup, region);
  });
}

function renderStrokes(svg, saved) {
  svg.querySelectorAll('.paint-group').forEach((g) => {
    const strokes = saved[g.dataset.name] || [];
    strokes.forEach((s) => g.appendChild(makeStrokePath(s.color, s.d)));
  });
}

function makeStrokePath(color, d) {
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', BRUSH_WIDTH);
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('fill', 'none');
  path.setAttribute('d', d);
  return path;
}

// clientX/clientY(화면 좌표)를 el이 속한 SVG 좌표계로 변환한다.
// el 자신이 회전/이동된 <g> 안에 있어도 정확히 맞아떨어진다.
function toLocalPoint(el, clientX, clientY) {
  const svg = el.ownerSVGElement;
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = el.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const p = pt.matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
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
  setupPaintLayers(svg, id);
  renderStrokes(svg, loadStrokes(id));

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

  let strokePath = null;
  let paintGroup = null;

  svg.addEventListener('pointerdown', (e) => {
    if (strokePath) return; // 한 번에 한 붓만
    const region = e.target.closest('.region');
    if (!region) return;
    paintGroup = svg.querySelector(`.paint-group[data-name="${region.dataset.name}"]`);
    if (!paintGroup) return;
    svg.setPointerCapture(e.pointerId);
    const p = toLocalPoint(paintGroup, e.clientX, e.clientY);
    strokePath = makeStrokePath(currentColor, `M${p.x},${p.y}`);
    paintGroup.appendChild(strokePath);
  });

  svg.addEventListener('pointermove', (e) => {
    if (!strokePath) return;
    const p = toLocalPoint(paintGroup, e.clientX, e.clientY);
    strokePath.setAttribute('d', strokePath.getAttribute('d') + ` L${p.x},${p.y}`);
  });

  const endStroke = () => {
    if (!strokePath) return;
    strokePath = null;
    paintGroup = null;
    saveStrokes(id, svg);
    checkComplete(svg);
  };
  svg.addEventListener('pointerup', endStroke);
  svg.addEventListener('pointercancel', endStroke);

  document.getElementById('resetBtn').addEventListener('click', () => {
    svg.querySelectorAll('.paint-group').forEach((g) => {
      g.innerHTML = '';
    });
    saveStrokes(id, svg);
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
  const groups = [...svg.querySelectorAll('.paint-group')];
  const allPainted = groups.length > 0 && groups.every((g) => g.children.length > 0);
  if (allPainted) {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
