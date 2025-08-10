// shared.js — FINAL-v3 2025-08-10 04:26:50 — Click-to-speak (no icons), single-play, en-US voice preference
(function(){
function voicesReady() {
  return new Promise((resolve) => {
    const v = speechSynthesis.getVoices();
    if (v && v.length) return resolve(v);
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
  });
}

let __ttsVoice = null;
async function pickVoice(langHint='en-US') {
  if (__ttsVoice) return __ttsVoice;
  const voices = await voicesReady();
  const wishNames = [
    /Google US English/i, /Samantha/i, /Ava/i, /Allison/i, /Victoria/i,
    /Karen/i, /Moira/i, /Serena/i, /Susan/i
  ];
  for (const rx of wishNames) {
    const v = voices.find(x => rx.test(x.name||''));
    if (v) { __ttsVoice = v; return v; }
  }
  let v = voices.find(x => /^en(-|_)?US/i.test(x.lang));
  if (!v) v = voices.find(x => /^en/i.test(x.lang));
  __ttsVoice = v || null;
  return __ttsVoice;
}

let __speaking = false;
async function speak(text, opts={}) {
  if (!text) return;
  // clean text: keep ASCII + common English punctuation
  const cleaned = String(text)
    .replace(/[^\u0000-\u00FF\u2019’“”A-Za-z0-9 ,.'!?\-–—:/]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (!cleaned) return;

  try { speechSynthesis.cancel(); } catch (e) {}
  if (__speaking) return;
  __speaking = true;

  const u = new SpeechSynthesisUtterance(cleaned);
  u.lang   = opts.lang   || 'en-US';
  u.rate   = opts.rate   || 0.96;
  u.pitch  = opts.pitch  || 1.03;
  u.volume = opts.volume ?? 1.0;

  try {
    const v = await pickVoice(u.lang);
    if (v) u.voice = v;
  } catch (e) {}

  u.onend = u.onerror = () => { __speaking = false; };
  speechSynthesis.speak(u);
}

function markClickable(el){
  el.style.cursor='pointer';
  if(!el.title) el.title='Tap/Click to speak';
  el.dataset.sayInit='1';
}

function autoAttachTTS(){
  // mark
  document.querySelectorAll('[data-say]').forEach(el=>{
    if(el.dataset.sayInit==='1') return;
    if(!el.dataset.say) el.dataset.say=(el.textContent||'').trim();
    markClickable(el);
  });
  // bind once
  if(!window.__ttsBound){
    document.addEventListener('click', (ev)=>{
      const target = ev.target.closest('[data-say]');
      if(!target) return;
      if(target.dataset.sayBusy==='1') return;
      target.dataset.sayBusy='1';
      const text = target.dataset.say || (target.textContent||'').trim();
      speak(text);
      setTimeout(()=>{ target.dataset.sayBusy='0'; }, 200);
    }, {capture:false, passive:true});
    window.__ttsBound = true;
  }
}

window.speak = speak;
window.autoAttachTTS = autoAttachTTS;

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', autoAttachTTS);
}else{
  autoAttachTTS();
}
})();