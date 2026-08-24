/* ============================================================
   app.js — 과학송 아카이브 메인 로직  v1.1
   ============================================================ */

'use strict';

// ══════════════════════════════════════════════════════
// 1. STATE
// ══════════════════════════════════════════════════════
const STORAGE_KEY = 'scienceSongArchive_v2';
const ADMIN_PW    = 'minah';

// ── 기본 과학송 데이터 (실제 링크) ──
const DEFAULT_SONGS = [
  /* ── 중2 ── */
  { id:'s01', grade:'중2', title:'원소기호송',           youtubeUrl:'https://www.youtube.com/watch?v=w2TJ1RBsiK0', videoId:'w2TJ1RBsiK0', thumbnail:'https://img.youtube.com/vi/w2TJ1RBsiK0/hqdefault.jpg', tags:['1단원','물질의구성'],        order:0  },
  { id:'s02', grade:'중2', title:'이온송',               youtubeUrl:'https://www.youtube.com/watch?v=ScxLD5UEoMA', videoId:'ScxLD5UEoMA', thumbnail:'https://img.youtube.com/vi/ScxLD5UEoMA/hqdefault.jpg', tags:['1단원','물질의구성'],        order:1  },
  { id:'s03', grade:'중2', title:'자기력송',             youtubeUrl:'https://www.youtube.com/watch?v=2110PW3rkJw', videoId:'2110PW3rkJw', thumbnail:'https://img.youtube.com/vi/2110PW3rkJw/hqdefault.jpg', tags:['2단원','전기와자기'],        order:2  },
  { id:'s04', grade:'중2', title:'태양계송',             youtubeUrl:'https://youtu.be/gmJ8RvIQiQc',                videoId:'gmJ8RvIQiQc', thumbnail:'https://img.youtube.com/vi/gmJ8RvIQiQc/hqdefault.jpg', tags:['3단원','태양계'],            order:3  },
  { id:'s05', grade:'중2', title:'광합성송',             youtubeUrl:'https://www.youtube.com/watch?v=P8cGGja3sHo', videoId:'P8cGGja3sHo', thumbnail:'https://img.youtube.com/vi/P8cGGja3sHo/hqdefault.jpg', tags:['4단원','식물과에너지'],       order:4  },
  { id:'s06', grade:'중2', title:'소화 순환 호흡 배설송', youtubeUrl:'https://youtu.be/DO7W9upASOY',                videoId:'DO7W9upASOY', thumbnail:'https://img.youtube.com/vi/DO7W9upASOY/hqdefault.jpg', tags:['5단원','동물과에너지'],       order:5  },
  { id:'s07', grade:'중2', title:'소화기관송',           youtubeUrl:'https://youtu.be/3adIvbguytc',                videoId:'3adIvbguytc', thumbnail:'https://img.youtube.com/vi/3adIvbguytc/hqdefault.jpg', tags:['5단원','동물과에너지'],       order:6  },
  { id:'s08', grade:'중2', title:'물질의 특성송',        youtubeUrl:'https://youtu.be/M3sufHqzpL4',                videoId:'M3sufHqzpL4', thumbnail:'https://img.youtube.com/vi/M3sufHqzpL4/hqdefault.jpg', tags:['6단원','물질의특성'],         order:7  },
  { id:'s09', grade:'중2', title:'해수의 순환송',        youtubeUrl:'https://youtu.be/S__Iees0hHo',                videoId:'S__Iees0hHo', thumbnail:'https://img.youtube.com/vi/S__Iees0hHo/hqdefault.jpg', tags:['7단원','수권과해수의순환'],    order:8  },
  { id:'s10', grade:'중2', title:'수권의 구성과 해수송', youtubeUrl:'https://youtu.be/wUkOtZdeQOQ',                videoId:'wUkOtZdeQOQ', thumbnail:'https://img.youtube.com/vi/wUkOtZdeQOQ/hqdefault.jpg', tags:['7단원','수권과해수의순환'],    order:9  },
  { id:'s11', grade:'중2', title:'열과 우리 생활송',     youtubeUrl:'https://youtu.be/Vx_J5q2aAmg',                videoId:'Vx_J5q2aAmg', thumbnail:'https://img.youtube.com/vi/Vx_J5q2aAmg/hqdefault.jpg', tags:['8단원','열과우리생활'],        order:10 },
  { id:'s12', grade:'중2', title:'열의 이동과 비열송',   youtubeUrl:'https://youtu.be/u5doBPQlgPg',                videoId:'u5doBPQlgPg', thumbnail:'https://img.youtube.com/vi/u5doBPQlgPg/hqdefault.jpg', tags:['8단원','열과우리생활'],        order:11 },
  /* ── 중1 ── */
  { id:'s13', grade:'중1', title:'지구계송',             youtubeUrl:'https://youtu.be/y4Zq3pB529A',                videoId:'y4Zq3pB529A', thumbnail:'https://img.youtube.com/vi/y4Zq3pB529A/hqdefault.jpg', tags:['1단원','지권의변화'],         order:12 },
  { id:'s14', grade:'중1', title:'암석송',               youtubeUrl:'https://www.youtube.com/watch?v=YNalQ0fOyVw', videoId:'YNalQ0fOyVw', thumbnail:'https://img.youtube.com/vi/YNalQ0fOyVw/hqdefault.jpg', tags:['1단원','지권의변화'],         order:13 },
  { id:'s15', grade:'중1', title:'광물송',               youtubeUrl:'https://youtu.be/-H5uBoLp4CE',                videoId:'-H5uBoLp4CE', thumbnail:'https://img.youtube.com/vi/-H5uBoLp4CE/hqdefault.jpg', tags:['1단원','지권의변화'],         order:14 },
  { id:'s16', grade:'중1', title:'여러 가지 힘송',       youtubeUrl:'https://youtu.be/_vAn-w2YbLg',                videoId:'_vAn-w2YbLg', thumbnail:'https://img.youtube.com/vi/_vAn-w2YbLg/hqdefault.jpg', tags:['2단원','여러가지힘'],         order:15 },
  { id:'s17', grade:'중1', title:'생물 다양성송',        youtubeUrl:'https://youtu.be/RvIAFg_dQu4',                videoId:'RvIAFg_dQu4', thumbnail:'https://img.youtube.com/vi/RvIAFg_dQu4/hqdefault.jpg', tags:['3단원','생물의다양성'],        order:16 },
  { id:'s18', grade:'중1', title:'기체의 성질송',        youtubeUrl:'https://www.youtube.com/watch?v=nDiXiCdIKIQ', videoId:'nDiXiCdIKIQ', thumbnail:'https://img.youtube.com/vi/nDiXiCdIKIQ/hqdefault.jpg', tags:['4단원','기체의성질'],         order:17 },
  { id:'s19', grade:'중1', title:'분자 배열송 (상태변화송)', youtubeUrl:'https://www.youtube.com/watch?v=ekN9KcXRGMw', videoId:'ekN9KcXRGMw', thumbnail:'https://img.youtube.com/vi/ekN9KcXRGMw/hqdefault.jpg', tags:['5단원','물질의상태변화'], order:18 },
  { id:'s20', grade:'중1', title:'파동송',               youtubeUrl:'https://www.youtube.com/watch?v=DpBDJlEB5V4', videoId:'DpBDJlEB5V4', thumbnail:'https://img.youtube.com/vi/DpBDJlEB5V4/hqdefault.jpg', tags:['6단원','빛과파동'],           order:19 },
];

