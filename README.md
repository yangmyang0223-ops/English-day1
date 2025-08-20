# 📚 英文學習網站 — Week 1（Day1–Day7）

本專案提供 7 天的英文學習頁面，每天包含：
- 🎥 本日主題影片（於 `videos.json` 設定）
- ✍️ 本日主要句型（可點擊朗讀）
- 🖊️ 單字＋片語表（含 KK 音標 / 中文 / 詞性 / 例句，可點擊朗讀）
- 📝 今日測驗（20 題：單字/片語/句型混合）
- 🔊 朗讀功能：所有底線文字皆可點擊發音（Web Speech API）

## 🗂 檔案結構（重點）
- `index.html`：首頁（含 Week 1 快速連結；Week 2–4 先預留）
- `week1.html`：第一週導覽頁
- `day1.html` … `day7.html`：每日頁面
- `dayX-quiz.json`：每日題庫（20 題）
- `shared.js`：點擊朗讀功能
- `quiz.js`：題庫載入與批改
- `video.js`：載入 `videos.json` 顯示影片連結
- `videos.json`：各日影片網址
- `vocab.json`：第一週單字資料庫（後續可擴充複習）
- `style.css`：樣式

---

## 🚀 上線（GitHub Pages）
1. 把所有檔案放在 repo 根目錄（與 `index.html` 同層）。
2. 進入 GitHub → **Settings → Pages**，Source 選擇 `Deploy from a branch`，並指定分支與資料夾（通常 `main / root`）。
3. 完成後，網站網址會是：