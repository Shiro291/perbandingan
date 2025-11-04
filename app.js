'use strict';

// State & config
const state = {
  mode: 'compare', // 'compare' | 'order' | 'mix'
  total: 10,
  showVisual: true,
  visualStyle: 'auto', // 'auto' | 'bar' | 'circle' | 'both'
  showHints: true,
  includeDecimals: false,
  questions: [],
  index: 0,
  score: 0,
  streak: 0,
  results: [],
  startedAt: 0,
  timerPerQuestion: false,
  challenge: false,
  challengeEnd: 0,
  timerSecs: 0,
  timerHandle: null,
};

// DOM refs
const screens = {
  home: document.getElementById('screen-home'),
  levels: document.getElementById('screen-levels'),
  game: document.getElementById('screen-game'),
  result: document.getElementById('screen-result'),
};
const btnHome = document.getElementById('btnHome');
const btnTeacher = document.getElementById('btnTeacher');
const btnQuickPlay = document.getElementById('btnQuickPlay');
const btnChooseLevel = document.getElementById('btnChooseLevel');
const levelButtons = document.querySelectorAll('.level');
const teacherDialog = document.getElementById('teacherDialog');
const optMode = document.getElementById('optMode');
const optCount = document.getElementById('optCount');
const optVisual = document.getElementById('optVisual');
const optHints = document.getElementById('optHints');
const optDecimals = document.getElementById('optDecimals');
const optVisualStyle = document.getElementById('optVisualStyle');
const optTimer = document.getElementById('optTimer');
const btnTeacherStart = document.getElementById('btnTeacherStart');

const hudIndex = document.getElementById('hudIndex');
const hudTotal = document.getElementById('hudTotal');
const hudScore = document.getElementById('hudScore');
const hudStreak = document.getElementById('hudStreak');
const hudTimer = document.getElementById('hudTimer');
const questionTitle = document.getElementById('questionTitle');
const questionContainer = document.getElementById('questionContainer');
const btnHint = document.getElementById('btnHint');
const btnCheck = document.getElementById('btnCheck');
const btnNext = document.getElementById('btnNext');
const feedback = document.getElementById('feedback');

const finalScore = document.getElementById('finalScore');
const finalTotal = document.getElementById('finalTotal');
const btnDownloadCsv = document.getElementById('btnDownloadCsv');
const btnReplay = document.getElementById('btnReplay');
const btnToLevels = document.getElementById('btnToLevels');

// Utility: navigation
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// Data helpers
function parseFraction(str) {
  str = String(str).trim();
  // Mixed number: e.g., "1 1/3"
  if (str.includes(' ')) {
    const [whole, frac] = str.split(' ');
    const [n, d] = frac.split('/').map(Number);
    return Number(whole) + (n / d);
  }
  // Proper fraction a/b
  if (str.includes('/')) {
    const [n, d] = str.split('/').map(Number);
    return n / d;
  }
  // Decimal
  return Number(str);
}

function lcm(a, b) {
  const gcd = (x, y) => y ? gcd(y, x % y) : Math.abs(x);
  return Math.abs(a * b) / gcd(a, b);
}

function toVisualParts(str) {
  // returns { numerator, denominator } if fraction; else approx as denominator 10
  if (str.includes('/')) {
    const [n, d] = str.split('/').map(Number);
    return { n, d };
  }
  // decimal or integer -> represent with denominator 10
  const val = parseFloat(str);
  const d = 10;
  const n = Math.round(val * d);
  return { n, d };
}