const DEFAULT_GRADES = ['전체', '중1', '중2', '중3'];

let state = {
  grades: [...DEFAULT_GRADES],
  songs:  DEFAULT_SONGS.map(s => ({...s})),
  currentGrade: '전체',
  isAdmin: false,
  editingId: null,
  currentTags: []
};

let sortableInstance = null;

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
    if (saved.songs  && Array.isArray(saved.songs))  state.songs  = saved.songs;
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

// ══════════════════════════════════════════════════════
// 4. RENDER HELPERS
// ══════════════════════════════════════════════════════
function getFilteredSongs() {
  let songs = [...state.songs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (state.currentGrade !== '전체') {
    songs = songs.filter(s => s.grade === state.currentGrade);
  }
  return songs;
}

function renderGradeTabs() {
  const nav    = document.getElementById('gradeNav');
  const mobile = document.getElementById('mobileGradeBar');
  nav.innerHTML    = '';
  mobile.innerHTML = '';

  state.grades.forEach(grade => {
    const count = grade === '전체'
      ? state.songs.length
      : state.songs.filter(s => s.grade === grade).length;

    // ── Desktop tab ──
    const btn = document.createElement('button');
    btn.className = 'grade-tab' + (grade === state.currentGrade ? ' active' : '');
    btn.setAttribute('aria-current', grade === state.currentGrade ? 'page' : 'false');
    btn.dataset.grade = grade;
    btn.innerHTML = `<span>${grade}</span><span class="tab-count">${count}</span>`;
    btn.onclick = () => selectGrade(grade);
    nav.appendChild(btn);

    // ── Mobile tab ──
    const mBtn = document.createElement('button');
    mBtn.className = 'mobile-grade-tab' + (grade === state.currentGrade ? ' active' : '');
    mBtn.dataset.grade = grade;
    mBtn.textContent = grade;
    mBtn.onclick = () => selectGrade(grade);
    mobile.appendChild(mBtn);
  });

  // ── Admin: 학년 관리 버튼 (사이드바 하단) ──
  if (state.isAdmin) {
    const sep = document.createElement('div');
    sep.style.cssText = 'border-top:1px solid var(--line); margin: 10px 0 6px;';
    nav.appendChild(sep);

    const manageBtn = document.createElement('button');
    manageBtn.className = 'grade-tab';
    manageBtn.style.cssText = 'color:var(--point-deep); gap:6px;';
    manageBtn.innerHTML = `
      <span style="display:flex;align-items:center;gap:6px;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        학년 관리
      </span>
    `;
    manageBtn.onclick = openGradeModal;
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
  document.getElementById('pageTitle').textContent =
    state.currentGrade === '전체' ? '전체 과학송' : state.currentGrade + ' 과학송';
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
    const card = createCardElement(song, idx);
    grid.appendChild(card);
  });

  setupSortable();
}

