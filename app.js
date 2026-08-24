/* ============================================================
   app.js — 과학송 아카이브 메인 로직  v2.1
   ============================================================ */

'use strict';

// ══════════════════════════════════════════════════════
// 1. CONSTANTS & STATE
// ══════════════════════════════════════════════════════
const STORAGE_KEY = 'scienceSongArchive_v2';
// 관리자 인증: SHA-256 해시로 저장 (개발자 도구 소스 노출 시 비밀번호 안전)
const ADMIN_HASH = 'ad5f52f58ed6ec6e7a641f2416f347674ac5933470079f2a18bc6269b1e80796';

// ── 기본 과학송 데이터 ──
const DEFAULT_SONGS = [
  /* ── 중2 ── */
  { id:'s01', grade:'중2', title:'원소기호송',              youtubeUrl:'https://www.youtube.com/watch?v=w2TJ1RBsiK0', videoId:'w2TJ1RBsiK0', thumbnail:'https://img.youtube.com/vi/w2TJ1RBsiK0/hqdefault.jpg', tags:['1단원','물질의구성'],         order:0  },
  { id:'s02', grade:'중2', title:'이온송',                  youtubeUrl:'https://www.youtube.com/watch?v=ScxLD5UEoMA', videoId:'ScxLD5UEoMA', thumbnail:'https://img.youtube.com/vi/ScxLD5UEoMA/hqdefault.jpg', tags:['1단원','물질의구성'],         order:1  },
  { id:'s03', grade:'중2', title:'자기력송',                youtubeUrl:'https://www.youtube.com/watch?v=2110PW3rkJw', videoId:'2110PW3rkJw', thumbnail:'https://img.youtube.com/vi/2110PW3rkJw/hqdefault.jpg', tags:['2단원','전기와자기'],         order:2  },
  { id:'s04', grade:'중2', title:'태양계송',                youtubeUrl:'https://youtu.be/gmJ8RvIQiQc',                videoId:'gmJ8RvIQiQc', thumbnail:'https://img.youtube.com/vi/gmJ8RvIQiQc/hqdefault.jpg', tags:['3단원','태양계'],             order:3  },
  { id:'s05', grade:'중2', title:'광합성송',                youtubeUrl:'https://www.youtube.com/watch?v=P8cGGja3sHo', videoId:'P8cGGja3sHo', thumbnail:'https://img.youtube.com/vi/P8cGGja3sHo/hqdefault.jpg', tags:['4단원','식물과에너지'],        order:4  },
  { id:'s06', grade:'중2', title:'소화 순환 호흡 배설송',   youtubeUrl:'https://youtu.be/DO7W9upASOY',                videoId:'DO7W9upASOY', thumbnail:'https://img.youtube.com/vi/DO7W9upASOY/hqdefault.jpg', tags:['5단원','동물과에너지'],        order:5  },
  { id:'s07', grade:'중2', title:'소화기관송',              youtubeUrl:'https://youtu.be/3adIvbguytc',                videoId:'3adIvbguytc', thumbnail:'https://img.youtube.com/vi/3adIvbguytc/hqdefault.jpg', tags:['5단원','동물과에너지'],        order:6  },
  { id:'s08', grade:'중2', title:'물질의 특성송',           youtubeUrl:'https://youtu.be/M3sufHqzpL4',                videoId:'M3sufHqzpL4', thumbnail:'https://img.youtube.com/vi/M3sufHqzpL4/hqdefault.jpg', tags:['6단원','물질의특성'],          order:7  },
  { id:'s09', grade:'중2', title:'해수의 순환송',           youtubeUrl:'https://youtu.be/S__Iees0hHo',                videoId:'S__Iees0hHo', thumbnail:'https://img.youtube.com/vi/S__Iees0hHo/hqdefault.jpg', tags:['7단원','수권과해수의순환'],     order:8  },
  { id:'s10', grade:'중2', title:'수권의 구성과 해수송',    youtubeUrl:'https://youtu.be/wUkOtZdeQOQ',               videoId:'wUkOtZdeQOQ', thumbnail:'https://img.youtube.com/vi/wUkOtZdeQOQ/hqdefault.jpg', tags:['7단원','수권과해수의순환'],     order:9  },
  { id:'s11', grade:'중2', title:'열과 우리 생활송',        youtubeUrl:'https://youtu.be/Vx_J5q2aAmg',               videoId:'Vx_J5q2aAmg', thumbnail:'https://img.youtube.com/vi/Vx_J5q2aAmg/hqdefault.jpg', tags:['8단원','열과우리생활'],         order:10 },
  { id:'s12', grade:'중2', title:'열의 이동과 비열송',      youtubeUrl:'https://youtu.be/u5doBPQlgPg',               videoId:'u5doBPQlgPg', thumbnail:'https://img.youtube.com/vi/u5doBPQlgPg/hqdefault.jpg', tags:['8단원','열과우리생활'],         order:11 },
  /* ── 중1 ── */
  { id:'s13', grade:'중1', title:'지구계송',                youtubeUrl:'https://youtu.be/y4Zq3pB529A',               videoId:'y4Zq3pB529A', thumbnail:'https://img.youtube.com/vi/y4Zq3pB529A/hqdefault.jpg', tags:['1단원','지권의변화'],          order:12 },
  { id:'s14', grade:'중1', title:'암석송',                  youtubeUrl:'https://www.youtube.com/watch?v=YNalQ0fOyVw', videoId:'YNalQ0fOyVw', thumbnail:'https://img.youtube.com/vi/YNalQ0fOyVw/hqdefault.jpg', tags:['1단원','지권의변화'],          order:13 },
  { id:'s15', grade:'중1', title:'광물송',                  youtubeUrl:'https://youtu.be/-H5uBoLp4CE',               videoId:'-H5uBoLp4CE', thumbnail:'https://img.youtube.com/vi/-H5uBoLp4CE/hqdefault.jpg', tags:['1단원','지권의변화'],          order:14 },
  { id:'s16', grade:'중1', title:'여러 가지 힘송',          youtubeUrl:'https://youtu.be/_vAn-w2YbLg',               videoId:'_vAn-w2YbLg', thumbnail:'https://img.youtube.com/vi/_vAn-w2YbLg/hqdefault.jpg', tags:['2단원','여러가지힘'],          order:15 },
  { id:'s17', grade:'중1', title:'생물 다양성송',           youtubeUrl:'https://youtu.be/RvIAFg_dQu4',               videoId:'RvIAFg_dQu4', thumbnail:'https://img.youtube.com/vi/RvIAFg_dQu4/hqdefault.jpg', tags:['3단원','생물의다양성'],         order:16 },
  { id:'s18', grade:'중1', title:'기체의 성질송',           youtubeUrl:'https://www.youtube.com/watch?v=nDiXiCdIKIQ', videoId:'nDiXiCdIKIQ', thumbnail:'https://img.youtube.com/vi/nDiXiCdIKIQ/hqdefault.jpg', tags:['4단원','기체의성질'],          order:17 },
  { id:'s19', grade:'중1', title:'분자 배열송 (상태변화송)', youtubeUrl:'https://www.youtube.com/watch?v=ekN9KcXRGMw', videoId:'ekN9KcXRGMw', thumbnail:'https://img.youtube.com/vi/ekN9KcXRGMw/hqdefault.jpg', tags:['5단원','물질의상태변화'],  order:18 },
  { id:'s20', grade:'중1', title:'파동송',                  youtubeUrl:'https://www.youtube.com/watch?v=DpBDJlEB5V4', videoId:'DpBDJlEB5V4', thumbnail:'https://img.youtube.com/vi/DpBDJlEB5V4/hqdefault.jpg', tags:['6단원','빛과파동'],            order:19 },
];

