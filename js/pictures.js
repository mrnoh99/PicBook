// 색칠공부 그림 목록
// 각 svg는 <svg viewBox="0 0 500 400"> 안에 들어갈 내용입니다.
// class="region"  : 아이가 탭해서 색칠할 수 있는 부분
// class="fixed"    : 눈, 코, 수염처럼 색칠 대상이 아닌 고정 장식
const PICTURES = [
  {
    id: 'car',
    name: '자동차',
    emoji: '🚗',
    svg: `
      <circle class="fixed" cx="150" cy="290" r="44" fill="#2b2b2b"/>
      <circle class="fixed" cx="350" cy="290" r="44" fill="#2b2b2b"/>
      <rect class="region" data-name="차체" x="60" y="180" width="380" height="100" rx="26"/>
      <path class="region" data-name="지붕" d="M150,180 L190,95 L310,95 L350,180 Z"/>
      <polygon class="region" data-name="창문1" points="162,174 196,113 244,113 244,174"/>
      <polygon class="region" data-name="창문2" points="256,174 256,113 304,113 338,174"/>
      <circle class="region" data-name="전조등" cx="432" cy="212" r="17"/>
      <circle class="region" data-name="바퀴1" cx="150" cy="290" r="19"/>
      <circle class="region" data-name="바퀴2" cx="350" cy="290" r="19"/>
    `
  },
  {
    id: 'truck',
    name: '트럭',
    emoji: '🚚',
    svg: `
      <circle class="fixed" cx="140" cy="290" r="44" fill="#2b2b2b"/>
      <circle class="fixed" cx="380" cy="290" r="44" fill="#2b2b2b"/>
      <rect class="region" data-name="운전석" x="60" y="150" width="150" height="140" rx="18"/>
      <rect class="region" data-name="창문" x="80" y="168" width="95" height="55" rx="8"/>
      <circle class="region" data-name="전조등" cx="68" cy="250" r="15"/>
      <rect class="region" data-name="화물칸" x="210" y="195" width="230" height="95" rx="10"/>
      <circle class="region" data-name="바퀴1" cx="140" cy="290" r="19"/>
      <circle class="region" data-name="바퀴2" cx="380" cy="290" r="19"/>
    `
  },
  {
    id: 'bus',
    name: '버스',
    emoji: '🚌',
    svg: `
      <circle class="fixed" cx="150" cy="290" r="44" fill="#2b2b2b"/>
      <circle class="fixed" cx="350" cy="290" r="44" fill="#2b2b2b"/>
      <rect class="region" data-name="차체" x="70" y="140" width="340" height="140" rx="24"/>
      <rect class="region" data-name="창문1" x="105" y="168" width="55" height="48" rx="8"/>
      <rect class="region" data-name="창문2" x="172" y="168" width="55" height="48" rx="8"/>
      <rect class="region" data-name="창문3" x="239" y="168" width="55" height="48" rx="8"/>
      <rect class="region" data-name="창문4" x="306" y="168" width="55" height="48" rx="8"/>
      <circle class="region" data-name="전조등" cx="395" cy="245" r="15"/>
      <circle class="region" data-name="바퀴1" cx="150" cy="290" r="19"/>
      <circle class="region" data-name="바퀴2" cx="350" cy="290" r="19"/>
    `
  },
  {
    id: 'fish',
    name: '물고기',
    emoji: '🐠',
    svg: `
      <ellipse class="region" data-name="몸통" cx="230" cy="200" rx="150" ry="95"/>
      <polygon class="region" data-name="꼬리" points="95,200 5,130 5,270"/>
      <polygon class="region" data-name="윗지느러미" points="210,110 250,30 290,110"/>
      <polygon class="region" data-name="아랫지느러미" points="210,290 250,360 280,290"/>
      <ellipse class="region" data-name="무늬1" cx="270" cy="200" rx="18" ry="80"/>
      <ellipse class="region" data-name="무늬2" cx="330" cy="200" rx="16" ry="65"/>
      <circle class="fixed" cx="350" cy="175" r="20" fill="#ffffff" stroke="#3a3a3a" stroke-width="5"/>
      <circle class="fixed" cx="354" cy="175" r="9" fill="#2b2b2b"/>
    `
  },
  {
    id: 'dog',
    name: '강아지',
    emoji: '🐶',
    svg: `
      <ellipse class="region" data-name="귀1" cx="145" cy="130" rx="42" ry="68"/>
      <ellipse class="region" data-name="귀2" cx="355" cy="130" rx="42" ry="68"/>
      <circle class="region" data-name="얼굴" cx="250" cy="190" r="115"/>
      <ellipse class="region" data-name="주둥이" cx="250" cy="255" rx="75" ry="52"/>
      <ellipse class="region" data-name="혀" cx="250" cy="300" rx="22" ry="30"/>
      <circle class="fixed" cx="205" cy="170" r="14" fill="#2b2b2b"/>
      <circle class="fixed" cx="295" cy="170" r="14" fill="#2b2b2b"/>
      <ellipse class="fixed" cx="250" cy="235" rx="18" ry="13" fill="#2b2b2b"/>
    `
  },
  {
    id: 'cat',
    name: '고양이',
    emoji: '🐱',
    svg: `
      <path class="region" data-name="꼬리" d="M380,330 Q460,300 445,195 Q435,150 402,175 Q422,255 358,300 Z"/>
      <ellipse class="region" data-name="몸통" cx="250" cy="320" rx="135" ry="95"/>
      <polygon class="region" data-name="귀1" points="165,115 132,15 205,95"/>
      <polygon class="region" data-name="귀2" points="335,115 368,15 295,95"/>
      <circle class="region" data-name="얼굴" cx="250" cy="175" r="105"/>
      <circle class="fixed" cx="210" cy="165" r="13" fill="#2b2b2b"/>
      <circle class="fixed" cx="290" cy="165" r="13" fill="#2b2b2b"/>
      <polygon class="fixed" points="240,200 260,200 250,215" fill="#e0788a"/>
      <line class="fixed" x1="150" y1="195" x2="210" y2="205" stroke="#3a3a3a" stroke-width="4" stroke-linecap="round"/>
      <line class="fixed" x1="150" y1="215" x2="212" y2="215" stroke="#3a3a3a" stroke-width="4" stroke-linecap="round"/>
      <line class="fixed" x1="350" y1="195" x2="290" y2="205" stroke="#3a3a3a" stroke-width="4" stroke-linecap="round"/>
      <line class="fixed" x1="350" y1="215" x2="288" y2="215" stroke="#3a3a3a" stroke-width="4" stroke-linecap="round"/>
    `
  },
  {
    id: 'elephant',
    name: '코끼리',
    emoji: '🐘',
    svg: `
      <ellipse class="region" data-name="귀" cx="115" cy="175" rx="95" ry="115"/>
      <rect class="region" data-name="다리1" x="255" y="350" width="42" height="65" rx="10"/>
      <rect class="region" data-name="다리2" x="340" y="350" width="42" height="65" rx="10"/>
      <ellipse class="region" data-name="몸통" cx="300" cy="280" rx="150" ry="105"/>
      <circle class="region" data-name="머리" cx="235" cy="185" r="100"/>
      <path class="region" data-name="코" d="M300,225 C345,245 365,300 345,365 C335,388 300,385 292,362 C312,320 288,255 268,228 Z"/>
      <circle class="fixed" cx="270" cy="160" r="14" fill="#2b2b2b"/>
    `
  },
  {
    id: 'butterfly',
    name: '나비',
    emoji: '🦋',
    svg: `
      <path class="region" data-name="날개1" d="M235,150 C150,70 50,100 65,180 C85,225 180,205 235,170 Z"/>
      <path class="region" data-name="날개2" d="M265,150 C350,70 450,100 435,180 C415,225 320,205 265,170 Z"/>
      <path class="region" data-name="날개3" d="M235,215 C155,230 90,305 135,335 C180,355 232,270 235,225 Z"/>
      <path class="region" data-name="날개4" d="M265,215 C345,230 410,305 365,335 C320,355 268,270 265,225 Z"/>
      <ellipse class="region" data-name="몸통" cx="250" cy="200" rx="16" ry="115"/>
      <circle class="fixed" cx="250" cy="90" r="10" fill="#2b2b2b"/>
      <line class="fixed" x1="250" y1="95" x2="220" y2="50" stroke="#2b2b2b" stroke-width="4" stroke-linecap="round"/>
      <line class="fixed" x1="250" y1="95" x2="280" y2="50" stroke="#2b2b2b" stroke-width="4" stroke-linecap="round"/>
    `
  },
  {
    id: 'sun',
    name: '해님',
    emoji: '☀️',
    svg: `
      <rect class="region" data-name="햇살1" x="235" y="20" width="30" height="80" rx="10" transform="rotate(0 250 200)"/>
      <rect class="region" data-name="햇살2" x="235" y="20" width="30" height="80" rx="10" transform="rotate(60 250 200)"/>
      <rect class="region" data-name="햇살3" x="235" y="20" width="30" height="80" rx="10" transform="rotate(120 250 200)"/>
      <rect class="region" data-name="햇살4" x="235" y="20" width="30" height="80" rx="10" transform="rotate(180 250 200)"/>
      <rect class="region" data-name="햇살5" x="235" y="20" width="30" height="80" rx="10" transform="rotate(240 250 200)"/>
      <rect class="region" data-name="햇살6" x="235" y="20" width="30" height="80" rx="10" transform="rotate(300 250 200)"/>
      <circle class="region" data-name="얼굴" cx="250" cy="200" r="95"/>
      <circle class="fixed" cx="220" cy="180" r="10" fill="#2b2b2b"/>
      <circle class="fixed" cx="280" cy="180" r="10" fill="#2b2b2b"/>
      <path class="fixed" d="M215,220 Q250,255 285,220" stroke="#2b2b2b" stroke-width="6" fill="none" stroke-linecap="round"/>
    `
  },
  {
    id: 'house',
    name: '집',
    emoji: '🏠',
    svg: `
      <rect class="region" data-name="굴뚝" x="315" y="85" width="34" height="75"/>
      <polygon class="region" data-name="지붕" points="95,180 250,55 405,180"/>
      <rect class="region" data-name="벽" x="120" y="180" width="260" height="185"/>
      <rect class="region" data-name="문" x="222" y="255" width="56" height="110"/>
      <rect class="region" data-name="창문1" x="150" y="210" width="60" height="60"/>
      <rect class="region" data-name="창문2" x="290" y="210" width="60" height="60"/>
      <circle class="fixed" cx="250" cy="330" r="5" fill="#2b2b2b"/>
    `
  }
];
