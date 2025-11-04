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
    ],
    match: {
      items: [
        { id: 'air', label: 'Air', type: 'bahan', emoji: '💧' },
        { id: 'pasta', label: 'Pasta gigi', type: 'bahan', emoji: '🪥' },
        { id: 'sikat', label: 'Sikat gigi', type: 'alat', emoji: '🪥' },
        { id: 'gelas', label: 'Gelas kumur', type: 'alat', emoji: '🥤' }
      ],
      pairs: [
        { itemId: 'sikat', stepIndex: 1 },
        { itemId: 'pasta', stepIndex: 1 },
        { itemId: 'air', stepIndex: 4 },
        { itemId: 'gelas', stepIndex: 4 }
      ]
    },
    fillin: {
      text: 'Basahi [[alat]] lalu beri [[bahan]] secukupnya, gosok gigi hingga bersih lalu [[aksi]].',
      answers: {
        alat: ['sikat', 'sikat gigi'],
        bahan: ['pasta', 'pasta gigi'],
        aksi: ['berkumur', 'kumur']
      },
      tolerance: 1
    }
  },
  {
    id: 'pesawat-kertas',
    title: 'Menyusun Pesawat Kertas',
    steps: [
      'Lipat kertas menjadi dua memanjang',
      'Buka kembali dan lipat sudut atas ke garis tengah',
      'Lipat lagi kedua sisi ke garis tengah',
      'Lipat sepanjang garis tengah menutup sayap',
      'Lipat sayap ke bawah di kedua sisi',
      'Rapikan dan terbangkan'
    ],
    match: {
      items: [
        { id: 'kertas', label: 'Kertas A4', type: 'bahan', emoji: '📄' }
      ],
      pairs: [ { itemId: 'kertas', stepIndex: 0 } ]
    },
    fillin: {
      text: 'Gunakan [[bahan]] dan lipat menjadi [[jumlah]] bagian sayap.',
      answers: { bahan: ['kertas', 'kertas a4'], jumlah: ['2', 'dua'] },
      tolerance: 1
    }
  },
  {
    id: 'mencuci-tangan',
    title: 'Mencuci Tangan yang Benar',
    steps: [
      'Basahi tangan dengan air',
      'Gunakan sabun dan gosok telapak tangan',
      'Gosok punggung tangan dan sela-sela jari',
      'Gosok kuku di telapak tangan',
      'Bilas hingga bersih',
      'Keringkan dengan tisu/handuk'
    ],
    match: {
      items: [
        { id: 'air2', label: 'Air', type: 'bahan', emoji: '💧' },
        { id: 'sabun', label: 'Sabun', type: 'bahan', emoji: '🧼' },
        { id: 'tisu', label: 'Tisu', type: 'alat', emoji: '🧻' }
      ],
      pairs: [
        { itemId: 'air2', stepIndex: 0 },
        { itemId: 'sabun', stepIndex: 1 },
        { itemId: 'tisu', stepIndex: 5 }
      ]
    },
    fillin: {
      text: 'Gosok tangan minimal [[durasi]] detik sebelum dibilas.',
      answers: { durasi: ['20', 'dua puluh'] },
      tolerance: 1
    }
  },
  {
    id: 'menyalakan-komputer',
    title: 'Menyalakan Komputer dengan Aman',
    steps: [
      'Pastikan kabel daya terpasang',
      'Tekan tombol power pada CPU/laptop',
      'Tunggu sistem menyala',
      'Masuk ke sistem dengan akun',
      'Siap digunakan'
    ],
    match: {
      items: [
        { id: 'kabel', label: 'Kabel daya', type: 'alat', emoji: '🔌' },
        { id: 'mouse', label: 'Mouse', type: 'alat', emoji: '🖱️' }
      ],
      pairs: [ { itemId: 'kabel', stepIndex: 0 } ]
    },
    fillin: {
      text: 'Tekan tombol [[nama]] untuk menyalakan perangkat.',
      answers: { nama: ['power'] },
      tolerance: 1
    }
  },
  {
    id: 'email-formal',
    title: 'Mengirim Email Formal Sederhana',
    steps: [
      'Buka aplikasi email',
      'Klik Tulis/Compose',
      'Isi alamat penerima',
      'Tulis subjek yang jelas',
      'Tulis isi pesan dengan salam dan penutup',
      'Kirim'
    ],
    fillin: {
      text: 'Gunakan bahasa [[gaya]] dan tulis [[bagian]] yang jelas.',
      answers: { gaya: ['formal', 'baku'], bagian: ['subjek', 'subject'] },
      tolerance: 2
    }
  },
  {
    id: 'gunung-berapi-mini',
    title: 'Eksperimen Gunung Berapi Mini',
    steps: [
      'Siapkan botol kecil dan nampan',
      'Masukkan soda kue ke botol',
      'Campur cuka dengan pewarna makanan',
      'Tuang campuran cuka ke botol',
      'Amati reaksi'
    ],
    match: {
      items: [
        { id: 'soda', label: 'Soda kue', type: 'bahan', emoji: '🧂' },
        { id: 'cuka', label: 'Cuka', type: 'bahan', emoji: '🧪' },
        { id: 'pewarna', label: 'Pewarna', type: 'bahan', emoji: '🎨' },
        { id: 'botol', label: 'Botol kecil', type: 'alat', emoji: '🧴' }
      ],
      pairs: [
        { itemId: 'botol', stepIndex: 0 },
        { itemId: 'soda', stepIndex: 1 },
        { itemId: 'cuka', stepIndex: 3 },
        { itemId: 'pewarna', stepIndex: 2 }
      ]
    }
  },
  {
    id: 'menyapu-lantai',
    title: 'Menyapu Lantai',
    steps: [
      'Siapkan sapu dan pengki',
      'Sapu dari sudut ke arah tengah',
      'Kumpulkan kotoran dengan pengki',
      'Buang ke tempat sampah'
    ],
    match: {
      items: [
        { id: 'sapu', label: 'Sapu', type: 'alat', emoji: '🧹' },
        { id: 'pengki', label: 'Pengki', type: 'alat', emoji: '🧹' },
        { id: 'tempat', label: 'Tempat sampah', type: 'alat', emoji: '🗑️' }
      ],
      pairs: [
        { itemId: 'sapu', stepIndex: 1 },
        { itemId: 'pengki', stepIndex: 2 },
        { itemId: 'tempat', stepIndex: 3 }
      ]
    }
  },
  {
    id: 'folder-file',
    title: 'Membuat Folder dan Menyalin File',
    steps: [
      'Buka File Explorer',
      'Klik kanan dan pilih Folder Baru',
      'Beri nama folder',
      'Pilih file sumber',
      'Salin dan tempel ke folder baru'
    ],
    fillin: {
      text: 'Klik [[menu]] untuk membuat folder baru.',
      answers: { menu: ['kanan', 'klik kanan', 'right click'] },
      tolerance: 2
    }
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
let selectedMode = 'order'; // 'order' | 'match' | 'fillin'
let currentOrder = []; // current shuffled order (array of strings)
let sortable = null;
let matchAssignments = new Map(); // stepIndex -> itemId[]

// --- DOM Refs --------------------------------------------------------------
const viewHome = document.getElementById('viewHome');
const viewGame = document.getElementById('viewGame');
const viewEditor = document.getElementById('viewEditor');

const navHome = document.getElementById('navHome');
const navEditor = document.getElementById('navEditor');

const procedureSelect = document.getElementById('procedureSelect');
const modeRadios = document.querySelectorAll('input[name="mode"]');
const startBtn = document.getElementById('startBtn');

const gameTitle = document.getElementById('gameTitle');
const scoreBox = document.getElementById('scoreBox');
const stepList = document.getElementById('stepList');
const checkBtn = document.getElementById('checkBtn');
const reshuffleBtn = document.getElementById('reshuffleBtn');
const backHomeBtn = document.getElementById('backHomeBtn');
const feedback = document.getElementById('feedback');
const matchArea = document.getElementById('matchArea');
const matchPalette = document.getElementById('matchPalette');
const matchSteps = document.getElementById('matchSteps');
const fillinArea = document.getElementById('fillinArea');
const fillinText = document.getElementById('fillinText');

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
// reflect mode changes
modeRadios.forEach(r => r.addEventListener('change', () => { selectedMode = getSelectedMode(); }));

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
  selectedMode = getSelectedMode();
  startGame();
});

