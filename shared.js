// shared.js — 點文字就發音（移除喇叭，支援 data-say 與 .en）
// iOS/Safari 相容：等待 voices 就緒後再挑選英文語音

function voicesReady() {
  return new Promise((resolve) => {
    const v = speechSynthesis.getVoices();
    if (v && v.length) return resolve(v);
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
  });
}

async function pickVoice(langHint = 'en-US') {
  const voices = await voicesReady();
  // 先挑 en-US，不行再 en-GB，再任一英文
  return (
    voices.find(v => /en(-|_)?US/i.test(v.lang)) ||
    voices.find(v => /en(-|_)?GB/i.test(v.lang)) ||
    voices.find(v => /^en/i.test(v.lang)) ||
    null
  );
}

async function speak(text, opts = {}) {
  if (!text) return;
  // 避免讀到中文：只保留西文可讀字元（英文、數字、常見標點）
  const cleaned = String(text)
    .replace(/[^\u0000-\u00ff]/g, '') // 移除非拉丁字元（含中日韓）
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (!cleaned) return;

  const u = new SpeechSynthesisUtterance(cleaned);
  u.lang   = opts.lang  || 'en-US';
  u.rate   = opts.rate  ?? 1;
  u.pitch  = opts.pitch ?? 1;
  u.volume = opts.volume ?? 1;

  try {
    const v = await pickVoice(u.lang);
    if (v) u.voice = v;
  } catch (_) {}

  // 停掉先前的發音，避免重疊
  try { speechSynthesis.cancel(); } catch (_) {}
  speechSynthesis.speak(u);
}

// 把可朗讀元素做成「可點」
function markClickable(el) {
  el.style.cursor = 'pointer';
  if (!el.title) el.title = '點一下朗讀';
  el.dataset.sayInit = '1';
}

// 初始化：
// 1) 讓所有 [data-say] 變成可點
// 2) 讓所有 .en（英文片段）在沒有 data-say 時，自動用文字當朗讀內容
function autoAttachTTS() {
  // 1) 明確標註 data-say 的（最可靠）
  document.querySelectorAll('[data-say]').forEach(el => {
    if (el.dataset.sayInit === '1') return;
    markClickable(el);
  });

  // 2) .en 類別的片段，沒有 data-say 就用文字
  document.querySelectorAll('.en').forEach(el => {
    if (el.dataset.sayInit === '1') return;
    if (!el.dataset.say) {
      el.dataset.say = (el.textContent || '').trim();
    }
    markClickable(el);
  });

  // 3) 事件委派：點到任何可朗讀的元素就發音
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-say], .en');
    if (!target) return;

    // 若點到的是按鈕等非文字元素就忽略（目前已無喇叭，但保險）
    if (target.tagName === 'BUTTON') return;

    const text = target.dataset.say || (target.textContent || '').trim();
    speak(text);
  }, { capture: false, passive: true });
}

// 給 HTML 直接呼叫
window.speak = speak;

// DOM 準備好就啟動
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoAttachTTS);
} else {
  autoAttachTTS();
}
