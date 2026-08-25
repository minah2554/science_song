/* ============================================================
   app.js — 과학송 아카이브 메인 로직  v2.2
   ============================================================ */

'use strict';

// ══════════════════════════════════════════════════════
// 1. CONSTANTS & STATE
// ══════════════════════════════════════════════════════
const STORAGE_KEY = 'scienceSongArchive_v2';
const FIREBASE_CONFIG_KEY = 'scienceSong_firebase_config';
const DB_NAME = 'ScienceSongMediaDB';
const DB_VERSION = 1;
const DB_STORE = 'videos';

// ── 기본 내장 Firebase 클라우드 설정 (어떤 기기에서도 0.1초 실시간 동기화) ──
const DEFAULT_FIREBASE_CONFIG = {
  projectId: "sciencesong",
  appId: "1:31189210028:web:19126abb298cf1455f2009",
  storageBucket: "sciencesong.firebasestorage.app",
  apiKey: "AIzaSyAqiWZvma68aOUkPT-E8WN7qKtRo3NmR-I",
  authDomain: "sciencesong.firebaseapp.com",
  messagingSenderId: "31189210028",
  projectNumber: "31189210028"
};

// 관리자 인증: SHA-256 해시로 저장 (개발자 도구 소스 노출 시 비밀번호 안전)
const ADMIN_HASH = 'ad5f52f58ed6ec6e7a641f2416f347674ac5933470079f2a18bc6269b1e80796';

// ── 기본 과학송 데이터 ──
const DEFAULT_SONGS = [
  /* ── 중2 ── */
  { id:'s01', grade:'중2', title:'원소기호송',              mediaType:'youtube', youtubeUrl:'https://www.youtube.com/watch?v=w2TJ1RBsiK0', videoId:'w2TJ1RBsiK0', thumbnail:'https://img.youtube.com/vi/w2TJ1RBsiK0/hqdefault.jpg', tags:['1단원','물질의구성'],         order:0  },
  { id:'s02', grade:'중2', title:'이온송',                  mediaType:'youtube', youtubeUrl:'https://www.youtube.com/watch?v=ScxLD5UEoMA', videoId:'ScxLD5UEoMA', thumbnail:'https://img.youtube.com/vi/ScxLD5UEoMA/hqdefault.jpg', tags:['1단원','물질의구성'],         order:1  },
  { id:'s03', grade:'중2', title:'자기력송',                mediaType:'youtube', youtubeUrl:'https://www.youtube.com/watch?v=2110PW3rkJw', videoId:'2110PW3rkJw', thumbnail:'https://img.youtube.com/vi/2110PW3rkJw/hqdefault.jpg', tags:['2단원','전기와자기'],         order:2  },
  { id:'s04', grade:'중2', title:'태양계송',                mediaType:'youtube', youtubeUrl:'https://youtu.be/gmJ8RvIQiQc',                videoId:'gmJ8RvIQiQc', thumbnail:'https://img.youtube.com/vi/gmJ8RvIQiQc/hqdefault.jpg', tags:['3단원','태양계'],             order:3  },
  { id:'s05', grade:'중2', title:'광합성송',                mediaType:'youtube', youtubeUrl:'https://www.youtube.com/watch?v=P8cGGja3sHo', videoId:'P8cGGja3sHo', thumbnail:'https://img.youtube.com/vi/P8cGGja3sHo/hqdefault.jpg', tags:['4단원','식물과에너지'],        order:4  },
  { id:'s06', grade:'중2', title:'소화 순환 호흡 배설송',   mediaType:'youtube', youtubeUrl:'https://youtu.be/DO7W9upASOY',                videoId:'DO7W9upASOY', thumbnail:'https://img.youtube.com/vi/DO7W9upASOY/hqdefault.jpg', tags:['5단원','동물과에너지'],        order:5  },
  { id:'s07', grade:'중2', title:'소화기관송',              mediaType:'youtube', youtubeUrl:'https://youtu.be/3adIvbguytc',                videoId:'3adIvbguytc', thumbnail:'https://img.youtube.com/vi/3adIvbguytc/hqdefault.jpg', tags:['5단원','동물과에너지'],        order:6  },
  { id:'s08', grade:'중2', title:'물질의 특성송',           mediaType:'youtube', youtubeUrl:'https://youtu.be/M3sufHqzpL4',                videoId:'M3sufHqzpL4', thumbnail:'https://img.youtube.com/vi/M3sufHqzpL4/hqdefault.jpg', tags:['6단원','물질의특성'],          order:7  },
  { id:'s09', grade:'중2', title:'해수의 순환송',           mediaType:'youtube', youtubeUrl:'https://youtu.be/S__Iees0hHo',                videoId:'S__Iees0hHo', thumbnail:'https://img.youtube.com/vi/S__Iees0hHo/hqdefault.jpg', tags:['7단원','수권과해수의순환'],     order:8  },
  { id:'s10', grade:'중2', title:'수권의 구성과 해수송',    mediaType:'youtube', youtubeUrl:'https://youtu.be/wUkOtZdeQOQ',               videoId:'wUkOtZdeQOQ', thumbnail:'https://img.youtube.com/vi/wUkOtZdeQOQ/hqdefault.jpg', tags:['7단원','수권과해수의순환'],     order:9  },
  { id:'s11', grade:'중2', title:'열과 우리 생활송',        mediaType:'youtube', youtubeUrl:'https://youtu.be/Vx_J5q2aAmg',               videoId:'Vx_J5q2aAmg', thumbnail:'https://img.youtube.com/vi/Vx_J5q2aAmg/hqdefault.jpg', tags:['8단원','열과우리생활'],         order:10 },
  { id:'s12', grade:'중2', title:'열의 이동과 비열송',      mediaType:'youtube', youtubeUrl:'https://youtu.be/u5doBPQlgPg',               videoId:'u5doBPQlgPg', thumbnail:'https://img.youtube.com/vi/u5doBPQlgPg/hqdefault.jpg', tags:['8단원','열과우리생활'],         order:11 },
  /* ── 중1 ── */
  { id:'s13', grade:'중1', title:'지구계송',                mediaType:'youtube', youtubeUrl:'https://youtu.be/y4Zq3pB529A',               videoId:'y4Zq3pB529A', thumbnail:'https://img.youtube.com/vi/y4Zq3pB529A/hqdefault.jpg', tags:['1단원','지권의변화'],          order:12 },
  { id:'s14', grade:'중1', title:'암석송',                  mediaType:'youtube', youtubeUrl:'https://www.youtube.com/watch?v=YNalQ0fOyVw', videoId:'YNalQ0fOyVw', thumbnail:'https://img.youtube.com/vi/YNalQ0fOyVw/hqdefault.jpg', tags:['1단원','지권의변화'],          order:13 },
  { id:'s15', grade:'중1', title:'광물송',                  mediaType:'youtube', youtubeUrl:'https://youtu.be/-H5uBoLp4CE',               videoId:'-H5uBoLp4CE', thumbnail:'https://img.youtube.com/vi/-H5uBoLp4CE/hqdefault.jpg', tags:['1단원','지권의변화'],          order:14 },
  { id:'s16', grade:'중1', title:'여러 가지 힘송',          mediaType:'youtube', youtubeUrl:'https://youtu.be/_vAn-w2YbLg',               videoId:'_vAn-w2YbLg', thumbnail:'https://img.youtube.com/vi/_vAn-w2YbLg/hqdefault.jpg', tags:['2단원','여러가지힘'],          order:15 },
  { id:'s17', grade:'중1', title:'생물 다양성송',           mediaType:'youtube', youtubeUrl:'https://youtu.be/RvIAFg_dQu4',               videoId:'RvIAFg_dQu4', thumbnail:'https://img.youtube.com/vi/RvIAFg_dQu4/hqdefault.jpg', tags:['3단원','생물의다양성'],         order:16 },
  { id:'s18', grade:'중1', title:'기체의 성질송',           mediaType:'youtube', youtubeUrl:'https://www.youtube.com/watch?v=nDiXiCdIKIQ', videoId:'nDiXiCdIKIQ', thumbnail:'https://img.youtube.com/vi/nDiXiCdIKIQ/hqdefault.jpg', tags:['4단원','기체의성질'],          order:17 },
  { id:'s19', grade:'중1', title:'분자 배열송 (상태변화송)', mediaType:'youtube', youtubeUrl:'https://www.youtube.com/watch?v=ekN9KcXRGMw', videoId:'ekN9KcXRGMw', thumbnail:'https://img.youtube.com/vi/ekN9KcXRGMw/hqdefault.jpg', tags:['5단원','물질의상태변화'],  order:18 },
  { id:'s20', grade:'중1', title:'파동송',                  mediaType:'youtube', youtubeUrl:'https://www.youtube.com/watch?v=DpBDJlEB5V4', videoId:'DpBDJlEB5V4', thumbnail:'https://img.youtube.com/vi/DpBDJlEB5V4/hqdefault.jpg', tags:['6단원','빛과파동'],            order:19 },
];

