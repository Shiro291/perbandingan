'use strict';

// --- Data & Storage --------------------------------------------------------
const STORAGE_KEY = 'prosedur.bank';
const RESULT_KEY = 'prosedur.results';

const builtinProcedures = [
  {
    id: 'nasi-goreng',
    title: 'Memasak Nasi Goreng',
    steps: [
      'Siapkan bahan: nasi, telur, bawang, kecap, garam',
      'Panaskan minyak di wajan',
      'Tumis bawang hingga harum',
      'Masukkan telur, orak-arik hingga matang',
      'Masukkan nasi, aduk rata',
      'Tambahkan kecap dan garam, aduk hingga merata',
      'Cicipi dan sajikan hangat'
    ]
  },
  {
    id: 'teh-manis',
    title: 'Membuat Teh Manis',
    steps: [
      'Rebus air hingga mendidih',
      'Masukkan teh celup ke dalam gelas',
      'Tuang air panas ke gelas',
      'Tambahkan gula sesuai selera',
      'Aduk hingga gula larut',
      'Sajikan'
    ]
  },
  {
    id: 'menyikat-gigi',
    title: 'Menyikat Gigi',
    steps: [
      'Basahi sikat gigi',
      'Letakkan pasta gigi pada sikat',
      'Sikat gigi bagian luar dan dalam',
      'Sikat gigi bagian atas (permukaan kunyah)',
      'Berkumur hingga bersih'
    ]
  }
];

function loadProcedures() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const localList = raw ? JSON.parse(raw) : [];
    // Merge by id: local overrides builtin
    const map = new Map(builtinProcedures.map(p => [p.id, p]));
    for (const p of localList) map.set(p.id, p);
    return Array.from(map.values());
  } catch (e) {
    console.warn('Failed to load procedures, fallback to builtin', e);
    return [...builtinProcedures];
  }
}