// --- Game ------------------------------------------------------------------
function attachGameHandlers() {
  checkBtn.addEventListener('click', onCheck);
  reshuffleBtn.addEventListener('click', () => {
    if (selectedMode === 'order') {
      currentOrder = shuffle([...selected.steps]);
      renderStepList();
    } else if (selectedMode === 'match') {
      renderMatch();
    } else if (selectedMode === 'fillin') {
      renderFillin();
    }
    feedback.textContent = '';
    scoreBox.textContent = 'Skor: 0';
  });
  backHomeBtn.addEventListener('click', () => show(viewHome));
}

function startGame() {
  if (!selected) return;
  gameTitle.textContent = selected.title;
  stepList.classList.add('hidden');
  matchArea.classList.add('hidden');
  fillinArea.classList.add('hidden');
  if (selectedMode === 'order') {
    currentOrder = shuffle([...selected.steps]);
    renderStepList();
    stepList.classList.remove('hidden');
  } else if (selectedMode === 'match') {
    renderMatch();
    matchArea.classList.remove('hidden');
  } else if (selectedMode === 'fillin') {
    renderFillin();
    fillinArea.classList.remove('hidden');
  }
  feedback.textContent = '';
  scoreBox.textContent = 'Skor: 0';
  show(viewGame);
}