const DEFAULT_GRADES = ['전체', '중1', '중2', '중3'];

let state = {
  grades:             [...DEFAULT_GRADES],
  songs:              DEFAULT_SONGS.map(s => ({ ...s, locked: false })),
  currentGrade:       '전체',
  isAdmin:            false,
  editingId:          null,
  currentTags:        [],
  sortBy:             'default',
  currentMediaType:   'youtube', // 'youtube' | 'file'
  selectedVideoFile:  null,
  selectedThumbData:  ''
};

let sortableInstance = null;
let firestoreDb = null;
let firestoreUnsubscribe = null;
let syncBroadcast = null;
let currentVideoObjectUrl = null;

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
  if (!tag) return CONTENT_TAG_COLOR;
  const m = String(tag).match(/^(\d+)단원$/);
  if (m) {
    const idx = Math.max(0, parseInt(m[1]) - 1) % UNIT_COLORS.length;
    return UNIT_COLORS[idx];
  }
  return CONTENT_TAG_COLOR;
}

function getUnitNumber(song) {
  if (!song || !song.tags) return 999;
  for (const tag of song.tags) {
    const m = String(tag).match(/^(\d+)단원$/);
    if (m) return parseInt(m[1]);
  }
  return 999;
}

// ══════════════════════════════════════════════════════
// 2. INDEXEDDB (동영상 파일 대용량 저장소)
// ══════════════════════════════════════════════════════
function openMediaDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

async function saveVideoBlob(id, fileOrBlob) {
  const db = await openMediaDB();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(DB_STORE, 'readwrite');
      const store = tx.objectStore(DB_STORE);
      store.put(fileOrBlob, id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch(e) {
      resolve(false);
    }
  });
}

async function getVideoBlob(id) {
  const db = await openMediaDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(DB_STORE, 'readonly');
      const store = tx.objectStore(DB_STORE);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    } catch(e) {
      resolve(null);
    }
  });
}