function compare(a, b) {
  const va = parseFraction(a);
  const vb = parseFraction(b);
  if (Math.abs(va - vb) < 1e-9) return 0;
  return va < vb ? -1 : 1;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Question bank (simple, small numbers)
const BANK = {
  compare: [
    { items: ['2/5', '3/5'], larger: 1 },
    { items: ['1/3', '1/4'], larger: 0 },
    { items: ['2/3', '3/4'], larger: 1 },
    { items: ['1/2', '2/5'], larger: 0 },
    { items: ['5/8', '4/6'], larger: compare('5/8','4/6')>0?0:1 },
    { items: ['3/10', '1/4'], larger: compare('3/10','1/4')>0?0:1 },
    { items: ['4/7', '5/9'], larger: compare('4/7','5/9')>0?0:1 },
    { items: ['1 1/3', '4/3'], larger: compare('1 1/3','4/3')>0?0:1 },
    { items: ['0.6', '3/5'], larger: compare('0.6','3/5')>0?0:1 },
    { items: ['2/6', '1/3'], larger: compare('2/6','1/3')>0?0:1 },
  ],
  order3: [
    { items: ['1/2', '2/5', '3/4'] },
    { items: ['1/3', '1/2', '2/3'] },
    { items: ['2/7', '3/7', '5/7'] },
    { items: ['1/4', '3/8', '2/3'] },
    { items: ['1/5', '0.2', '2/3'] },
    { items: ['3/10', '1/4', '2/5'] },
  ],
};

function buildQuestionsFromLevel(level) {
  switch(String(level)){
    case '1':
      return shuffle([
        { type: 'compare', items: ['2/5','3/5'], answer: 1 },
        { type: 'compare', items: ['1/6','5/6'], answer: 1 },
        { type: 'compare', items: ['4/9','7/9'], answer: 1 },
        { type: 'compare', items: ['3/8','2/8'], answer: 0 },
        { type: 'compare', items: ['5/7','4/7'], answer: 0 },
      ]);
    case '2':
      return shuffle([
        { type: 'compare', items: ['1/2','1/3'], answer: 0 },
        { type: 'compare', items: ['1/4','1/5'], answer: 0 },
        { type: 'compare', items: ['1/6','1/2'], answer: 1 },
        { type: 'compare', items: ['1/8','1/4'], answer: 1 },
        { type: 'compare', items: ['1/10','1/3'], answer: 1 },
      ]);
    case '3':
      return shuffle([
        { type: 'compare', items: ['2/3','3/4'], answer: compare('2/3','3/4')>0?0:1 },
        { type: 'compare', items: ['5/8','3/5'], answer: compare('5/8','3/5')>0?0:1 },
        { type: 'compare', items: ['4/7','5/9'], answer: compare('4/7','5/9')>0?0:1 },
        { type: 'compare', items: ['3/10','2/7'], answer: compare('3/10','2/7')>0?0:1 },
        { type: 'compare', items: ['1/2','2/3'], answer: compare('1/2','2/3')>0?0:1 },
      ]);
    case '4':
      return shuffle([
        { type: 'order', items: ['1/2','2/5','3/4'] },
        { type: 'order', items: ['1/3','1/2','2/3'] },
        { type: 'order', items: ['2/7','3/7','5/7'] },
        { type: 'order', items: ['1/4','3/8','2/3'] },
        { type: 'order', items: ['1/5','0.2','2/3'] },
      ]);
    case '5':
      return shuffle([
        { type: 'compare', items: ['1 1/3','4/3'], answer: compare('1 1/3','4/3')>0?0:1 },
        { type: 'compare', items: ['1 1/2','3/2'], answer: compare('1 1/2','3/2')>0?0:1 },
        { type: 'order', items: ['1 1/4','5/4','3/2'] },
        { type: 'order', items: ['1 2/3','5/3','1 1/2'] },
      ]);
    default:
      return [];
  }
}

function buildQuickQuestions() {
  // Mix compare and order from BANK
  const comps = shuffle(BANK.compare).slice(0, 6).map(q => ({ type:'compare', items:q.items, answer:q.larger }));
  const ords = shuffle(BANK.order3).slice(0, 4).map(q => ({ type:'order', items:q.items }));
  return shuffle([...comps, ...ords]);
}

// Rendering
function clearQuestionUI(){
  questionContainer.innerHTML = '';
  feedback.textContent = '';
  btnCheck.disabled = false;
  btnNext.disabled = true;
}

function fractionCardHTML(text){
  let visual = '';
  if (state.showVisual) {
    const {n,d} = toVisualParts(text);
    const percent = Math.max(0, Math.min(100, Math.round((n/d)*100)));
    const bar = `
      <div class="bar" aria-hidden="true"><div class="bar-fill" style="width:${percent}%"></div></div>
      <div class="bar-label">≈ ${percent}%</div>
    `;
    const circle = pieSVG(n, d);
    if (state.visualStyle === 'bar') visual = bar;
    else if (state.visualStyle === 'circle') visual = circle;
    else if (state.visualStyle === 'both') visual = circle + bar;
    else visual = Math.random() < 0.5 ? bar : circle; // auto
  }
  return `
    <div class="fraction-card" data-value="${text}">
      <div class="fraction-title">${text}</div>
      ${visual}
    </div>
  `;
}

// Build an SVG pie (pizza) with d slices, first n filled
function pieSVG(n, d) {
  n = Math.max(0, Math.min(n, d));
  const size = 96, r = 45, cx = 48, cy = 48;
  const slices = [];
  for (let i = 0; i < d; i++) {
    const start = (i / d) * 2 * Math.PI - Math.PI / 2;
    const end = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const largeArc = (end - start) > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    const filled = i < n;
    slices.push(`<path d="${path}" fill="${filled ? '#f97316' : '#fde68a'}" stroke="#f59e0b" stroke-width="1"/>`);
  }
  // Outline circle
  const outline = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#92400e" stroke-width="1.5" />`;
  return `<div class="pie-wrap"><svg class="pie" viewBox="0 0 ${size} ${size}" aria-hidden="true">${slices.join('')}${outline}</svg></div>`;
}

function renderCompare(items){
  questionTitle.textContent = 'Pilih pecahan yang lebih besar';
  const [a,b] = items;
  const row = document.createElement('div');
  row.className = 'fraction-row';
  row.innerHTML = fractionCardHTML(a) + fractionCardHTML(b);
  questionContainer.appendChild(row);

  const cards = row.querySelectorAll('.fraction-card');
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      questionContainer.dataset.choice = String(idx);
      card.classList.add('pop');
      setTimeout(()=>card.classList.remove('pop'), 250);
    });
  });
}