function saveProcedures(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function logResult(entry) {
  const list = loadResults();
  list.push(entry);
  localStorage.setItem(RESULT_KEY, JSON.stringify(list));
}

function loadResults() {
  try {
    const raw = localStorage.getItem(RESULT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function exportResultsCsv() {
  const list = loadResults();
  if (!list.length) { alert('Belum ada hasil.'); return; }
  const headers = ['timestamp','procedureId','procedureTitle','total','correct'];
  const rows = [headers.join(',')];
  for (const r of list) {
    rows.push([
      new Date(r.timestamp).toISOString(),
      csvEscape(r.procedureId),
      csvEscape(r.procedureTitle),
      r.total,
      r.correct
    ].join(','));
  }
  const blob = new Blob([rows.join('\n')], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hasil_prosedur.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function csvEscape(s) {
  if (s == null) return '';
  const str = String(s);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// --- UI State --------------------------------------------------------------
let procedures = loadProcedures();
let selected = null; // selected procedure object
let currentOrder = []; // current shuffled order (array of strings)
let sortable = null;

// --- DOM Refs --------------------------------------------------------------
const viewHome = document.getElementById('viewHome');
const viewGame = document.getElementById('viewGame');
const viewEditor = document.getElementById('viewEditor');

const navHome = document.getElementById('navHome');
const navEditor = document.getElementById('navEditor');

const procedureSelect = document.getElementById('procedureSelect');
const startBtn = document.getElementById('startBtn');

const gameTitle = document.getElementById('gameTitle');
const scoreBox = document.getElementById('scoreBox');
const stepList = document.getElementById('stepList');
const checkBtn = document.getElementById('checkBtn');
const reshuffleBtn = document.getElementById('reshuffleBtn');
const backHomeBtn = document.getElementById('backHomeBtn');
const feedback = document.getElementById('feedback');

const procTitle = document.getElementById('procTitle');
const procSteps = document.getElementById('procSteps');
const saveProcBtn = document.getElementById('saveProcBtn');
const clearFormBtn = document.getElementById('clearFormBtn');
const savedList = document.getElementById('savedList');

const exportJsonBtn = document.getElementById('exportJsonBtn');
const importJsonInput = document.getElementById('importJsonInput');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const backHomeBtn2 = document.getElementById('backHomeBtn2');

// --- Init ------------------------------------------------------------------
renderHome();
attachNav();
attachGameHandlers();
attachEditorHandlers();

// --- Navigation ------------------------------------------------------------
function show(view) {
  for (const v of [viewHome, viewGame, viewEditor]) v.classList.add('hidden');
  view.classList.remove('hidden');
}

function attachNav() {
  navHome.addEventListener('click', () => show(viewHome));
  navEditor.addEventListener('click', () => { renderEditor(); show(viewEditor); });
}

// --- Home ------------------------------------------------------------------
function renderHome() {
  // refresh procedures from storage
  procedures = loadProcedures();
  procedureSelect.innerHTML = '';
  for (const p of procedures) {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.title;
    procedureSelect.appendChild(opt);
  }
}

startBtn.addEventListener('click', () => {
  const id = procedureSelect.value;
  selected = procedures.find(p => p.id === id) || procedures[0];
  startGame();
});

// --- Game ------------------------------------------------------------------
function attachGameHandlers() {
  checkBtn.addEventListener('click', onCheck);
  reshuffleBtn.addEventListener('click', () => {
    currentOrder = shuffle([...selected.steps]);
    renderStepList();
    feedback.textContent = '';
    scoreBox.textContent = 'Skor: 0';
  });
  backHomeBtn.addEventListener('click', () => show(viewHome));
}

function startGame() {
  if (!selected) return;
  gameTitle.textContent = selected.title;
  currentOrder = shuffle([...selected.steps]);
  renderStepList();
  feedback.textContent = '';
  scoreBox.textContent = 'Skor: 0';
  show(viewGame);
}

function renderStepList() {
  stepList.innerHTML = '';
  currentOrder.forEach((text) => {
    const li = document.createElement('li');
    const handle = document.createElement('span');
    handle.className = 'handle';
    handle.textContent = '≡';
    const span = document.createElement('span');
    span.className = 'text';
    span.textContent = text;
    li.appendChild(handle);
    li.appendChild(span);
    stepList.appendChild(li);
  });

  if (sortable) sortable.destroy();
  sortable = Sortable.create(stepList, {
    animation: 150,
    handle: '.handle',
  });
}

function onCheck() {
  const items = [...stepList.querySelectorAll('li')];
  const current = items.map(li => li.querySelector('.text').textContent);
  let correct = 0;
  items.forEach((li, idx) => {
    const expected = normalize(selected.steps[idx]);
    const got = normalize(current[idx]);
    li.classList.remove('correct','wrong');
    if (expected === got) {
      li.classList.add('correct');
      correct++;
    } else {
      li.classList.add('wrong');
    }
  });
  scoreBox.textContent = `Skor: ${correct}/${selected.steps.length}`;
  if (correct === selected.steps.length) {
    feedback.textContent = 'Mantap! Semua benar.';
    fireConfetti();
  } else {
    feedback.textContent = 'Ada yang belum pas. Coba sesuaikan lagi.';
  }
  // log result
  logResult({
    timestamp: Date.now(),
    procedureId: selected.id,
    procedureTitle: selected.title,
    total: selected.steps.length,
    correct
  });
}

// --- Editor ----------------------------------------------------------------
function attachEditorHandlers() {
  saveProcBtn.addEventListener('click', onSaveProcedure);
  clearFormBtn.addEventListener('click', () => { procTitle.value = ''; procSteps.value=''; });
  exportJsonBtn.addEventListener('click', onExportJson);
  importJsonInput.addEventListener('change', onImportJson);
  exportCsvBtn.addEventListener('click', exportResultsCsv);
  backHomeBtn2.addEventListener('click', () => show(viewHome));
}

function renderEditor() {
  // list saved (local only)
  const raw = localStorage.getItem(STORAGE_KEY);
  const localList = raw ? JSON.parse(raw) : [];
  savedList.innerHTML = '';
  if (!localList.length) {
    const li = document.createElement('li');
    li.textContent = 'Belum ada prosedur tersimpan.';
    savedList.appendChild(li);
  } else {
    localList.forEach(p => {
      const li = document.createElement('li');
      const title = document.createElement('span');
      title.className = 'title';
      title.textContent = p.title;
      const useBtn = document.createElement('button');
      useBtn.className = 'secondary';
      useBtn.textContent = 'Pakai';
      useBtn.addEventListener('click', () => {
        // ensure appears in dropdown by merging
        const merged = mergeLocalWithBuiltin();
        saveProcedures(merged); // store merged as local for simplicity
        renderHome();
        procedureSelect.value = p.id;
        show(viewHome);
      });
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Hapus';
      delBtn.addEventListener('click', () => {
        const filtered = localList.filter(x => x.id !== p.id);
        saveProcedures(filtered);
        renderEditor();
        renderHome();
      });
      li.appendChild(title);
      li.appendChild(useBtn);
      li.appendChild(delBtn);
      savedList.appendChild(li);
    });
  }
}

function onSaveProcedure() {
  const title = procTitle.value.trim();
  const steps = procSteps.value.split('\n').map(s => s.trim()).filter(Boolean);
  if (!title) { alert('Judul tidak boleh kosong.'); return; }
  if (steps.length < 3) { alert('Minimal 3 langkah.'); return; }
  if (hasDuplicate(steps.map(normalize))) {
    if (!confirm('Ada langkah duplikat setelah normalisasi. Lanjutkan?')) return;
  }
  const id = slugify(title);
  const raw = localStorage.getItem(STORAGE_KEY);
  const localList = raw ? JSON.parse(raw) : [];
  const existingIdx = localList.findIndex(p => p.id === id);
  const item = { id, title, steps };
  if (existingIdx >= 0) localList[existingIdx] = item; else localList.push(item);
  saveProcedures(localList);
  procTitle.value = '';
  procSteps.value = '';
  renderEditor();
  renderHome();
  alert('Disimpan.');
}

function onExportJson() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const localList = raw ? JSON.parse(raw) : [];
  const blob = new Blob([JSON.stringify(localList, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'prosedur_local.json';
  a.click();
  URL.revokeObjectURL(url);
}

function onImportJson(evt) {
  const file = evt.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const arr = JSON.parse(reader.result);
      if (!Array.isArray(arr)) throw new Error('Format JSON harus array.');
      // validate minimal shape
      const cleaned = arr.map(x => ({
        id: x.id || slugify(String(x.title||'untitled')),
        title: String(x.title||'Tanpa Judul'),
        steps: Array.isArray(x.steps) ? x.steps.map(s => String(s||'').trim()).filter(Boolean) : []
      })).filter(p => p.title && p.steps.length >= 3);
      saveProcedures(cleaned);
      renderEditor();
      renderHome();
      alert('Import berhasil.');
    } catch (e) {
      console.error(e);
      alert('Gagal import JSON.');
    }
  };
  reader.readAsText(file);
  // reset input
  evt.target.value = '';
}

function mergeLocalWithBuiltin() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const localList = raw ? JSON.parse(raw) : [];
  const map = new Map(builtinProcedures.map(p => [p.id, p]));
  for (const p of localList) map.set(p.id, p);
  return Array.from(map.values());
}

// --- Utils -----------------------------------------------------------------
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalize(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g, ' ');
}

function hasDuplicate(arr) {
  const set = new Set();
  for (const x of arr) {
    if (set.has(x)) return true;
    set.add(x);
  }
  return false;
}

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function fireConfetti() {
  try {
    if (typeof confetti !== 'function') return;
    // try emoji shape if supported
    let shapes = [];
    if (confetti.shapeFromText) {
      const scalar = 2;
      const star = confetti.shapeFromText({ text: '⭐', scalar });
      const clap = confetti.shapeFromText({ text: '👏', scalar });
      shapes = [star, clap];
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, shapes, scalar });
    } else {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  } catch (_) { /* no-op */ }
}