async function deleteVideoBlob(id) {
  const db = await openMediaDB();
  if (!db) return;
  try {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).delete(id);
  } catch(e) {}
}

// ══════════════════════════════════════════════════════
// 3. PERSISTENCE & REAL-TIME SYNC
// ══════════════════════════════════════════════════════
try {
  if (typeof BroadcastChannel !== 'undefined') {
    syncBroadcast = new BroadcastChannel('science_song_sync_v2');
    syncBroadcast.onmessage = (event) => {
      if (event.data && event.data.type === 'STATE_UPDATED') {
        loadState();
        renderAll();
      }
    };
  }
} catch(e) {}

// 브라우저 탭 간 실시간 storage 이벤트 동기화
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    loadState();
    renderAll();
  }
});

function saveState(skipCloud = false) {
  const toSave = {
    grades: state.grades,
    songs: state.songs,
    updatedAt: Date.now()
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch(e) {
    console.warn('LocalStorage 저장 경고:', e);
  }

  // 다른 탭으로 실시간 전파
  try {
    if (syncBroadcast) {
      syncBroadcast.postMessage({ type: 'STATE_UPDATED', updatedAt: toSave.updatedAt });
    }
  } catch(e) {}

  // Firebase 실시간 클라우드 DB로 동기화
  if (!skipCloud) {
    saveToCloud(toSave);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.grades && Array.isArray(saved.grades) && saved.grades.length > 0) {
      const validGrades = saved.grades.includes('전체') ? saved.grades : ['전체', ...saved.grades];
      state.grades = validGrades;
    }
    if (saved.songs && Array.isArray(saved.songs)) {
      state.songs = saved.songs.map((s, idx) => ({
        locked: false,
        order: s.order ?? idx,
        mediaType: s.mediaType || (s.videoId || s.youtubeUrl ? 'youtube' : 'file'),
        ...s
      }));
    }
  } catch(e) {
    console.warn('LocalStorage 로드 오류:', e);
  }
}

// ── Firebase 클라우드 실시간 동기화 초기화 ──
function initFirebaseSync() {
  const rawConfig = localStorage.getItem(FIREBASE_CONFIG_KEY);
  let config = DEFAULT_FIREBASE_CONFIG;
  if (rawConfig) {
    try { config = JSON.parse(rawConfig); } catch(e) {}
  }

  try {
    if (typeof firebase === 'undefined') {
      updateCloudBadge('local');
      return;
    }

    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(config);
    }
    firestoreDb = firebase.firestore();
    updateCloudBadge('connected');

    if (firestoreUnsubscribe) {
      firestoreUnsubscribe();
      firestoreUnsubscribe = null;
    }

    // Firestore 실시간 스냅샷 리스너 (어떤 기기에서 수정하든 모든 기기에 0.1초 내 실시간 자동 반영)
    firestoreUnsubscribe = firestoreDb.collection('archive').doc('main').onSnapshot((doc) => {
      if (doc.exists) {
        const remoteData = doc.data();
        if (remoteData && remoteData.songs && Array.isArray(remoteData.songs)) {
          state.songs = remoteData.songs.map((s, idx) => ({
            locked: false,
            order: s.order ?? idx,
            mediaType: s.mediaType || (s.videoId || s.youtubeUrl ? 'youtube' : 'file'),
            ...s
          }));
          if (remoteData.grades && Array.isArray(remoteData.grades)) {
            state.grades = remoteData.grades;
          }
          saveState(true);
          renderAll();
        }
      } else {
        // 최초 클라우드 DB 생성 시 현재 상태를 클라우드에 업로드
        saveToCloud({ grades: state.grades, songs: state.songs, updatedAt: Date.now() });
      }
    }, (err) => {
      console.warn('Firestore 동기화 에러:', err);
      updateCloudBadge('error');
    });
  } catch (err) {
    console.warn('Firebase 초기화 실패:', err);
    updateCloudBadge('error');
  }
}

async function saveToCloud(data) {
  if (!firestoreDb) return;
  try {
    await firestoreDb.collection('archive').doc('main').set({
      songs: data.songs,
      grades: data.grades,
      updatedAt: data.updatedAt || Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('클라우드 저장 실패:', err);
  }
}

function updateCloudBadge(status) {
  const badge = document.getElementById('cloudStatusBadge');
  if (!badge) return;
  badge.className = 'cloud-status-badge';
  if (status === 'connected') {
    badge.classList.add('cloud-status--connected');
    badge.textContent = '☁️ 실시간 클라우드 연결됨';
  } else if (status === 'error') {
    badge.classList.add('cloud-status--error');
    badge.textContent = '⚠️ 클라우드 연결 오류';
  } else {
    badge.classList.add('cloud-status--local');
    badge.textContent = '💾 로컬 저장소 모드';
  }
}

// ══════════════════════════════════════════════════════
// 4. UTILS & VIDEO PROCESSING
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

// 광고 최소화: 개인정보 보호 모드(youtube-nocookie.com) 및 플레이어 최적화 파라미터 적용
function getYoutubeEmbedUrl(videoId) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function sortTags(tags = []) {
  const unitTags = [];
  const otherTags = [];
  tags.forEach(t => {
    const item = String(t).trim();
    if (/^\d+단원$/.test(item)) {
      unitTags.push(item);
    } else if (item) {
      otherTags.push(item);
    }
  });
  unitTags.sort((a, b) => parseInt(a) - parseInt(b));
  return [...unitTags, ...otherTags];
}

// ── 업로드된 동영상 파일에서 썸네일 프레임 자동 캡처 ──
function captureVideoFrame(file) {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;
      video.muted = true;
      video.playsInline = true;

      video.addEventListener('loadeddata', () => {
        video.currentTime = Math.min(1.0, video.duration > 1 ? 1.0 : 0.2);
      });

      video.addEventListener('seeked', () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          URL.revokeObjectURL(objectUrl);
          resolve(dataUrl);
        } catch(err) {
          URL.revokeObjectURL(objectUrl);
          resolve('');
        }
      });

      video.addEventListener('error', () => {
        URL.revokeObjectURL(objectUrl);
        resolve('');
      });
    } catch(e) {
      resolve('');
    }
  });
}