let sortableInstance = null;
function renderOrder(items){
  questionTitle.textContent = 'Urutkan dari yang terkecil ke terbesar';
  const ul = document.createElement('ul');
  ul.className = 'sortable-list';
  items.forEach(text => {
    const li = document.createElement('li');
    li.className = 'sortable-item';
    li.innerHTML = `
      <span class="handle">↕</span>
      <div style="flex:1">${fractionCardHTML(text)}</div>
    `;
    ul.appendChild(li);
  });
  questionContainer.appendChild(ul);
  sortableInstance = new Sortable(ul, {
    animation: 150,
    handle: '.handle',
  });
}

function renderCurrentQuestion(){
  clearQuestionUI();
  hudIndex.textContent = String(state.index + 1);
  hudTotal.textContent = String(state.questions.length);
  hudScore.textContent = String(state.score);
  hudStreak.textContent = state.streak >= 2 ? `🔥 x${state.streak}` : '';

  const q = state.questions[state.index];
  if (!q) return;

  if (q.type === 'compare') {
    renderCompare(q.items);
    btnCheck.style.display = '';
  } else {
    renderOrder(q.items);
    btnCheck.style.display = '';
  }
  // Timer per soal
  startQuestionTimer();
}

function correctOrder(items){
  return [...items].sort((a,b)=>compare(a,b));
}

