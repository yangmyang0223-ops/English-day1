
function loadQuiz(jsonPath, mountSelector){
  fetch(jsonPath, {cache:'no-store'})
    .then(r => { if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
    .then(items => renderQuiz(items, mountSelector))
    .catch(err => { document.querySelector(mountSelector).innerHTML = '<p style="color:#b00">無法載入題庫：'+err.message+'</p>'; });
}
function renderQuiz(items, mountSelector){
  const wrap = document.querySelector(mountSelector);
  const ol = document.createElement('ol');
  ol.className = 'qz';
  items.forEach((q, idx)=>{
    const li = document.createElement('li');
    const qdiv = document.createElement('div');
    qdiv.className = 'q';
    const qs = document.createElement('span');
    qs.textContent = q.question;
    if(window.speak && (q.say || q.question)){
      qs.setAttribute('data-say', q.say || q.question);
      qs.addEventListener('click', ()=>speak(q.say || q.question));
      qs.style.textDecoration = 'underline';
      qs.style.textUnderlineOffset = '2px';
    }
    qdiv.appendChild(qs);
    if(q.translation){
      const tr = document.createElement('div');
      tr.style.color = '#555';
      tr.style.fontSize = '.95rem';
      tr.textContent = q.translation;
      qdiv.appendChild(tr);
    }
    li.appendChild(qdiv);
    q.options.forEach((opt, jdx)=>{
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'q'+(idx+1);
      input.value = String.fromCharCode(65+jdx);
      if(jdx===q.answer) input.setAttribute('data-answer','1');
      label.appendChild(input);
      const span = document.createElement('span');
      span.textContent = typeof opt==='string' ? opt : (opt.text||'');
      const speakText = (typeof opt==='string') ? opt : (opt.say || opt.text || '');
      if(window.speak && speakText){
        span.setAttribute('data-say', speakText);
        span.addEventListener('click', ()=>speak(speakText));
        span.style.textDecoration = 'underline';
        span.style.textUnderlineOffset = '2px';
      }
      label.appendChild(span);
      li.appendChild(label);
      li.appendChild(document.createElement('br'));
    });
    ol.appendChild(li);
  });
  wrap.innerHTML = '';
  wrap.appendChild(ol);
  const actions = document.createElement('div');
  actions.className = 'actions';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '批改';
  const score = document.createElement('span');
  score.id = 'quiz-score';
  btn.addEventListener('click', ()=>gradeQuiz(mountSelector));
  actions.appendChild(btn);
  actions.appendChild(score);
  wrap.appendChild(actions);
}
function gradeQuiz(scope){
  const root = document.querySelector(scope);
  const radios = [...root.querySelectorAll('input[type=radio]')];
  const groups = [...new Set(radios.map(r=>r.name))];
  let correct = 0;
  groups.forEach(g=>{
    const picked = root.querySelector('input[name="'+g+'"]:checked');
    const ok = root.querySelector('input[name="'+g+'"][data-answer="1"]');
    if(picked && ok && picked.value===ok.value) correct++;
  });
  const scoreEl = root.querySelector('#quiz-score') || document.getElementById('quiz-score');
  if(scoreEl) scoreEl.textContent = '分數：'+correct+' / '+groups.length;
}