// ══════════════════════════════════════════════════════
// 5. SORT
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

  if (!state.isAdmin) {
    songs = songs.filter(s => !s.locked);
  }

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
// 6. RENDER HELPERS
// ══════════════════════════════════════════════════════
function renderGradeTabs() {
  const nav    = document.getElementById('gradeNav');
  const mobile = document.getElementById('mobileGradeBar');
  if (!nav || !mobile) return;

  nav.innerHTML    = '';
  mobile.innerHTML = '';

  state.grades.forEach(grade => {
    const allGradeSongs = grade === '전체' ? state.songs : state.songs.filter(s => s.grade === grade);
    const visibleSongs = state.isAdmin ? allGradeSongs : allGradeSongs.filter(s => !s.locked);
    const count = visibleSongs.length;
    const isAllLocked = allGradeSongs.length > 0 && allGradeSongs.every(s => s.locked);
    const lockedCount = allGradeSongs.filter(s => s.locked).length;

    // Desktop tab
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
          <span class="tab-count">${allGradeSongs.length}</span>
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

    // Mobile tab
    const mBtn = document.createElement('button');
    mBtn.className = 'mobile-grade-tab' + (grade === state.currentGrade ? ' active' : '');
    mBtn.dataset.grade = grade;
    if (state.isAdmin && lockedCount > 0) {
      mBtn.innerHTML = `${escapeHtml(grade)} <span style="font-size:10px;opacity:0.8;">🔒${lockedCount > 0 && lockedCount < allGradeSongs.length ? lockedCount : ''}</span>`;
    } else {
      mBtn.textContent = grade;
    }
    mBtn.addEventListener('click', () => selectGrade(grade));
    mobile.appendChild(mBtn);
  });

  // Admin: 학년 관리 버튼
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
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
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
  if (!el) return;
  const visibleSongs = state.isAdmin ? state.songs : state.songs.filter(s => !s.locked);
  const total      = visibleSongs.length;
  const gradeCount = state.grades.filter(g => g !== '전체').length;
  el.innerHTML = `<strong>${total}</strong>개 과학송<br>${gradeCount}개 학년 운영 중`;
}