function checkAnswer(){
  const q = state.questions[state.index];
  const timeSpent = Date.now() - state.startedAt;

  if (q.type === 'compare'){
    const choice = Number(questionContainer.dataset.choice ?? '-1');
    if (choice < 0){
      feedback.textContent = 'Silakan pilih salah satu pecahan.';
      return false;
    }
    const [a,b] = q.items;
    const larger = compare(a,b) > 0 ? 0 : 1;
    const ok = (choice === (q.answer ?? larger));
    setFeedback(ok, ok ? 'Benar! 🎉' : `Kurang tepat. Yang lebih besar adalah ${larger===0?a:b}.`);
    pushResult({ type:'compare', items:q.items, answer: larger, user: choice, ok, timeSpent });
    if (ok) fireConfetti();
    return true;
  }

  if (q.type === 'order'){
    const items = Array.from(questionContainer.querySelectorAll('.fraction-card')).map(el => el.dataset.value);
    const correct = correctOrder(q.items);
    const ok = items.every((it, i) => it === correct[i]);
    setFeedback(ok, ok ? 'Urutan tepat! 🎉' : `Coba lagi. Urutan benar: ${correct.join(' < ')}`);
    pushResult({ type:'order', items: q.items, answer: correct, user: items, ok, timeSpent });
    if (ok) fireConfetti();
    return true;
  }

  return false;
}

function nextQuestion(){
  state.index += 1;
  if (state.index >= state.questions.length){
    showSummary();
    return;
  }
  state.startedAt = Date.now();
  renderCurrentQuestion();
}

function setFeedback(ok, text){
  feedback.textContent = text;
  btnCheck.disabled = true;
  btnNext.disabled = false;
  if (ok) {
    state.streak += 1;
    let gained = 1;
    if (state.streak >= 3) gained += 1; // bonus streak
    state.score += gained;
    hudStreak.textContent = state.streak >= 2 ? `🔥 x${state.streak}` : '';
  } else {
    state.streak = 0;
    hudStreak.textContent = '';
    questionContainer.classList.add('shake');
    setTimeout(()=>questionContainer.classList.remove('shake'), 300);
  }
  hudScore.textContent = String(state.score);
  // Stop timer only for per-question timer. Challenge timer continues globally.
  if (!state.challenge && state.timerPerQuestion) stopTimer();
}

function pushResult(row){
  state.results.push(row);
}

function fireConfetti(){
  if (typeof confetti !== 'function') return;
  try {
    const scalar = 1.5;
    const pizza = confetti.shapeFromText({ text: '🍕', scalar });
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      shapes: [pizza],
      scalar
    });
  } catch (e) {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }
}

function hintFor(q){
  if (q.type === 'compare'){
    const [a,b] = q.items;
    const title = 'Strategi:';
    // Simple strategy text
    let tip = '';
    if (a.includes('/') && b.includes('/')){
      const [na,da]=a.split('/').map(Number), [nb,db]=b.split('/').map(Number);
      if (da === db) tip = 'Penyebut sama → bandingkan pembilang.';
      else {
        const L = lcm(da, db);
        tip = `Samakan penyebut (KPK=${L}).`;
      }
    } else {
      tip = 'Bisa konversi cepat ke desimal atau persentase.';
    }
    return `${title} ${tip}`;
  }
  if (q.type === 'order'){
    return 'Urutkan dari nilai terkecil. Bandingkan berpasangan atau ubah ke desimal singkat.';
  }
  return '';
}

