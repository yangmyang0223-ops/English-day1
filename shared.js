// ===== shared.js — English-learning 共用功能 =====

// 等待語音清單可用
function voicesReady() {
  return new Promise(resolve => {
    const v = speechSynthesis.getVoices();
    if (v && v.length) return resolve(v);
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
  });
}

// 選一個最合適的英文語音，優先 en-US，其次任何 en-*
async function pickVoice(langHint = 'en-US') {
  const voices = await voicesReady();
  // 先找 en-US
  let v = voices.find(x => /en(-|_)US/i.test(x.lang));
  // 再找任何英文
  if (!v) v = voices.find(x => /^en(-|_)/i.test(x.lang));
  // 沒有就 undefined（用系統預設）
  return v;
}

/**
 * 朗讀文字（最小可用版本）
 * @param {string} text - 要朗讀的英文
 * @param {object} opts - 可選參數：{ lang, rate, pitch, volume }
 */
async function speak(text, opts = {}) {
  if (!text) return;

  const u = new SpeechSynthesisUtterance(text);
  u.lang   = opts.lang   || 'en-US';
  u.rate   = opts.rate   || 1;   // 速度 0.5~2
  u.pitch  = opts.pitch  || 1;   // 音高 0~2
  u.volume = opts.volume || 1;   // 音量 0~1

  try {
    const v = await pickVoice(u.lang);
    if (v) u.voice = v;
  } catch (e) {
    // 忽略，使用預設語音
  }

  // 取消正在排隊/播放的，避免重疊
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// 幫頁面自動加發音能力：
// 1) 任何元素帶有 [data-say="..."] 會在後面自動加一顆 🔊 按鈕播放 data-say 的內容
// 2) 任何元素 class 含有 .say 會點選自身就朗讀裡面的文字
function autoAttachTTS() {
  // [data-say] -> 在後面加 🔊 按鈕
  document.querySelectorAll('[data-say]').forEach(el => {
    if (el.dataset.sayInit === '1') return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '🔊';
    btn.addEventListener('click', () => speak(el.dataset.say || el.textContent.trim()));
    el.insertAdjacentElement('afterend', btn);
    el.dataset.sayInit = '1';
  });

  // .say -> 點它自己就說
  document.querySelectorAll('.say').forEach(el => {
    if (el.dataset.sayInit === '1') return;
    el.style.cursor = 'pointer';
    el.title = '點一下朗讀';
    el.addEventListener('click', () => speak(el.textContent.trim()));
    el.dataset.sayInit = '1';
  });
}

// 提供一個工具可以手動產生按鈕
function makeSpeakButton(text, label = '🔊') {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = label;
  btn.addEventListener('click', () => speak(text));
  return btn;
}

// 自動掛載
document.addEventListener('DOMContentLoaded', () => {
  // 觸發一次取聲音（iOS 有時需要互動後才會真正說話）
  voicesReady().then(() => autoAttachTTS());
});

// 暴露到全域，舊寫法 onclick="speak('...')" 仍可用
window.speak = speak;
window.makeSpeakButton = makeSpeakButton;
