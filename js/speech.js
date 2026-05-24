// speech.js – Web Speech API wrapper with pt-PT voice priority
const Speech = (() => {
  let voices = [];
  let ready = false;

  function loadVoices() {
    voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    ready = true;
  }

  // Init: load sync + listen for async Chrome event
  if (window.speechSynthesis) {
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
  }

  function pickVoice() {
    // Priority: exact pt-PT > pt-P* > any pt-*
    const exact = voices.find(v => v.lang === 'pt-PT');
    if (exact) return exact;
    const ptP = voices.find(v => v.lang.startsWith('pt-P'));
    if (ptP) return ptP;
    const ptAny = voices.find(v => v.lang.startsWith('pt'));
    return ptAny || null;
  }

  function getSettings() {
    return Store.get('settings', { speechEnabled: true, speechRate: 0.85, speechVolume: 1 });
  }

  function speak(text, onEnd) {
    const settings = getSettings();
    if (!settings.speechEnabled) { if (onEnd) onEnd(); return; }
    if (!window.speechSynthesis) {
      console.warn('Web Speech API not supported');
      if (onEnd) onEnd();
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT';
    utterance.rate = settings.speechRate || 0.85;
    utterance.volume = settings.speechVolume !== undefined ? settings.speechVolume : 1;

    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') console.warn('Speech error:', e.error);
      if (onEnd) onEnd();
    };

    speechSynthesis.speak(utterance);
  }

  function cancel() {
    if (window.speechSynthesis) speechSynthesis.cancel();
  }

  function isEnabled() {
    return getSettings().speechEnabled;
  }

  function setEnabled(val) {
    const s = getSettings();
    s.speechEnabled = val;
    Store.set('settings', s);
  }

  function setRate(val) {
    const s = getSettings();
    s.speechRate = val;
    Store.set('settings', s);
  }

  return { speak, cancel, isEnabled, setEnabled, setRate, pickVoice };
})();