function createCardElement(song, idx) {
  const card = document.createElement('div');
  card.className = 'song-card';
  card.dataset.id = song.id;
  card.style.animationDelay = `${idx * 0.04}s`;

  const thumbHtml = song.thumbnail
    ? `<img class="card-thumb" src="${song.thumbnail}" alt="${escapeHtml(song.title)} 썸네일"
         onerror="this.outerHTML=\`<div class='thumb-fallback'><img src='음표 아이콘.png' alt='' /><span>썸네일 없음</span></div>\`"
         loading="lazy" />`
    : `<div class="thumb-fallback">
         <img src="음표 아이콘.png" alt="" />
         <span>썸네일 없음</span>
       </div>`;

  const tagsHtml = song.tags && song.tags.length > 0
    ? song.tags.map(t => `<span class="card-tag">#${escapeHtml(t)}</span>`).join('')
    : '';

  const gradeBadge = `<span class="card-grade-badge">${escapeHtml(song.grade)}</span>`;

  card.innerHTML = `
    <button class="card-edit-btn" onclick="event.stopPropagation(); openEditModal('${song.id}')" title="편집" aria-label="편집">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--point-deep)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </button>
    <div class="card-thumb-wrap">
      ${thumbHtml}
      <div class="play-overlay">
        <div class="play-btn-circle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="card-title">${escapeHtml(song.title)}</div>
      <div class="card-tags">${gradeBadge}${tagsHtml}</div>
    </div>
  `;

  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-edit-btn')) return;
    playSong(song);
  });

  return card;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ══════════════════════════════════════════════════════
// 5. GRADE NAVIGATION
// ══════════════════════════════════════════════════════
function selectGrade(grade) {
  state.currentGrade = grade;
  renderGradeTabs();
  renderPageTitle();
  renderCards();
}

// ══════════════════════════════════════════════════════
// 6. ADMIN AUTH
// ══════════════════════════════════════════════════════
function openAdminLogin() {
  if (state.isAdmin) { exitAdmin(); return; }
  document.getElementById('adminPasswordInput').value = '';
  document.getElementById('adminError').style.display = 'none';
  openModal('adminLoginModal');
  setTimeout(() => document.getElementById('adminPasswordInput').focus(), 100);
}