const DEFAULT_GRADES = ['전체', '중1', '중2', '중3'];

let state = {
  grades:       [...DEFAULT_GRADES],
  songs:        DEFAULT_SONGS.map(s => ({ ...s, locked: false })),
  currentGrade: '전체',
  isAdmin:      false,
  editingId:    null,
  currentTags:  [],
  sortBy:       'default'
};

let sortableInstance = null;

// ── 태그 색상 팔레트 ──
const UNIT_COLORS = [
  { bg: '#FDE8EF', border: '#F1B8CB', text: '#9B3A60' }, // 1단원 — 로즈
  { bg: '#EDE5F8', border: '#C9AEED', text: '#6B3A9B' }, // 2단원 — 라벤더
  { bg: '#D5F0EC', border: '#9DD4CC', text: '#2A7A6E' }, // 3단원 — 민트
  { bg: '#FEF0E0', border: '#F9C88A', text: '#9B5A1A' }, // 4단원 — 피치
  { bg: '#DCE8F8', border: '#9CC2E8', text: '#1A4E8C' }, // 5단원 — 블루
  { bg: '#E2F5D8', border: '#AADCA0', text: '#3A7A1A' }, // 6단원 — 그린
  { bg: '#FEF8DC', border: '#F0DC8A', text: '#7A6010' }, // 7단원 — 앰버
  { bg: '#FFE8DC', border: '#FFBBAA', text: '#8C2A1A' }, // 8단원 — 코랄
];
const CONTENT_TAG_COLOR = { bg: '#EEE5F5', border: '#CDB0DC', text: '#6A3578' };

