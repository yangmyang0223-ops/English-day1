# English Learning Plan – 影片連結設定
你可以在 `videos.json` 裡替每一天的 `dayN` 填入影片網址：

```json
{
  "day1": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  "day2": "",
  "day3": "",
  "day4": "",
  "day5": "",
  "day6": "",
  "day7": ""
}
```

- 只要填入 **合法的 http/https 連結**，各日的頁面就會在最上方顯示「🎥 本日主題影片」按鈕。
- 若該日留空，頁面會提示「尚未設定影片連結」。
- 設定完成後，請 Commit / Push，稍等 GitHub Pages 部署完成，再以破快取方式（網址加上 `?v=12345`）重新開啟頁面即可看到最新連結。
