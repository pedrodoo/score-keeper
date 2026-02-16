/**
 * TRON Score Keeper – Audio manager
 * Preloads sounds, unlocks on first user interaction, plays background loop and SFX.
 */
(function () {
  const backgroundVolume = 0.4;
  let unlocked = false;
  let backgroundAudio = null;
  const sfx = {};

  function createAudio(src) {
    const a = new Audio();
    a.preload = 'auto';
    if (src) a.src = src;
    return a;
  }

  function preload() {
    if (typeof AUDIO_CONFIG === 'undefined') return;
    backgroundAudio = createAudio(AUDIO_CONFIG.background);
    backgroundAudio.loop = true;
    backgroundAudio.volume = backgroundVolume;
    ['sfxClickIncrement', 'sfxClickDecrement', 'sfxDraw'].forEach((key) => {
      const src = AUDIO_CONFIG[key];
      if (src) sfx[key] = createAudio(src);
    });
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    if (backgroundAudio && backgroundAudio.src) {
      backgroundAudio.play().catch(() => {});
    }
  }

  function playSfx(type) {
    if (!unlocked) return;
    const key = type === 'clickIncrement' ? 'sfxClickIncrement' : type === 'clickDecrement' ? 'sfxClickDecrement' : type === 'draw' ? 'sfxDraw' : null;
    const a = key ? sfx[key] : null;
    if (!a || !a.src) return;
    if (a.readyState >= 2) {
      a.currentTime = 0;
      a.play().catch(() => {});
    }
  }

  function playBackground() {
    if (backgroundAudio && backgroundAudio.src && unlocked) {
      backgroundAudio.play().catch(() => {});
    }
  }

  function pauseBackground() {
    if (backgroundAudio) backgroundAudio.pause();
  }

  window.audioManager = {
    preload,
    unlock,
    playSfx,
    playBackground,
    pauseBackground,
    get unlocked() { return unlocked; }
  };

  preload();
  document.body.addEventListener('click', unlock, { once: true });
  document.body.addEventListener('keydown', unlock, { once: true });
  document.body.addEventListener('touchstart', unlock, { once: true });
})();