function getTagColor(tag) {
  const m = tag.match(/^(\d+)단원$/);
  if (m) {
    const idx = Math.max(0, parseInt(m[1]) - 1) % UNIT_COLORS.length;
    return UNIT_COLORS[idx];
  }
  return CONTENT_TAG_COLOR;
}

function getUnitNumber(song) {
  if (!song.tags) return 999;
  for (const tag of song.tags) {
    const m = tag.match(/^(\d+)단원$/);
    if (m) return parseInt(m[1]);
  }
  return 999;
}

// ══════════════════════════════════════════════════════
// 2. PERSISTENCE
// ══════════════════════════════════════════════════════
function saveState() {
  const toSave = { grades: state.grades, songs: state.songs };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)); } catch(e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.grades && Array.isArray(saved.grades)) state.grades = saved.grades;
    if (saved.songs  && Array.isArray(saved.songs)) {
      state.songs = saved.songs.map(s => ({ locked: false, ...s }));
    }
  } catch(e) {}
}

// ══════════════════════════════════════════════════════
// 3. UTILS
// ══════════════════════════════════════════════════════
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function extractVideoId(url) {
  if (!url) return null;
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function getYoutubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function getYoutubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// SHA-256 해시 유틸 (Web Crypto API — 브라우저 개발자 도구에 비밀번호가 원문으로 노출되지 않음)
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ══════════════════════════════════════════════════════
// 4. SORT
// ══════════════════════════════════════════════════════
function setSortBy(sortType) {
  state.sortBy = sortType;
  ['default', 'unit', 'title'].forEach(t => {
    const btn = document.getElementById(`sortBtn-${t}`);
    if (btn) btn.classList.toggle('active', t === sortType);
  });
  renderCards();
}

function getFilteredSongs() {
  let songs = [...state.songs];
  if (state.currentGrade !== '전체') {
    songs = songs.filter(s => s.grade === state.currentGrade);
  }

  switch (state.sortBy) {
    case 'unit':
      songs.sort((a, b) => {
        const ua = getUnitNumber(a);
        const ub = getUnitNumber(b);
        if (ua !== ub) return ua - ub;
        return (a.order ?? 0) - (b.order ?? 0);
      });
      break;
    case 'title':
      songs.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
      break;
    default:
      songs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  return songs;
}

// ══════════════════════════════════════════════════════
// 5. RENDER HELPERS
// ══════════════════════════════════════════════════════
function renderGradeTabs() {
  const nav    = document.getElementById('gradeNav');
  const mobile = document.getElementById('mobileGradeBar');
  nav.innerHTML    = '';
  mobile.innerHTML = '';

  state.grades.forEach(grade => {
    const gradeSongs = grade === '전체' ? state.songs : state.songs.filter(s => s.grade === grade);
    const count = gradeSongs.length;
    const isAllLocked = count > 0 && gradeSongs.every(s => s.locked);
    const lockedCount = gradeSongs.filter(s => s.locked).length;

    // ── Desktop tab ──
    const btn = document.createElement('button');
    btn.className = 'grade-tab' + (grade === state.currentGrade ? ' active' : '');
    btn.setAttribute('aria-current', grade === state.currentGrade ? 'page' : 'false');
    btn.dataset.grade = grade;

    if (state.isAdmin) {
      const lockTitle = isAllLocked ? '전체 잠금 해제' : '전체 잠금';
      const lockIcon  = isAllLocked
        ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
        : `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`;

      btn.innerHTML = `
        <span>${escapeHtml(grade)}</span>
        <span style="display:flex;align-items:center;gap:3px;">
          <span class="tab-count">${count}</span>
          <button class="tab-lock-btn ${isAllLocked ? 'locked' : ''}"
                  data-grade="${escapeHtml(grade)}"
                  title="${lockTitle}" aria-label="${lockTitle}">
            ${lockIcon}
          </button>
        </span>
      `;
      btn.querySelector('.tab-lock-btn').addEventListener('click', e => {
        e.stopPropagation();
        toggleGradeLock(grade, !isAllLocked);
      });
    } else {
      btn.innerHTML = `<span>${escapeHtml(grade)}</span><span class="tab-count">${count}</span>`;
    }

    btn.addEventListener('click', () => selectGrade(grade));
    nav.appendChild(btn);

    // ── Mobile tab ──
    const mBtn = document.createElement('button');
    mBtn.className = 'mobile-grade-tab' + (grade === state.currentGrade ? ' active' : '');
    mBtn.dataset.grade = grade;
    if (state.isAdmin && lockedCount > 0) {
      mBtn.innerHTML = `${escapeHtml(grade)} <span style="font-size:10px;opacity:0.8;">🔒${lockedCount > 0 && lockedCount < count ? lockedCount : ''}</span>`;
    } else {
      mBtn.textContent = grade;
    }
    mBtn.addEventListener('click', () => selectGrade(grade));
    mobile.appendChild(mBtn);
  });

  // ── Admin: 학년 관리 버튼 ──
  if (state.isAdmin) {
    const sep = document.createElement('div');
    sep.style.cssText = 'border-top:1px solid var(--line); margin: 10px 0 6px;';
    nav.appendChild(sep);

    const manageBtn = document.createElement('button');
    manageBtn.className = 'grade-tab';
    manageBtn.style.cssText = 'color:var(--point-deep);';
    manageBtn.innerHTML = `
      <span style="display:flex;align-items:center;gap:6px;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        학년 관리
      </span>
    `;
    manageBtn.addEventListener('click', openGradeModal);
    nav.appendChild(manageBtn);
  }
}

function renderSidebarStats() {
  const el = document.getElementById('sidebarStats');
  const total      = state.songs.length;
  const gradeCount = state.grades.filter(g => g !== '전체').length;
  el.innerHTML = `<strong>${total}</strong>개 과학송<br>${gradeCount}개 학년 운영 중`;
}

function renderPageTitle() {
  const area  = document.getElementById('pageTitleArea');
  const grade = state.currentGrade;

  if (grade === '전체') {
    const total    = state.songs.length;
    const chipsHtml = state.grades
      .filter(g => g !== '전체')
      .map(g => {
        const cnt = state.songs.filter(s => s.grade === g).length;
        if (!cnt) return '';
        return `<span class="title-grade-chip">${escapeHtml(g)} <strong>${cnt}</strong>곡</span>`;
      })
      .filter(Boolean).join('');

    area.innerHTML = `
      <div class="page-title-inner">
        <span class="page-title-rabbit" aria-hidden="true">
          <img src="음표 아이콘.png" alt="" width="44" height="44" style="object-fit:contain;" />
        </span>
        <div>
          <h1 class="page-title">전체 과학송</h1>
          <div class="page-title-meta">
            <span class="page-total-badge">총 ${total}곡</span>
            ${chipsHtml}
          </div>
        </div>
      </div>
    `;
  } else {
    const songs = state.songs.filter(s => s.grade === grade);
    const total = songs.length;

    // 단원 분포 계산
    const unitMap = {};
    songs.forEach(s => {
      (s.tags || []).forEach(t => {
        if (/^\d+단원$/.test(t)) unitMap[t] = (unitMap[t] || 0) + 1;
      });
    });

    const unitsHtml = Object.entries(unitMap)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([unit, cnt]) => {
        const c = getTagColor(unit);
        return `<span class="title-unit-chip" style="background:${c.bg};border-color:${c.border};color:${c.text}">${escapeHtml(unit)} ${cnt}곡</span>`;
      }).join('');

    area.innerHTML = `
      <div class="page-title-banner">
        <div class="page-title-banner-main">
          <span class="page-title-rabbit" aria-hidden="true">
            <img src="음표 아이콘.png" alt="" width="38" height="38" style="object-fit:contain;" />
          </span>
          <div>
            <h1 class="page-title">${escapeHtml(grade)} 과학송</h1>
            <p class="page-title-count">총 <strong>${total}</strong>곡</p>
          </div>
        </div>
        ${unitsHtml ? `<div class="page-title-units">${unitsHtml}</div>` : ''}
      </div>
    `;
  }
}

function renderCards() {
  const grid  = document.getElementById('cardsGrid');
  const empty = document.getElementById('emptyState');
  const songs = getFilteredSongs();

  grid.innerHTML = '';

  if (songs.length === 0) {
    empty.style.display = '';
    grid.appendChild(empty);
    return;
  }

  empty.style.display = 'none';
  songs.forEach((song, idx) => {
    grid.appendChild(createCardElement(song, idx));
  });

  setupSortable();
}

function createCardElement(song, idx) {
  const card = document.createElement('div');
  card.className = 'song-card' + (song.locked ? ' song-card--locked' : '');
  card.dataset.id = song.id;
  card.style.animationDelay = `${idx * 0.04}s`;

  // 썸네일 HTML
  const thumbHtml = song.thumbnail
    ? `<img class="card-thumb" src="${song.thumbnail}" alt="${escapeHtml(song.title)} 썸네일"
           onerror="this.outerHTML=\`<div class='thumb-fallback'><img src='음표 아이콘.png' alt='' /><span>썸네일 없음</span></div>\`"
           loading="lazy" />`
    : `<div class="thumb-fallback">
         <img src="음표 아이콘.png" alt="" />
         <span>썸네일 없음</span>
       </div>`;

  // 태그 HTML (색상 적용)
  const tagsHtml = !song.locked && song.tags && song.tags.length > 0
    ? song.tags.map(t => {
        const c = getTagColor(t);
        return `<span class="card-tag" style="background:${c.bg};border-color:${c.border};color:${c.text}">#${escapeHtml(t)}</span>`;
      }).join('')
    : '';

  const gradeBadge = !song.locked
    ? `<span class="card-grade-badge">${escapeHtml(song.grade)}</span>`
    : '';

  // 잠금 오버레이
  const lockOverlay = song.locked
    ? `<div class="lock-overlay">
         <div class="lock-icon-wrap">
           <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
             <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
             <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
           </svg>
         </div>
       </div>`
    : '';

  // 카드 잠금 버튼 (관리자)
  const lockBtnHtml = state.isAdmin
    ? `<button class="card-lock-btn${song.locked ? ' is-locked' : ''}"
               data-id="${song.id}"
               title="${song.locked ? '잠금 해제' : '잠금'}"
               aria-label="${song.locked ? '잠금 해제' : '잠금'}">
         ${song.locked
           ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
           : `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`
         }
       </button>`
    : '';

  card.innerHTML = `
    <button class="card-edit-btn" data-edit="${song.id}" title="편집" aria-label="편집">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--point-deep)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </button>
    ${lockBtnHtml}
    <div class="card-thumb-wrap">
      ${thumbHtml}
      ${lockOverlay}
      ${!song.locked ? `<div class="play-overlay">
        <div class="play-btn-circle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      </div>` : ''}
    </div>
    <div class="card-body">
      ${song.locked
        ? `<div class="card-locked-msg">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
             잠긴 콘텐츠
           </div>`
        : `<div class="card-title">${escapeHtml(song.title)}</div>
           <div class="card-tags">${gradeBadge}${tagsHtml}</div>`
      }
    </div>
  `;

  card.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.card-edit-btn');
    const lockBtn = e.target.closest('.card-lock-btn');

    if (editBtn) {
      e.stopPropagation();
      openEditModal(editBtn.dataset.edit);
      return;
    }
    if (lockBtn) {
      e.stopPropagation();
      toggleSongLock(lockBtn.dataset.id);
      return;
    }
    if (song.locked) {
      if (!state.isAdmin) showToast('잠긴 과학송입니다 🔒', 'warn');
      return;
    }
    playSong(song);
  });

  return card;
}

// ══════════════════════════════════════════════════════
// 6. LOCK MANAGEMENT
// ══════════════════════════════════════════════════════
function toggleSongLock(id) {
  const song = state.songs.find(s => s.id === id);
  if (!song) return;
  song.locked = !song.locked;
  saveState();
  renderCards();
  renderGradeTabs();
  showToast(song.locked ? `"${song.title}" 잠금됨 🔒` : `"${song.title}" 잠금 해제 🔓`, song.locked ? 'warn' : 'success');
}

function toggleGradeLock(grade, lock) {
  const songs = grade === '전체'
    ? state.songs
    : state.songs.filter(s => s.grade === grade);
  songs.forEach(s => s.locked = lock);
  saveState();
  renderCards();
  renderGradeTabs();
  const label = grade === '전체' ? '전체' : `${grade}`;
  showToast(lock ? `${label} 전체 잠금됨 🔒` : `${label} 전체 잠금 해제 🔓`, lock ? 'warn' : 'success');
}

// ══════════════════════════════════════════════════════
// 7. GRADE NAVIGATION
// ══════════════════════════════════════════════════════
function selectGrade(grade) {
  state.currentGrade = grade;
  renderGradeTabs();
  renderPageTitle();
  renderCards();
}

// ══════════════════════════════════════════════════════
// 8. ADMIN AUTH
// ══════════════════════════════════════════════════════
function openAdminLogin() {
  if (state.isAdmin) { exitAdmin(); return; }
  document.getElementById('adminPasswordInput').value = '';
  document.getElementById('adminError').style.display = 'none';
  openModal('adminLoginModal');
  setTimeout(() => document.getElementById('adminPasswordInput').focus(), 100);
}

async function verifyAdmin() {
  const pw = document.getElementById('adminPasswordInput').value;
  const hash = await sha256(pw);
  if (hash === ADMIN_HASH) {
    closeModal('adminLoginModal');
    enterAdmin();
  } else {
    document.getElementById('adminError').style.display = '';
    document.getElementById('adminPasswordInput').select();
  }
}

function enterAdmin() {
  state.isAdmin = true;
  document.getElementById('adminBanner').style.display  = '';
  document.getElementById('adminAddRow').style.display  = '';
  document.getElementById('adminToggleBtn').innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
    관리자 종료
  `;
  document.getElementById('adminToggleBtn').style.cssText = 'color:var(--point-deep); border-color:var(--point-line);';
  document.querySelector('.app-layout').classList.add('admin-mode');
  document.getElementById('cardsGrid').classList.add('admin-mode');
  renderGradeTabs();
  renderCards();
  showToast('관리자 모드 활성화 ✓', 'success');
}

function exitAdmin() {
  state.isAdmin = false;
  document.getElementById('adminBanner').style.display = 'none';
  document.getElementById('adminAddRow').style.display = 'none';
  document.getElementById('adminToggleBtn').innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
    관리자
  `;
  document.getElementById('adminToggleBtn').style.cssText = '';
  document.querySelector('.app-layout').classList.remove('admin-mode');
  document.getElementById('cardsGrid').classList.remove('admin-mode');
  if (sortableInstance) { sortableInstance.destroy(); sortableInstance = null; }
  renderGradeTabs();
  renderCards();
  showToast('관리자 모드 종료');
}

// ══════════════════════════════════════════════════════
// 9. DRAG & DROP (SortableJS)
// ══════════════════════════════════════════════════════
function setupSortable() {
  if (sortableInstance) { sortableInstance.destroy(); sortableInstance = null; }
  if (!state.isAdmin || state.sortBy !== 'default') return;

  const grid = document.getElementById('cardsGrid');
  sortableInstance = Sortable.create(grid, {
    animation: 200,
    ghostClass: 'sortable-ghost',
    dragClass:  'sortable-drag',
    handle:     '.song-card',
    onEnd() {
      const cards    = grid.querySelectorAll('.song-card');
      const newOrder = [...cards].map(c => c.dataset.id);
      newOrder.forEach((id, idx) => {
        const song = state.songs.find(s => s.id === id);
        if (song) song.order = idx;
      });
      saveState();
      showToast('순서가 변경되었습니다 ✓', 'success');
    }
  });
}

// ══════════════════════════════════════════════════════
// 10. PLAYER
// ══════════════════════════════════════════════════════
function playSong(song) {
  if (state.isAdmin) return;
  if (song.locked) { showToast('잠긴 과학송입니다 🔒', 'warn'); return; }

  const videoId = song.videoId || extractVideoId(song.youtubeUrl);
  if (!videoId) {
    if (song.youtubeUrl) window.open(song.youtubeUrl, '_blank');
    else showToast('재생할 영상 정보가 없습니다.', 'error');
    return;
  }

  document.getElementById('youtubeIframe').src = getYoutubeEmbedUrl(videoId);
  document.getElementById('playerModalTitle').textContent = song.title;

  const tagsHtml = (song.tags || []).map(t => {
    const c = getTagColor(t);
    return `<span class="card-tag" style="background:${c.bg};border-color:${c.border};color:${c.text}">#${escapeHtml(t)}</span>`;
  }).join('');

  document.getElementById('playerInfo').innerHTML = `
    <div class="player-song-title">${escapeHtml(song.title)}</div>
    <div class="player-tags">
      <span class="card-grade-badge" style="margin-right:4px;">${escapeHtml(song.grade)}</span>
      ${tagsHtml}
    </div>
  `;

  openModal('playerModal');
}

