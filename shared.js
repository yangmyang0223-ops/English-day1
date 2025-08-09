// 瀏覽器內建語音播放
function speak(text, rate = 1) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => /en(-|_)US/i.test(v.lang)) || voices.find(v => /en/i.test(v.lang));
    if (voice) utterance.voice = voice;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

// 有些瀏覽器需要先觸發 voices 載入
if (speechSynthesis && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {};
}
