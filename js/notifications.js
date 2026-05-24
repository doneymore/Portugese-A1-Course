// notifications.js – Daily morning flashcard + notification permission
const Notifications = (() => {
  const KEY = 'falapt_morning';

  function getState() {
    return Store.get(KEY, { lastShown: null, permissionAsked: false });
  }

  function patchState(updates) {
    Store.set(KEY, Object.assign({}, getState(), updates));
  }

  async function requestPermission() {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission !== 'default') return Notification.permission;
    return Notification.requestPermission();
  }

  function shouldShowToday() {
    return getState().lastShown !== new Date().toDateString();
  }

  function pickRandomCard() {
    const units = window.ALL_UNITS || [];
    if (!units.length) return null;
    const unit = units[Math.floor(Math.random() * units.length)];
    const cards = (unit.flashcards || []).filter(c => c.front && c.back);
    if (!cards.length) return null;
    return { card: cards[Math.floor(Math.random() * cards.length)], unit };
  }

  function showMorningCard() {
    const result = pickRandomCard();
    if (!result) return;
    const { card, unit } = result;
    patchState({ lastShown: new Date().toDateString() });

    const overlay = document.createElement('div');
    overlay.className = 'morning-overlay';
    overlay.id = 'morning-overlay';
    overlay.innerHTML = `
      <div class="morning-modal">
        <div class="morning-badge">🌅 Bom dia!</div>
        <h2 class="morning-title">Daily Flashcard</h2>
        <p class="morning-unit">Unit ${unit.id}: ${unit.lesson.title}</p>
        <div class="morning-card-body">
          <div class="mc-word">${card.front}</div>
          ${card.phonetic ? `<div class="mc-phonetic">[${card.phonetic}]</div>` : ''}
          <button class="btn btn-outline btn-sm" id="mc-reveal-btn" style="margin-top:0.75rem">Reveal Answer</button>
          <div class="mc-answer" id="mc-answer" style="display:none">
            <div class="mc-translation">${card.back}</div>
          </div>
        </div>
        <div class="morning-footer">
          <button class="btn btn-ghost" id="mc-close-btn">Skip</button>
          <a href="#/unit/${unit.id}/flashcards" class="btn btn-primary" id="mc-practice-btn">Practice More →</a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#mc-reveal-btn').addEventListener('click', () => {
      overlay.querySelector('#mc-answer').style.display = 'block';
      overlay.querySelector('#mc-reveal-btn').style.display = 'none';
    });

    overlay.querySelector('#mc-close-btn').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#mc-practice-btn').addEventListener('click', () => overlay.remove());
  }

  function showPermissionPrompt() {
    if (document.getElementById('notif-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'notif-overlay';
    overlay.id = 'notif-overlay';
    overlay.innerHTML = `
      <div class="notif-modal">
        <div class="notif-icon">🔔</div>
        <h2>Morning Reminders</h2>
        <p>Allow Falapt to send you a daily flashcard every morning to keep your streak alive!</p>
        <div class="notif-actions">
          <button class="btn btn-ghost" id="notif-no-btn">Not now</button>
          <button class="btn btn-primary" id="notif-yes-btn">Allow</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    patchState({ permissionAsked: true });

    overlay.querySelector('#notif-no-btn').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#notif-yes-btn').addEventListener('click', async () => {
      overlay.remove();
      const result = await requestPermission();
      if (result === 'granted') {
        Toast.show('Morning reminders enabled! 🔔', 'xp');
        registerPeriodicSync();
      }
    });
  }

  async function registerPeriodicSync() {
    if (!('serviceWorker' in navigator)) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      if ('periodicSync' in reg) {
        await reg.periodicSync.register('morning-card', {
          minInterval: 12 * 60 * 60 * 1000,
        });
      }
    } catch (_) {}
  }

  function init() {
    const showCard = shouldShowToday();

    if (showCard) {
      setTimeout(showMorningCard, 900);
    }

    const s = getState();
    if (!s.permissionAsked && 'Notification' in window && Notification.permission === 'default') {
      setTimeout(showPermissionPrompt, showCard ? 5500 : 1800);
    }

    // If already granted, ensure periodic sync is registered
    if ('Notification' in window && Notification.permission === 'granted') {
      registerPeriodicSync();
    }
  }

  return { init, requestPermission, showMorningCard };
})();