function closePlayer() {
  document.getElementById('youtubeIframe').src = '';
  closeModal('playerModal');
}

// ══════════════════════════════════════════════════════
// 11. ADD / EDIT MODAL
// ══════════════════════════════════════════════════════
function openAddModal() {
  state.editingId   = null;
  state.currentTags = [];
  document.getElementById('songModalTitle').textContent      = '과학송 추가';
  document.getElementById('deleteSongBtn').style.display    = 'none';
  document.getElementById('songYoutubeUrl').value           = '';
  document.getElementById('songTitle').value                = '';
  document.getElementById('thumbPreviewArea').style.display = 'none';
  document.getElementById('thumbPreviewImg').src            = '';
  renderTagList();
  populateGradeSelect();
  openModal('songModal');
  setTimeout(() => document.getElementById('songYoutubeUrl').focus(), 100);
}

function openEditModal(id) {
  const song = state.songs.find(s => s.id === id);
  if (!song) return;

  state.editingId   = id;
  state.currentTags = [...(song.tags || [])];

  document.getElementById('songModalTitle').textContent   = '과학송 편집';
  document.getElementById('deleteSongBtn').style.display = '';
  document.getElementById('songYoutubeUrl').value        = song.youtubeUrl || '';
  document.getElementById('songTitle').value             = song.title || '';

  if (song.thumbnail) {
    document.getElementById('thumbPreviewImg').src             = song.thumbnail;
    document.getElementById('thumbPreviewArea').style.display = '';
  } else {
    document.getElementById('thumbPreviewArea').style.display = 'none';
  }

  populateGradeSelect(song.grade);
  renderTagList();
  openModal('songModal');
}