function getSelectedMode() {
  const r = document.querySelector('input[name="mode"]:checked');
  return r ? r.value : 'order';
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
  if (selectedMode === 'order') return onCheckOrder();
  if (selectedMode === 'match') return onCheckMatch();
  if (selectedMode === 'fillin') return onCheckFillin();
}

function onCheckOrder() {
  const items = [...stepList.querySelectorAll('li')];
  const current = items.map(li => li.querySelector('.text').textContent);
  let correct = 0;
  items.forEach((li, idx) => {
    const expected = normalize(selected.steps[idx]);
    const got = normalize(current[idx]);
    li.classList.remove('correct','wrong');
    if (expected === got) { li.classList.add('correct'); correct++; }
    else { li.classList.add('wrong'); }
  });
  scoreBox.textContent = `Skor: ${correct}/${selected.steps.length}`;
  finalizeCheck(correct, selected.steps.length);
}

// --- Matching mode --------------------------------------------------------
function renderMatch() {
  // reset
  matchAssignments = new Map();
  matchPalette.innerHTML = '';
  matchSteps.innerHTML = '';
  const cfg = selected.match || { items: [], pairs: [] };
  const items = shuffle([...(cfg.items || [])]);
  const totalSteps = selected.steps.length;

  // palette chips
      items.forEach(it => {
    const chip = document.createElement('div');
        chip.className = `chip ${it.type}`;
        chip.textContent = `${it.emoji ? it.emoji + ' ' : ''}${it.label}`;
    chip.dataset.itemId = it.id;
    chip.dataset.type = it.type;
    matchPalette.appendChild(chip);
  });

  // steps as dropzones
  for (let i = 0; i < totalSteps; i++) {
    const box = document.createElement('div');
    box.className = 'dropstep';
    box.dataset.stepIndex = String(i);
    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = `${i+1}. ${selected.steps[i]}`;
    const slot = document.createElement('div');
    slot.className = 'slot';
    box.appendChild(title);
    box.appendChild(slot);
    matchSteps.appendChild(box);
  }

  // Interact.js setup
  if (window.interact) {
    interact('.chip').draggable({
      inertia: true,
      autoScroll: true,
      listeners: {
        move (event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
        end (event) {
          // If not dropped, snap back
          if (!event.dropzone) {
            event.target.style.transform = 'translate(0px, 0px)';
            event.target.removeAttribute('data-x');
            event.target.removeAttribute('data-y');
          }
        }
      }
    });

    interact('.dropstep').dropzone({
      accept: '.chip',
      overlap: 0.3,
      ondragenter (event) { event.target.classList.add('dropzone-active'); },
      ondragleave (event) { event.target.classList.remove('dropzone-active'); },
      ondrop (event) {
        const stepIndex = Number(event.target.dataset.stepIndex);
        const chip = event.relatedTarget;
        // move chip visually into slot
        chip.style.transform = 'translate(0px, 0px)';
        chip.removeAttribute('data-x');
        chip.removeAttribute('data-y');
        event.target.querySelector('.slot').appendChild(chip);
        // record assignment (allow multiple items per step)
        const prev = matchAssignments.get(stepIndex) || [];
        const id = chip.dataset.itemId;
        if (!prev.includes(id)) prev.push(id);
        matchAssignments.set(stepIndex, prev);
      },
      ondropdeactivate (event) { event.target.classList.remove('dropzone-active'); }
    });
  }
}

function onCheckMatch() {
  const cfg = selected.match || { items: [], pairs: [] };
  const expectedPairs = cfg.pairs || [];
  let correct = 0;
  // Build map stepIndex -> expected itemIds
  const expectedMap = new Map();
  expectedPairs.forEach(p => {
    const arr = expectedMap.get(p.stepIndex) || []; arr.push(p.itemId); expectedMap.set(p.stepIndex, arr);
  });
  // compare assignments
  for (let i = 0; i < selected.steps.length; i++) {
    const box = matchSteps.querySelector(`.dropstep[data-step-index="${i}"]`);
    box.classList.remove('drop-ok','drop-bad');
    const expected = (expectedMap.get(i) || []).sort();
    const got = (matchAssignments.get(i) || []).slice().sort();
    if (expected.length && arraysEqual(expected, got)) {
      correct++;
      box.classList.add('drop-ok');
    } else if (expected.length) {
      box.classList.add('drop-bad');
    }
  }
  const totalConsidered = expectedMap.size; // steps that have expected items
  scoreBox.textContent = `Skor: ${correct}/${totalConsidered || selected.steps.length}`;
  finalizeCheck(correct, totalConsidered || selected.steps.length);
}

// --- Fill-in mode ---------------------------------------------------------
function renderFillin() {
  fillinText.innerHTML = '';
  const cfg = selected.fillin || { text: '', answers: {}, tolerance: 1 };
  const html = (cfg.text || '').replace(/\[\[(.+?)\]\]/g, (m, key) => {
    const k = key.trim();
    return `<input type="text" data-key="${escapeHtml(k)}" placeholder="…" />`;
  });
  const p = document.createElement('p');
  p.className = 'fillin-text';
  p.innerHTML = html;
  fillinText.appendChild(p);
}

function onCheckFillin() {
  const cfg = selected.fillin || { text: '', answers: {}, tolerance: 1 };
  const inputs = [...fillinText.querySelectorAll('input[data-key]')];
  let correct = 0;
  inputs.forEach(inp => {
    const key = inp.dataset.key;
    const acceptable = (cfg.answers?.[key] || []).map(normalize);
    const tol = Number(cfg.tolerance || 1);
    const val = normalize(inp.value || '');
    inp.classList.remove('correct','wrong');
    if (acceptable.length === 0) { return; }
    if (acceptable.includes(val)) { inp.classList.add('correct'); correct++; return; }
    // tolerant
    const isClose = acceptable.some(ans => levenshtein(ans, val) <= tol);
    if (isClose) { inp.classList.add('correct'); correct++; }
    else inp.classList.add('wrong');
  });
  scoreBox.textContent = `Skor: ${correct}/${inputs.length || 1}`;
  finalizeCheck(correct, inputs.length || 1);
}

function finalizeCheck(correct, total) {
  if (correct === total && total > 0) {
    feedback.textContent = 'Mantap! Semua benar.';
    fireConfetti();
    playSuccess();
  } else {
    feedback.textContent = 'Ada yang belum pas. Coba sesuaikan lagi.';
    playError();
  }
  logResult({ timestamp: Date.now(), procedureId: selected.id, procedureTitle: selected.title, total, correct });
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

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Small Levenshtein implementation
function levenshtein(a, b) {
  if (a === b) return 0;
  const al = a.length, bl = b.length;
  if (al === 0) return bl; if (bl === 0) return al;
  const dp = new Array(bl + 1);
  for (let j = 0; j <= bl; j++) dp[j] = j;
  for (let i = 1; i <= al; i++) {
    let prev = i - 1; // dp[i-1][j-1]
    dp[0] = i;
    for (let j = 1; j <= bl; j++) {
      const temp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(
        dp[j] + 1,      // deletion
        dp[j - 1] + 1,  // insertion
        prev + cost     // substitution
      );
      prev = temp;
    }
  }
  return dp[bl];
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

// --- Sound (Web Audio, no extra files) ------------------------------------
let audioCtx;
function getAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  return audioCtx;
}

function playTone(freq = 440, duration = 0.15, type = 'sine', gain = 0.05) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g).connect(ctx.destination);
  osc.start();
  setTimeout(() => { osc.stop(); }, duration * 1000);
}

function playSuccess() {
  // simple two-note chime
  playTone(660, 0.12, 'sine', 0.05);
  setTimeout(() => playTone(880, 0.12, 'sine', 0.05), 120);
}

function playError() {
  // short low buzz
  playTone(200, 0.12, 'square', 0.04);
}
