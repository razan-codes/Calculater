// ================= منطق الحاسبة (بدون eval) =================
const display = document.getElementById('display');
const subDisplay = document.getElementById('subDisplay');
const keys = document.querySelector('.keys');

let current = '0';      // الرقم الحالي على الشاشة
let previous = null;    // الرقم السابق المخزن
let operation = null;   // العملية المختارة + - * /
let justEvaluated = false;

function updateDisplay() {
  display.value = current;
  const op = operation ? ` ${symbolFor(operation)} ` : '';
  subDisplay.textContent = previous !== null ? `${previous}${op}${(justEvaluated && !operation) ? '' : ''}` : '';
}

function symbolFor(op){
  return op === '*' ? '×' : op === '/' ? '÷' : op;
}

function clearAll(){
  current = '0'; previous = null; operation = null; justEvaluated = false; updateDisplay();
}

function deleteOne(){
  if (justEvaluated) { clearAll(); return; }
  if (current.length > 1) current = current.slice(0, -1);
  else current = '0';
  updateDisplay();
}

function appendNumber(n){
  if (justEvaluated) { current = '0'; justEvaluated = false; }
  if (current === '0' && n !== '.') current = String(n);
  else current += String(n);
  updateDisplay();
}

function addDot(){
  if (justEvaluated) { current = '0'; justEvaluated = false; }
  if (!current.includes('.')) current += '.';
  updateDisplay();
}

function toggleSign(){
  if (current === '0') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}

function percent(){
  const num = parseFloat(current);
  if (!isNaN(num)) {
    current = String(num / 100);
    updateDisplay();
  }
}

function chooseOperation(op){
  if (operation && !justEvaluated) {
    // إذا تم اختيار عملية أخرى مباشرة، نحاول الحساب أولاً
    compute();
  }
  previous = parseFloat(current);
  operation = op;
  justEvaluated = false;
  current = '0';
  updateDisplay();
}

function compute(){
  if (operation === null || previous === null) return;
  const a = previous;
  const b = parseFloat(current);
  let result;
  switch(operation){
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b === 0 ? NaN : a / b; break;
  }
  current = String(Number.isFinite(result) ? +result.toFixed(12) : 'خطأ');
  previous = null;
  operation = null;
  justEvaluated = true;
  updateDisplay();
}

// تعامل مع الضغط على الأزرار
keys.addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === 'number') return appendNumber(btn.dataset.num);
  if (action === 'dot') return addDot();
  if (action === 'operation') return chooseOperation(btn.dataset.op);
  if (action === 'equals') return compute();
  if (action === 'clear') return clearAll();
  if (action === 'delete') return deleteOne();
  if (action === 'percent') return percent();
  if (action === 'sign') return toggleSign();
});

// دعم لوحة المفاتيح
window.addEventListener('keydown', (e)=>{
  const { key } = e;
  if (/^[0-9]$/.test(key)) return appendNumber(key);
  if (key === '.') return addDot();
  if (['+', '-', '*', '/'].includes(key)) return chooseOperation(key);
  if (key === 'Enter' || key === '=') return compute();
  if (key === 'Backspace') return deleteOne();
  if (key === 'Escape') return clearAll();
  if (key === '%') return percent();
});

// تحديث أولي
updateDisplay();

/* ================== مُبدّل الثيمات ================== */
(function setupThemeSwitcher() {
  const THEME_KEY = 'calc_theme';
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    document.body.classList.remove('theme-glass','theme-neumorph','theme-neon');
    document.body.classList.add(`theme-${saved}`);
  } else {
    // ثيم افتراضي: Glass
    document.body.classList.add('theme-glass');
  }

  const switcher = document.querySelector('.theme-switcher');
  if (!switcher) return;

  switcher.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-theme]');
    if (!btn) return;
    const theme = btn.getAttribute('data-theme'); // glass | neumorph | neon
    document.body.classList.remove('theme-glass','theme-neumorph','theme-neon');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem(THEME_KEY, theme);
  });
})();