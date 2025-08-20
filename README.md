# 📚 英文學習網站 — Week 1 & Week 2（Day1–Day14）

本專案提供 **Day1–Day14** 的英文學習頁面（分兩週）。每天包含：
- 🎥 本日主題影片（由 `videos.json` 設定）
- ✍️ 本日主要句型（可點擊朗讀）
- 🖊️ 單字＋片語表（含 KK 音標 / 中文 / 詞性 / 例句；可點擊朗讀）
- 📝 今日測驗（20 題：單字／片語／句型混合；**按鈕一次顯示全部答案**，不自動判分）
- 🔊 朗讀功能：所有底線文字皆可點擊發音（Web Speech API, `en-US`）

## 🗂 重要檔案
- `index.html`：首頁（含 Week 1、Week 2 快速連結；**連結自動附加 `?v=時間戳` 破快取**）
- `week1.html`、`week2.html`：各週導覽頁
- `day1.html … day14.html`：每日頁面
- `dayX-quiz.json`：每日題庫（20 題，含正確答案索引）
- `shared.js`：點擊朗讀
- `quiz.js`：載入題庫；按鈕一次顯示全部答案（不自動判分）
- `video.js`：載入 `videos.json` 顯示影片連結
- `videos.json`：各日影片網址（**建議自行替換成你要的教材影片**）
- `style.css`：樣式
- 工具：`check.html`（一次列出 Day1–Day14 破快取連結），`review.html`（複習簡版）

## 🚀 上線（GitHub Pages）
1. 把所有檔案放到 repo 根目錄（與 `index.html` 同層）。
2. GitHub → **Settings → Pages**：Source 選 `Deploy from a branch`，指定 `main / root`。
3. 網站網址通常為：