function populateGradeSelect(selectedGrade = '') {
  const sel = document.getElementById('songGrade');
  sel.innerHTML = '<option value="">학년 선택...</option>';
  state.grades.filter(g => g !== '전체').forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    if (g === selectedGrade) opt.selected = true;
    sel.appendChild(opt);
  });
}

function fetchYoutubeThumbnail() {
  const url     = document.getElementById('songYoutubeUrl').value.trim();
  const videoId = extractVideoId(url);
  if (!videoId) { showToast('올바른 YouTube URL을 입력해 주세요.', 'error'); return; }
  const thumb = getYoutubeThumbnail(videoId);
  document.getElementById('thumbPreviewImg').src             = thumb;
  document.getElementById('thumbPreviewArea').style.display = '';
  showToast('썸네일을 가져왔습니다 ✓', 'success');
}

function clearThumbnail() {
  document.getElementById('thumbPreviewImg').src             = '';
  document.getElementById('thumbPreviewArea').style.display = 'none';
}

function saveSong() {
  const url   = document.getElementById('songYoutubeUrl').value.trim();
  const title = document.getElementById('songTitle').value.trim();
  const grade = document.getElementById('songGrade').value;

  if (!url)   { showToast('유튜브 URL을 입력해 주세요.', 'error'); return; }
  if (!title) { showToast('노래 제목을 입력해 주세요.', 'error'); return; }
  if (!grade) { showToast('학년을 선택해 주세요.', 'error'); return; }

  const videoId   = extractVideoId(url) || '';
  const thumbSrc  = document.getElementById('thumbPreviewImg').src || '';
  const thumbnail = (thumbSrc && !thumbSrc.endsWith('undefined'))
    ? thumbSrc
    : (videoId ? getYoutubeThumbnail(videoId) : '');

  if (state.editingId) {
    const idx = state.songs.findIndex(s => s.id === state.editingId);
    if (idx !== -1) {
      state.songs[idx] = {
        ...state.songs[idx],
        title, grade, youtubeUrl: url, videoId, thumbnail,
        tags: [...state.currentTags]
      };
    }
    showToast('수정되었습니다 ✓', 'success');
  } else {
    const maxOrder = state.songs.reduce((m, s) => Math.max(m, s.order ?? 0), -1);
    state.songs.push({
      id: uid(), title, grade, youtubeUrl: url, videoId, thumbnail,
      tags: [...state.currentTags], order: maxOrder + 1, locked: false
    });
    showToast('과학송이 추가되었습니다 ✓', 'success');
  }

  saveState();
  closeModal('songModal');
  renderGradeTabs();
  renderSidebarStats();
  renderPageTitle();
  renderCards();
}