function downloadCsv(){
  const rows = [
    ['index','tipe','item','jawaban_benar','jawaban_siswa','benar','waktu_ms'],
  ];
  state.results.forEach((r, i) => {
    const itemStr = Array.isArray(r.items) ? r.items.join(' | ') : String(r.items);
    const ansStr = Array.isArray(r.answer) ? r.answer.join(' < ') : String(r.answer);
    const usrStr = Array.isArray(r.user) ? r.user.join(' < ') : String(r.user);
    rows.push([i+1, r.type, itemStr, ansStr, usrStr, r.ok ? '1' : '0', r.timeSpent]);
  });
  const csv = rows.map(r => r.map(v => '"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'hasil_pecahan.csv'; a.click();
  URL.revokeObjectURL(url);
}

function startGame(questions){
  state.questions = questions.slice(0, state.total);
  state.index = 0;
  state.score = 0;
  state.streak = 0;
  state.results = [];
  hudTotal.textContent = String(state.questions.length);
  // Toggle hint button visibility per setting
  btnHint.style.display = state.showHints ? '' : 'none';
  // Set up challenge end time if challenge
  if (state.challenge) {
    state.challengeEnd = Date.now() + 60_000;
  } else {
    state.challengeEnd = 0;
  }
  showScreen('game');
  state.startedAt = Date.now();
  renderCurrentQuestion();
}

function showSummary(){
  finalScore.textContent = String(state.score);
  finalTotal.textContent = String(state.questions.length);
  showScreen('result');
}

// Timer logic
function startQuestionTimer(){
  stopTimer();
  if (!(state.timerPerQuestion || state.challenge)) { hudTimer.textContent = '—'; return; }
  const perQuestion = !state.challenge && state.timerPerQuestion;
  const start = Date.now();
  state.timerSecs = perQuestion ? 10 : Math.ceil((state.challengeEnd - Date.now())/1000);
  hudTimer.textContent = String(state.timerSecs);
  state.timerHandle = setInterval(()=>{
    const elapsed = Math.floor((Date.now() - start)/1000);
    const remain = state.challenge
      ? Math.ceil((state.challengeEnd - Date.now())/1000)
      : (10 - elapsed);
    state.timerSecs = remain;
    hudTimer.textContent = remain >= 0 ? String(remain) : '0';
    if (remain <= 0){
      stopTimer();
      if (state.challenge){
        showSummary();
      } else {
        // Auto mark as wrong and proceed
        feedback.textContent = 'Waktu habis. Coba soal berikutnya!';
        state.streak = 0; hudStreak.textContent = '';
        btnCheck.disabled = true; btnNext.disabled = false;
      }
    }
  }, 200);
}
function stopTimer(){ if (state.timerHandle) { clearInterval(state.timerHandle); state.timerHandle = null; } }

// Events
btnHome.addEventListener('click', () => showScreen('home'));
btnTeacher.addEventListener('click', () => teacherDialog.showModal());
btnQuickPlay.addEventListener('click', () => {
  state.mode = 'mix';
  state.total = 10;
  startGame(buildQuickQuestions());
});
btnChooseLevel.addEventListener('click', () => showScreen('levels'));
levelButtons.forEach(btn => btn.addEventListener('click', () => {
  const level = btn.dataset.level;
  if (level === 'challenge'){
    state.challenge = true;
    state.mode = 'mix';
    state.total = 30; // large pool, time-limited
    const qs = [...buildQuickQuestions(), ...buildQuickQuestions(), ...buildQuickQuestions()];
    startGame(qs);
  } else {
    state.challenge = false;
    const qs = buildQuestionsFromLevel(level);
    state.total = qs.length;
    startGame(qs);
  }
}));

btnHint.addEventListener('click', () => {
  if (!state.showHints) return;
  const q = state.questions[state.index];
  feedback.textContent = hintFor(q);
});

btnCheck.addEventListener('click', () => {
  const ok = checkAnswer();
});
btnNext.addEventListener('click', () => {
  nextQuestion();
});

btnDownloadCsv.addEventListener('click', downloadCsv);
btnReplay.addEventListener('click', () => {
  state.index = 0; state.score = 0; state.results = [];
  showScreen('game');
  renderCurrentQuestion();
});
btnToLevels.addEventListener('click', () => showScreen('levels'));

btnTeacherStart.addEventListener('click', (e) => {
  e.preventDefault();
  state.mode = optMode.value;
  state.total = Number(optCount.value);
  state.showVisual = optVisual.checked;
  state.visualStyle = optVisualStyle.value;
  state.showHints = optHints.checked;
  state.includeDecimals = optDecimals.checked;
  state.timerPerQuestion = optTimer.checked;
  state.challenge = false;

  let qs = [];
  if (state.mode === 'compare') qs = shuffle(BANK.compare).map(q => ({type:'compare', items:q.items, answer:q.larger}));
  else if (state.mode === 'order') qs = shuffle(BANK.order3).map(q => ({type:'order', items:q.items}));
  else qs = buildQuickQuestions();

  if (!state.includeDecimals) {
    qs = qs.filter(q => !q.items.some(it => String(it).includes('.')));
  }

  qs = qs.slice(0, state.total);

  teacherDialog.close();
  startGame(qs);
});

// Init
showScreen('home');
