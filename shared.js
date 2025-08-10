<!-- just a marker so GitHub shows HTML; actual file is JS -->
<script>
/* shared.js – TTS helper (en-US), single-play, auto-attach to [data-say]  */

// wait voices ready (handles Safari/Chrome differences)
function voicesReady() {
  return new Promise(resolve => {
    const v = speechSynthesis.getVoices();
    if (v && v.length) return resolve(v);
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
  });
}

// pick a natural English voice (prefer en-US)
async function pickVoice(langHint = 'en-US') {
  const voices = await voicesReady();
  const pick = (...tests) => voices.find(tests[0]) || null;

  // priority: Google US English (Chrome), Samantha (iOS), en-US, fallbacks
  const v =
    voices.find(v => /Google US English/i.test(v.name)) ||
    voices.find(v => /Samantha/i.test(v.name)) ||
    voices.find(v => /^en(-|_)?US/i.test(v.lang)) ||
    voices.find(v => /^en(-|_)?GB/i.test(v.lang)) ||
    voices.find(v => /^en/i.test(v.lang)) || null;

  return v;
}

let __speaking = false;
async function speak(text, opts = {}) {
  if (!text) return;
  // guard: cancel any existing utterance first
  try { speechSynthesis.cancel(); } catch(e) {}
  if (__speaking) return; // simple re-entry guard to avoid double play
  __speaking = true;

  const u = new SpeechSynthesisUtterance(text);
  u.lang = (opts.lang || 'en-US');
  u.rate = opts.rate || 1;
  u.pitch = opts.pitch || 1;
  u.volume = opts.volume || 1;

  try {
    const v = await pickVoice(u.lang);
    if (v) u.voice = v;
  } catch(e) {}

  u.onend = u.onerror = () => { __speaking = false; };
  speechSynthesis.speak(u);
}

// auto: inject small speaker button & make any [data-say] clickable
function autoAttachTTS() {
  // 1) Make [data-say] elements clickable & add title hint
  document.querySelectorAll('[data-say]').forEach(el => {
    el.style.cursor = 'pointer';
    if (!el.title) el.title = 'Click to play';
  });

  // 2) Event delegation: click anywhere with [data-say] will speak
  document.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-say]');
    if (!el) return;
    // avoid double-trigger from button child etc.
    if (el.dataset.sayBusy === '1') return;
    el.dataset.sayBusy = '1';

    // derive text
    const raw = (el.dataset.say || el.textContent || '').trim();
    const cleaned = raw.replace(/[^\u0020-\u007e\u00A0-\uFFFF]/g, '').replace(/\s{2,}/g, ' ').trim();
    speak(cleaned).finally(() => {
      setTimeout(() => { el.dataset.sayBusy = '0'; }, 150); // small cool-down
    });
  }, { capture: false, passive: true });
}

// expose helpers (optional)
window.speak = speak;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoAttachTTS);
} else {
  autoAttachTTS();
}
</script>