function deleteSong() {
  if (!state.editingId) return;
  if (!confirm('이 과학송을 삭제할까요?')) return;
  state.songs = state.songs.filter(s => s.id !== state.editingId);
  saveState();
  closeModal('songModal');
  renderGradeTabs();
  renderSidebarStats();
  renderPageTitle();
  renderCards();
  showToast('삭제되었습니다.', 'warn');
}

// ══════════════════════════════════════════════════════
// 12. TAG INPUT
// ══════════════════════════════════════════════════════
function handleTagInput(e) {
  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTagFromInput(); }
}

function addTagFromInput() {
  const input = document.getElementById('songTagInput');
  const val   = input.value.trim().replace(/,+$/, '').trim();
  if (!val) return;
  if (!state.currentTags.includes(val)) { state.currentTags.push(val); renderTagList(); }
  input.value = '';
}

function removeTag(tag) {
  state.currentTags = state.currentTags.filter(t => t !== tag);
  renderTagList();
}

function renderTagList() {
  const list = document.getElementById('tagList');
  list.innerHTML = '';
  state.currentTags.forEach(tag => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `#${escapeHtml(tag)} <button class="tag-chip-remove" data-tag="${escapeHtml(tag)}" aria-label="삭제">×</button>`;
    chip.querySelector('.tag-chip-remove').addEventListener('click', () => removeTag(tag));
    list.appendChild(chip);
  });
}

