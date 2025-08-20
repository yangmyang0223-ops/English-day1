/* quiz.js — 題目載入＋結束後一次顯示所有答案（不自動判分） */
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function el(tag,attrs={},children=[]){
  const x=document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='html') x.innerHTML=v;
    else if(k==='text') x.textContent=v;
    else x.setAttribute(k,v);
  });
  children.forEach(c=>x.appendChild(c));
  return x;
}

/**
 * json 結構（沿用你現有的 dayX-quiz.json）：
 * [
 *   { "question":"EN→ZH: canvas", "options":["畫布","畫架","…","…"], "answer":0 },
 *   { "question":"▶️ Listening ...", "say":"I blend the colors ...", "options":[...], "answer":0 }
 * ]
 * 注意：options[i] 可能是字串，或 {text:"xxx", say:"(可選)"} 的物件
 */
function loadQuiz(jsonPath, mountSel, count=20){
  fetch(jsonPath,{cache:'no-store'})
    .then(r=>r.json())
    .then(all=>{
      const items = all.slice(0);
      shuffle(items);
      const picked = items.slice(0, count);

      const root = document.querySelector(mountSel);
      root.innerHTML = '';

      // 題目區
      const ol = el('ol',{class:'qz'});
      picked.forEach((q,i)=>{
        const li = el('li');
        // 題幹
        const stemWrap = el('div',{class:'q'});
        const stem = el('span',{text:q.question});
        stem.style.textDecoration='underline';
        stem.style.textUnderlineOffset='2px';
        stem.addEventListener('click',()=>{
          if(window.speak && (q.say||q.question)) speak(q.say||q.question);
        });
        stemWrap.appendChild(stem);
        li.appendChild(stemWrap);

        // 選項
        q.options.forEach((opt,j)=>{
          const lab=el('label');
          const inp=el('input'); inp.type='radio'; inp.name='q'+i; inp.value=String.fromCharCode(65+j);
          // 不在這裡做對錯判定，只用來記錄選擇
          const show = (typeof opt==='string') ? opt : (opt.text||'');
          const sp=el('span',{text:show});
          sp.style.textDecoration='underline';
          sp.style.textUnderlineOffset='2px';
          sp.addEventListener('click',()=>{ if(window.speak){ speak((typeof opt==='string')?opt:(opt.say||opt.text||'')); } });
          lab.appendChild(inp); lab.appendChild(sp);
          li.appendChild(lab);
          li.appendChild(document.createElement('br'));
        });
        ol.appendChild(li);
      });

      root.appendChild(ol);

      // 操作按鈕
      const btnShow = el('button',{text:'顯示所有題目答案'});
      btnShow.style.marginRight='8px';

      const btnHide = el('button',{text:'隱藏答案'});
      btnHide.style.display='none';
      btnHide.style.marginRight='8px';

      const answersBox = el('div',{id:'answer-key', class:'note'});
      answersBox.style.marginTop = '10px';

      // 產生答案清單（不判分）
      const renderAnswers = ()=>{
        const mapLetter = i => String.fromCharCode(65+i); // 0->A, 1->B ...
        const olAns = el('ol');
        picked.forEach((q,idx)=>{
          const li = el('li');
          const ansIndex = Number(q.answer||0);
          const opt = q.options[ansIndex];
          const ansText = (typeof opt==='string') ? opt : (opt.text||'');
          li.innerHTML = `<strong>Q${idx+1}</strong> → 正確答案：<code>${mapLetter(ansIndex)}</code>　<span style="text-decoration:underline">${ansText}</span>`;
          li.style.marginBottom='6px';
          li.addEventListener('click',()=>{ if(window.speak){ speak((typeof opt==='string')?opt:(opt.say||opt.text||'')); } });
          olAns.appendChild(li);
        });
        answersBox.innerHTML='';
        answersBox.appendChild(el('h3',{text:'🗝 全部題目答案'}));
        answersBox.appendChild(olAns);
      };

      btnShow.addEventListener('click',()=>{
        renderAnswers();
        btnShow.style.display='none';
        btnHide.style.display='inline-block';
      });
      btnHide.addEventListener('click',()=>{
        answersBox.innerHTML='';
        btnHide.style.display='none';
        btnShow.style.display='inline-block';
      });

      root.appendChild(btnShow);
      root.appendChild(btnHide);
      root.appendChild(answersBox);
    })
    .catch(e=>{
      const root = document.querySelector(mountSel);
      root.innerHTML = '<p style="color:#b00">題庫載入失敗：'+e.message+'</p>';
    });
}
