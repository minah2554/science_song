/* ============================================================
   app.js ??ê³¼í•™???„ì¹´?´ë¸Œ ë©”ì¸ ë¡œì§  v2.0
   ============================================================ */

'use strict';

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 1. CONSTANTS & STATE
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
const STORAGE_KEY = 'scienceSongArchive_v2';
// ê´€ë¦¬ì ?¸ì¦: SHA-256 ?´ì‹œë¡??€??(?ŒìŠ¤ ?¸ì¶œ??ë¹„ë?ë²ˆí˜¸ ë³´í˜¸)
const ADMIN_HASH = 'ad5f52f58ed6ec6e7a641f2416f347674ac5933470079f2a18bc6269b1e80796';

// ?€?€ ê¸°ë³¸ ê³¼í•™???°ì´???€?€
const DEFAULT_SONGS = [
  /* ?€?€ ì¤? ?€?€ */
  { id:'s01', grade:'ì¤?', title:'?ì†Œê¸°í˜¸??,              youtubeUrl:'https://www.youtube.com/watch?v=w2TJ1RBsiK0', videoId:'w2TJ1RBsiK0', thumbnail:'https://img.youtube.com/vi/w2TJ1RBsiK0/hqdefault.jpg', tags:['1?¨ì›','ë¬¼ì§ˆ?˜êµ¬??],         order:0  },
  { id:'s02', grade:'ì¤?', title:'?´ì˜¨??,                  youtubeUrl:'https://www.youtube.com/watch?v=ScxLD5UEoMA', videoId:'ScxLD5UEoMA', thumbnail:'https://img.youtube.com/vi/ScxLD5UEoMA/hqdefault.jpg', tags:['1?¨ì›','ë¬¼ì§ˆ?˜êµ¬??],         order:1  },
  { id:'s03', grade:'ì¤?', title:'?ê¸°?¥ì†¡',                youtubeUrl:'https://www.youtube.com/watch?v=2110PW3rkJw', videoId:'2110PW3rkJw', thumbnail:'https://img.youtube.com/vi/2110PW3rkJw/hqdefault.jpg', tags:['2?¨ì›','?„ê¸°?€?ê¸°'],         order:2  },
  { id:'s04', grade:'ì¤?', title:'?œì–‘ê³„ì†¡',                youtubeUrl:'https://youtu.be/gmJ8RvIQiQc',                videoId:'gmJ8RvIQiQc', thumbnail:'https://img.youtube.com/vi/gmJ8RvIQiQc/hqdefault.jpg', tags:['3?¨ì›','?œì–‘ê³?],             order:3  },
  { id:'s05', grade:'ì¤?', title:'ê´‘í•©?±ì†¡',                youtubeUrl:'https://www.youtube.com/watch?v=P8cGGja3sHo', videoId:'P8cGGja3sHo', thumbnail:'https://img.youtube.com/vi/P8cGGja3sHo/hqdefault.jpg', tags:['4?¨ì›','?ë¬¼ê³¼ì—?ˆì?'],        order:4  },
  { id:'s06', grade:'ì¤?', title:'?Œí™” ?œí™˜ ?¸í¡ ë°°ì„¤??,   youtubeUrl:'https://youtu.be/DO7W9upASOY',                videoId:'DO7W9upASOY', thumbnail:'https://img.youtube.com/vi/DO7W9upASOY/hqdefault.jpg', tags:['5?¨ì›','?™ë¬¼ê³¼ì—?ˆì?'],        order:5  },
  { id:'s07', grade:'ì¤?', title:'?Œí™”ê¸°ê???,              youtubeUrl:'https://youtu.be/3adIvbguytc',                videoId:'3adIvbguytc', thumbnail:'https://img.youtube.com/vi/3adIvbguytc/hqdefault.jpg', tags:['5?¨ì›','?™ë¬¼ê³¼ì—?ˆì?'],        order:6  },
  { id:'s08', grade:'ì¤?', title:'ë¬¼ì§ˆ???¹ì„±??,           youtubeUrl:'https://youtu.be/M3sufHqzpL4',                videoId:'M3sufHqzpL4', thumbnail:'https://img.youtube.com/vi/M3sufHqzpL4/hqdefault.jpg', tags:['6?¨ì›','ë¬¼ì§ˆ?˜íŠ¹??],          order:7  },
  { id:'s09', grade:'ì¤?', title:'?´ìˆ˜???œí™˜??,           youtubeUrl:'https://youtu.be/S__Iees0hHo',                videoId:'S__Iees0hHo', thumbnail:'https://img.youtube.com/vi/S__Iees0hHo/hqdefault.jpg', tags:['7?¨ì›','?˜ê¶Œê³¼í•´?˜ì˜?œí™˜'],     order:8  },
  { id:'s10', grade:'ì¤?', title:'?˜ê¶Œ??êµ¬ì„±ê³??´ìˆ˜??,    youtubeUrl:'https://youtu.be/wUkOtZdeQOQ',               videoId:'wUkOtZdeQOQ', thumbnail:'https://img.youtube.com/vi/wUkOtZdeQOQ/hqdefault.jpg', tags:['7?¨ì›','?˜ê¶Œê³¼í•´?˜ì˜?œí™˜'],     order:9  },
  { id:'s11', grade:'ì¤?', title:'?´ê³¼ ?°ë¦¬ ?í™œ??,        youtubeUrl:'https://youtu.be/Vx_J5q2aAmg',               videoId:'Vx_J5q2aAmg', thumbnail:'https://img.youtube.com/vi/Vx_J5q2aAmg/hqdefault.jpg', tags:['8?¨ì›','?´ê³¼?°ë¦¬?í™œ'],         order:10 },
  { id:'s12', grade:'ì¤?', title:'?´ì˜ ?´ë™ê³?ë¹„ì—´??,      youtubeUrl:'https://youtu.be/u5doBPQlgPg',               videoId:'u5doBPQlgPg', thumbnail:'https://img.youtube.com/vi/u5doBPQlgPg/hqdefault.jpg', tags:['8?¨ì›','?´ê³¼?°ë¦¬?í™œ'],         order:11 },
  /* ?€?€ ì¤? ?€?€ */
  { id:'s13', grade:'ì¤?', title:'ì§€êµ¬ê³„??,                youtubeUrl:'https://youtu.be/y4Zq3pB529A',               videoId:'y4Zq3pB529A', thumbnail:'https://img.youtube.com/vi/y4Zq3pB529A/hqdefault.jpg', tags:['1?¨ì›','ì§€ê¶Œì˜ë³€??],          order:12 },
  { id:'s14', grade:'ì¤?', title:'?”ì„??,                  youtubeUrl:'https://www.youtube.com/watch?v=YNalQ0fOyVw', videoId:'YNalQ0fOyVw', thumbnail:'https://img.youtube.com/vi/YNalQ0fOyVw/hqdefault.jpg', tags:['1?¨ì›','ì§€ê¶Œì˜ë³€??],          order:13 },
  { id:'s15', grade:'ì¤?', title:'ê´‘ë¬¼??,                  youtubeUrl:'https://youtu.be/-H5uBoLp4CE',               videoId:'-H5uBoLp4CE', thumbnail:'https://img.youtube.com/vi/-H5uBoLp4CE/hqdefault.jpg', tags:['1?¨ì›','ì§€ê¶Œì˜ë³€??],          order:14 },
  { id:'s16', grade:'ì¤?', title:'?¬ëŸ¬ ê°€ì§€ ?˜ì†¡',          youtubeUrl:'https://youtu.be/_vAn-w2YbLg',               videoId:'_vAn-w2YbLg', thumbnail:'https://img.youtube.com/vi/_vAn-w2YbLg/hqdefault.jpg', tags:['2?¨ì›','?¬ëŸ¬ê°€ì§€??],          order:15 },
  { id:'s17', grade:'ì¤?', title:'?ë¬¼ ?¤ì–‘?±ì†¡',           youtubeUrl:'https://youtu.be/RvIAFg_dQu4',               videoId:'RvIAFg_dQu4', thumbnail:'https://img.youtube.com/vi/RvIAFg_dQu4/hqdefault.jpg', tags:['3?¨ì›','?ë¬¼?˜ë‹¤?‘ì„±'],         order:16 },
  { id:'s18', grade:'ì¤?', title:'ê¸°ì²´???±ì§ˆ??,           youtubeUrl:'https://www.youtube.com/watch?v=nDiXiCdIKIQ', videoId:'nDiXiCdIKIQ', thumbnail:'https://img.youtube.com/vi/nDiXiCdIKIQ/hqdefault.jpg', tags:['4?¨ì›','ê¸°ì²´?˜ì„±ì§?],          order:17 },
  { id:'s19', grade:'ì¤?', title:'ë¶„ì ë°°ì—´??(?íƒœë³€?”ì†¡)', youtubeUrl:'https://www.youtube.com/watch?v=ekN9KcXRGMw', videoId:'ekN9KcXRGMw', thumbnail:'https://img.youtube.com/vi/ekN9KcXRGMw/hqdefault.jpg', tags:['5?¨ì›','ë¬¼ì§ˆ?˜ìƒ?œë???],  order:18 },
  { id:'s20', grade:'ì¤?', title:'?Œë™??,                  youtubeUrl:'https://www.youtube.com/watch?v=DpBDJlEB5V4', videoId:'DpBDJlEB5V4', thumbnail:'https://img.youtube.com/vi/DpBDJlEB5V4/hqdefault.jpg', tags:['6?¨ì›','ë¹›ê³¼?Œë™'],            order:19 },
];

const DEFAULT_GRADES = ['?„ì²´', 'ì¤?', 'ì¤?', 'ì¤?'];

let state = {
  grades:       [...DEFAULT_GRADES],
  songs:        DEFAULT_SONGS.map(s => ({ ...s, locked: false })),
  currentGrade: '?„ì²´',
  isAdmin:      false,
  editingId:    null,
  currentTags:  [],
  sortBy:       'default'
};

let sortableInstance = null;

// ?€?€ ?œê·¸ ?‰ìƒ ?”ë ˆ???€?€
const UNIT_COLORS = [
  { bg: '#FDE8EF', border: '#F1B8CB', text: '#9B3A60' }, // 1?¨ì› ??ë¡œì¦ˆ
  { bg: '#EDE5F8', border: '#C9AEED', text: '#6B3A9B' }, // 2?¨ì› ???¼ë²¤??  { bg: '#D5F0EC', border: '#9DD4CC', text: '#2A7A6E' }, // 3?¨ì› ??ë¯¼íŠ¸
  { bg: '#FEF0E0', border: '#F9C88A', text: '#9B5A1A' }, // 4?¨ì› ???¼ì¹˜
  { bg: '#DCE8F8', border: '#9CC2E8', text: '#1A4E8C' }, // 5?¨ì› ??ë¸”ë£¨
  { bg: '#E2F5D8', border: '#AADCA0', text: '#3A7A1A' }, // 6?¨ì› ??ê·¸ë¦°
  { bg: '#FEF8DC', border: '#F0DC8A', text: '#7A6010' }, // 7?¨ì› ???°ë²„
  { bg: '#FFE8DC', border: '#FFBBAA', text: '#8C2A1A' }, // 8?¨ì› ??ì½”ë„
];
const CONTENT_TAG_COLOR = { bg: '#EEE5F5', border: '#CDB0DC', text: '#6A3578' };

function getTagColor(tag) {
  const m = tag.match(/^(\d+)?¨ì›$/);
  if (m) {
    const idx = Math.max(0, parseInt(m[1]) - 1) % UNIT_COLORS.length;
    return UNIT_COLORS[idx];
  }
  return CONTENT_TAG_COLOR;
}

function getUnitNumber(song) {
  if (!song.tags) return 999;
  for (const tag of song.tags) {
    const m = tag.match(/^(\d+)?¨ì›$/);
    if (m) return parseInt(m[1]);
  }
  return 999;
}

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 2. PERSISTENCE
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
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
      // locked ?„ë“œ ê¸°ë³¸ê°?ë³´ì¥
      state.songs = saved.songs.map(s => ({ locked: false, ...s }));
    }
  } catch(e) {}
}

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 3. UTILS
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
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

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 4. SORT
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
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
  if (state.currentGrade !== '?„ì²´') {
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

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 5. RENDER HELPERS
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
function renderGradeTabs() {
  const nav    = document.getElementById('gradeNav');
  const mobile = document.getElementById('mobileGradeBar');
  nav.innerHTML    = '';
  mobile.innerHTML = '';

  state.grades.forEach(grade => {
    const gradeSongs = grade === '?„ì²´' ? state.songs : state.songs.filter(s => s.grade === grade);
    const count = gradeSongs.length;
    const isAllLocked = count > 0 && gradeSongs.every(s => s.locked);
    const lockedCount = gradeSongs.filter(s => s.locked).length;

    // ?€?€ Desktop tab ?€?€
    const btn = document.createElement('button');
    btn.className = 'grade-tab' + (grade === state.currentGrade ? ' active' : '');
    btn.setAttribute('aria-current', grade === state.currentGrade ? 'page' : 'false');
    btn.dataset.grade = grade;

    if (state.isAdmin) {
      const lockTitle = isAllLocked ? '?„ì²´ ? ê¸ˆ ?´ì œ' : '?„ì²´ ? ê¸ˆ';
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
      // ? ê¸ˆ ë²„íŠ¼ ?´ë¦­ ?´ë²¤??      btn.querySelector('.tab-lock-btn').addEventListener('click', e => {
        e.stopPropagation();
        toggleGradeLock(grade, !isAllLocked);
      });
    } else {
      btn.innerHTML = `<span>${escapeHtml(grade)}</span><span class="tab-count">${count}</span>`;
    }

    btn.addEventListener('click', () => selectGrade(grade));
    nav.appendChild(btn);

    // ?€?€ Mobile tab ?€?€
    const mBtn = document.createElement('button');
    mBtn.className = 'mobile-grade-tab' + (grade === state.currentGrade ? ' active' : '');
    mBtn.dataset.grade = grade;
    if (state.isAdmin && lockedCount > 0) {
      mBtn.innerHTML = `${escapeHtml(grade)} <span style="font-size:10px;opacity:0.8;">?”’${lockedCount > 0 && lockedCount < count ? lockedCount : ''}</span>`;
    } else {
      mBtn.textContent = grade;
    }
    mBtn.addEventListener('click', () => selectGrade(grade));
    mobile.appendChild(mBtn);
  });

  // ?€?€ Admin: ?™ë…„ ê´€ë¦?ë²„íŠ¼ ?€?€
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
        ?™ë…„ ê´€ë¦?      </span>
    `;
    manageBtn.addEventListener('click', openGradeModal);
    nav.appendChild(manageBtn);
  }
}

function renderSidebarStats() {
  const el = document.getElementById('sidebarStats');
  const total      = state.songs.length;
  const gradeCount = state.grades.filter(g => g !== '?„ì²´').length;
  el.innerHTML = `<strong>${total}</strong>ê°?ê³¼í•™??br>${gradeCount}ê°??™ë…„ ?´ì˜ ì¤?;
}

function renderPageTitle() {
  const area  = document.getElementById('pageTitleArea');
  const grade = state.currentGrade;

  if (grade === '?„ì²´') {
    const total    = state.songs.length;
    const chipsHtml = state.grades
      .filter(g => g !== '?„ì²´')
      .map(g => {
        const cnt = state.songs.filter(s => s.grade === g).length;
        if (!cnt) return '';
        return `<span class="title-grade-chip">${escapeHtml(g)} <strong>${cnt}</strong>ê³?/span>`;
      })
      .filter(Boolean).join('');

    area.innerHTML = `
      <div class="page-title-inner">
        <span class="page-title-rabbit" aria-hidden="true">
          <img src="À½Ç¥ ¾ÆÀÌÄÜ.png" alt="" width="44" height="44" style="object-fit:contain;" />
        </span>
        <div>
          <h1 class="page-title">?„ì²´ ê³¼í•™??/h1>
          <div class="page-title-meta">
            <span class="page-total-badge">ì´?${total}ê³?/span>
            ${chipsHtml}
          </div>
        </div>
      </div>
    `;
  } else {
    const songs = state.songs.filter(s => s.grade === grade);
    const total = songs.length;

    // ?¨ì› ë¶„í¬ ê³„ì‚°
    const unitMap = {};
    songs.forEach(s => {
      (s.tags || []).forEach(t => {
        if (/^\d+?¨ì›$/.test(t)) unitMap[t] = (unitMap[t] || 0) + 1;
      });
    });

    const unitsHtml = Object.entries(unitMap)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([unit, cnt]) => {
        const c = getTagColor(unit);
        return `<span class="title-unit-chip" style="background:${c.bg};border-color:${c.border};color:${c.text}">${escapeHtml(unit)} ${cnt}ê³?/span>`;
      }).join('');

    area.innerHTML = `
      <div class="page-title-banner">
        <div class="page-title-banner-main">
          <span class="page-title-rabbit" aria-hidden="true">
            <img src="À½Ç¥ ¾ÆÀÌÄÜ.png" alt="" width="38" height="38" style="object-fit:contain;" />
          </span>
          <div>
            <h1 class="page-title">${escapeHtml(grade)} ê³¼í•™??/h1>
            <p class="page-title-count">ì´?<strong>${total}</strong>ê³?/p>
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

  // ?¸ë„¤??HTML
  const thumbHtml = song.thumbnail
    ? `<img class="card-thumb" src="${song.thumbnail}" alt="${escapeHtml(song.title)} ?¸ë„¤??
           onerror="this.outerHTML=\`<div class='thumb-fallback'><img src='À½Ç¥ ¾ÆÀÌÄÜ.png' alt='' /><span>?¸ë„¤???†ìŒ</span></div>\`"
           loading="lazy" />`
    : `<div class="thumb-fallback">
         <img src="À½Ç¥ ¾ÆÀÌÄÜ.png" alt="" />
         <span>?¸ë„¤???†ìŒ</span>
       </div>`;

  // ?œê·¸ HTML (?‰ìƒ ?ìš©)
  const tagsHtml = !song.locked && song.tags && song.tags.length > 0
    ? song.tags.map(t => {
        const c = getTagColor(t);
        return `<span class="card-tag" style="background:${c.bg};border-color:${c.border};color:${c.text}">#${escapeHtml(t)}</span>`;
      }).join('')
    : '';

  const gradeBadge = !song.locked
    ? `<span class="card-grade-badge">${escapeHtml(song.grade)}</span>`
    : '';

  // ? ê¸ˆ ?¤ë²„?ˆì´
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

  // ì¹´ë“œ ? ê¸ˆ ë²„íŠ¼ (ê´€ë¦¬ì)
  const lockBtnHtml = state.isAdmin
    ? `<button class="card-lock-btn${song.locked ? ' is-locked' : ''}"
               data-id="${song.id}"
               title="${song.locked ? '? ê¸ˆ ?´ì œ' : '? ê¸ˆ'}"
               aria-label="${song.locked ? '? ê¸ˆ ?´ì œ' : '? ê¸ˆ'}">
         ${song.locked
           ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
           : `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`
         }
       </button>`
    : '';

  card.innerHTML = `
    <button class="card-edit-btn" data-edit="${song.id}" title="?¸ì§‘" aria-label="?¸ì§‘">
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
             ? ê¸´ ì½˜í…ì¸?           </div>`
        : `<div class="card-title">${escapeHtml(song.title)}</div>
           <div class="card-tags">${gradeBadge}${tagsHtml}</div>`
      }
    </div>
  `;

  // ?´ë²¤???„ì„?¼ë¡œ ë²„íŠ¼ ?´ë¦­ ì²˜ë¦¬
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
      if (!state.isAdmin) showToast('? ê¸´ ê³¼í•™?¡ì…?ˆë‹¤ ?”’', 'warn');
      return;
    }
    playSong(song);
  });

  return card;
}

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 6. LOCK MANAGEMENT
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
function toggleSongLock(id) {
  const song = state.songs.find(s => s.id === id);
  if (!song) return;
  song.locked = !song.locked;
  saveState();
  renderCards();
  renderGradeTabs();
  showToast(song.locked ? `"${song.title}" ? ê¸ˆ???”’` : `"${song.title}" ? ê¸ˆ ?´ì œ ?”“`, song.locked ? 'warn' : 'success');
}

function toggleGradeLock(grade, lock) {
  const songs = grade === '?„ì²´'
    ? state.songs
    : state.songs.filter(s => s.grade === grade);
  songs.forEach(s => s.locked = lock);
  saveState();
  renderCards();
  renderGradeTabs();
  const label = grade === '?„ì²´' ? '?„ì²´' : `${grade}`;
  showToast(lock ? `${label} ?„ì²´ ? ê¸ˆ???”’` : `${label} ?„ì²´ ? ê¸ˆ ?´ì œ ?”“`, lock ? 'warn' : 'success');
}

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 7. GRADE NAVIGATION
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
function selectGrade(grade) {
  state.currentGrade = grade;
  renderGradeTabs();
  renderPageTitle();
  renderCards();
}

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 8. ADMIN AUTH
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
function openAdminLogin() {
  if (state.isAdmin) { exitAdmin(); return; }
  document.getElementById('adminPasswordInput').value = '';
  document.getElementById('adminError').style.display = 'none';
  openModal('adminLoginModal');
  setTimeout(() => document.getElementById('adminPasswordInput').focus(), 100);
}

// SHA-256 ?´ì‹œ ? í‹¸ (crypto.subtle ?¬ìš© ??ê°œë°œ???„êµ¬?ì„œ ë¹„ë?ë²ˆí˜¸ ë¯¸ë…¸ì¶?
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
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
    ê´€ë¦¬ì ì¢…ë£Œ
  `;
  document.getElementById('adminToggleBtn').style.cssText = 'color:var(--point-deep); border-color:var(--point-line);';
  document.querySelector('.app-layout').classList.add('admin-mode');
  document.getElementById('cardsGrid').classList.add('admin-mode');
  renderGradeTabs();
  renderCards();
  showToast('ê´€ë¦¬ì ëª¨ë“œ ?œì„±????, 'success');
}

function exitAdmin() {
  state.isAdmin = false;
  document.getElementById('adminBanner').style.display = 'none';
  document.getElementById('adminAddRow').style.display = 'none';
  document.getElementById('adminToggleBtn').innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
    ê´€ë¦¬ì
  `;
  document.getElementById('adminToggleBtn').style.cssText = '';
  document.querySelector('.app-layout').classList.remove('admin-mode');
  document.getElementById('cardsGrid').classList.remove('admin-mode');
  if (sortableInstance) { sortableInstance.destroy(); sortableInstance = null; }
  renderGradeTabs();
  renderCards();
  showToast('ê´€ë¦¬ì ëª¨ë“œ ì¢…ë£Œ');
}

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 9. DRAG & DROP (SortableJS)
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
function setupSortable() {
  if (sortableInstance) { sortableInstance.destroy(); sortableInstance = null; }
  // ê¸°ë³¸???•ë ¬???Œë§Œ ?œë˜ê·????œë¡­ ?œì„±??  if (!state.isAdmin || state.sortBy !== 'default') return;

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
      showToast('?œì„œê°€ ë³€ê²½ë˜?ˆìŠµ?ˆë‹¤ ??, 'success');
    }
  });
}

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 10. PLAYER
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
function playSong(song) {
  if (state.isAdmin) return;
  if (song.locked) { showToast('? ê¸´ ê³¼í•™?¡ì…?ˆë‹¤ ?”’', 'warn'); return; }

  const videoId = song.videoId || extractVideoId(song.youtubeUrl);
  if (!videoId) {
    if (song.youtubeUrl) window.open(song.youtubeUrl, '_blank');
    else showToast('?¬ìƒ???ìƒ ?•ë³´ê°€ ?†ìŠµ?ˆë‹¤.', 'error');
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

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 11. ADD / EDIT MODAL
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
function openAddModal() {
  state.editingId   = null;
  state.currentTags = [];
  document.getElementById('songModalTitle').textContent         = 'ê³¼í•™??ì¶”ê?';
  document.getElementById('deleteSongBtn').style.display       = 'none';
  document.getElementById('songYoutubeUrl').value              = '';
  document.getElementById('songTitle').value                   = '';
  document.getElementById('thumbPreviewArea').style.display    = 'none';
  document.getElementById('thumbPreviewImg').src               = '';
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

  document.getElementById('songModalTitle').textContent   = 'ê³¼í•™???¸ì§‘';
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
  sel.innerHTML = '<option value="">?™ë…„ ? íƒ...</option>';
  state.grades.filter(g => g !== '?„ì²´').forEach(g => {
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
  if (!videoId) { showToast('?¬ë°”ë¥?YouTube URL???…ë ¥??ì£¼ì„¸??', 'error'); return; }
  const thumb = getYoutubeThumbnail(videoId);
  document.getElementById('thumbPreviewImg').src             = thumb;
  document.getElementById('thumbPreviewArea').style.display = '';
  showToast('?¸ë„¤?¼ì„ ê°€?¸ì™”?µë‹ˆ????, 'success');
}

function clearThumbnail() {
  document.getElementById('thumbPreviewImg').src             = '';
  document.getElementById('thumbPreviewArea').style.display = 'none';
}

function saveSong() {
  const url   = document.getElementById('songYoutubeUrl').value.trim();
  const title = document.getElementById('songTitle').value.trim();
  const grade = document.getElementById('songGrade').value;

  if (!url)   { showToast('? íŠœë¸?URL???…ë ¥??ì£¼ì„¸??', 'error'); return; }
  if (!title) { showToast('?¸ë˜ ?œëª©???…ë ¥??ì£¼ì„¸??', 'error'); return; }
  if (!grade) { showToast('?™ë…„??? íƒ??ì£¼ì„¸??', 'error'); return; }

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
    showToast('?˜ì •?˜ì—ˆ?µë‹ˆ????, 'success');
  } else {
    const maxOrder = state.songs.reduce((m, s) => Math.max(m, s.order ?? 0), -1);
    state.songs.push({
      id: uid(), title, grade, youtubeUrl: url, videoId, thumbnail,
      tags: [...state.currentTags], order: maxOrder + 1, locked: false
    });
    showToast('ê³¼í•™?¡ì´ ì¶”ê??˜ì—ˆ?µë‹ˆ????, 'success');
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
  if (!confirm('??ê³¼í•™?¡ì„ ?? œ? ê¹Œ??')) return;
  state.songs = state.songs.filter(s => s.id !== state.editingId);
  saveState();
  closeModal('songModal');
  renderGradeTabs();
  renderSidebarStats();
  renderPageTitle();
  renderCards();
  showToast('?? œ?˜ì—ˆ?µë‹ˆ??', 'warn');
}

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 12. TAG INPUT
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
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
    chip.innerHTML = `#${escapeHtml(tag)} <button class="tag-chip-remove" data-tag="${escapeHtml(tag)}" aria-label="?? œ">Ã—</button>`;
    chip.querySelector('.tag-chip-remove').addEventListener('click', () => removeTag(tag));
    list.appendChild(chip);
  });
}

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 13. GRADE MANAGEMENT
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
function openGradeModal() {
  renderGradeManageList();
  openModal('gradeModal');
}

function renderGradeManageList() {
  const ul = document.getElementById('gradeManageList');
  ul.innerHTML = '';
  state.grades.filter(g => g !== '?„ì²´').forEach(grade => {
    const count = state.songs.filter(s => s.grade === grade).length;
    const li = document.createElement('li');
    li.className = 'grade-manage-item';
    li.innerHTML = `
      <span>${escapeHtml(grade)} <small style="color:var(--muted)">(${count}ê°?</small></span>
      <button data-grade="${escapeHtml(grade)}">?? œ</button>
    `;
    li.querySelector('button').addEventListener('click', () => removeGrade(grade));
    ul.appendChild(li);
  });
}

function addGrade() {
  const input = document.getElementById('newGradeInput');
  const val   = input.value.trim();
  if (!val) return;
  if (state.grades.includes(val)) { showToast('?´ë? ì¡´ì¬?˜ëŠ” ?™ë…„?…ë‹ˆ??', 'warn'); return; }
  state.grades.push(val);
  saveState();
  input.value = '';
  renderGradeManageList();
  renderGradeTabs();
  showToast(`"${val}" ì¶”ê? ??, 'success');
}

function removeGrade(grade) {
  const count = state.songs.filter(s => s.grade === grade).length;
  if (count > 0) {
    showToast(`???™ë…„??ê³¼í•™??${count}ê°œê? ?ˆìŠµ?ˆë‹¤. ë¨¼ì? ?¤ë¥¸ ?™ë…„?¼ë¡œ ?´ë™??ì£¼ì„¸??`, 'error');
    return;
  }
  if (!confirm(`"${grade}"??ë¥? ?? œ? ê¹Œ??`)) return;
  state.grades = state.grades.filter(g => g !== grade);
  if (state.currentGrade === grade) state.currentGrade = '?„ì²´';
  saveState();
  renderGradeManageList();
  renderGradeTabs();
  renderCards();
  showToast(`"${grade}" ?? œ??, 'warn');
}

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 14. MODAL HELPERS
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
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

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 15. TOAST
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
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

// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
// 16. INIT
// ?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•?â•
function init() {
  loadState();
  renderGradeTabs();
  renderSidebarStats();
  renderPageTitle();
  renderCards();
}

init();