// ══════════════════════════════════════════════════════
// 13. GRADE MANAGEMENT
// ══════════════════════════════════════════════════════
function openGradeModal() {
  renderGradeManageList();
  openModal('gradeModal');
}

function renderGradeManageList() {
  const ul = document.getElementById('gradeManageList');
  ul.innerHTML = '';
  state.grades.filter(g => g !== '전체').forEach(grade => {
    const count = state.songs.filter(s => s.grade === grade).length;
    const li = document.createElement('li');
    li.className = 'grade-manage-item';
    li.innerHTML = `
      <span>${escapeHtml(grade)} <small style="color:var(--muted)">(${count}개)</small></span>
      <button data-grade="${escapeHtml(grade)}">삭제</button>
    `;
    li.querySelector('button').addEventListener('click', () => removeGrade(grade));
    ul.appendChild(li);
  });
}

function addGrade() {
  const input = document.getElementById('newGradeInput');
  const val   = input.value.trim();
  if (!val) return;
  if (state.grades.includes(val)) { showToast('이미 존재하는 학년입니다.', 'warn'); return; }
  state.grades.push(val);
  saveState();
  input.value = '';
  renderGradeManageList();
  renderGradeTabs();
  showToast(`"${val}" 추가 ✓`, 'success');
}

function removeGrade(grade) {
  const count = state.songs.filter(s => s.grade === grade).length;
  if (count > 0) {
    showToast(`이 학년에 과학송 ${count}개가 있습니다. 먼저 다른 학년으로 이동해 주세요.`, 'error');
    return;
  }
  if (!confirm(`"${grade}"을(를) 삭제할까요?`)) return;
  state.grades = state.grades.filter(g => g !== grade);
  if (state.currentGrade === grade) state.currentGrade = '전체';
  saveState();
  renderGradeManageList();
  renderGradeTabs();
  renderCards();
  showToast(`"${grade}" 삭제됨`, 'warn');
}

// ══════════════════════════════════════════════════════
// 14. MODAL HELPERS
// ══════════════════════════════════════════════════════
function openModal(id) {
  document.getElementById(id).style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target !== overlay) return;
    if (overlay.id === 'playerModal') closePlayer();
    else closeModal(overlay.id);
  });
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closePlayer();
  ['adminLoginModal', 'songModal', 'gradeModal'].forEach(id => {
    if (document.getElementById(id).style.display !== 'none') closeModal(id);
  });
});

// ══════════════════════════════════════════════════════
// 15. TOAST
// ══════════════════════════════════════════════════════
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast' + (type ? ` toast--${type}` : '');
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}

// ══════════════════════════════════════════════════════
// 16. INIT
// ══════════════════════════════════════════════════════
function init() {
  loadState();
  renderGradeTabs();
  renderSidebarStats();
  renderPageTitle();
  renderCards();
}

init();