function verifyAdmin() {
  const pw = document.getElementById('adminPasswordInput').value;
  if (pw === ADMIN_PW) {
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
// 7. DRAG & DROP (SortableJS)
// ══════════════════════════════════════════════════════
function setupSortable() {
  if (sortableInstance) { sortableInstance.destroy(); sortableInstance = null; }
  if (!state.isAdmin) return;

  const grid = document.getElementById('cardsGrid');
  sortableInstance = Sortable.create(grid, {
    animation: 200,
    ghostClass: 'sortable-ghost',
    dragClass: 'sortable-drag',
    handle: '.song-card',
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
// 8. PLAYER
// ══════════════════════════════════════════════════════
function playSong(song) {
  if (state.isAdmin) return;

  const videoId = song.videoId || extractVideoId(song.youtubeUrl);
  if (!videoId) {
    if (song.youtubeUrl) window.open(song.youtubeUrl, '_blank');
    else showToast('재생할 영상 정보가 없습니다.', 'error');
    return;
  }

  document.getElementById('youtubeIframe').src = getYoutubeEmbedUrl(videoId);
  document.getElementById('playerModalTitle').textContent = song.title;

  const tagsHtml = (song.tags || []).map(t => `<span class="card-tag">#${escapeHtml(t)}</span>`).join('');
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
// 9. ADD / EDIT MODAL
// ══════════════════════════════════════════════════════
function openAddModal() {
  state.editingId = null;
  state.currentTags = [];
  document.getElementById('songModalTitle').textContent = '과학송 추가';
  document.getElementById('deleteSongBtn').style.display = 'none';
  document.getElementById('songYoutubeUrl').value = '';
  document.getElementById('songTitle').value = '';
  document.getElementById('thumbPreviewArea').style.display = 'none';
  document.getElementById('thumbPreviewImg').src = '';
  renderTagList();
  populateGradeSelect();
  openModal('songModal');
  setTimeout(() => document.getElementById('songYoutubeUrl').focus(), 100);
}

function openEditModal(id) {
  const song = state.songs.find(s => s.id === id);
  if (!song) return;

  state.editingId = id;
  state.currentTags = [...(song.tags || [])];

  document.getElementById('songModalTitle').textContent = '과학송 편집';
  document.getElementById('deleteSongBtn').style.display = '';
  document.getElementById('songYoutubeUrl').value = song.youtubeUrl || '';
  document.getElementById('songTitle').value = song.title || '';

  if (song.thumbnail) {
    document.getElementById('thumbPreviewImg').src = song.thumbnail;
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
  document.getElementById('thumbPreviewImg').src = thumb;
  document.getElementById('thumbPreviewArea').style.display = '';
  showToast('썸네일을 가져왔습니다 ✓', 'success');
}

function clearThumbnail() {
  document.getElementById('thumbPreviewImg').src = '';
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
      state.songs[idx] = { ...state.songs[idx], title, grade, youtubeUrl: url, videoId, thumbnail, tags: [...state.currentTags] };
    }
    showToast('수정되었습니다 ✓', 'success');
  } else {
    const maxOrder = state.songs.reduce((m, s) => Math.max(m, s.order ?? 0), -1);
    state.songs.push({ id: uid(), title, grade, youtubeUrl: url, videoId, thumbnail, tags: [...state.currentTags], order: maxOrder + 1 });
    showToast('과학송이 추가되었습니다 ✓', 'success');
  }

  saveState();
  closeModal('songModal');
  renderGradeTabs();
  renderSidebarStats();
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
  renderCards();
  showToast('삭제되었습니다.', 'warn');
}

// ══════════════════════════════════════════════════════
// 10. TAG INPUT
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
    chip.innerHTML = `#${escapeHtml(tag)} <button class="tag-chip-remove" onclick="removeTag('${escapeHtml(tag)}')" aria-label="삭제">×</button>`;
    list.appendChild(chip);
  });
}

// ══════════════════════════════════════════════════════
// 11. GRADE MANAGEMENT
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
      <button onclick="removeGrade('${escapeHtml(grade)}')">삭제</button>
    `;
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
// 12. MODAL HELPERS
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
  ['adminLoginModal','songModal','gradeModal'].forEach(id => {
    if (document.getElementById(id).style.display !== 'none') closeModal(id);
  });
});

// ══════════════════════════════════════════════════════
// 13. TOAST
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
// 14. INIT
// ══════════════════════════════════════════════════════
function init() {
  loadState();
  renderGradeTabs();
  renderSidebarStats();
  renderPageTitle();
  renderCards();
}

init();
