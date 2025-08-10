// shared.js - minimal TTS + auto attach
function voicesReady(){
  return new Promise(resolve=>{
    const v = speechSynthesis.getVoices();
    if (v && v.length) return resolve(v);
    speechSynthesis.onvoiceschanged = ()=>resolve(speechSynthesis.getVoices());
  });
}

async function pickVoice(langHint='en-US'){
  const voices = await voicesReady();
  let v = voices.find(x=>/en(-|_)US/i.test(x.lang));
  if(!v) v = voices.find(x=>/^en(-|_)/i.test(x.lang));
  return v;
}

async function speak(text, opts={}){
  if(!text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = opts.lang || 'en-US';
  u.rate = opts.rate || 1;
  u.pitch = opts.pitch || 1;
  u.volume = opts.volume || 1;
  try{ const v = await pickVoice(u.lang); if(v) u.voice = v; }catch(e){}
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// auto: any [data-say] gets a 🔊 button; any .say reads on click
function autoAttachTTS(){
  document.querySelectorAll('[data-say]').forEach(el=>{
    if(el.dataset.sayInit==='1') return;
    const btn=document.createElement('button');
    btn.type='button'; btn.textContent='🔊';
    btn.addEventListener('click',()=>speak(el.dataset.say || el.textContent.trim()));
    el.insertAdjacentElement('afterend', btn);
    el.dataset.sayInit='1';
  });
  document.querySelectorAll('.say').forEach(el=>{
    if(el.dataset.sayInit==='1') return;
    el.style.cursor='pointer'; el.title='點一下朗讀';
    el.addEventListener('click',()=>speak(el.textContent.trim()));
    el.dataset.sayInit='1';
  });
}
document.addEventListener('DOMContentLoaded',()=>{ voicesReady().then(autoAttachTTS); });
window.speak = speak;