<script>
// ===== 語音朗讀（使用瀏覽器 SpeechSynthesis，iPad/Safari 可用） =====
function speak(text, rate=1) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate; // 0.8~1.2 可調
  // 優先挑自然英文聲音（若可用）
  const v = speechSynthesis.getVoices().find(v => /en(-|_)US/i.test(v.lang) && !/compact|siri/i.test(v.name)) || null;
  if (v) u.voice = v;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// ===== 本週 7 天教材資料（句型＋單字＋測驗） =====
const DATA = {
  1: {
    title: "Day 1 – Painting Basics",
    patterns: [
      { en:"I'm starting with a simple sketch.", zh:"我先從簡單素描開始。" },
      { en:"I block in the big shapes first.", zh:"我先鋪大形。" }
    ],
    vocab: [
      { word:"canvas", phon:"/ˈkæn.vəs/", zh:"畫布" },
      { word:"sketch", phon:"/skɛtʃ/", zh:"素描" },
      { word:"palette", phon:"/ˈpæl.ɪt/", zh:"調色盤" }
    ],
    quiz: [
      { q:"Which word means '畫布'?", a:["sketch","canvas","palette","paper"], ans:1 },
      { q:"'I block in the big shapes first.' 最接近意思？", a:["我先畫背景","我先鋪大形","我先畫細節","我先上亮部"], ans:1 }
    ]
  },
  2: {
    title: "Day 2 – Art Tools",
    patterns: [
      { en:"I use a flat brush for broad strokes.", zh:"我用平筆刷大筆觸。" },
      { en:"Clean your brush between colors.", zh:"換色前要清筆。" }
    ],
    vocab: [
      { word:"brush", phon:"/brʌʃ/", zh:"畫筆" },
      { word:"easel", phon:"/ˈiː.zəl/", zh:"畫架" },
      { word:"watercolor", phon:"/ˈwɔː.t̬ɚˌkʌl.ɚ/", zh:"水彩" }
    ],
    quiz: [
      { q:"Which tool is a '畫架'?", a:["palette","easel","canvas","rag"], ans:1 },
      { q:"'flat brush' 是？", a:["平筆","圓筆","扇形筆","排筆"], ans:0 }
    ]
  },
  3: {
    title: "Day 3 – Color Theory",
    patterns: [
      { en:"Lower saturation to calm the mood.", zh:"降低飽和度讓畫面更沈穩。" },
      { en:"Complementary colors create contrast.", zh:"互補色能增加反差。" }
    ],
    vocab: [
      { word:"hue", phon:"/hjuː/", zh:"色相" },
      { word:"saturation", phon:"/ˌsætʃ.əˈreɪ.ʃən/", zh:"飽和度" },
      { word:"contrast", phon:"/ˈkɒn.træst/", zh:"對比" }
    ],
    quiz: [
      { q:"哪個是『飽和度』？", a:["hue","value","saturation","tint"], ans:2 },
      { q:"互補色的功能？", a:["降低明度","提升反差","混成灰色","更柔和"], ans:1 }
    ]
  },
  4: {
    title: "Day 4 – Composition",
    patterns: [
      { en:"Place the focal point off-center.", zh:"把焦點放在偏中心位置。" },
      { en:"Use leading lines to guide the eye.", zh:"用引導線帶動視線。" }
    ],
    vocab: [
      { word:"composition", phon:"/ˌkɒm.pəˈzɪʃ.ən/", zh:"構圖" },
      { word:"focal point", phon:"/ˈfəʊ.kəl pɔɪnt/", zh:"焦點" },
      { word:"leading lines", phon:"/ˈliː.dɪŋ laɪnz/", zh:"引導線" }
    ],
    quiz: [
      { q:"'focal point' 指？", a:["主題","背景","焦點","光源"], ans:2 },
      { q:"想引導視線該用？", a:["互補色","引導線","低飽和","邊框"], ans:1 }
    ]
  },
  5: {
    title: "Day 5 – Brush Techniques",
    patterns: [
      { en:"Use dry-brush for texture.", zh:"用乾刷製造質感。" },
      { en:"Blend edges for a softer look.", zh:"柔化邊緣會更柔和。" }
    ],
    vocab: [
      { word:"stroke", phon:"/stroʊk/", zh:"筆觸" },
      { word:"blending", phon:"/ˈblen.dɪŋ/", zh:"暈染、融合" },
      { word:"dry brush", phon:"/draɪ brʌʃ/", zh:"乾刷" }
    ],
    quiz: [
      { q:"哪個技巧能做出粗糙質感？", a:["wet-on-wet","glazing","dry brush","scumbling"], ans:2 },
      { q:"柔化邊緣英文？", a:["sharpen edges","blend edges","block edges","cut edges"], ans:1 }
    ]
  },
  6: {
    title: "Day 6 – Still Life",
    patterns: [
      { en:"I map light and shadow first.", zh:"我先標出明暗。" },
      { en:"Keep values simple.", zh:"把明度關係保持簡潔。" }
    ],
    vocab: [
      { word:"still life", phon:"/ˌstɪl ˈlaɪf/", zh:"靜物畫" },
      { word:"shadow", phon:"/ˈʃæd.oʊ/", zh:"陰影" },
      { word:"highlight", phon:"/ˈhaɪ.laɪt/", zh:"亮部" }
    ],
    quiz: [
      { q:"'still life' 是？", a:["風景畫","肖像畫","抽象畫","靜物畫"], ans:3 },
      { q:"先做明暗圖的目的？", a:["更彩色","更銳利","穩定結構","增加筆觸"], ans:2 }
    ]
  },
  7: {
    title: "Day 7 – Review & Quiz",
    patterns: [
      { en:"Let's review key terms from this week.", zh:"複習本週關鍵詞。" },
      { en:"Explain your composition choices.", zh:"說明你的構圖選擇。" }
    ],
    vocab: [
      { word:"value", phon:"/ˈvæl.juː/", zh:"明度" },
      { word:"texture", phon:"/ˈtɛks.tʃɚ/", zh:"質地" },
      { word:"contrast", phon:"/ˈkɒn.træst/", zh:"對比" }
    ],
    quiz: [
      { q:"哪個詞跟『明暗』最相關？", a:["hue","value","saturation","temperature"], ans:1 },
      { q:"想讓畫面更穩：", a:["加互補色","降飽和","提高對比","擴色域"], ans:1 }
    ]
  }
};

