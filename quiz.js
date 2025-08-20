
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function el(tag,attrs={},children=[]){const x=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>{if(k==='html')x.innerHTML=v;else if(k==='text')x.textContent=v;else x.setAttribute(k,v)});children.forEach(c=>x.appendChild(c));return x}
function loadQuiz(jsonPath, mountSel, count=20){
  fetch(jsonPath,{cache:'no-store'}).then(r=>r.json()).then(all=>{
    const items = all.slice(0); shuffle(items); const picked = items.slice(0, count);
    const root=document.querySelector(mountSel); root.innerHTML='';
    const ol=el('ol',{class:'qz'});
    picked.forEach((q,i)=>{
      const li=el('li'); const stem=el('div',{class:'q'});
      const s=el('span',{text:q.question}); s.style.textDecoration='underline'; s.style.textUnderlineOffset='2px';
      s.addEventListener('click',()=>{ if(window.speak && (q.say||q.question)) speak(q.say||q.question); });
      stem.appendChild(s); li.appendChild(stem);
      q.options.forEach((opt,j)=>{
        const lab=el('label'); const inp=el('input'); inp.type='radio'; inp.name='q'+i; inp.value=String.fromCharCode(65+j);
        const show=(typeof opt==='string')?opt:(opt.text||''); const sp=el('span',{text:show});
        sp.style.textDecoration='underline'; sp.style.textUnderlineOffset='2px';
        sp.addEventListener('click',()=>{ if(window.speak){ speak((typeof opt==='string')?opt:(opt.say||opt.text||'')); } });
        lab.appendChild(inp); lab.appendChild(sp); li.appendChild(lab); li.appendChild(document.createElement('br'));
      });
      ol.appendChild(li);
    });
    root.appendChild(ol);
    const btnShow = el('button',{text:'顯示所有題目答案'}); btnShow.style.marginRight='8px';
    const btnHide = el('button',{text:'隱藏答案'}); btnHide.style.display='none';
    const answersBox = el('div',{id:'answer-key', class:'note'}); answersBox.style.marginTop='10px';
    const renderAnswers = ()=>{
      const mapLetter = i => String.fromCharCode(65+i);
      const olAns = el('ol');
      picked.forEach((q,idx)=>{
        const ansIndex = Number(q.answer||0);
        const opt = q.options[ansIndex];
        const ansText = (typeof opt==='string') ? opt : (opt.text||'');
        const li = el('li'); li.style.marginBottom='6px';
        li.innerHTML = `<strong>Q${idx+1}</strong> → 正確答案：<code>${mapLetter(ansIndex)}</code>　<span style="text-decoration:underline">${ansText}</span>`;
        li.addEventListener('click',()=>{ if(window.speak){ speak((typeof opt==='string')?opt:(opt.say||opt.text||'')); } });
        olAns.appendChild(li);
      });
      answersBox.innerHTML=''; answersBox.appendChild(el('h3',{text:'🗝 全部題目答案'})); answersBox.appendChild(olAns);
    };
    btnShow.addEventListener('click',()=>{ renderAnswers(); btnShow.style.display='none'; btnHide.style.display='inline-block'; });
    btnHide.addEventListener('click',()=>{ answersBox.innerHTML=''; btnHide.style.display='none'; btnShow.style.display='inline-block'; });
    root.appendChild(btnShow); root.appendChild(btnHide); root.appendChild(answersBox);
  }).catch(e=>{ document.querySelector(mountSel).innerHTML='<p style="color:#b00">題庫載入失敗：'+e.message+'</p>'; });
}
