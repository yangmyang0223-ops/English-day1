// shared.js — 點文字或喇叭都能發音（支援 iOS Safari）
// -----------------------------------------------------

// 等待瀏覽器載入語音清單
function voicesReady() {
  return new Promise(resolve => {
    const v = speechSynthesis.getVoices();
    if (v && v.length) return resolve(v);
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
  });
}

// 挑選較自然的英文語音
async function pickVoice(langHint = 'en-US') {
  const voices = await voicesReady();
  // 先找 en-US，再退而求其次 en-GB，再不行就第一個英文
  return (
    voices.find(v => /en(-|_)?US/i.test(v.lang)) ||
    voices.find(v => /en(-|_)?GB/i.test(v.lang)) ||
    voices.find(v => /^en/i.test(v.lang)) ||
    null
  );
}

// 朗讀
async function speak(text, opts = {}) {
  if (!text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang   = opts.lang   || 'en-US';
  u.rate   = opts.rate   || 1;
  u.pitch  = opts.pitch  || 1;
  u.volume = opts.volume || 1;

  try {
    const v = await pickVoice(u.lang);
    if (v) u.voice = v;
  } catch (e) {/* 忽略挑選語音失敗 */}

  // 停掉前一段，避免重疊
  try { speechSynthesis.cancel(); } catch (e) {}
  speechSynthesis.speak(u);
}

// 自動：為所有 data-say 加上喇叭按鈕，並讓文字可點
function autoAttachTTS() {
  // 1) 讓任何帶 data-say 的元素：游標變手指、加 title 提示
  document.querySelectorAll('[data-say]').forEach(el => {
    el.style.cursor = 'pointer';
    if (!el.title) el.title = 'Tap / 點一下朗讀';
  });

  // 2) 插入喇叭（若尚未插入）
  document.querySelectorAll('[data-say]').forEach(el => {
    if (el.dataset.sayInit === '1') return; // 已處理
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '🔊';
    btn.setAttribute('aria-label', 'Play pronunciation');
    btn.style.marginLeft = '6px';
    btn.style.fontSize = '0.95em';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', ev => {
      ev.stopPropagation(); // 不要觸發父元素的點擊
      const txt = el.dataset.say && el.dataset.say !== '1'
        ? el.dataset.say
        : (el.textContent || '').trim();
      speak(txt);
    });
    el.insertAdjacentElement('beforeend', btn);
    el.dataset.sayInit = '1';
  });

  // 3) 事件委派：點任何帶 data-say 的元素本身，也會朗讀（不用喇叭）
  document.addEventListener('click', function (e) {
    const target = e.target.closest('[data-say]');
    if (!target) return;
    // 如果點到的是我們插入的按鈕，已在上面處理，這裡就不再讀
    if (e.target.tagName === 'BUTTON' && e.target.textContent.includes('🔊')) return;

    const txt = target.dataset.say && target.dataset.say !== '1'
      ? target.dataset.say
      : (target.textContent || '').trim();
    // 嘗試避免把整列表格的中文也一起讀進去：只取英文字母/空白/標點（保守型）
    const cleaned = txt.replace(/[\u4e00-\u9fff]/g, '').replace(/\s{2,}/g, ' ').trim();
    speak(cleaned || txt);
  }, { capture: false, passive: true });
}

// 讓 HTML 可以呼叫
window.autoAttachTTS = autoAttachTTS;
window.speak = speak;