// ===== 產生頁面 =====
function renderDay(day) {
  const root = document.getElementById("app");
  const d = DATA[day];
  if (!root || !d) return;

  root.innerHTML = `
    <h1>${d.title}</h1>

    <section>
      <h2>📌 Main Sentence Patterns</h2>
      <ul>
        ${d.patterns.map(p => `
          <li><b>${p.en}</b> — ${p.zh}
            <button onclick="speak('${p.en.replace(/'/g,"\\'")}')">🔊</button>
          </li>
        `).join("")}
      </ul>
    </section>

    <section>
      <h2>📚 Vocabulary</h2>
      <table border="1" cellpadding="6">
        <thead><tr>
          <th>Word</th><th>KK</th><th>中文</th><th>Pronounce</th>
        </tr></thead>
        <tbody>
          ${d.vocab.map(v => `
            <tr>
              <td>${v.word}</td>
              <td>${v.phon}</td>
              <td>${v.zh}</td>
              <td><button onclick="speak('${v.word.replace(/'/g,"\\'")}')">🔊</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>

    <section>
      <h2>📝 Quiz</h2>
      <ol>
        ${d.quiz.map((q, i) => `
          <li>
            ${q.q}
            <ul style="list-style: upper-alpha;">
              ${q.a.map((opt, j)=>`
                <li>
                  <label>
                    <input type="radio" name="q${i}" value="${j}">
                    ${opt}
                  </label>
                </li>
              `).join("")}
            </ul>
          </li>
        `).join("")}
      </ol>
      <button id="checkBtn">Check Answers</button>
      <div id="result" aria-live="polite" style="margin-top:8px;"></div>
    </section>
  `;

  document.getElementById("checkBtn").onclick = () => {
    let score = 0;
    d.quiz.forEach((q, i) => {
      const picked = document.querySelector(`input[name="q${i}"]:checked`);
      if (picked && Number(picked.value) === q.ans) score++;
    });
    const el = document.getElementById("result");
    el.textContent = `Score: ${score} / ${d.quiz.length}`;
  };
}
</script>