function renderPageTitle() {
  const area  = document.getElementById('pageTitleArea');
  if (!area) return;
  const grade = state.currentGrade;

  if (grade === '전체') {
    const visibleSongs = state.isAdmin ? state.songs : state.songs.filter(s => !s.locked);
    const total    = visibleSongs.length;
    const chipsHtml = state.grades
      .filter(g => g !== '전체')
      .map(g => {
        const gradeSongs = state.songs.filter(s => s.grade === g);
        const cnt = (state.isAdmin ? gradeSongs : gradeSongs.filter(s => !s.locked)).length;
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
    const gradeSongs = state.songs.filter(s => s.grade === grade);
    const songs = state.isAdmin ? gradeSongs : gradeSongs.filter(s => !s.locked);
    const total = songs.length;

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
  if (!grid || !empty) return;

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
  card.style.animationDelay = `${idx * 0.03}s`;

  const isFileMedia = song.mediaType === 'file' || song.hasVideoFile;

  // 썸네일 엘리먼트 생성
  let thumbHtml = '';
  if (song.thumbnail) {
    thumbHtml = `<img class="card-thumb" src="${escapeHtml(song.thumbnail)}" alt="${escapeHtml(song.title)} 썸네일" loading="lazy" />`;
  } else {
    thumbHtml = `<div class="thumb-fallback"><img src="음표 아이콘.png" alt="" /><span>${isFileMedia ? '동영상 파일' : '썸네일 없음'}</span></div>`;
  }

  const sortedTags = sortTags(song.tags || []);
  const tagsHtml = !song.locked && sortedTags.length > 0
    ? sortedTags.map(t => {
        const c = getTagColor(t);
        return `<span class="card-tag" style="background:${c.bg};border-color:${c.border};color:${c.text}">#${escapeHtml(t)}</span>`;
      }).join('')
    : '';

  const gradeBadge = !song.locked
    ? `<span class="card-grade-badge">${escapeHtml(song.grade)}</span>`
    : '';

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

  const sourceBadgeHtml = isFileMedia
    ? `<span class="card-source-badge">
         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
         영상 파일
       </span>`
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
      ${sourceBadgeHtml}
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

  // 썸네일 이미지 로드 실패 시 안전 폴백
  const imgEl = card.querySelector('img.card-thumb');
  if (imgEl) {
    imgEl.addEventListener('error', () => {
      imgEl.outerHTML = `<div class="thumb-fallback"><img src="음표 아이콘.png" alt="" /><span>썸네일 없음</span></div>`;
    });
  }

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
    if (state.isAdmin) {
      openEditModal(song.id);
      return;
    }
    if (song.locked) {
      showToast('잠긴 과학송입니다 🔒', 'warn');
      return;
    }
    playSong(song);
  });

  return card;
}

// ══════════════════════════════════════════════════════
// 7. LOCK MANAGEMENT
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
// 8. GRADE NAVIGATION
// ══════════════════════════════════════════════════════
function selectGrade(grade) {
  state.currentGrade = grade;
  renderGradeTabs();
  renderPageTitle();
  renderCards();
}

// ══════════════════════════════════════════════════════
// 9. ADMIN AUTH
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
// 10. DRAG & DROP (SortableJS 안전 래핑)
// ══════════════════════════════════════════════════════
function setupSortable() {
  if (sortableInstance) { sortableInstance.destroy(); sortableInstance = null; }
  if (!state.isAdmin || state.sortBy !== 'default') return;
  if (typeof Sortable === 'undefined' || !Sortable || !Sortable.create) return;

  const grid = document.getElementById('cardsGrid');
  if (!grid) return;

  try {
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
  } catch(e) {}
}

// ══════════════════════════════════════════════════════
// 11. HYBRID PLAYER (YouTube & HTML5 Video)
// ══════════════════════════════════════════════════════
async function playSong(song) {
  if (state.isAdmin) return;
  if (song.locked) { showToast('잠긴 과학송입니다 🔒', 'warn'); return; }

  const youtubeIframe = document.getElementById('youtubeIframe');
  const videoPlayer   = document.getElementById('html5VideoPlayer');
  const isFileMedia   = song.mediaType === 'file' || song.hasVideoFile;

  if (currentVideoObjectUrl) {
    URL.revokeObjectURL(currentVideoObjectUrl);
    currentVideoObjectUrl = null;
  }

  if (isFileMedia) {
    // 📁 자체 업로드 동영상 재생 (광고 0% HTML5 플레이어)
    youtubeIframe.style.display = 'none';
    youtubeIframe.src = '';
    videoPlayer.style.display = 'block';

    const blob = await getVideoBlob(song.id);
    if (!blob) {
      showToast('이 기기에서 등록된 영상 파일을 찾을 수 없습니다.', 'error');
      return;
    }
    currentVideoObjectUrl = URL.createObjectURL(blob);
    videoPlayer.src = currentVideoObjectUrl;
    videoPlayer.play().catch(() => {});
  } else {
    // 🎬 YouTube 임베드 재생 (광고 최소화 도메인 적용)
    videoPlayer.pause();
    videoPlayer.src = '';
    videoPlayer.style.display = 'none';
    youtubeIframe.style.display = 'block';

    const videoId = song.videoId || extractVideoId(song.youtubeUrl);
    if (!videoId) {
      if (song.youtubeUrl) window.open(song.youtubeUrl, '_blank');
      else showToast('재생할 영상 정보가 없습니다.', 'error');
      return;
    }
    youtubeIframe.src = getYoutubeEmbedUrl(videoId);
  }

  document.getElementById('playerModalTitle').textContent = song.title;

  const sortedTags = sortTags(song.tags || []);
  const tagsHtml = sortedTags.map(t => {
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
  const youtubeIframe = document.getElementById('youtubeIframe');
  const videoPlayer   = document.getElementById('html5VideoPlayer');
  if (youtubeIframe) youtubeIframe.src = '';
  if (videoPlayer) {
    videoPlayer.pause();
    videoPlayer.src = '';
  }
  if (currentVideoObjectUrl) {
    URL.revokeObjectURL(currentVideoObjectUrl);
    currentVideoObjectUrl = null;
  }
  closeModal('playerModal');
}

// ══════════════════════════════════════════════════════
// 12. ADD / EDIT MODAL & MEDIA UPLOAD
// ══════════════════════════════════════════════════════
function setMediaType(type) {
  state.currentMediaType = type;
  document.getElementById('mediaTypeTabYoutube').classList.toggle('active', type === 'youtube');
  document.getElementById('mediaTypeTabFile').classList.toggle('active', type === 'file');
  document.getElementById('youtubeUrlGroup').style.display = (type === 'youtube' ? 'block' : 'none');
  document.getElementById('fileUploadGroup').style.display = (type === 'file' ? 'block' : 'none');
}

function openAddModal() {
  state.editingId          = null;
  state.currentTags        = [];
  state.selectedVideoFile  = null;
  state.selectedThumbData  = '';

  document.getElementById('songModalTitle').textContent      = '과학송 추가';
  document.getElementById('deleteSongBtn').style.display    = 'none';
  document.getElementById('songYoutubeUrl').value           = '';
  document.getElementById('songTitle').value                = '';
  document.getElementById('customYoutubeThumbUrl').value    = '';
  document.getElementById('selectedFileInfo').style.display = 'none';
  document.getElementById('thumbPreviewArea').style.display = 'none';
  document.getElementById('thumbPreviewImg').src            = '';

  setMediaType('youtube');
  renderTagList();
  populateGradeSelect();
  openModal('songModal');
  setTimeout(() => document.getElementById('songYoutubeUrl').focus(), 100);
}

function openEditModal(id) {
  const song = state.songs.find(s => s.id === id);
  if (!song) return;

  state.editingId          = id;
  state.currentTags        = [...(song.tags || [])];
  state.selectedVideoFile  = null;
  state.selectedThumbData  = song.thumbnail || '';

  document.getElementById('songModalTitle').textContent   = '과학송 편집';
  document.getElementById('deleteSongBtn').style.display = '';
  document.getElementById('songYoutubeUrl').value        = song.youtubeUrl || '';
  document.getElementById('songTitle').value             = song.title || '';
  document.getElementById('customYoutubeThumbUrl').value = '';

  const isFileMedia = song.mediaType === 'file' || song.hasVideoFile;
  setMediaType(isFileMedia ? 'file' : 'youtube');

  if (isFileMedia && song.videoFileName) {
    document.getElementById('selectedFileName').querySelector('span').textContent = song.videoFileName;
    document.getElementById('selectedFileSize').textContent = song.videoFileSize ? `(${song.videoFileSize})` : '';
    document.getElementById('selectedFileInfo').style.display = 'flex';
  } else {
    document.getElementById('selectedFileInfo').style.display = 'none';
  }

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

// ── 동영상 파일 선택 핸들러 & 썸네일 자동 캡처 ──
async function handleVideoFileSelect(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  state.selectedVideoFile = file;
  const fileName = file.name;
  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

  document.getElementById('selectedFileName').querySelector('span').textContent = fileName;
  document.getElementById('selectedFileSize').textContent = `(${fileSizeMb})`;
  document.getElementById('selectedFileInfo').style.display = 'flex';

  // 노래 제목 자동 채우기 (비어있는 경우 파일명에서 확장자 제거 후 적용)
  const titleInput = document.getElementById('songTitle');
  if (!titleInput.value.trim()) {
    titleInput.value = fileName.replace(/\.[^/.]+$/, '');
  }

  showToast('동영상 썸네일을 캡처하는 중...', '');
  const thumbData = await captureVideoFrame(file);
  if (thumbData) {
    state.selectedThumbData = thumbData;
    document.getElementById('thumbPreviewImg').src = thumbData;
    document.getElementById('thumbPreviewArea').style.display = '';
    showToast('영상 첫 프레임에서 썸네일을 자동 추출했습니다 ✓', 'success');
  }
}

function clearSelectedVideoFile() {
  state.selectedVideoFile = null;
  document.getElementById('videoFileInput').value = '';
  document.getElementById('selectedFileInfo').style.display = 'none';
}

function fetchCustomYoutubeThumb() {
  const url = document.getElementById('customYoutubeThumbUrl').value.trim();
  const videoId = extractVideoId(url);
  if (!videoId) {
    showToast('올바른 유튜브 링크를 입력해 주세요.', 'error');
    return;
  }
  const thumb = getYoutubeThumbnail(videoId);
  state.selectedThumbData = thumb;
  document.getElementById('thumbPreviewImg').src = thumb;
  document.getElementById('thumbPreviewArea').style.display = '';
  showToast('유튜브 썸네일을 가져왔습니다 ✓', 'success');
}

function fetchYoutubeThumbnail() {
  const url     = document.getElementById('songYoutubeUrl').value.trim();
  const videoId = extractVideoId(url);
  if (!videoId) { showToast('올바른 YouTube URL을 입력해 주세요.', 'error'); return; }
  const thumb = getYoutubeThumbnail(videoId);
  state.selectedThumbData = thumb;
  document.getElementById('thumbPreviewImg').src             = thumb;
  document.getElementById('thumbPreviewArea').style.display = '';
  showToast('썸네일을 가져왔습니다 ✓', 'success');
}

function clearThumbnail() {
  state.selectedThumbData = '';
  document.getElementById('thumbPreviewImg').src             = '';
  document.getElementById('thumbPreviewArea').style.display = 'none';
}

function setupYoutubeUrlAutoThumb() {
  const input = document.getElementById('songYoutubeUrl');
  if (!input) return;
  const updateThumb = () => {
    const url = input.value.trim();
    const videoId = extractVideoId(url);
    if (videoId) {
      const thumb = getYoutubeThumbnail(videoId);
      state.selectedThumbData = thumb;
      document.getElementById('thumbPreviewImg').src = thumb;
      document.getElementById('thumbPreviewArea').style.display = '';
    }
  };
  input.addEventListener('input', updateThumb);
  input.addEventListener('paste', () => setTimeout(updateThumb, 50));
}

// ── 과학송 저장 로직 ──
async function saveSong() {
  const title = document.getElementById('songTitle').value.trim();
  const grade = document.getElementById('songGrade').value;

  if (!title) { showToast('노래 제목을 입력해 주세요.', 'error'); return; }
  if (!grade) { showToast('학년을 선택해 주세요.', 'error'); return; }

  const isFileMode = state.currentMediaType === 'file';
  let url = '';
  let videoId = '';
  let videoFileName = '';
  let videoFileSize = '';

  if (isFileMode) {
    if (!state.editingId && !state.selectedVideoFile) {
      showToast('등록할 영상 파일을 선택해 주세요.', 'error');
      return;
    }
    if (state.selectedVideoFile) {
      videoFileName = state.selectedVideoFile.name;
      videoFileSize = (state.selectedVideoFile.size / (1024 * 1024)).toFixed(1) + ' MB';
    }
  } else {
    url = document.getElementById('songYoutubeUrl').value.trim();
    if (!url) { showToast('유튜브 URL을 입력해 주세요.', 'error'); return; }
    videoId = extractVideoId(url) || '';
  }

  const thumbSrc  = document.getElementById('thumbPreviewImg').src || state.selectedThumbData || '';
  const thumbnail = (thumbSrc && !thumbSrc.endsWith('undefined') && thumbSrc !== window.location.href)
    ? thumbSrc
    : (videoId ? getYoutubeThumbnail(videoId) : '');

  const processedTags = sortTags(state.currentTags);
  const songId = state.editingId || uid();

  if (isFileMode && state.selectedVideoFile) {
    await saveVideoBlob(songId, state.selectedVideoFile);
  }

  if (state.editingId) {
    const idx = state.songs.findIndex(s => s.id === state.editingId);
    if (idx !== -1) {
      const prev = state.songs[idx];
      state.songs[idx] = {
        ...prev,
        title,
        grade,
        mediaType: isFileMode ? 'file' : 'youtube',
        youtubeUrl: isFileMode ? '' : url,
        videoId: isFileMode ? '' : (videoId || prev.videoId),
        videoFileName: isFileMode ? (videoFileName || prev.videoFileName || '') : '',
        videoFileSize: isFileMode ? (videoFileSize || prev.videoFileSize || '') : '',
        hasVideoFile: isFileMode,
        thumbnail: thumbnail || prev.thumbnail || (videoId ? getYoutubeThumbnail(videoId) : ''),
        tags: processedTags
      };
    }
    showToast(`"${title}" 수정 완료 ✓`, 'success');
  } else {
    const maxOrder = state.songs.reduce((m, s) => Math.max(m, s.order ?? 0), -1);
    state.songs.push({
      id: songId,
      title,
      grade,
      mediaType: isFileMode ? 'file' : 'youtube',
      youtubeUrl: url,
      videoId,
      videoFileName,
      videoFileSize,
      hasVideoFile: isFileMode,
      thumbnail: thumbnail || (videoId ? getYoutubeThumbnail(videoId) : ''),
      tags: processedTags,
      order: maxOrder + 1,
      locked: false
    });
    showToast(`"${title}" 추가 완료 ✓`, 'success');
  }

  saveState();
  closeModal('songModal');
  renderAll();
}

async function deleteSong() {
  if (!state.editingId) return;
  if (!confirm('이 과학송을 삭제할까요?')) return;
  const targetId = state.editingId;
  state.songs = state.songs.filter(s => s.id !== targetId);
  await deleteVideoBlob(targetId);
  saveState();
  closeModal('songModal');
  renderAll();
  showToast('삭제되었습니다.', 'warn');
}

// ══════════════════════════════════════════════════════
// 13. TAG INPUT
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
// 14. GRADE MANAGEMENT
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
// 15. DATA & CLOUD MANAGEMENT
// ══════════════════════════════════════════════════════
function openDataModal() {
  const savedConfig = localStorage.getItem(FIREBASE_CONFIG_KEY);
  let activeConfig = DEFAULT_FIREBASE_CONFIG;
  if (savedConfig) {
    try { activeConfig = JSON.parse(savedConfig); } catch(e) {}
  }
  const configInput = document.getElementById('firebaseConfigInput');
  if (configInput) {
    configInput.value = JSON.stringify(activeConfig, null, 2);
  }
  updateCloudBadge(firestoreDb ? 'connected' : 'local');
  openModal('dataModal');
}

async function syncLocalToCloudNow() {
  if (!firestoreDb) {
    showToast('클라우드에 연결하는 중...', '');
    initFirebaseSync();
  }
  if (!firestoreDb) {
    showToast('클라우드 연결을 확인해 주세요.', 'error');
    return;
  }
  showToast('클라우드로 전체 데이터를 전송하는 중...', '');
  await saveToCloud({
    grades: state.grades,
    songs: state.songs,
    updatedAt: Date.now()
  });
  showToast('☁️ 현재 목록이 클라우드에 저장되었습니다! 이제 핸드폰이나 다른 기기에서도 똑같이 보입니다 ✓', 'success');
}

async function syncCloudToLocalNow() {
  if (!firestoreDb) {
    initFirebaseSync();
  }
  if (!firestoreDb) {
    showToast('클라우드 연결을 확인해 주세요.', 'error');
    return;
  }
  try {
    const doc = await firestoreDb.collection('archive').doc('main').get();
    if (doc.exists) {
      const remoteData = doc.data();
      if (remoteData && remoteData.songs && Array.isArray(remoteData.songs)) {
        state.songs = remoteData.songs.map((s, idx) => ({
          locked: false,
          order: s.order ?? idx,
          mediaType: s.mediaType || (s.videoId || s.youtubeUrl ? 'youtube' : 'file'),
          ...s
        }));
        if (remoteData.grades && Array.isArray(remoteData.grades)) {
          state.grades = remoteData.grades;
        }
        saveState(true);
        renderAll();
        showToast('🔄 클라우드에서 최신 데이터를 가져왔습니다 ✓', 'success');
      }
    } else {
      showToast('클라우드에 저장된 데이터가 없습니다.', 'warn');
    }
  } catch(e) {
    showToast('데이터 가져오기 오류: ' + e.message, 'error');
  }
}

function exportDataJson() {
  const data = {
    grades: state.grades,
    songs: state.songs,
    exportedAt: new Date().toISOString(),
    version: '2.2'
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `science_songs_backup_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('백업 JSON 파일이 다운로드되었습니다 ✓', 'success');
}

function copyDataJson() {
  const data = {
    grades: state.grades,
    songs: state.songs,
    exportedAt: new Date().toISOString(),
    version: '2.2'
  };
  const jsonStr = JSON.stringify(data, null, 2);
  navigator.clipboard.writeText(jsonStr).then(() => {
    showToast('전체 데이터가 클립보드에 복사되었습니다 ✓', 'success');
  }).catch(() => {
    showToast('복사에 실패했습니다.', 'error');
  });
}

function togglePasteImportArea() {
  const area = document.getElementById('pasteImportArea');
  if (!area) return;
  area.style.display = area.style.display === 'none' ? 'block' : 'none';
  if (area.style.display === 'block') {
    document.getElementById('importJsonText').focus();
  }
}

function importDataFromFile(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      applyImportedData(parsed);
      e.target.value = '';
    } catch(err) {
      showToast('올바른 JSON 파일 형식이 아닙니다.', 'error');
    }
  };
  reader.readAsText(file);
}

function importDataFromText() {
  const text = document.getElementById('importJsonText').value.trim();
  if (!text) {
    showToast('JSON 텍스트를 입력해 주세요.', 'error');
    return;
  }
  try {
    const parsed = JSON.parse(text);
    applyImportedData(parsed);
    document.getElementById('importJsonText').value = '';
    document.getElementById('pasteImportArea').style.display = 'none';
  } catch(err) {
    showToast('올바른 JSON 형식이 아닙니다.', 'error');
  }
}

function applyImportedData(data) {
  let importedSongs = [];
  let importedGrades = null;

  if (Array.isArray(data)) {
    importedSongs = data;
  } else if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data.songs)) importedSongs = data.songs;
    if (Array.isArray(data.grades)) importedGrades = data.grades;
  }

  if (importedSongs.length === 0) {
    showToast('가져올 과학송 데이터가 없습니다.', 'error');
    return;
  }

  state.songs = importedSongs.map((s, idx) => ({
    id: s.id || uid(),
    title: s.title || '제목 없음',
    grade: s.grade || '중1',
    mediaType: s.mediaType || (s.videoId || s.youtubeUrl ? 'youtube' : 'file'),
    youtubeUrl: s.youtubeUrl || '',
    videoId: s.videoId || extractVideoId(s.youtubeUrl) || '',
    videoFileName: s.videoFileName || '',
    videoFileSize: s.videoFileSize || '',
    hasVideoFile: !!s.hasVideoFile,
    thumbnail: s.thumbnail || (s.videoId ? getYoutubeThumbnail(s.videoId) : ''),
    tags: Array.isArray(s.tags) ? s.tags : [],
    order: s.order ?? idx,
    locked: !!s.locked
  }));

  if (importedGrades && importedGrades.length > 0) {
    state.grades = importedGrades.includes('전체') ? importedGrades : ['전체', ...importedGrades];
  }

  saveState();
  renderAll();
  showToast(`총 ${state.songs.length}개 과학송을 성공적으로 불러왔습니다 ✓`, 'success');
  closeModal('dataModal');
}

function resetToDefaultData() {
  if (!confirm('정말 기본 예시 데이터로 초기화할까요?\n수정하거나 추가한 모든 데이터가 처음 상태로 되돌아갑니다.')) return;
  state.grades = [...DEFAULT_GRADES];
  state.songs  = DEFAULT_SONGS.map(s => ({ ...s, locked: false }));
  saveState();
  renderAll();
  showToast('기본 데이터로 초기화되었습니다.', 'warn');
  closeModal('dataModal');
}

function saveFirebaseConfig() {
  const input = document.getElementById('firebaseConfigInput').value.trim();
  if (!input) {
    showToast('Firebase 설정을 입력해 주세요.', 'error');
    return;
  }
  try {
    let configObj = null;
    if (input.startsWith('{')) {
      configObj = JSON.parse(input);
    } else {
      configObj = new Function(`return (${input});`)();
    }
    if (!configObj || !configObj.projectId) {
      showToast('올바른 Firebase 설정(projectId 필수)을 입력해 주세요.', 'error');
      return;
    }
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(configObj));
    initFirebaseSync();
    saveToCloud({ grades: state.grades, songs: state.songs, updatedAt: Date.now() });
    showToast('Firebase 클라우드 연동 성공! 실시간 동기화가 활성화되었습니다 ✓', 'success');
  } catch(e) {
    showToast('설정 파싱 오류: 올바른 JSON 또는 객체 형식인지 확인해 주세요.', 'error');
  }
}

function clearFirebaseConfig() {
  if (!confirm('Firebase 클라우드 연결을 해제할까요?')) return;
  localStorage.removeItem(FIREBASE_CONFIG_KEY);
  if (firestoreUnsubscribe) {
    firestoreUnsubscribe();
    firestoreUnsubscribe = null;
  }
  firestoreDb = null;
  document.getElementById('firebaseConfigInput').value = '';
  updateCloudBadge('local');
  showToast('클라우드 연결이 해제되었습니다. 로컬 저장소 모드로 동작합니다.');
}

// ── 파일 드래그 앤 드롭 리스너 ──
function setupFileDropzone() {
  const dropzone = document.getElementById('fileDropzone');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      handleVideoFileSelect({ target: { files } });
    }
  });
}

// ══════════════════════════════════════════════════════
// 16. MODAL HELPERS
// ══════════════════════════════════════════════════════
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
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
  ['adminLoginModal', 'songModal', 'gradeModal', 'dataModal'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.style.display !== 'none') closeModal(id);
  });
});

// ══════════════════════════════════════════════════════
// 17. TOAST
// ══════════════════════════════════════════════════════
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
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
// 18. RENDER ALL & INIT (새로고침 안전 가드)
// ══════════════════════════════════════════════════════
function renderAll() {
  try {
    renderGradeTabs();
    renderSidebarStats();
    renderPageTitle();
    renderCards();
  } catch(err) {
    console.error('렌더링 중 오류 발생:', err);
  }
}

function init() {
  try {
    loadState();
    setupYoutubeUrlAutoThumb();
    setupFileDropzone();
    initFirebaseSync();
  } catch(e) {
    console.warn('초기화 단계 경고:', e);
  } finally {
    renderAll();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}