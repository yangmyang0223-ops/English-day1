
function mountVideo(day, mountId){
  const el = document.getElementById(mountId);
  if(!el){ return; }
  fetch('videos.json', {cache:'no-store'})
    .then(r=>r.json())
    .then(videos=>{
      const key = 'day'+day;
      const url = videos[key];
      if(url && /^https?:\/\//.test(url)){
        el.innerHTML = '<h2>🎥 本日主題影片</h2><p><a href="'+url+'" target="_blank" rel="noopener">點我觀看影片</a></p>';
      }else{
        el.innerHTML = '<h2>🎥 本日主題影片</h2><p class="video-note">尚未設定影片連結。請在 <code>videos.json</code> 的 <code>'+key+'</code> 填入影片網址。</p>';
      }
    }).catch(()=>{
      el.innerHTML = '<h2>🎥 本日主題影片</h2><p class="video-note">找不到 <code>videos.json</code>，請確認檔案存在於同一層目錄。</p>';
    });
}
